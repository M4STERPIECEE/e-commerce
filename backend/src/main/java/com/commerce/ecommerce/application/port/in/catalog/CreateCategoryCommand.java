package com.commerce.ecommerce.application.port.in.catalog;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateCategoryCommand {
    private String name;
    private String slug;
    private String description;
}
