package com.commerce.ecommerce.application.port.in.order;

import com.commerce.ecommerce.domain.model.Order;

public interface CreateOrderFromCartUseCase {
    Order createOrder(CreateOrderCommand command);
}
