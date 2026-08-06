package com.commerce.ecommerce.application.usecase.auth;

import com.commerce.ecommerce.application.port.in.auth.LoginCommand;
import com.commerce.ecommerce.application.port.in.auth.LoginUseCase;
import com.commerce.ecommerce.application.port.in.auth.TokenPair;
import com.commerce.ecommerce.application.port.out.PasswordEncoderPort;
import com.commerce.ecommerce.application.port.out.TokenGeneratorPort;
import com.commerce.ecommerce.application.port.out.UserRepositoryPort;
import com.commerce.ecommerce.domain.exception.UnauthorizedException;
import com.commerce.ecommerce.domain.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LoginService implements LoginUseCase {

    private final UserRepositoryPort userRepository;
    private final PasswordEncoderPort passwordEncoder;
    private final TokenGeneratorPort tokenGenerator;

    @Override
    public TokenPair login(LoginCommand command) {
        User user = userRepository.findByEmail(command.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (!passwordEncoder.matches(command.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        return TokenPair.builder()
                .accessToken(tokenGenerator.generateAccessToken(user))
                .refreshToken(tokenGenerator.generateRefreshToken(user))
                .build();
    }
}
