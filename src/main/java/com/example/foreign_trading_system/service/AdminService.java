package com.example.foreign_trading_system.service;

import com.example.foreign_trading_system.dto.AdminUserResponse;
import com.example.foreign_trading_system.dto.SummaryResponse;
import com.example.foreign_trading_system.dto.TradeCreateRequest;
import com.example.foreign_trading_system.dto.CurrencyRequest;
import com.example.foreign_trading_system.exception.AppException;
import com.example.foreign_trading_system.model.Trade;
import com.example.foreign_trading_system.model.User;
import com.example.foreign_trading_system.model.Currency;
import com.example.foreign_trading_system.repository.TradeRepository;
import com.example.foreign_trading_system.repository.UserRepository;
import com.example.foreign_trading_system.repository.CurrencyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
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
    private final CurrencyRepository currencyRepository;

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

    @Transactional
    public void deleteUser(Long userId) {
        log.info("Deleting user id: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        
        if ("ADMIN".equals(user.getRole())) {
            throw new AppException("Cannot delete admin users", HttpStatus.FORBIDDEN);
        }
        
        userRepository.delete(user);
        log.info("User deleted successfully for id: {}", userId);
    }

    @Transactional
    public Trade createTrade(TradeCreateRequest request) {
        log.info("Creating new trade from {} to {}", request.getFromCurrency(), request.getToCurrency());
        
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        
        Trade trade = new Trade();
        trade.setFromCurrency(request.getFromCurrency());
        trade.setToCurrency(request.getToCurrency());
        trade.setAmount(request.getAmount());
        trade.setExchangeRate(request.getExchangeRate());
        trade.setResultAmount(request.getAmount().multiply(request.getExchangeRate()));
        trade.setStatus(request.getStatus() != null ? request.getStatus() : "COMPLETED");
        trade.setTradeDate(LocalDateTime.now());
        trade.setCreatedAt(LocalDateTime.now());
        trade.setUser(user);
        
        Trade savedTrade = tradeRepository.save(trade);
        log.info("Trade created successfully with id: {}", savedTrade.getId());
        return savedTrade;
    }

    @Transactional
    public void deleteTrade(Long tradeId) {
        log.info("Deleting trade id: {}", tradeId);
        Trade trade = tradeRepository.findById(tradeId)
                .orElseThrow(() -> new AppException("Trade not found", HttpStatus.NOT_FOUND));
        
        tradeRepository.delete(trade);
        log.info("Trade deleted successfully for id: {}", tradeId);
    }

    public List<Currency> getAllCurrencies() {
        log.info("Fetching all currencies");
        return currencyRepository.findAll();
    }

    @Transactional
    public Currency createCurrency(CurrencyRequest request) {
        log.info("Creating new currency: {}", request.getCode());
        
        Currency currency = new Currency();
        currency.setCode(request.getCode().toUpperCase());
        currency.setName(request.getName());
        currency.setExchangeRate(request.getExchangeRate());
        
        Currency saved = currencyRepository.save(currency);
        log.info("Currency created successfully with id: {}", saved.getId());
        return saved;
    }

    @Transactional
    public Currency updateCurrency(Long currencyId, CurrencyRequest request) {
        log.info("Updating currency id: {}", currencyId);
        
        Currency currency = currencyRepository.findById(currencyId)
                .orElseThrow(() -> new AppException("Currency not found", HttpStatus.NOT_FOUND));
        
        currency.setCode(request.getCode().toUpperCase());
        currency.setName(request.getName());
        currency.setExchangeRate(request.getExchangeRate());
        
        Currency updated = currencyRepository.save(currency);
        log.info("Currency updated successfully for id: {}", currencyId);
        return updated;
    }

    @Transactional
    public void deleteCurrency(Long currencyId) {
        log.info("Deleting currency id: {}", currencyId);
        Currency currency = currencyRepository.findById(currencyId)
                .orElseThrow(() -> new AppException("Currency not found", HttpStatus.NOT_FOUND));
        
        currencyRepository.delete(currency);
        log.info("Currency deleted successfully for id: {}", currencyId);
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
