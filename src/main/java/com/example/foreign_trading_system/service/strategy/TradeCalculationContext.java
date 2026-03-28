package com.example.foreign_trading_system.service.strategy;

import com.example.foreign_trading_system.exception.AppException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class TradeCalculationContext {

    private static final String DEFAULT_CALCULATION_TYPE = "MULTIPLY";
    private final List<TradeResultCalculationStrategy> strategies;

    public TradeCalculationContext(List<TradeResultCalculationStrategy> strategies) {
        this.strategies = strategies;
    }

    public BigDecimal calculateResultAmount(BigDecimal amount, BigDecimal exchangeRate) {
        if (amount == null || exchangeRate == null) {
            throw new AppException("Amount and exchange rate are required for calculation", HttpStatus.BAD_REQUEST);
        }

        return strategies.stream()
                .filter(strategy -> strategy.supports(DEFAULT_CALCULATION_TYPE))
                .findFirst()
                .orElseThrow(() -> new AppException("No trade calculation strategy configured", HttpStatus.INTERNAL_SERVER_ERROR))
                .calculate(amount, exchangeRate);
    }
}
