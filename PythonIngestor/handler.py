import requests
import yfinance as yf
from edgar import Company, set_identity
from tickers import SP500_TICKERS

SPRING_BOOT_URL = "http://localhost:8080/internal/ingest"

def handler(event, context):
    set_identity("edgar-feed@gmail.com")
    for ticker in SP500_TICKERS:
        process_ticker(ticker)

def process_ticker(ticker):
    try:
        trades = fetch_trades(ticker)
        if not trades:
            return
        prices = fetch_prices(ticker)
        post_to_springboot(trades, prices)
    except Exception as e:
        print(f"Error processing {ticker}: {e}")
    
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
                "filedDate": str(filing.filing_date),
                "ticker": ticker,
                "issuerName": form4.issuer.name,
                "insiderName": owner.name,
                "insiderRole": owner.position,
                "transactionDate": str(tx.date),
                "transactionCode": tx.transaction_code,
                "shares": int(tx.shares) if tx.shares else None,
                "price": float(tx.price) if tx.price else None,
                "ownershipType": tx.direct_indirect,
                "sharesAfter": int(tx.remaining) if tx.remaining else None
            })
    return trades 

def post_to_springboot(trades, prices):
    payload = {"trades": trades, "prices": prices}
    response = requests.post(SPRING_BOOT_URL, json=payload)
    if response.status_code != 200:
        print(f"Failed to post to Spring Boot: {response.status_code} {response.text}")
    return response.status_code
       

        
    