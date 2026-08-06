package com.commerce.ecommerce.adapter.out.persistence.mapper;

import com.commerce.ecommerce.adapter.out.persistence.entity.CategoryJpaEntity;
import com.commerce.ecommerce.domain.model.Category;

public class CategoryMapper {
    private CategoryMapper() {}

    public static Category toDomain(CategoryJpaEntity entity) {
        if (entity == null) return null;
        return Category.builder()
                .id(entity.getId())
                .name(entity.getName())
                .slug(entity.getSlug())
                .description(entity.getDescription())
                .build();
    }

    public static CategoryJpaEntity toEntity(Category domain) {
        if (domain == null) return null;
        return CategoryJpaEntity.builder()
                .id(domain.getId())
                .name(domain.getName())
                .slug(domain.getSlug())
                .description(domain.getDescription())
                .build();
    }
}
