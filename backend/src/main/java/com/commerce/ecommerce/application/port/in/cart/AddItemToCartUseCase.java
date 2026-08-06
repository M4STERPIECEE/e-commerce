package com.commerce.ecommerce.application.port.in.cart;

import com.commerce.ecommerce.domain.model.Cart;

public interface AddItemToCartUseCase {
    Cart addItem(AddItemCommand command);
}
