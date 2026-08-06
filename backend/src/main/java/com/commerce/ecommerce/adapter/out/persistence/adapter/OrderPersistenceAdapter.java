package com.commerce.ecommerce.adapter.out.persistence.adapter;

import com.commerce.ecommerce.adapter.out.persistence.mapper.OrderMapper;
import com.commerce.ecommerce.adapter.out.persistence.repository.OrderJpaRepository;
import com.commerce.ecommerce.application.port.out.OrderRepositoryPort;
import com.commerce.ecommerce.domain.model.Order;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class OrderPersistenceAdapter implements OrderRepositoryPort {

    private final OrderJpaRepository repository;

    @Override
    public Order save(Order order) {
        return OrderMapper.toDomain(repository.save(OrderMapper.toEntity(order)));
    }

    @Override
    public Optional<Order> findById(UUID id) {
        return repository.findById(id).map(OrderMapper::toDomain);
    }

    @Override
    public Page<Order> findByUserId(UUID userId, Pageable pageable) {
        return repository.findByUserId(userId, pageable).map(OrderMapper::toDomain);
    }

    @Override
    public Page<Order> findAll(Pageable pageable) {
        return repository.findAll(pageable).map(OrderMapper::toDomain);
    }

    @Override
    public Optional<Order> findByIdAndUserId(UUID id, UUID userId) {
        return repository.findByIdAndUserId(id, userId).map(OrderMapper::toDomain);
    }
}
