package com.commerce.ecommerce.domain.model;

import com.commerce.ecommerce.domain.model.enums.CartStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Cart {
    private UUID id;
    private UUID userId;
    private CartStatus status;
    private LocalDateTime createdAt;

    @Builder.Default
    private List<CartItem> items = new ArrayList<>();
}
