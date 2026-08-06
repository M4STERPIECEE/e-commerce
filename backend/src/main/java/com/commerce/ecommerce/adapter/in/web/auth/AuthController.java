package com.commerce.ecommerce.adapter.in.web.auth;

import com.commerce.ecommerce.adapter.in.web.auth.dto.LoginRequest;
import com.commerce.ecommerce.adapter.in.web.auth.dto.RefreshTokenRequest;
import com.commerce.ecommerce.adapter.in.web.auth.dto.RegisterRequest;
import com.commerce.ecommerce.adapter.in.web.auth.dto.UserProfileResponse;
import com.commerce.ecommerce.adapter.in.web.auth.mapper.UserProfileMapper;
import com.commerce.ecommerce.adapter.in.web.common.ApiResponse;
import com.commerce.ecommerce.adapter.out.persistence.repository.UserJpaRepository;
import com.commerce.ecommerce.application.port.in.auth.*;
import com.commerce.ecommerce.domain.model.User;
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
@RequestMapping("/api/${version.path}/auth")
@RequiredArgsConstructor
public class AuthController {

    private final RegisterUserUseCase registerUserUseCase;
    private final LoginUseCase loginUseCase;
    private final RefreshTokenUseCase refreshTokenUseCase;
    private final GetCurrentUserUseCase getCurrentUserUseCase;
    private final UserJpaRepository userJpaRepository;
    private final UserProfileMapper userProfileMapper;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserProfileResponse>> register(@Valid @RequestBody RegisterRequest request) {
        User user = registerUserUseCase.register(RegisterCommand.builder()
                .email(request.getEmail())
                .password(request.getPassword())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .build());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully", userProfileMapper.toResponse(user)));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<TokenPair>> login(@Valid @RequestBody LoginRequest request) {
        TokenPair tokens = loginUseCase.login(LoginCommand.builder()
                .email(request.getEmail())
                .password(request.getPassword())
                .build());
        return ResponseEntity.ok(ApiResponse.success(tokens));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<TokenPair>> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        TokenPair tokens = refreshTokenUseCase.refresh(request.getRefreshToken());
        return ResponseEntity.ok(ApiResponse.success(tokens));
    }

    @GetMapping("/me")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<UserProfileResponse>> me(@AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = userJpaRepository.findByEmail(userDetails.getUsername())
                .map(e -> e.getId())
                .orElseThrow();
        User user = getCurrentUserUseCase.getCurrentUser(userId);
        return ResponseEntity.ok(ApiResponse.success(userProfileMapper.toResponse(user)));
    }
}
