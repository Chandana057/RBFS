package org.example.filesharingsystem.dto;

import lombok.Data;

@Data
public class AdminCreateUserRequest {
    private String name;
    private String email;
    private String password;
    private String role;
}
