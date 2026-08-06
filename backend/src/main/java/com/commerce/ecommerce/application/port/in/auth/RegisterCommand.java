package com.commerce.ecommerce.application.port.in.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterCommand {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
}
