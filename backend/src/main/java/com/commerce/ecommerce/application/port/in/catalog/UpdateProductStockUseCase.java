package com.commerce.ecommerce.application.port.in.catalog;

import java.util.UUID;

public interface UpdateProductStockUseCase {
    void updateStock(UUID productId, int newStock);
}
