package com.commerce.ecommerce.adapter.in.web.order.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class OrderItemResponse {
    private UUID id;
    private UUID productId;
    private String productNameSnapshot;
    private int quantity;
    private BigDecimal unitPriceSnapshot;
}
