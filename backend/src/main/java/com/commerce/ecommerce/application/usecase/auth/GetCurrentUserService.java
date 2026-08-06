package com.commerce.ecommerce.application.usecase.auth;

import com.commerce.ecommerce.application.port.in.auth.GetCurrentUserUseCase;
import com.commerce.ecommerce.application.port.out.UserRepositoryPort;
import com.commerce.ecommerce.domain.exception.UserNotFoundException;
import com.commerce.ecommerce.domain.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetCurrentUserService implements GetCurrentUserUseCase {

    private final UserRepositoryPort userRepository;

    @Override
    public User getCurrentUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
    }
}
