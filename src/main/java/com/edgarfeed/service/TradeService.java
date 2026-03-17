package com.edgarfeed.service;

import com.edgarfeed.model.Trade;
import com.edgarfeed.repository.TradeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;

@Service
public class TradeService {
    private final TradeRepository tradeRepository;

    public TradeService(TradeRepository tradeRepository){
        this.tradeRepository = tradeRepository;
    }

    public Page<Trade> getAllTrades(Pageable pageable){
        return tradeRepository.findAll(pageable);
    }

    public Optional<Trade> getTradeById(Integer Id){
        return tradeRepository.findById(Id);

    }

    public List<Trade> getTradesByTicker(String ticker){
        return tradeRepository.findByTicker(ticker);
    }

    public List<Trade> getTradesByCode(Character code){
        return tradeRepository.findByTransactionCode(code);
    }

    public List<Trade> getTradesByInsider(String name){
        return tradeRepository.findByInsiderName(name);
    }
}
