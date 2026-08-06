package com.commerce.ecommerce.adapter.out.payment;

import com.commerce.ecommerce.application.port.out.PaymentGatewayPort;
import com.commerce.ecommerce.domain.model.Payment;
import com.commerce.ecommerce.domain.model.enums.PaymentMethod;
import com.commerce.ecommerce.domain.model.enums.PaymentStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Mock payment gateway — always returns SUCCESS after a simulated delay.
 * Replace with a real gateway implementation in production.
 */
@Component
@Slf4j
public class MockPaymentGatewayAdapter implements PaymentGatewayPort {

    @Override
    public Payment processPayment(UUID orderId, BigDecimal amount) {
        log.info("Processing mock payment for order {} amount {}", orderId, amount);

        // Simulate payment processing delay (50ms)
        try {
            Thread.sleep(50);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        String transactionRef = "MOCK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        return Payment.builder()
                .orderId(orderId)
                .method(PaymentMethod.MOCK_CARD)
                .status(PaymentStatus.SUCCESS)
                .amount(amount)
                .transactionRef(transactionRef)
                .createdAt(LocalDateTime.now())
                .build();
    }
}
