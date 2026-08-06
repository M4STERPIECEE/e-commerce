package com.commerce.ecommerce.adapter.out.persistence.repository;

import com.commerce.ecommerce.adapter.out.persistence.entity.CartJpaEntity;
import com.commerce.ecommerce.domain.model.enums.CartStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CartJpaRepository extends JpaRepository<CartJpaEntity, UUID> {
    Optional<CartJpaEntity> findByUserIdAndStatus(UUID userId, CartStatus status);
}
