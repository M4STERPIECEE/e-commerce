package com.commerce.ecommerce.adapter.out.persistence.mapper;

import com.commerce.ecommerce.adapter.out.persistence.entity.ProductJpaEntity;
import com.commerce.ecommerce.domain.model.Product;

public class ProductMapper {
    private ProductMapper() {}

    public static Product toDomain(ProductJpaEntity entity) {
        if (entity == null) return null;
        return Product.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .price(entity.getPrice())
                .stock(entity.getStock())
                .imageUrl(entity.getImageUrl())
                .active(entity.isActive())
                .categoryId(entity.getCategoryId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public static ProductJpaEntity toEntity(Product domain) {
        if (domain == null) return null;
        return ProductJpaEntity.builder()
                .id(domain.getId())
                .name(domain.getName())
                .description(domain.getDescription())
                .price(domain.getPrice())
                .stock(domain.getStock())
                .imageUrl(domain.getImageUrl())
                .active(domain.isActive())
                .categoryId(domain.getCategoryId())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .build();
    }
}
