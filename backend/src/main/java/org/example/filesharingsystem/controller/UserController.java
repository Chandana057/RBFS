package org.example.filesharingsystem.controller;

import org.example.filesharingsystem.dto.AdminCreateUserRequest;
import org.example.filesharingsystem.dto.AdminUpdateRoleRequest;
import org.example.filesharingsystem.dto.UserProfileResponse;
import org.example.filesharingsystem.model.User;
import org.example.filesharingsystem.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // This creates a new user
    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    // This shows all users in your browser
    @GetMapping("/all")
    public List<UserProfileResponse> getAllUsers() {
        return userService.getAllUsers().stream().map(this::toProfile).collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody AdminCreateUserRequest request) {
        if (request.getName() == null || request.getName().isBlank()
                || request.getEmail() == null || request.getEmail().isBlank()
                || request.getPassword() == null || request.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Name, email, and password are required."));
        }

        String email = request.getEmail().trim().toLowerCase();
        if (userService.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "A user with this email already exists."));
        }

        User user = new User();
        user.setUsername(request.getName().trim());
        user.setEmail(email);
        user.setPassword(request.getPassword());
        user.setRole(normalizeRole(request.getRole()));

        return ResponseEntity.status(HttpStatus.CREATED).body(toProfile(userService.saveUser(user)));
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody AdminUpdateRoleRequest request) {
        User user = userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found."));
        }

        user.setRole(normalizeRole(request.getRole()));
        return ResponseEntity.ok(toProfile(userService.saveUser(user)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userService.deleteUser(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found."));
        }

        return ResponseEntity.ok(Map.of("message", "User deleted successfully."));
    }

    private String normalizeRole(String role) {
        if ("admin".equalsIgnoreCase(role) || "ROLE_ADMIN".equalsIgnoreCase(role)) {
            return "ROLE_ADMIN";
        }
        return "ROLE_EMPLOYEE";
    }

    private UserProfileResponse toProfile(User user) {
        String normalizedRole = "ROLE_ADMIN".equals(user.getRole()) ? "admin" : "user";
        return new UserProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                normalizedRole,
                user.getUsername(),
                "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.getUsername().replace(" ", "%20")
        );
    }
}
