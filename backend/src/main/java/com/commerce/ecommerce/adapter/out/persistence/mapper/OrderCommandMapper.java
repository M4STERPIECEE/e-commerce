package com.commerce.ecommerce.adapter.out.persistence.mapper;

import com.commerce.ecommerce.adapter.in.web.order.dto.CheckoutRequest;
import com.commerce.ecommerce.application.port.in.order.CreateOrderCommand;
import com.commerce.ecommerce.application.port.in.order.UpdateOrderStatusCommand;
import com.commerce.ecommerce.domain.model.enums.OrderStatus;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.UUID;

@Mapper(componentModel = "spring")
public interface OrderCommandMapper {

    @Mapping(target = "email", source = "email")
    CreateOrderCommand toCreateOrderCommand(String email, CheckoutRequest request);

    @Mapping(target = "orderId", source = "orderId")
    @Mapping(target = "newStatus", source = "status")
    UpdateOrderStatusCommand toUpdateOrderStatusCommand(UUID orderId, OrderStatus status);
}
