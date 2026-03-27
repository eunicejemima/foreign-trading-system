package com.example.foreign_trading_system.service;

import com.example.foreign_trading_system.dto.AdminUserResponse;
import com.example.foreign_trading_system.dto.SummaryResponse;
import com.example.foreign_trading_system.exception.AppException;
import com.example.foreign_trading_system.model.Trade;
import com.example.foreign_trading_system.model.User;
import com.example.foreign_trading_system.repository.TradeRepository;
import com.example.foreign_trading_system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.math.BigDecimal;

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
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        user.setActive(!user.isActive());
        User updatedUser = userRepository.save(user);

        log.info("User status toggled successfully for id: {}", userId);
        return mapUserToResponse(updatedUser);
    }

    @Transactional
    public AdminUserResponse updateUser(Long userId, Map<String, Object> userUpdate) {
        log.info("Updating user id: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        if (userUpdate.containsKey("username")) {
            user.setUsername((String) userUpdate.get("username"));
        }
        if (userUpdate.containsKey("email")) {
            user.setEmail((String) userUpdate.get("email"));
        }
        if (userUpdate.containsKey("role")) {
            user.setRole((String) userUpdate.get("role"));
        }
        if (userUpdate.containsKey("active")) {
            user.setActive((Boolean) userUpdate.get("active"));
        }

        User updatedUser = userRepository.save(user);
        log.info("User updated successfully for id: {}", userId);
        return mapUserToResponse(updatedUser);
    }

    public List<Trade> getAllTrades() {
        log.info("Fetching all trades");
        return tradeRepository.findAll();
    }

    @Transactional
    public Trade updateTrade(Long tradeId, Map<String, Object> tradeUpdate) {
        log.info("Updating trade id: {}", tradeId);
        Trade trade = tradeRepository.findById(tradeId)
                .orElseThrow(() -> new AppException("Trade not found", HttpStatus.NOT_FOUND));

        if (tradeUpdate.containsKey("fromCurrency")) {
            trade.setFromCurrency((String) tradeUpdate.get("fromCurrency"));
        }
        if (tradeUpdate.containsKey("toCurrency")) {
            trade.setToCurrency((String) tradeUpdate.get("toCurrency"));
        }
        if (tradeUpdate.containsKey("amount")) {
            Object amount = tradeUpdate.get("amount");
            if (amount instanceof Number) {
                trade.setAmount(BigDecimal.valueOf(((Number) amount).doubleValue()));
            }
        }
        if (tradeUpdate.containsKey("exchangeRate")) {
            Object rate = tradeUpdate.get("exchangeRate");
            if (rate instanceof Number) {
                trade.setExchangeRate(BigDecimal.valueOf(((Number) rate).doubleValue()));
            }
        }
        if (tradeUpdate.containsKey("resultAmount")) {
            Object result = tradeUpdate.get("resultAmount");
            if (result instanceof Number) {
                trade.setResultAmount(BigDecimal.valueOf(((Number) result).doubleValue()));
            }
        }
        if (tradeUpdate.containsKey("status")) {
            trade.setStatus((String) tradeUpdate.get("status"));
        }

        Trade updatedTrade = tradeRepository.save(trade);
        log.info("Trade updated successfully for id: {}", tradeId);
        return updatedTrade;
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
