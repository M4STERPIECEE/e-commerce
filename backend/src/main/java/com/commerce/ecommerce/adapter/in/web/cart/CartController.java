package com.commerce.ecommerce.adapter.in.web.cart;

import com.commerce.ecommerce.adapter.in.web.common.ApiResponse;
import com.commerce.ecommerce.adapter.out.persistence.repository.UserJpaRepository;
import com.commerce.ecommerce.application.port.in.cart.*;
import com.commerce.ecommerce.domain.model.Cart;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Cart")
public class CartController {

    private final GetOrCreateCartUseCase getOrCreateCartUseCase;
    private final AddItemToCartUseCase addItemToCartUseCase;
    private final UpdateCartItemQuantityUseCase updateCartItemQuantityUseCase;
    private final RemoveItemFromCartUseCase removeItemFromCartUseCase;
    private final ClearCartUseCase clearCartUseCase;
    private final UserJpaRepository userJpaRepository;

    @GetMapping
    @Operation(summary = "Get current cart")
    public ResponseEntity<ApiResponse<Cart>> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = resolveUserId(userDetails);
        return ResponseEntity.ok(ApiResponse.success(getOrCreateCartUseCase.getOrCreateCart(userId)));
    }

    @PostMapping("/items")
    @Operation(summary = "Add item to cart")
    public ResponseEntity<ApiResponse<Cart>> addItem(@AuthenticationPrincipal UserDetails userDetails,
                                                      @RequestParam UUID productId,
                                                      @RequestParam @Positive int quantity) {
        UUID userId = resolveUserId(userDetails);
        Cart cart = addItemToCartUseCase.addItem(AddItemCommand.builder()
                .userId(userId).productId(productId).quantity(quantity).build());
        return ResponseEntity.ok(ApiResponse.success(cart));
    }

    @PutMapping("/items/{productId}")
    @Operation(summary = "Update cart item quantity")
    public ResponseEntity<ApiResponse<Cart>> updateItem(@AuthenticationPrincipal UserDetails userDetails,
                                                         @PathVariable UUID productId,
                                                         @RequestParam @Positive int quantity) {
        UUID userId = resolveUserId(userDetails);
        Cart cart = updateCartItemQuantityUseCase.updateItemQuantity(UpdateItemCommand.builder()
                .userId(userId).productId(productId).quantity(quantity).build());
        return ResponseEntity.ok(ApiResponse.success(cart));
    }

    @DeleteMapping("/items/{productId}")
    @Operation(summary = "Remove item from cart")
    public ResponseEntity<ApiResponse<Cart>> removeItem(@AuthenticationPrincipal UserDetails userDetails,
                                                         @PathVariable UUID productId) {
        UUID userId = resolveUserId(userDetails);
        Cart cart = removeItemFromCartUseCase.removeItem(userId, productId);
        return ResponseEntity.ok(ApiResponse.success(cart));
    }

    @DeleteMapping
    @Operation(summary = "Clear cart")
    public ResponseEntity<ApiResponse<Void>> clearCart(@AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = resolveUserId(userDetails);
        clearCartUseCase.clearCart(userId);
        return ResponseEntity.ok(ApiResponse.success("Cart cleared", null));
    }

    private UUID resolveUserId(UserDetails userDetails) {
        return userJpaRepository.findByEmail(userDetails.getUsername())
                .map(e -> e.getId())
                .orElseThrow();
    }
}
