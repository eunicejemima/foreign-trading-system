package com.example.foreign_trading_system.config;

import com.example.foreign_trading_system.model.User;
import com.example.foreign_trading_system.model.Trade;
import com.example.foreign_trading_system.repository.UserRepository;
import com.example.foreign_trading_system.repository.TradeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TradeRepository tradeRepository;

    @Override
    public void run(String... args) throws Exception {
        // Create or update admin user
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        User admin = userRepository.findByUsername("admin")
                .orElse(new User());
        
        admin.setUsername("admin");
        admin.setEmail("admin@fts.com");
        admin.setPassword(encoder.encode("admin123")); // Always encode with correct password
        admin.setRole("ADMIN");
        admin.setActive(true);

        userRepository.save(admin);
        log.info("Admin user created/updated successfully");

        // Create sample trades if none exist
        if (tradeRepository.count() == 0) {
            Trade trade1 = new Trade();
            trade1.setUser(admin);
            trade1.setFromCurrency("USD");
            trade1.setToCurrency("EUR");
            trade1.setAmount(BigDecimal.valueOf(1000.00));
            trade1.setExchangeRate(BigDecimal.valueOf(0.92));
            trade1.setResultAmount(BigDecimal.valueOf(920.00));
            trade1.setStatus("COMPLETED");
            trade1.setTradeDate(LocalDateTime.now().minusDays(5));
            trade1.setCreatedAt(LocalDateTime.now().minusDays(5));

            Trade trade2 = new Trade();
            trade2.setUser(admin);
            trade2.setFromCurrency("GBP");
            trade2.setToCurrency("JPY");
            trade2.setAmount(BigDecimal.valueOf(500.00));
            trade2.setExchangeRate(BigDecimal.valueOf(157.50));
            trade2.setResultAmount(BigDecimal.valueOf(78750.00));
            trade2.setStatus("COMPLETED");
            trade2.setTradeDate(LocalDateTime.now().minusDays(3));
            trade2.setCreatedAt(LocalDateTime.now().minusDays(3));

            Trade trade3 = new Trade();
            trade3.setUser(admin);
            trade3.setFromCurrency("EUR");
            trade3.setToCurrency("CAD");
            trade3.setAmount(BigDecimal.valueOf(750.00));
            trade3.setExchangeRate(BigDecimal.valueOf(1.45));
            trade3.setResultAmount(BigDecimal.valueOf(1087.50));
            trade3.setStatus("COMPLETED");
            trade3.setTradeDate(LocalDateTime.now().minusDays(1));
            trade3.setCreatedAt(LocalDateTime.now().minusDays(1));

            Trade trade4 = new Trade();
            trade4.setUser(admin);
            trade4.setFromCurrency("AUD");
            trade4.setToCurrency("INR");
            trade4.setAmount(BigDecimal.valueOf(2000.00));
            trade4.setExchangeRate(BigDecimal.valueOf(54.25));
            trade4.setResultAmount(BigDecimal.valueOf(108500.00));
            trade4.setStatus("COMPLETED");
            trade4.setTradeDate(LocalDateTime.now());
            trade4.setCreatedAt(LocalDateTime.now());

            tradeRepository.save(trade1);
            tradeRepository.save(trade2);
            tradeRepository.save(trade3);
            tradeRepository.save(trade4);

            log.info("Sample trades created successfully - 4 trades added");
        } else {
            log.info("Trades already exist in database");
        }
    }
}
