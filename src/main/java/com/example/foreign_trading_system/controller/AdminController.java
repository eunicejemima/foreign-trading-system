package com.example.foreign_trading_system.controller;

import com.example.foreign_trading_system.dto.AdminUserResponse;
import com.example.foreign_trading_system.dto.SummaryResponse;
import com.example.foreign_trading_system.model.Trade;
import com.example.foreign_trading_system.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> getAllUsers() {
        List<AdminUserResponse> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/users/{id}/toggle")
    public ResponseEntity<AdminUserResponse> toggleUserStatus(@PathVariable Long id) {
        AdminUserResponse response = adminService.toggleUserStatus(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/trades")
    public ResponseEntity<List<Trade>> getAllTrades() {
        List<Trade> trades = adminService.getAllTrades();
        return ResponseEntity.ok(trades);
    }

    @GetMapping("/summary")
    public ResponseEntity<SummaryResponse> getSummary() {
        SummaryResponse summary = adminService.getSummary();
        return ResponseEntity.ok(summary);
    }
}
