package com.example.foreign_trading_system.service;

import com.example.foreign_trading_system.dto.AdminUserResponse;
import com.example.foreign_trading_system.dto.SummaryResponse;
import com.example.foreign_trading_system.model.Trade;
import com.example.foreign_trading_system.model.User;
import com.example.foreign_trading_system.repository.TradeRepository;
import com.example.foreign_trading_system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final TradeRepository tradeRepository;

    public List<AdminUserResponse> getAllUsers() {
        log.info("Fetching all users");
        return userRepository.findAll().stream()
                .map(this::mapUserToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AdminUserResponse toggleUserStatus(Long userId) {
        log.info("Toggling status for user id: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setActive(!user.isActive());
        User updatedUser = userRepository.save(user);
        
        log.info("User status toggled successfully for id: {}", userId);
        return mapUserToResponse(updatedUser);
    }

    public List<Trade> getAllTrades() {
        log.info("Fetching all trades");
        return tradeRepository.findAll();
    }

    public SummaryResponse getSummary() {
        log.info("Generating summary report");
        
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.findAll().stream()
                .filter(User::isActive)
                .count();
        long totalTrades = tradeRepository.count();
        long completedTrades = tradeRepository.findAll().stream()
                .filter(t -> "COMPLETED".equals(t.getStatus()))
                .count();
        
        log.info("Summary generated - Total Users: {}, Active Users: {}, Total Trades: {}, Completed Trades: {}",
                totalUsers, activeUsers, totalTrades, completedTrades);
        
        return SummaryResponse.builder()
                .totalUsers(totalUsers)
                .totalTrades(totalTrades)
                .activeUsers(activeUsers)
                .completedTrades(completedTrades)
                .build();
    }

    private AdminUserResponse mapUserToResponse(User user) {
        return AdminUserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .isActive(user.isActive())
                .build();
    }
}
