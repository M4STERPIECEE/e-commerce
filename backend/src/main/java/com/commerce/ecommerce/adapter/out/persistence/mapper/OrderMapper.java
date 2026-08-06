package com.commerce.ecommerce.adapter.out.persistence.mapper;

import com.commerce.ecommerce.adapter.out.persistence.entity.OrderItemJpaEntity;
import com.commerce.ecommerce.adapter.out.persistence.entity.OrderJpaEntity;
import com.commerce.ecommerce.domain.model.Order;
import com.commerce.ecommerce.domain.model.OrderItem;

import java.util.stream.Collectors;

public class OrderMapper {
    private OrderMapper() {}

    public static Order toDomain(OrderJpaEntity entity) {
        if (entity == null) return null;
        return Order.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .status(entity.getStatus())
                .totalAmount(entity.getTotalAmount())
                .shippingAddress(entity.getShippingAddress())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .items(entity.getItems().stream()
                        .map(OrderMapper::itemToDomain)
                        .collect(Collectors.toList()))
                .build();
    }

    public static OrderItem itemToDomain(OrderItemJpaEntity entity) {
        return OrderItem.builder()
                .id(entity.getId())
                .orderId(entity.getOrder() != null ? entity.getOrder().getId() : null)
                .productId(entity.getProductId())
                .productNameSnapshot(entity.getProductNameSnapshot())
                .quantity(entity.getQuantity())
                .unitPriceSnapshot(entity.getUnitPriceSnapshot())
                .build();
    }

    public static OrderJpaEntity toEntity(Order domain) {
        if (domain == null) return null;
        OrderJpaEntity entity = OrderJpaEntity.builder()
                .id(domain.getId())
                .userId(domain.getUserId())
                .status(domain.getStatus())
                .totalAmount(domain.getTotalAmount())
                .shippingAddress(domain.getShippingAddress())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .build();
        entity.setItems(domain.getItems().stream()
                .map(item -> itemToEntity(item, entity))
                .collect(Collectors.toList()));
        return entity;
    }

    public static OrderItemJpaEntity itemToEntity(OrderItem domain, OrderJpaEntity orderEntity) {
        return OrderItemJpaEntity.builder()
                .id(domain.getId())
                .order(orderEntity)
                .productId(domain.getProductId())
                .productNameSnapshot(domain.getProductNameSnapshot())
                .quantity(domain.getQuantity())
                .unitPriceSnapshot(domain.getUnitPriceSnapshot())
                .build();
    }
}
