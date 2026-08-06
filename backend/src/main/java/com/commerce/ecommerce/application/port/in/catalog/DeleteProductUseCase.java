package com.commerce.ecommerce.application.port.in.catalog;

import java.util.UUID;

public interface DeleteProductUseCase {
    void deleteProduct(UUID id);
}
