package com.edgarfeed.controller;

import com.edgarfeed.model.Price;
import com.edgarfeed.model.Trade;
import com.edgarfeed.service.PriceService;
import com.edgarfeed.service.TradeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tickers")
public class TickerController {
    private final TradeService tradeService;
    private final PriceService priceService;

    public TickerController(TradeService tradeService, PriceService priceService){
        this.priceService = priceService;
        this.tradeService = tradeService;
    }
    @GetMapping("/{ticker}/trades")
    public List<Trade> getTradesByTicker(@PathVariable String ticker){
        return tradeService.getTradesByTicker(ticker);
    }
    @GetMapping("/{ticker}/prices")
    public List<Price> getPricesByTicker(@PathVariable String ticker){
        return priceService.getPricesByTicker(ticker);
    }

}
