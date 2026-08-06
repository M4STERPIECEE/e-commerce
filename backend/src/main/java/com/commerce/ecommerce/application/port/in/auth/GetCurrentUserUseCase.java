package com.commerce.ecommerce.application.port.in.auth;

import com.commerce.ecommerce.domain.model.User;

import java.util.UUID;

public interface GetCurrentUserUseCase {
    User getCurrentUser(UUID userId);
}
