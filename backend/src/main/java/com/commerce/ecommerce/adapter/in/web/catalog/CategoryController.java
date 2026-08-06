package com.commerce.ecommerce.adapter.in.web.catalog;

import com.commerce.ecommerce.adapter.in.web.common.ApiResponse;
import com.commerce.ecommerce.application.port.in.catalog.CreateCategoryCommand;
import com.commerce.ecommerce.application.port.in.catalog.CreateCategoryUseCase;
import com.commerce.ecommerce.application.port.in.catalog.ListCategoriesUseCase;
import com.commerce.ecommerce.application.usecase.catalog.CategoryService;
import com.commerce.ecommerce.domain.model.Category;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
@Tag(name = "Categories")
public class CategoryController {

    private final CreateCategoryUseCase createCategoryUseCase;
    private final ListCategoriesUseCase listCategoriesUseCase;
    private final CategoryService categoryService;

    @GetMapping
    @Operation(summary = "List all categories (public)")
    public ResponseEntity<ApiResponse<List<Category>>> listCategories() {
        return ResponseEntity.ok(ApiResponse.success(listCategoriesUseCase.listCategories()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get category detail (public)")
    public ResponseEntity<ApiResponse<Category>> getCategory(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(categoryService.getCategory(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create category (admin only)")
    public ResponseEntity<ApiResponse<Category>> createCategory(@Valid @RequestBody CategoryRequest request) {
        Category category = createCategoryUseCase.createCategory(CreateCategoryCommand.builder()
                .name(request.getName())
                .slug(request.getSlug())
                .description(request.getDescription())
                .build());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(category));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete category (admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable UUID id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Category deleted", null));
    }

    @Data
    static class CategoryRequest {
        @NotBlank private String name;
        @NotBlank private String slug;
        private String description;
    }
}
