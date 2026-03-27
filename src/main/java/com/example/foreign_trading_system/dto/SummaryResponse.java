package com.example.foreign_trading_system.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SummaryResponse {
    private long totalUsers;
    private long totalTrades;
    private long activeUsers;
    private long completedTrades;
}
