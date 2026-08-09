package com.commerce.ecommerce.adapter.in.web.cart.dto;

import com.commerce.ecommerce.domain.model.enums.CartStatus;
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
