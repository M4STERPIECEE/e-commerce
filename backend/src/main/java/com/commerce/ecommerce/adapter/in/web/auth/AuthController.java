package com.commerce.ecommerce.adapter.in.web.auth;

import com.commerce.ecommerce.adapter.in.web.common.ApiResponse;
import com.commerce.ecommerce.adapter.out.persistence.repository.UserJpaRepository;
import com.commerce.ecommerce.application.port.in.auth.*;
import com.commerce.ecommerce.domain.model.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final RegisterUserUseCase registerUserUseCase;
    private final LoginUseCase loginUseCase;
    private final RefreshTokenUseCase refreshTokenUseCase;
    private final GetCurrentUserUseCase getCurrentUserUseCase;
    private final UserJpaRepository userJpaRepository;

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<ApiResponse<UserProfileResponse>> register(@Valid @RequestBody RegisterRequest request) {
        User user = registerUserUseCase.register(RegisterCommand.builder()
                .email(request.getEmail())
                .password(request.getPassword())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .build());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully", toProfileResponse(user)));
    }

    @PostMapping("/login")
    @Operation(summary = "Login and receive JWT tokens")
    public ResponseEntity<ApiResponse<TokenPair>> login(@Valid @RequestBody LoginRequest request) {
        TokenPair tokens = loginUseCase.login(LoginCommand.builder()
                .email(request.getEmail())
                .password(request.getPassword())
                .build());
        return ResponseEntity.ok(ApiResponse.success(tokens));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token")
    public ResponseEntity<ApiResponse<TokenPair>> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        TokenPair tokens = refreshTokenUseCase.refresh(request.getRefreshToken());
        return ResponseEntity.ok(ApiResponse.success(tokens));
    }

    @GetMapping("/me")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get current user profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> me(@AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = userJpaRepository.findByEmail(userDetails.getUsername())
                .map(e -> e.getId())
                .orElseThrow();
        User user = getCurrentUserUseCase.getCurrentUser(userId);
        return ResponseEntity.ok(ApiResponse.success(toProfileResponse(user)));
    }

    private UserProfileResponse toProfileResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
