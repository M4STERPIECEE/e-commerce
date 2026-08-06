package com.commerce.ecommerce.adapter.out.persistence.mapper;

import com.commerce.ecommerce.adapter.out.persistence.entity.OrderItemJpaEntity;
import com.commerce.ecommerce.adapter.out.persistence.entity.OrderJpaEntity;
import com.commerce.ecommerce.domain.model.Order;
import com.commerce.ecommerce.domain.model.OrderItem;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    Order toDomain(OrderJpaEntity entity);

    @Mapping(target = "orderId", source = "order.id")
    OrderItem toDomain(OrderItemJpaEntity entity);

    @Mapping(target = "items.order", ignore = true)
    OrderJpaEntity toEntity(Order domain);

    @Mapping(target = "order", ignore = true)
    OrderItemJpaEntity toEntity(OrderItem domain);

    @AfterMapping
    default void linkItems(@MappingTarget OrderJpaEntity entity) {
        if (entity.getItems() != null) {
            entity.getItems().forEach(item -> item.setOrder(entity));
        }
    }
}
