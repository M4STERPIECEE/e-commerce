package com.commerce.ecommerce.adapter.out.persistence.mapper;

import com.commerce.ecommerce.adapter.in.web.catalog.dto.CategoryRequest;
import com.commerce.ecommerce.application.port.in.catalog.CreateCategoryCommand;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryCommandMapper {

    CreateCategoryCommand toCreateCategoryCommand(CategoryRequest request);
}
