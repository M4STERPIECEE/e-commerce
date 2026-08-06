package com.commerce.ecommerce.application.port.in.order;

import com.commerce.ecommerce.domain.model.Order;

import java.util.UUID;

public interface GetOrderDetailUseCase {
    Order getOrder(UUID orderId, UUID userId);
}
