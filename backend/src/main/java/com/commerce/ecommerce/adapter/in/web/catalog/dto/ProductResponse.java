package com.commerce.ecommerce.adapter.in.web.catalog.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ProductResponse {
    private UUID id;
    private String name;
    private String description;
    private BigDecimal price;
    private int stock;
    private String imageUrl;
    private boolean active;
    private UUID categoryId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
