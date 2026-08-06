package com.commerce.ecommerce.adapter.out.persistence.mapper;

import com.commerce.ecommerce.adapter.out.persistence.entity.CategoryJpaEntity;
import com.commerce.ecommerce.domain.model.Category;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    Category toDomain(CategoryJpaEntity entity);

    CategoryJpaEntity toEntity(Category domain);
}
