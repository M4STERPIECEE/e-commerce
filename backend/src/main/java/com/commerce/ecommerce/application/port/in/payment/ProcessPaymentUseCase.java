package com.commerce.ecommerce.application.port.in.payment;

import com.commerce.ecommerce.domain.model.Payment;

import java.util.UUID;

public interface ProcessPaymentUseCase {
    Payment processPayment(UUID orderId);
}
