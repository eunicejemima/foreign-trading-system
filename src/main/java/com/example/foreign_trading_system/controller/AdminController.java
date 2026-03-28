package com.example.foreign_trading_system.controller;

import com.example.foreign_trading_system.dto.AdminUserResponse;
import com.example.foreign_trading_system.dto.SummaryResponse;
import com.example.foreign_trading_system.dto.TradeCreateRequest;
import com.example.foreign_trading_system.dto.CurrencyRequest;
import com.example.foreign_trading_system.model.Trade;
import com.example.foreign_trading_system.model.Currency;
import com.example.foreign_trading_system.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // User Management Endpoints
    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> getAllUsers() {
        List<AdminUserResponse> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<AdminUserResponse> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> userUpdate) {
        AdminUserResponse response = adminService.updateUser(id, userUpdate);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/users/{id}/toggle")
    public ResponseEntity<AdminUserResponse> toggleUserStatus(@PathVariable Long id) {
        AdminUserResponse response = adminService.toggleUserStatus(id);
        return ResponseEntity.ok(response);
    }

    // Trade Management Endpoints
    @GetMapping("/trades")
    public ResponseEntity<List<Trade>> getAllTrades() {
        List<Trade> trades = adminService.getAllTrades();
        return ResponseEntity.ok(trades);
    }

    @PostMapping("/trades")
    public ResponseEntity<Trade> createTrade(@RequestBody TradeCreateRequest request) {
        Trade trade = adminService.createTrade(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(trade);
    }

    @PutMapping("/trades/{id}")
    public ResponseEntity<Trade> updateTrade(@PathVariable Long id, @RequestBody Map<String, Object> tradeUpdate) {
        Trade trade = adminService.updateTrade(id, tradeUpdate);
        return ResponseEntity.ok(trade);
    }

    @DeleteMapping("/trades/{id}")
    public ResponseEntity<Void> deleteTrade(@PathVariable Long id) {
        adminService.deleteTrade(id);
        return ResponseEntity.noContent().build();
    }

    // Currency Management Endpoints
    @GetMapping("/currencies")
    public ResponseEntity<List<Currency>> getAllCurrencies() {
        List<Currency> currencies = adminService.getAllCurrencies();
        return ResponseEntity.ok(currencies);
    }

    @PostMapping("/currencies")
    public ResponseEntity<Currency> createCurrency(@RequestBody CurrencyRequest request) {
        Currency currency = adminService.createCurrency(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(currency);
    }

    @PutMapping("/currencies/{id}")
    public ResponseEntity<Currency> updateCurrency(@PathVariable Long id, @RequestBody CurrencyRequest request) {
        Currency currency = adminService.updateCurrency(id, request);
        return ResponseEntity.ok(currency);
    }

    @DeleteMapping("/currencies/{id}")
    public ResponseEntity<Void> deleteCurrency(@PathVariable Long id) {
        adminService.deleteCurrency(id);
        return ResponseEntity.noContent().build();
    }

    // Summary Endpoint
    @GetMapping("/summary")
    public ResponseEntity<SummaryResponse> getSummary() {
        SummaryResponse summary = adminService.getSummary();
        return ResponseEntity.ok(summary);
    }
}

