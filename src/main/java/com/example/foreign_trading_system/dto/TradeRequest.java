package com.example.foreign_trading_system.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TradeRequest {
    @NotBlank(message = "From currency is required")
    private String fromCurrency;
    
    @NotBlank(message = "To currency is required")
    private String toCurrency;
    
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private Double amount;
    
    @NotNull(message = "Exchange rate is required")
    @Positive(message = "Exchange rate must be positive")
    private Double exchangeRate;
    
    private String status;
    
    @NotNull(message = "User ID is required")
    private Long userId;
}
