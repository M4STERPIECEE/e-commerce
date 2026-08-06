package com.commerce.ecommerce.application.usecase.auth;

import com.commerce.ecommerce.application.port.in.auth.RegisterCommand;
import com.commerce.ecommerce.application.port.in.auth.RegisterUserUseCase;
import com.commerce.ecommerce.application.port.out.PasswordEncoderPort;
import com.commerce.ecommerce.application.port.out.UserRepositoryPort;
import com.commerce.ecommerce.domain.exception.EmailAlreadyExistsException;
import com.commerce.ecommerce.domain.model.User;
import com.commerce.ecommerce.domain.model.enums.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class RegisterUserService implements RegisterUserUseCase {

    private final UserRepositoryPort userRepository;
    private final PasswordEncoderPort passwordEncoder;

    @Override
    public User register(RegisterCommand command) {
        if (userRepository.existsByEmail(command.getEmail())) {
            throw new EmailAlreadyExistsException(command.getEmail());
        }
        User user = User.builder()
                .email(command.getEmail())
                .password(passwordEncoder.encode(command.getPassword()))
                .firstName(command.getFirstName())
                .lastName(command.getLastName())
                .role(UserRole.CUSTOMER)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        return userRepository.save(user);
    }
}
