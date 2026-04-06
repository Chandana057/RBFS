package org.example.filesharingsystem.config;

import org.example.filesharingsystem.model.User;
import org.example.filesharingsystem.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner seedAdminUser(UserService userService) {
        return args -> {
            if (!userService.existsByEmail("admin@sharevault.com")) {
                User admin = new User();
                admin.setUsername("Admin User");
                admin.setEmail("admin@sharevault.com");
                admin.setPassword("password123");
                admin.setRole("ROLE_ADMIN");
                userService.saveUser(admin);
            }

            if (!userService.existsByEmail("user@sharevault.com")) {
                User standardUser = new User();
                standardUser.setUsername("Regular User");
                standardUser.setEmail("user@sharevault.com");
                standardUser.setPassword("password123");
                standardUser.setRole("ROLE_EMPLOYEE");
                userService.saveUser(standardUser);
            }
        };
    }
}
