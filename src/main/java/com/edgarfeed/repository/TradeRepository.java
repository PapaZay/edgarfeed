package com.edgarfeed.repository;

import com.edgarfeed.model.Trade;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TradeRepository extends JpaRepository<Trade, Integer> {
    List<Trade> findByTicker(String ticker);
    List<Trade> findByTransactionCode(Character code);
    List<Trade> findByInsiderName(String insiderName);
}
