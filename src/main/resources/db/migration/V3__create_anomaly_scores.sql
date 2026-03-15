CREATE TABLE anomaly_scores (
    id         SERIAL PRIMARY KEY,
    trade_id   INTEGER REFERENCES trades(id),
    car_30d    NUMERIC(8,4),
    score      NUMERIC(5,4),
    scored_at  TIMESTAMPTZ DEFAULT now()
);