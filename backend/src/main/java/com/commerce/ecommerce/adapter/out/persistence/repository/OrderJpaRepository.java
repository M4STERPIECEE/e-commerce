package com.commerce.ecommerce.adapter.out.persistence.repository;

import com.commerce.ecommerce.adapter.out.persistence.entity.OrderJpaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface OrderJpaRepository extends JpaRepository<OrderJpaEntity, UUID> {
    Page<OrderJpaEntity> findByUserId(UUID userId, Pageable pageable);
    Optional<OrderJpaEntity> findByIdAndUserId(UUID id, UUID userId);
}
