package com.commerce.ecommerce.application.usecase.cart;

import com.commerce.ecommerce.application.port.in.cart.*;
import com.commerce.ecommerce.application.port.out.CartRepositoryPort;
import com.commerce.ecommerce.application.port.out.ProductRepositoryPort;
import com.commerce.ecommerce.domain.exception.InsufficientStockException;
import com.commerce.ecommerce.domain.exception.ProductNotFoundException;
import com.commerce.ecommerce.domain.model.Cart;
import com.commerce.ecommerce.domain.model.CartItem;
import com.commerce.ecommerce.domain.model.Product;
import com.commerce.ecommerce.domain.model.enums.CartStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService implements GetOrCreateCartUseCase, AddItemToCartUseCase,
        UpdateCartItemQuantityUseCase, RemoveItemFromCartUseCase, ClearCartUseCase {

    private final CartRepositoryPort cartRepository;
    private final ProductRepositoryPort productRepository;

    @Override
    public Cart getOrCreateCart(UUID userId) {
        return cartRepository.findActiveCartByUserId(userId)
                .orElseGet(() -> cartRepository.save(Cart.builder()
                        .userId(userId)
                        .status(CartStatus.ACTIVE)
                        .createdAt(LocalDateTime.now())
                        .items(new ArrayList<>())
                        .build()));
    }

    @Override
    public Cart addItem(AddItemCommand command) {
        Cart cart = getOrCreateCart(command.getUserId());
        Product product = productRepository.findById(command.getProductId())
                .orElseThrow(() -> new ProductNotFoundException(command.getProductId()));

        if (product.getStock() < command.getQuantity()) {
            throw new InsufficientStockException(product.getId(), command.getQuantity(), product.getStock());
        }

        // Check if item already in cart
        cart.getItems().stream()
                .filter(i -> i.getProductId().equals(command.getProductId()))
                .findFirst()
                .ifPresentOrElse(
                        item -> item.setQuantity(item.getQuantity() + command.getQuantity()),
                        () -> cart.getItems().add(CartItem.builder()
                                .cartId(cart.getId())
                                .productId(product.getId())
                                .quantity(command.getQuantity())
                                .unitPriceSnapshot(product.getPrice())
                                .build())
                );
        return cartRepository.save(cart);
    }

    @Override
    public Cart updateItemQuantity(UpdateItemCommand command) {
        Cart cart = getOrCreateCart(command.getUserId());
        Product product = productRepository.findById(command.getProductId())
                .orElseThrow(() -> new ProductNotFoundException(command.getProductId()));

        if (product.getStock() < command.getQuantity()) {
            throw new InsufficientStockException(product.getId(), command.getQuantity(), product.getStock());
        }

        cart.getItems().stream()
                .filter(i -> i.getProductId().equals(command.getProductId()))
                .findFirst()
                .ifPresent(item -> item.setQuantity(command.getQuantity()));

        return cartRepository.save(cart);
    }

    @Override
    public Cart removeItem(UUID userId, UUID productId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().removeIf(i -> i.getProductId().equals(productId));
        return cartRepository.save(cart);
    }

    @Override
    public void clearCart(UUID userId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }
}
