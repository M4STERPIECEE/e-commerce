package com.commerce.ecommerce.application.port.in.cart;

import java.util.UUID;

public interface ClearCartUseCase {
    void clearCart(UUID userId);
}
