package com.commerce.ecommerce.application.port.in.order;

import java.util.UUID;

public interface CancelOrderUseCase {
    void cancelOrder(UUID orderId, UUID userId);
}
