package com.commerce.ecommerce.application.usecase.order;

import com.commerce.ecommerce.application.port.in.order.*;
import com.commerce.ecommerce.application.port.out.*;
import com.commerce.ecommerce.domain.exception.*;
import com.commerce.ecommerce.domain.model.*;
import com.commerce.ecommerce.domain.model.enums.CartStatus;
import com.commerce.ecommerce.domain.model.enums.OrderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService implements CreateOrderFromCartUseCase, GetOrderDetailUseCase,
        ListUserOrdersUseCase, ListAllOrdersUseCase, UpdateOrderStatusUseCase, CancelOrderUseCase {

    private final CartRepositoryPort cartRepository;
    private final ProductRepositoryPort productRepository;
    private final OrderRepositoryPort orderRepository;

    @Override
    public Order createOrder(CreateOrderCommand command) {
        Cart cart = cartRepository.findActiveCartByUserId(command.getUserId())
                .orElseThrow(() -> new CartNotFoundException(command.getUserId()));

        if (cart.getItems().isEmpty()) {
            throw new InvalidOrderStatusException("Cannot create order from an empty cart");
        }

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getItems()) {
            Product product = productRepository.findById(cartItem.getProductId())
                    .orElseThrow(() -> new ProductNotFoundException(cartItem.getProductId()));

            if (!product.isActive()) {
                throw new InvalidOrderStatusException("Product is not available: " + product.getName());
            }
            if (product.getStock() < cartItem.getQuantity()) {
                throw new InsufficientStockException(product.getId(), cartItem.getQuantity(), product.getStock());
            }

            // Decrement stock atomically
            product.setStock(product.getStock() - cartItem.getQuantity());
            product.setUpdatedAt(LocalDateTime.now());
            productRepository.save(product);

            OrderItem orderItem = OrderItem.builder()
                    .productId(product.getId())
                    .productNameSnapshot(product.getName())
                    .quantity(cartItem.getQuantity())
                    .unitPriceSnapshot(cartItem.getUnitPriceSnapshot())
                    .build();
            orderItems.add(orderItem);
            total = total.add(cartItem.getUnitPriceSnapshot().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }

        Order order = Order.builder()
                .userId(command.getUserId())
                .status(OrderStatus.PENDING)
                .totalAmount(total)
                .shippingAddress(command.getShippingAddress())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .items(orderItems)
                .build();
        Order savedOrder = orderRepository.save(order);

        // Convert cart
        cart.setStatus(CartStatus.CONVERTED);
        cart.getItems().clear();
        cartRepository.save(cart);

        return savedOrder;
    }

    @Override
    @Transactional(readOnly = true)
    public Order getOrder(UUID orderId, UUID userId) {
        return orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Order> listUserOrders(UUID userId, Pageable pageable) {
        return orderRepository.findByUserId(userId, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Order> listAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }

    @Override
    public Order updateStatus(UpdateOrderStatusCommand command) {
        Order order = orderRepository.findById(command.getOrderId())
                .orElseThrow(() -> new OrderNotFoundException(command.getOrderId()));
        order.setStatus(command.getNewStatus());
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    @Override
    public void cancelOrder(UUID orderId, UUID userId) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new InvalidOrderStatusException(order.getStatus(), OrderStatus.CANCELLED);
        }
        // Restore stock
        for (OrderItem item : order.getItems()) {
            productRepository.findById(item.getProductId()).ifPresent(product -> {
                product.setStock(product.getStock() + item.getQuantity());
                product.setUpdatedAt(LocalDateTime.now());
                productRepository.save(product);
            });
        }
        order.setStatus(OrderStatus.CANCELLED);
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);
    }
}
