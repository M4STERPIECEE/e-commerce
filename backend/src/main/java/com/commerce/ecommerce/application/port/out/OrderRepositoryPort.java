package com.commerce.ecommerce.application.port.out;

import com.commerce.ecommerce.domain.model.Order;
import com.commerce.ecommerce.domain.model.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.UUID;

public interface OrderRepositoryPort {
    Order save(Order order);
    Optional<Order> findById(UUID id);
    Page<Order> findByUserId(UUID userId, Pageable pageable);
    Page<Order> findAll(Pageable pageable);
    Optional<Order> findByIdAndUserId(UUID id, UUID userId);
}
