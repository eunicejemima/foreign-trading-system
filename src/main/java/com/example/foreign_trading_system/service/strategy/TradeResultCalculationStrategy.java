package com.example.foreign_trading_system.service.strategy;

import java.math.BigDecimal;

public interface TradeResultCalculationStrategy {
    boolean supports(String calculationType);

    BigDecimal calculate(BigDecimal amount, BigDecimal exchangeRate);
}
