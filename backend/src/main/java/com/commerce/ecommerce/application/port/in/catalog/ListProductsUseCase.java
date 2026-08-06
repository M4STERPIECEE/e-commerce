package com.commerce.ecommerce.application.port.in.catalog;

import com.commerce.ecommerce.domain.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ListProductsUseCase {
    Page<Product> listProducts(ProductFilter filter, Pageable pageable);
}
