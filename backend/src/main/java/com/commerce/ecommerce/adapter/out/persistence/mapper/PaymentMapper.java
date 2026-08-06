package com.commerce.ecommerce.adapter.out.persistence.mapper;

import com.commerce.ecommerce.adapter.out.persistence.entity.PaymentJpaEntity;
import com.commerce.ecommerce.domain.model.Payment;

public class PaymentMapper {
    private PaymentMapper() {}

    public static Payment toDomain(PaymentJpaEntity entity) {
        if (entity == null) return null;
        return Payment.builder()
                .id(entity.getId())
                .orderId(entity.getOrderId())
                .method(entity.getMethod())
                .status(entity.getStatus())
                .amount(entity.getAmount())
                .transactionRef(entity.getTransactionRef())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public static PaymentJpaEntity toEntity(Payment domain) {
        if (domain == null) return null;
        return PaymentJpaEntity.builder()
                .id(domain.getId())
                .orderId(domain.getOrderId())
                .method(domain.getMethod())
                .status(domain.getStatus())
                .amount(domain.getAmount())
                .transactionRef(domain.getTransactionRef())
                .createdAt(domain.getCreatedAt())
                .build();
    }
}
