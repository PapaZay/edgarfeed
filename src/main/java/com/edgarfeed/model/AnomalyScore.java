package com.edgarfeed.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "anomaly_scores")
public class AnomalyScore {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "trade_id")
    private Trade trade;

    @Column(name = "car_30d")
    private BigDecimal car30d;

    private BigDecimal score;
    private OffsetDateTime scoredAt;

}
