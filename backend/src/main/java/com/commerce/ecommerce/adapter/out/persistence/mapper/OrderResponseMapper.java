package com.commerce.ecommerce.adapter.out.persistence.mapper;

import com.commerce.ecommerce.adapter.in.web.order.dto.OrderItemResponse;
import com.commerce.ecommerce.adapter.in.web.order.dto.OrderResponse;
import com.commerce.ecommerce.domain.model.Order;
import com.commerce.ecommerce.domain.model.OrderItem;
import org.mapstruct.Mapper;
import org.springframework.data.domain.Page;

@Mapper(componentModel = "spring")
public interface OrderResponseMapper {

    OrderResponse toResponse(Order order);

    OrderItemResponse toResponse(OrderItem item);

    default Page<OrderResponse> toResponse(Page<Order> orders) {
        return orders.map(this::toResponse);
    }
}
