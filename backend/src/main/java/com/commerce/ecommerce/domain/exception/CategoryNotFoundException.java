package com.commerce.ecommerce.domain.exception;

import java.util.UUID;

public class CategoryNotFoundException extends RuntimeException {
    public CategoryNotFoundException(UUID id) {
        super("Category not found with id: " + id);
    }
    public CategoryNotFoundException(String slug) {
        super("Category not found with slug: " + slug);
    }
}
