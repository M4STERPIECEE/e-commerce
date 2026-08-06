package com.commerce.ecommerce.application.usecase.auth;

import com.commerce.ecommerce.application.port.in.auth.RefreshTokenUseCase;
import com.commerce.ecommerce.application.port.in.auth.TokenPair;
import com.commerce.ecommerce.application.port.out.TokenGeneratorPort;
import com.commerce.ecommerce.application.port.out.UserRepositoryPort;
import com.commerce.ecommerce.domain.exception.UnauthorizedException;
import com.commerce.ecommerce.domain.exception.UserNotFoundException;
import com.commerce.ecommerce.domain.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RefreshTokenService implements RefreshTokenUseCase {

    private final TokenGeneratorPort tokenGenerator;
    private final UserRepositoryPort userRepository;

    @Override
    public TokenPair refresh(String refreshToken) {
        if (!tokenGenerator.isTokenValid(refreshToken) || !tokenGenerator.isRefreshToken(refreshToken)) {
            throw new UnauthorizedException("Invalid or expired refresh token");
        }
        String email = tokenGenerator.extractEmail(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email));

        return TokenPair.builder()
                .accessToken(tokenGenerator.generateAccessToken(user))
                .refreshToken(tokenGenerator.generateRefreshToken(user))
                .build();
    }
}
