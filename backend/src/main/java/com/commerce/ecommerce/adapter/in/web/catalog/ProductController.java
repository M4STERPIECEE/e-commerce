package com.commerce.ecommerce.adapter.in.web.catalog;

import com.commerce.ecommerce.adapter.in.web.catalog.dto.ProductRequest;
import com.commerce.ecommerce.adapter.in.web.common.ApiResponse;
import com.commerce.ecommerce.adapter.out.persistence.mapper.CatalogCommandMapper;
import com.commerce.ecommerce.application.port.in.catalog.*;
import com.commerce.ecommerce.domain.model.Product;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/api/${version.path}/products")
@RequiredArgsConstructor
public class ProductController {

    private final CreateProductUseCase createProductUseCase;
    private final UpdateProductUseCase updateProductUseCase;
    private final DeleteProductUseCase deleteProductUseCase;
    private final ListProductsUseCase listProductsUseCase;
    private final GetProductDetailUseCase getProductDetailUseCase;
    private final UpdateProductStockUseCase updateProductStockUseCase;
    private final CatalogCommandMapper catalogMapper;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Product>>> listProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        ProductFilter filter = catalogMapper.toProductFilter(search, categoryId, minPrice, maxPrice);
        Page<Product> products = listProductsUseCase.listProducts(filter, PageRequest.of(page, size, sort));
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> getProduct(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(getProductDetailUseCase.getProduct(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<Product>> createProduct(@Valid @RequestBody ProductRequest request) {
        Product product = createProductUseCase.createProduct(catalogMapper.toCreateProductCommand(request));
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(product));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<Product>> updateProduct(@PathVariable UUID id,
                                                               @Valid @RequestBody ProductRequest request) {
        Product product = updateProductUseCase.updateProduct(catalogMapper.toUpdateProductCommand(id, request));
        return ResponseEntity.ok(ApiResponse.success(product));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable UUID id) {
        deleteProductUseCase.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted", null));
    }

    @PatchMapping("/{id}/stock")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<Void>> updateStock(@PathVariable UUID id,
                                                          @RequestParam int quantity) {
        updateProductStockUseCase.updateStock(id, quantity);
        return ResponseEntity.ok(ApiResponse.success("Stock updated", null));
    }
}
