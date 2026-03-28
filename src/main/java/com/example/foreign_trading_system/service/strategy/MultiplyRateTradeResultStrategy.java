package com.example.foreign_trading_system.service.strategy;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class MultiplyRateTradeResultStrategy implements TradeResultCalculationStrategy {

    private static final String STRATEGY_TYPE = "MULTIPLY";

    @Override
    public boolean supports(String calculationType) {
        return STRATEGY_TYPE.equalsIgnoreCase(calculationType);
    }

    @Override
    public BigDecimal calculate(BigDecimal amount, BigDecimal exchangeRate) {
        return amount.multiply(exchangeRate);
    }
}
