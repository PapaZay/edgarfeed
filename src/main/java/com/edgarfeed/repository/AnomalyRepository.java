package com.edgarfeed.repository;

import com.edgarfeed.model.AnomalyScore;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnomalyRepository extends JpaRepository<AnomalyScore, Integer> {
    List<AnomalyScore> findByTrade_Id(Integer tradeId);

}
