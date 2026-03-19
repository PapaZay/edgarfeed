package com.edgarfeed.controller;

import com.edgarfeed.model.Trade;
import com.edgarfeed.service.TradeService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trades")
public class TradeController {
    private final TradeService tradeService;

    public TradeController(TradeService tradeService){
        this.tradeService = tradeService;
    }

    @GetMapping
    public ResponseEntity<?> getTrade(Pageable page, @RequestParam(required = false) String ticker, @RequestParam(required = false) Character code){
        if (ticker != null){
            return ResponseEntity.ok(tradeService.getTradesByTicker(ticker));
        }
        if (code != null){
            return ResponseEntity.ok(tradeService.getTradesByCode(code));
        }
        return ResponseEntity.ok(tradeService.getAllTrades(page));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTradeById(@PathVariable Integer id){
        return tradeService.getTradeById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}
