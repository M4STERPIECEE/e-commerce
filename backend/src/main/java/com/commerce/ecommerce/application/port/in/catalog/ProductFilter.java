package com.commerce.ecommerce.application.port.in.catalog;

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
public class ProductFilter {
    private String search;
    private UUID categoryId;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
}
