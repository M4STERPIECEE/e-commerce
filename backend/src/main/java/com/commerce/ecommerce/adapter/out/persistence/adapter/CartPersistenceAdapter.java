package com.commerce.ecommerce.adapter.out.persistence.adapter;

import com.commerce.ecommerce.adapter.out.persistence.mapper.CartMapper;
import com.commerce.ecommerce.adapter.out.persistence.repository.CartJpaRepository;
import com.commerce.ecommerce.application.port.out.CartRepositoryPort;
import com.commerce.ecommerce.domain.model.Cart;
import com.commerce.ecommerce.domain.model.enums.CartStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class CartPersistenceAdapter implements CartRepositoryPort {

    private final CartJpaRepository repository;
    private final CartMapper mapper;

    @Override
    public Cart save(Cart cart) {
        return mapper.toDomain(repository.save(mapper.toEntity(cart)));
    }

    @Override
    public Optional<Cart> findActiveCartByUserId(UUID userId) {
        return repository.findByUserIdAndStatus(userId, CartStatus.ACTIVE).map(mapper::toDomain);
    }

    @Override
    public Optional<Cart> findById(UUID id) {
        return repository.findById(id).map(mapper::toDomain);
    }
}
