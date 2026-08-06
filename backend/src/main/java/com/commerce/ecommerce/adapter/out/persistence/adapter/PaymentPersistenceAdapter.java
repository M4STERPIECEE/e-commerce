package com.commerce.ecommerce.adapter.out.persistence.adapter;

import com.commerce.ecommerce.adapter.out.persistence.mapper.PaymentMapper;
import com.commerce.ecommerce.adapter.out.persistence.repository.PaymentJpaRepository;
import com.commerce.ecommerce.application.port.out.PaymentRepositoryPort;
import com.commerce.ecommerce.domain.model.Payment;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class PaymentPersistenceAdapter implements PaymentRepositoryPort {

    private final PaymentJpaRepository repository;

    @Override
    public Payment save(Payment payment) {
        return PaymentMapper.toDomain(repository.save(PaymentMapper.toEntity(payment)));
    }

    @Override
    public Optional<Payment> findByOrderId(UUID orderId) {
        return repository.findByOrderId(orderId).map(PaymentMapper::toDomain);
    }

    @Override
    public Optional<Payment> findById(UUID id) {
        return repository.findById(id).map(PaymentMapper::toDomain);
    }
}
