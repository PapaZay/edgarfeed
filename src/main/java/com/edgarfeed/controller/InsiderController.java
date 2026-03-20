package com.edgarfeed.controller;

import com.edgarfeed.model.Trade;
import com.edgarfeed.service.TradeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/insiders")
public class InsiderController {
    private final TradeService tradeService;

    public InsiderController(TradeService tradeService){
        this.tradeService = tradeService;
    }

    @GetMapping("/{name}/trades")
    public List<Trade> getTradeByInsider(@PathVariable String name){
        return tradeService.getTradesByInsider(name);
    }

}
