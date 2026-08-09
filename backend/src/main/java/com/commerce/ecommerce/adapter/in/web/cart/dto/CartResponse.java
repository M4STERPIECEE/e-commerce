package com.commerce.ecommerce.adapter.in.web.cart.dto;

import com.commerce.ecommerce.domain.model.enums.CartStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class CartResponse {
    private UUID id;
    private UUID userId;
    private CartStatus status;
    private LocalDateTime createdAt;
    private List<CartItemResponse> items;
}
