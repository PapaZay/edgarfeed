package com.edgarfeed.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "trades")
public class Trade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "accession_no")
    private String accessionNo;

    @Column(name = "filed_date")
    private LocalDate filedDate;

    private String ticker;
    @Column(name = "issuer_name")
    private String issuerName;
    private String insiderName;
    private String insiderRole;
    private LocalDate transactionDate;
    private Character transactionCode;
    private Long shares;
    private BigDecimal price;
    private BigDecimal value;
    private Character ownershipType;
    private Long sharesAfter;
    private OffsetDateTime createdAt;

}
