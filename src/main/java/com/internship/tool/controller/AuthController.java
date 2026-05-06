package com.internship.tool.controller;

import com.internship.tool.security.JwtUtil;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtUtil jwtUtil;

    public AuthController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> request) {

        String username = request.get("username");
        String password = request.get("password");

        // 🔥 Admin login
        if ("admin".equals(username) && "admin123".equals(password)) {
            String token = jwtUtil.generateToken(username, "ADMIN");
            return Map.of("token", token);
        }

        // 🔥 User login
        if ("user".equals(username) && "user123".equals(password)) {
            String token = jwtUtil.generateToken(username, "USER");
            return Map.of("token", token);
        }

        throw new RuntimeException("Invalid credentials");
    }
}