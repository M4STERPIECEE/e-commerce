package com.commerce.ecommerce.adapter.in.web.cart;

import com.commerce.ecommerce.adapter.in.web.cart.dto.CartResponse;
import com.commerce.ecommerce.adapter.in.web.common.ApiResponse;
import com.commerce.ecommerce.adapter.out.persistence.mapper.CartCommandMapper;
import com.commerce.ecommerce.adapter.out.persistence.mapper.CartResponseMapper;
import com.commerce.ecommerce.application.port.in.cart.*;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/${version.path}/cart")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class CartController {

    private final GetOrCreateCartUseCase getOrCreateCartUseCase;
    private final AddItemToCartUseCase addItemToCartUseCase;
    private final UpdateCartItemQuantityUseCase updateCartItemQuantityUseCase;
    private final RemoveItemFromCartUseCase removeItemFromCartUseCase;
    private final ClearCartUseCase clearCartUseCase;
    private final CartCommandMapper cartMapper;
    private final CartResponseMapper cartResponseMapper;

    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(
                cartResponseMapper.toResponse(getOrCreateCartUseCase.getOrCreateCart(userDetails.getUsername()))));
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartResponse>> addItem(@AuthenticationPrincipal UserDetails userDetails,
                                                              @RequestParam UUID productId,
                                                              @RequestParam @Positive int quantity) {
        CartResponse cart = cartResponseMapper.toResponse(
                addItemToCartUseCase.addItem(cartMapper.toAddItemCommand(userDetails.getUsername(), productId, quantity)));
        return ResponseEntity.ok(ApiResponse.success(cart));
    }

    @PutMapping("/items/{productId}")
    public ResponseEntity<ApiResponse<CartResponse>> updateItem(@AuthenticationPrincipal UserDetails userDetails,
                                                                 @PathVariable UUID productId,
                                                                 @RequestParam @Positive int quantity) {
        CartResponse cart = cartResponseMapper.toResponse(
                updateCartItemQuantityUseCase.updateItemQuantity(
                        cartMapper.toUpdateItemCommand(userDetails.getUsername(), productId, quantity)));
        return ResponseEntity.ok(ApiResponse.success(cart));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<ApiResponse<CartResponse>> removeItem(@AuthenticationPrincipal UserDetails userDetails,
                                                                 @PathVariable UUID productId) {
        CartResponse cart = cartResponseMapper.toResponse(
                removeItemFromCartUseCase.removeItem(userDetails.getUsername(), productId));
        return ResponseEntity.ok(ApiResponse.success(cart));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> clearCart(@AuthenticationPrincipal UserDetails userDetails) {
        clearCartUseCase.clearCart(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Cart cleared", null));
    }
}
