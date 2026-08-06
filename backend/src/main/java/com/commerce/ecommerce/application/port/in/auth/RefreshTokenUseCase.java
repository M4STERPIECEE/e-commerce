package com.commerce.ecommerce.application.port.in.auth;

public interface RefreshTokenUseCase {
    TokenPair refresh(String refreshToken);
}
