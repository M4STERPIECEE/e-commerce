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
public class CreateProductCommand {
    private String name;
    private String description;
    private BigDecimal price;
    private int stock;
    private String imageUrl;
    private boolean active;
    private UUID categoryId;
}
