package com.commerce.ecommerce.adapter.out.persistence.mapper;

import com.commerce.ecommerce.adapter.out.persistence.entity.PaymentJpaEntity;
import com.commerce.ecommerce.domain.model.Payment;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PaymentMapper {

    Payment toDomain(PaymentJpaEntity entity);

    PaymentJpaEntity toEntity(Payment domain);
}
