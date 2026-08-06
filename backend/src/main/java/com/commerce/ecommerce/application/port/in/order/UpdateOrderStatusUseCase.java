package com.commerce.ecommerce.application.port.in.order;

import com.commerce.ecommerce.domain.model.Order;

public interface UpdateOrderStatusUseCase {
    Order updateStatus(UpdateOrderStatusCommand command);
}
