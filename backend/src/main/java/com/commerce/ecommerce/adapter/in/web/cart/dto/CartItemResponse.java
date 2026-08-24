package com.commerce.ecommerce.adapter.in.web.cart.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class CartItemResponse {
    private UUID id;
    private UUID productId;
    private int quantity;
    private BigDecimal unitPriceSnapshot;
}
