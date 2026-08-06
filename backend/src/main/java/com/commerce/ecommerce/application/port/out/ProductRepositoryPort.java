package com.commerce.ecommerce.application.port.out;

import com.commerce.ecommerce.domain.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepositoryPort {
    Product save(Product product);
    Optional<Product> findById(UUID id);
    void deleteById(UUID id);
    boolean existsById(UUID id);
    Page<Product> findAll(String search, UUID categoryId, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);
    List<Product> findAllById(List<UUID> ids);
}
