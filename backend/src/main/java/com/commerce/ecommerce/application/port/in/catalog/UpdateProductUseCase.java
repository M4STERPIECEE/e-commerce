package com.commerce.ecommerce.application.port.in.catalog;

import com.commerce.ecommerce.domain.model.Product;

public interface UpdateProductUseCase {
    Product updateProduct(UpdateProductCommand command);
}
