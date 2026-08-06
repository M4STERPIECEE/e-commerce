package com.commerce.ecommerce.application.port.in.cart;

import com.commerce.ecommerce.domain.model.Cart;

import java.util.UUID;

public interface GetOrCreateCartUseCase {
    Cart getOrCreateCart(UUID userId);
}
