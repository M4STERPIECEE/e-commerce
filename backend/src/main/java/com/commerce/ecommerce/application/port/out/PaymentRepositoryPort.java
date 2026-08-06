package com.commerce.ecommerce.application.port.out;

import com.commerce.ecommerce.domain.model.Payment;

import java.util.Optional;
import java.util.UUID;

public interface PaymentRepositoryPort {
    Payment save(Payment payment);
    Optional<Payment> findByOrderId(UUID orderId);
    Optional<Payment> findById(UUID id);
}
