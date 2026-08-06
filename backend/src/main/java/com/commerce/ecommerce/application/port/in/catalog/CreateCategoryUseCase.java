package com.commerce.ecommerce.application.port.in.catalog;

import com.commerce.ecommerce.domain.model.Category;

public interface CreateCategoryUseCase {
    Category createCategory(CreateCategoryCommand command);
}
