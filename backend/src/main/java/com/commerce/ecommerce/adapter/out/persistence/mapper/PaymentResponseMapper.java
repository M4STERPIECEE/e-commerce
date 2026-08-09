package com.commerce.ecommerce.adapter.out.persistence.mapper;

import com.commerce.ecommerce.adapter.in.web.payment.dto.PaymentResponse;
import com.commerce.ecommerce.domain.model.Payment;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PaymentResponseMapper {

    PaymentResponse toResponse(Payment payment);
}
