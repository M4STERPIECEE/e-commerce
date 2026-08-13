package com.commerce.ecommerce.adapter.out.persistence.repository;

import com.commerce.ecommerce.adapter.out.persistence.entity.ProductJpaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.UUID;

public interface ProductJpaRepository extends JpaRepository<ProductJpaEntity, UUID> {

    @Query("""
            SELECT p FROM ProductJpaEntity p
            WHERE (cast(:search as string) IS NULL OR cast(:search as string) = ''
                   OR LOWER(p.name) LIKE LOWER(CONCAT('%', cast(:search as string), '%'))
                   OR LOWER(p.description) LIKE LOWER(CONCAT('%', cast(:search as string), '%')))
            AND (:categoryId IS NULL OR p.categoryId = :categoryId)
            AND (:minPrice IS NULL OR p.price >= :minPrice)
            AND (:maxPrice IS NULL OR p.price <= :maxPrice)
            """)
    Page<ProductJpaEntity> findWithFilters(
            @Param("search") String search,
            @Param("categoryId") UUID categoryId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable
    );
}
