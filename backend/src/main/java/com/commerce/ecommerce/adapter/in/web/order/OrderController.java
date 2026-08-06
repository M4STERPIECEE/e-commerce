package com.commerce.ecommerce.adapter.in.web.order;

import com.commerce.ecommerce.adapter.in.web.common.ApiResponse;
import com.commerce.ecommerce.adapter.out.persistence.repository.UserJpaRepository;
import com.commerce.ecommerce.application.port.in.order.*;
import com.commerce.ecommerce.domain.model.Order;
import com.commerce.ecommerce.domain.model.enums.OrderStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Orders")
public class OrderController {

    private final CreateOrderFromCartUseCase createOrderFromCartUseCase;
    private final GetOrderDetailUseCase getOrderDetailUseCase;
    private final ListUserOrdersUseCase listUserOrdersUseCase;
    private final ListAllOrdersUseCase listAllOrdersUseCase;
    private final UpdateOrderStatusUseCase updateOrderStatusUseCase;
    private final CancelOrderUseCase cancelOrderUseCase;
    private final UserJpaRepository userJpaRepository;

    @PostMapping("/checkout")
    @Operation(summary = "Checkout — create order from cart")
    public ResponseEntity<ApiResponse<Order>> checkout(@AuthenticationPrincipal UserDetails userDetails,
            @RequestBody CheckoutRequest request) {
        UUID userId = resolveUserId(userDetails);
        Order order = createOrderFromCartUseCase.createOrder(CreateOrderCommand.builder()
                .userId(userId).shippingAddress(request.getShippingAddress()).build());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(order));
    }

    @GetMapping
    @Operation(summary = "List user orders")
    public ResponseEntity<ApiResponse<Page<Order>>> listOrders(@AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        UUID userId = resolveUserId(userDetails);
        Page<Order> orders = listUserOrdersUseCase.listUserOrders(userId,
                PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order detail")
    public ResponseEntity<ApiResponse<Order>> getOrder(@AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id) {
        UUID userId = resolveUserId(userDetails);
        return ResponseEntity.ok(ApiResponse.success(getOrderDetailUseCase.getOrder(id, userId)));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel order (if PENDING)")
    public ResponseEntity<ApiResponse<Void>> cancelOrder(@AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id) {
        UUID userId = resolveUserId(userDetails);
        cancelOrderUseCase.cancelOrder(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Order cancelled", null));
    }

    // Admin endpoints
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "List all orders (admin only)")
    public ResponseEntity<ApiResponse<Page<Order>>> listAllOrders(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<Order> orders = listAllOrdersUseCase.listAllOrders(
                PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @PatchMapping("/admin/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update order status (admin only)")
    public ResponseEntity<ApiResponse<Order>> updateStatus(@PathVariable UUID id,
            @RequestParam OrderStatus status) {
        Order order = updateOrderStatusUseCase.updateStatus(UpdateOrderStatusCommand.builder()
                .orderId(id).newStatus(status).build());
        return ResponseEntity.ok(ApiResponse.success(order));
    }

    private UUID resolveUserId(UserDetails userDetails) {
        return userJpaRepository.findByEmail(userDetails.getUsername())
                .map(e -> e.getId())
                .orElseThrow();
    }

    @Data
    static class CheckoutRequest {
        private String shippingAddress;
    }
}
