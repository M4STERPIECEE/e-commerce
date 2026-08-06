package com.commerce.ecommerce.application.port.in.cart;

import com.commerce.ecommerce.domain.model.Cart;

public interface UpdateCartItemQuantityUseCase {
    Cart updateItemQuantity(UpdateItemCommand command);
}
