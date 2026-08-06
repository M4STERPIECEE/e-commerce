package com.commerce.ecommerce.application.port.out;

import com.commerce.ecommerce.domain.model.Cart;

import java.util.Optional;
import java.util.UUID;

public interface CartRepositoryPort {
    Cart save(Cart cart);
    Optional<Cart> findActiveCartByUserId(UUID userId);
    Optional<Cart> findById(UUID id);
}
