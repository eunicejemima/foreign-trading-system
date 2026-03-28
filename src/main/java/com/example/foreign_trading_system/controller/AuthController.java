package com.example.foreign_trading_system.controller;

import com.example.foreign_trading_system.dto.AuthRequest;
import com.example.foreign_trading_system.dto.AuthResponse;
import com.example.foreign_trading_system.dto.UserCreateRequest;
import com.example.foreign_trading_system.dto.AdminUserResponse;
import com.example.foreign_trading_system.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminUserResponse> createUser(@RequestBody UserCreateRequest request) {
        AdminUserResponse response = authService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}

