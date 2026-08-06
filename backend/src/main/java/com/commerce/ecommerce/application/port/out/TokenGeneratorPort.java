package com.commerce.ecommerce.application.port.out;

import com.commerce.ecommerce.domain.model.User;

public interface TokenGeneratorPort {
    String generateAccessToken(User user);
    String generateRefreshToken(User user);
    String extractEmail(String token);
    boolean isTokenValid(String token);
    boolean isRefreshToken(String token);
}
