package com.commerce.ecommerce.adapter.out.persistence.mapper;

import com.commerce.ecommerce.application.port.in.cart.AddItemCommand;
import com.commerce.ecommerce.application.port.in.cart.UpdateItemCommand;
import org.mapstruct.Mapper;

import java.util.UUID;

@Mapper(componentModel = "spring")
public interface CartCommandMapper {

    AddItemCommand toAddItemCommand(String email, UUID productId, int quantity);

    UpdateItemCommand toUpdateItemCommand(String email, UUID productId, int quantity);
}
