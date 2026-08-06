package com.commerce.ecommerce.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    private UUID id;
    private UUID orderId;
    private UUID productId;
    private String productNameSnapshot;
    private int quantity;
    private BigDecimal unitPriceSnapshot;
}
