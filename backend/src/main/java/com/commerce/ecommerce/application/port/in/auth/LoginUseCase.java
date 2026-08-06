package com.commerce.ecommerce.application.port.in.auth;

public interface LoginUseCase {
    TokenPair login(LoginCommand command);
}
