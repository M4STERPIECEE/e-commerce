package com.commerce.ecommerce.domain.exception;

import com.commerce.ecommerce.domain.model.enums.OrderStatus;

public class InvalidOrderStatusException extends RuntimeException {
    public InvalidOrderStatusException(OrderStatus current, OrderStatus target) {
        super("Cannot transition order from status " + current + " to " + target);
    }
    public InvalidOrderStatusException(String message) {
        super(message);
    }
}
