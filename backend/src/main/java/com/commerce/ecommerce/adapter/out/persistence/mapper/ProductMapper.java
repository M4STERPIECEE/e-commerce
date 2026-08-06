package com.commerce.ecommerce.adapter.out.persistence.mapper;

import com.commerce.ecommerce.adapter.out.persistence.entity.ProductJpaEntity;
import com.commerce.ecommerce.domain.model.Product;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    Product toDomain(ProductJpaEntity entity);

    ProductJpaEntity toEntity(Product domain);
}
