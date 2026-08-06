package com.commerce.ecommerce.adapter.in.web.catalog.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoryRequest {
    @NotBlank private String name;
    @NotBlank private String slug;
    private String description;
}
