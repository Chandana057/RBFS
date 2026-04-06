package org.example.filesharingsystem.service;

import org.example.filesharingsystem.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PasswordResetService {

    private final UserService userService;

    @Value("${app.frontend.base-url:http://localhost:5173}")
    private String frontendBaseUrl;

    public PasswordResetService(UserService userService) {
        this.userService = userService;
    }

    public String createResetLink(User user) {
        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(30));
        userService.saveUser(user);
        return buildResetLink(token);
    }

    public void resetPassword(String token, String password) {
        User user = userService.findByResetToken(token);
        if (user == null) {
            throw new IllegalArgumentException("Invalid or expired recovery link.");
        }

        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Recovery link has expired. Please request a new one.");
        }

        user.setPassword(password);
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userService.saveUser(user);
    }

    private String buildResetLink(String token) {
        return frontendBaseUrl.replaceAll("/$", "") + "/reset-password?token=" + token;
    }
}
