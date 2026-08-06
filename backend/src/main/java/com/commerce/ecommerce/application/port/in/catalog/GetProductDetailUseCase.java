package com.commerce.ecommerce.application.port.in.catalog;

import com.commerce.ecommerce.domain.model.Product;

import java.util.UUID;

public interface GetProductDetailUseCase {
    Product getProduct(UUID id);
}
