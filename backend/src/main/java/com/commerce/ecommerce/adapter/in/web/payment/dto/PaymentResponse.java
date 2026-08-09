package com.commerce.ecommerce.adapter.in.web.payment.dto;

import com.commerce.ecommerce.domain.model.enums.PaymentMethod;
import com.commerce.ecommerce.domain.model.enums.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class PaymentResponse {
    private UUID id;
    private UUID orderId;
    private PaymentMethod method;
    private PaymentStatus status;
    private BigDecimal amount;
    private String transactionRef;
    private LocalDateTime createdAt;
}
