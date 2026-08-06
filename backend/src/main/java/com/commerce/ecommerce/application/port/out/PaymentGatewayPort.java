package com.commerce.ecommerce.application.port.out;

import com.commerce.ecommerce.domain.model.Payment;

import java.math.BigDecimal;
import java.util.UUID;

public interface PaymentGatewayPort {
    Payment processPayment(UUID orderId, BigDecimal amount);
}
