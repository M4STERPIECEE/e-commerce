package com.commerce.ecommerce.application.port.in.auth;

import com.commerce.ecommerce.domain.model.User;

public interface GetCurrentUserUseCase {
    User getCurrentUser(String email);
}
