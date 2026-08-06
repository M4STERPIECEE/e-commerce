package com.commerce.ecommerce.adapter.out.persistence.mapper;

import com.commerce.ecommerce.adapter.out.persistence.entity.CartItemJpaEntity;
import com.commerce.ecommerce.adapter.out.persistence.entity.CartJpaEntity;
import com.commerce.ecommerce.domain.model.Cart;
import com.commerce.ecommerce.domain.model.CartItem;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CartMapper {

    Cart toDomain(CartJpaEntity entity);

    @Mapping(target = "cartId", source = "cart.id")
    CartItem toDomain(CartItemJpaEntity entity);

    @Mapping(target = "items.cart", ignore = true)
    CartJpaEntity toEntity(Cart domain);

    @Mapping(target = "cart", ignore = true)
    CartItemJpaEntity toEntity(CartItem domain);

    @AfterMapping
    default void linkItems(@MappingTarget CartJpaEntity entity) {
        if (entity.getItems() != null) {
            entity.getItems().forEach(item -> item.setCart(entity));
        }
    }
}
