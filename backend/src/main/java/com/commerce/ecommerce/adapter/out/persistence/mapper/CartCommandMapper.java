package com.commerce.ecommerce.adapter.out.persistence.mapper;

import com.commerce.ecommerce.application.port.in.cart.AddItemCommand;
import com.commerce.ecommerce.application.port.in.cart.UpdateItemCommand;
import org.mapstruct.Mapper;

import java.util.UUID;

@Mapper(componentModel = "spring")
public interface CartCommandMapper {

    AddItemCommand toAddItemCommand(UUID userId, UUID productId, int quantity);

    UpdateItemCommand toUpdateItemCommand(UUID userId, UUID productId, int quantity);
}
