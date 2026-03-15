CREATE TABLE prices (
    id       SERIAL PRIMARY KEY,
    ticker   TEXT NOT NULL,
    date     DATE NOT NULL,
    open     NUMERIC(12,4),
    high     NUMERIC(12,4),
    low      NUMERIC(12,4),
    close    NUMERIC(12,4),
    volume   BIGINT,
    UNIQUE(ticker, date)
);