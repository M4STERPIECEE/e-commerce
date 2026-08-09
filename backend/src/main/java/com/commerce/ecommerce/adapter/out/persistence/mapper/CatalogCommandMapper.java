package com.commerce.ecommerce.adapter.out.persistence.mapper;

import com.commerce.ecommerce.adapter.in.web.catalog.dto.ProductRequest;
import com.commerce.ecommerce.application.port.in.catalog.CreateProductCommand;
import com.commerce.ecommerce.application.port.in.catalog.ProductFilter;
import com.commerce.ecommerce.application.port.in.catalog.UpdateProductCommand;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.math.BigDecimal;
import java.util.UUID;

@Mapper(componentModel = "spring")
public interface CatalogCommandMapper {

    CreateProductCommand toCreateProductCommand(ProductRequest request);

    @Mapping(target = "id", source = "id")
    UpdateProductCommand toUpdateProductCommand(UUID id, ProductRequest request);

    ProductFilter toProductFilter(String search, UUID categoryId, BigDecimal minPrice, BigDecimal maxPrice);
}
