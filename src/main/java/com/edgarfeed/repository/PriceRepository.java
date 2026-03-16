package com.edgarfeed.repository;

import com.edgarfeed.model.Price;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PriceRepository extends JpaRepository<Price, Integer> {
    List<Price> findByTicker(String ticker);
}
