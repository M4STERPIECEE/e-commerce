package com.commerce.ecommerce.application.port.in.catalog;

import com.commerce.ecommerce.domain.model.Category;

import java.util.List;

public interface ListCategoriesUseCase {
    List<Category> listCategories();
}
