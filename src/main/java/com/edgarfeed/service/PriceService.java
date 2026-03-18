package com.edgarfeed.service;

import com.edgarfeed.model.Price;
import com.edgarfeed.repository.PriceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PriceService {
    private final PriceRepository priceRepository;

    public PriceService(PriceRepository priceRepository){
        this.priceRepository = priceRepository;
    }

    public List<Price> getPricesByTicker(String ticker){
        return priceRepository.findByTicker(ticker);
    }

    public Price savePrice(Price price){
        return priceRepository.save(price);
    }
}
