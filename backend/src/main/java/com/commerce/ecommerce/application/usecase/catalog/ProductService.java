package com.commerce.ecommerce.application.usecase.catalog;

import com.commerce.ecommerce.application.port.in.catalog.*;
import com.commerce.ecommerce.application.port.out.ProductRepositoryPort;
import com.commerce.ecommerce.domain.exception.ProductNotFoundException;
import com.commerce.ecommerce.domain.model.Product;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService implements CreateProductUseCase, UpdateProductUseCase,
        DeleteProductUseCase, ListProductsUseCase, GetProductDetailUseCase, UpdateProductStockUseCase {

    private final ProductRepositoryPort productRepository;

    @Override
    public Product createProduct(CreateProductCommand command) {
        Product product = Product.builder()
                .name(command.getName())
                .description(command.getDescription())
                .price(command.getPrice())
                .stock(command.getStock())
                .imageUrl(command.getImageUrl())
                .active(command.isActive())
                .categoryId(command.getCategoryId())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(UpdateProductCommand command) {
        Product existing = productRepository.findById(command.getId())
                .orElseThrow(() -> new ProductNotFoundException(command.getId()));
        existing.setName(command.getName());
        existing.setDescription(command.getDescription());
        existing.setPrice(command.getPrice());
        existing.setStock(command.getStock());
        existing.setImageUrl(command.getImageUrl());
        existing.setActive(command.isActive());
        existing.setCategoryId(command.getCategoryId());
        existing.setUpdatedAt(LocalDateTime.now());
        return productRepository.save(existing);
    }

    @Override
    public void deleteProduct(UUID id) {
        if (!productRepository.existsById(id)) {
            throw new ProductNotFoundException(id);
        }
        productRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Product> listProducts(ProductFilter filter, Pageable pageable) {
        return productRepository.findAll(
                filter.getSearch(),
                filter.getCategoryId(),
                filter.getMinPrice(),
                filter.getMaxPrice(),
                pageable
        );
    }

    @Override
    @Transactional(readOnly = true)
    public Product getProduct(UUID id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
    }

    @Override
    public void updateStock(UUID productId, int newStock) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));
        product.setStock(newStock);
        product.setUpdatedAt(LocalDateTime.now());
        productRepository.save(product);
    }
}
