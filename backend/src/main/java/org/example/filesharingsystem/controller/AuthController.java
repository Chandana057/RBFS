package org.example.filesharingsystem.controller;

import org.example.filesharingsystem.dto.AuthResponse;
import org.example.filesharingsystem.dto.ForgotPasswordRequest;
import org.example.filesharingsystem.dto.LoginRequest;
import org.example.filesharingsystem.dto.RegisterRequest;
import org.example.filesharingsystem.dto.ResetPasswordRequest;
import org.example.filesharingsystem.dto.UserProfileResponse;
import org.example.filesharingsystem.model.User;
import org.example.filesharingsystem.service.PasswordResetService;
import org.example.filesharingsystem.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserService userService;
    private final PasswordResetService passwordResetService;

    public AuthController(UserService userService, PasswordResetService passwordResetService) {
        this.userService = userService;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (request.getName() == null || request.getName().isBlank()
                || request.getEmail() == null || request.getEmail().isBlank()
                || request.getPassword() == null || request.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Name, email, and password are required."));
        }

        if (userService.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "An account with this email already exists."));
        }

        User user = new User();
        user.setUsername(request.getName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(request.getPassword());
        user.setRole("ROLE_EMPLOYEE");

        User savedUser = userService.saveUser(user);
        String token = buildMockToken(savedUser);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AuthResponse(toProfile(savedUser), token, "Account created successfully."));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()
                || request.getPassword() == null || request.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and password are required."));
        }

        User user = userService.findByEmail(request.getEmail().trim().toLowerCase());
        if (user == null || !user.getPassword().equals(request.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password."));
        }

        String token = buildMockToken(user);
        return ResponseEntity.ok(new AuthResponse(toProfile(user), token, "Login successful."));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required."));
        }

        User user = userService.findByEmail(request.getEmail().trim().toLowerCase());
        if (user == null) {
            return ResponseEntity.ok(Map.of("message", "If the account exists, a recovery link has been generated."));
        }

        String resetLink = passwordResetService.createResetLink(user);

        return ResponseEntity.ok(Map.of(
                "message", "Recovery link generated successfully.",
                "resetLink", resetLink
        ));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        if (request.getToken() == null || request.getToken().isBlank()
                || request.getPassword() == null || request.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Token and new password are required."));
        }

        try {
            passwordResetService.resetPassword(request.getToken(), request.getPassword());
            return ResponseEntity.ok(Map.of("message", "Password updated successfully. Please sign in."));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
        }
    }

    private UserProfileResponse toProfile(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                normalizeRole(user.getRole()),
                user.getUsername(),
                "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.getUsername().replace(" ", "%20")
        );
    }

    private String normalizeRole(String role) {
        if ("ROLE_ADMIN".equals(role)) {
            return "admin";
        }
        return "user";
    }

    private String buildMockToken(User user) {
        String raw = user.getEmail() + ":" + System.currentTimeMillis();
        return Base64.getEncoder().encodeToString(raw.getBytes(StandardCharsets.UTF_8));
    }
}
