package com.commerce.ecommerce.application.usecase.catalog;

import com.commerce.ecommerce.application.port.in.catalog.*;
import com.commerce.ecommerce.application.port.out.CategoryRepositoryPort;
import com.commerce.ecommerce.domain.exception.CategoryNotFoundException;
import com.commerce.ecommerce.domain.model.Category;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryService implements CreateCategoryUseCase, ListCategoriesUseCase {

    private final CategoryRepositoryPort categoryRepository;

    @Override
    public Category createCategory(CreateCategoryCommand command) {
        Category category = Category.builder()
                .name(command.getName())
                .slug(command.getSlug())
                .description(command.getDescription())
                .build();
        return categoryRepository.save(category);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Category> listCategories() {
        return categoryRepository.findAll();
    }

    @Transactional
    public void deleteCategory(UUID id) {
        if (!categoryRepository.existsById(id)) {
            throw new CategoryNotFoundException(id);
        }
        categoryRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Category getCategory(UUID id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException(id));
    }
}
