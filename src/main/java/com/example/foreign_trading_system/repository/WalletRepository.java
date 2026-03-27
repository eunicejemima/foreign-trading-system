package com.example.foreign_trading_system.repository;

import com.example.foreign_trading_system.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WalletRepository extends JpaRepository<Account, Long> {
}
