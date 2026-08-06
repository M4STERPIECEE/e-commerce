package com.commerce.ecommerce.domain.exception;

import java.util.UUID;

public class CartNotFoundException extends RuntimeException {
    public CartNotFoundException(UUID userId) {
        super("Cart not found for user: " + userId);
    }
}
