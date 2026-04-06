package org.example.filesharingsystem.dto;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String token;
    private String password;
}
