package com.example.foreign_trading_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TradeCreateRequest {
    private String fromCurrency;
    private String toCurrency;
    private BigDecimal amount;
    private BigDecimal exchangeRate;
    private String status;
    private Long userId;
}
