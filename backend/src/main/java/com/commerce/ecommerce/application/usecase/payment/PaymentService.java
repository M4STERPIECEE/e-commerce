package com.commerce.ecommerce.application.usecase.payment;

import com.commerce.ecommerce.application.port.in.payment.GetPaymentStatusUseCase;
import com.commerce.ecommerce.application.port.in.payment.ProcessPaymentUseCase;
import com.commerce.ecommerce.application.port.out.OrderRepositoryPort;
import com.commerce.ecommerce.application.port.out.PaymentGatewayPort;
import com.commerce.ecommerce.application.port.out.PaymentRepositoryPort;
import com.commerce.ecommerce.domain.exception.OrderNotFoundException;
import com.commerce.ecommerce.domain.exception.PaymentNotFoundException;
import com.commerce.ecommerce.domain.model.Order;
import com.commerce.ecommerce.domain.model.Payment;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentService implements ProcessPaymentUseCase, GetPaymentStatusUseCase {

    private final OrderRepositoryPort orderRepository;
    private final PaymentGatewayPort paymentGateway;
    private final PaymentRepositoryPort paymentRepository;

    @Override
    public Payment processPayment(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));
        Payment payment = paymentGateway.processPayment(orderId, order.getTotalAmount());
        return paymentRepository.save(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public Payment getPaymentStatus(UUID orderId) {
        return paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new PaymentNotFoundException(orderId));
    }
}
