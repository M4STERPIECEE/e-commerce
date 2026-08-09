package com.commerce.ecommerce.adapter.out.persistence.mapper;

import com.commerce.ecommerce.adapter.in.web.catalog.dto.ProductResponse;
import com.commerce.ecommerce.domain.model.Product;
import org.mapstruct.Mapper;
import org.springframework.data.domain.Page;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductResponseMapper {

    ProductResponse toResponse(Product product);

    List<ProductResponse> toResponse(List<Product> products);

    default Page<ProductResponse> toResponse(Page<Product> products) {
        return products.map(this::toResponse);
    }
}
