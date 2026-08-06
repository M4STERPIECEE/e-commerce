package com.commerce.ecommerce.adapter.out.persistence.adapter;

import com.commerce.ecommerce.adapter.out.persistence.mapper.CategoryMapper;
import com.commerce.ecommerce.adapter.out.persistence.repository.CategoryJpaRepository;
import com.commerce.ecommerce.application.port.out.CategoryRepositoryPort;
import com.commerce.ecommerce.domain.model.Category;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class CategoryPersistenceAdapter implements CategoryRepositoryPort {

    private final CategoryJpaRepository repository;

    @Override
    public Category save(Category category) {
        return CategoryMapper.toDomain(repository.save(CategoryMapper.toEntity(category)));
    }

    @Override
    public Optional<Category> findById(UUID id) {
        return repository.findById(id).map(CategoryMapper::toDomain);
    }

    @Override
    public List<Category> findAll() {
        return repository.findAll().stream().map(CategoryMapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public void deleteById(UUID id) {
        repository.deleteById(id);
    }

    @Override
    public boolean existsBySlug(String slug) {
        return repository.existsBySlug(slug);
    }

    @Override
    public boolean existsById(UUID id) {
        return repository.existsById(id);
    }
}
