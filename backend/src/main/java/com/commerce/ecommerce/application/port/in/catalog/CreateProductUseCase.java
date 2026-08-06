package com.commerce.ecommerce.application.port.in.catalog;

import com.commerce.ecommerce.domain.model.Product;

public interface CreateProductUseCase {
    Product createProduct(CreateProductCommand command);
}
