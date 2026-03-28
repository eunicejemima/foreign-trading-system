package com.example.foreign_trading_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CurrencyRequest {
    private String code;
    private String name;
    private BigDecimal exchangeRate;
}
