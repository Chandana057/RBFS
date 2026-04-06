package org.example.filesharingsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private UserProfileResponse user;
    private String token;
    private String message;
}
