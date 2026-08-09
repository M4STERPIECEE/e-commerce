package com.commerce.ecommerce.adapter.out.persistence.mapper;

import com.commerce.ecommerce.adapter.in.web.auth.dto.LoginRequest;
import com.commerce.ecommerce.adapter.in.web.auth.dto.RegisterRequest;
import com.commerce.ecommerce.application.port.in.auth.LoginCommand;
import com.commerce.ecommerce.application.port.in.auth.RegisterCommand;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AuthMapper {

    RegisterCommand toRegisterCommand(RegisterRequest request);

    LoginCommand toLoginCommand(LoginRequest request);
}
