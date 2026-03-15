CREATE TABLE trades (
    id               SERIAL PRIMARY KEY,
    accession_no     TEXT UNIQUE,
    filed_date       DATE NOT NULL,
    ticker           TEXT NOT NULL,
    issuer_name      TEXT,
    insider_name     TEXT NOT NULL,
    insider_role     TEXT,
    transaction_date DATE NOT NULL,
    transaction_code CHAR(1) NOT NULL,
    shares           BIGINT,
    price            NUMERIC(12,4),
    value            NUMERIC(16,2),
    ownership_type   CHAR(1),
    shares_after     BIGINT,
    created_at       TIMESTAMPTZ DEFAULT now()
);
