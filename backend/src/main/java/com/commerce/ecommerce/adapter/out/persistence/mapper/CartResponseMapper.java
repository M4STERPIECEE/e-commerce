package com.commerce.ecommerce.adapter.out.persistence.mapper;

import com.commerce.ecommerce.adapter.in.web.cart.dto.CartItemResponse;
import com.commerce.ecommerce.adapter.in.web.cart.dto.CartResponse;
import com.commerce.ecommerce.domain.model.Cart;
import com.commerce.ecommerce.domain.model.CartItem;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CartResponseMapper {

    CartResponse toResponse(Cart cart);

    CartItemResponse toResponse(CartItem item);
}
