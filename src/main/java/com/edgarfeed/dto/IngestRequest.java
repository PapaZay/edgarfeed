package com.edgarfeed.dto;

import com.edgarfeed.model.Price;
import com.edgarfeed.model.Trade;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class IngestRequest {
    private List<Trade> trades;
    private List<Price> prices;

}
