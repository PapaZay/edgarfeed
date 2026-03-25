import requests
import yfinance as yf
from edgar import Company, set_identity, get_filings
from tickers import SP500_TICKERS

SPRING_BOOT_URL = "http://localhost:8080/internal/ingest"

def handler(event, context):
    pass
# TODO: Implement process ticker function
def process_ticker(ticker):
    pass
    
def fetch_prices(ticker):
    data = yf.Ticker(ticker)   
    hist = data.history(period="100d")
    
    prices = []
    for date, row in hist.iterrows():
        prices.append({
            "ticker": ticker,
            "date": str(date.date()),
            "open": float(row["Open"]),
            "high": float(row["High"]),
            "low": float(row["Low"]),
            "close": float(row["Close"]),
            "volume": int(row["Volume"])
            
        })
    return prices


def fetch_trades(ticker):
    company = Company(ticker)
    filings = company.get_filings(form="4").latest(10)
    
    trades = []
    for filing in filings:
        form4 = filing.obj()
        owner = form4.reporting_owners[0]
        transactions = form4.non_derivative_table.transactions
        for tx in transactions:
            trades.append({
                "accessionNo": filing.accession_no,
                "filing_date": str(filing.filing_date),
                "ticker": ticker,
                "issuerName": form4.issuer.name,
                "insiderName": owner.name,
                "insiderRole": owner.position,
                "transactionDate": str(tx.date),
                "transactionCode": tx.transaction_code,
                "shares": int(tx.shares),
                "price": float(tx.price),
                "ownershipType": tx.direct_indirect,
                "sharesAfter": int(tx.remaining)
            })
    return trades 
       
# for testing purposes
set_identity("edgar-feed@gmail.com")
print(fetch_trades("SNOW"))
        
    