package com.commerce.ecommerce.adapter.out.persistence.mapper;

import com.commerce.ecommerce.adapter.out.persistence.entity.CartItemJpaEntity;
import com.commerce.ecommerce.adapter.out.persistence.entity.CartJpaEntity;
import com.commerce.ecommerce.domain.model.Cart;
import com.commerce.ecommerce.domain.model.CartItem;

import java.util.stream.Collectors;

public class CartMapper {
    private CartMapper() {}

    public static Cart toDomain(CartJpaEntity entity) {
        if (entity == null) return null;
        return Cart.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .items(entity.getItems().stream()
                        .map(CartMapper::itemToDomain)
                        .collect(Collectors.toList()))
                .build();
    }

    public static CartItem itemToDomain(CartItemJpaEntity entity) {
        return CartItem.builder()
                .id(entity.getId())
                .cartId(entity.getCart() != null ? entity.getCart().getId() : null)
                .productId(entity.getProductId())
                .quantity(entity.getQuantity())
                .unitPriceSnapshot(entity.getUnitPriceSnapshot())
                .build();
    }

    public static CartJpaEntity toEntity(Cart domain) {
        if (domain == null) return null;
        CartJpaEntity entity = CartJpaEntity.builder()
                .id(domain.getId())
                .userId(domain.getUserId())
                .status(domain.getStatus())
                .createdAt(domain.getCreatedAt())
                .build();
        entity.setItems(domain.getItems().stream()
                .map(item -> itemToEntity(item, entity))
                .collect(Collectors.toList()));
        return entity;
    }

    public static CartItemJpaEntity itemToEntity(CartItem domain, CartJpaEntity cartEntity) {
        return CartItemJpaEntity.builder()
                .id(domain.getId())
                .cart(cartEntity)
                .productId(domain.getProductId())
                .quantity(domain.getQuantity())
                .unitPriceSnapshot(domain.getUnitPriceSnapshot())
                .build();
    }
}
