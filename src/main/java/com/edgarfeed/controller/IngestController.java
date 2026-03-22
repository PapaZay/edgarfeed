package com.edgarfeed.controller;

import com.edgarfeed.dto.IngestRequest;
import com.edgarfeed.model.Price;
import com.edgarfeed.service.PriceService;
import com.edgarfeed.service.TradeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/internal/ingest")
public class IngestController {
    private final TradeService tradeService;
    private final PriceService priceService;

    public IngestController(TradeService tradeService, PriceService priceService){
        this.priceService = priceService;
        this.tradeService = tradeService;
    }

    @PostMapping
    public ResponseEntity<Void> ingest(@RequestBody IngestRequest request){
        request.getTrades().forEach(tradeService::saveTrade);
        request.getPrices().forEach(priceService::savePrice);
        return ResponseEntity.ok().build();
    }

}
