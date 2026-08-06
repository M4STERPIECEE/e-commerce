package com.commerce.ecommerce.application.port.in.cart;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddItemCommand {
    private UUID userId;
    private UUID productId;
    private int quantity;
}
