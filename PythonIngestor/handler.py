import requests
import yfinance as yf
from edgar import Company, set_identity
from tickers import SP500_TICKERS
import math
import os
import time
import xml.etree.ElementTree as ET

SPRING_BOOT_URL = os.environ.get("SPRING_BOOT_URL", "http://localhost:8080/internal/ingest") 


def _xml_text(el,path):
    node = el.find(path)
    return node.text.strip() if node is not None and node.text else None

def handler(event, context):
    print("Handler started", flush=True)
    set_identity("edgar-feed@gmail.com")
    start = event.get("start", 0)
    end = event.get("end", len(SP500_TICKERS))
    completed = 0
    for ticker in SP500_TICKERS[start:end]:
        process_ticker(ticker)
        completed += 1
        print(f"Progress {completed}/{end - start} tickers completed", flush=True)
        time.sleep(2)
    print(f"Done. Processed {completed} tickers.", flush=True)

def process_ticker(ticker):
    print(f"Processing {ticker}", flush=True)
    try:
        trades = fetch_trades(ticker)
        if not trades:
            return
        prices = fetch_prices(ticker)
        post_to_springboot(trades, prices)
    except Exception as e:
        print(f"Error processing {ticker}: {e}", flush=True)
    
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
    print(f"Got company {ticker}", flush=True)                                                                                                                            
    try:                                                                                                                                                                  
        filing = company.get_filings(form="4").latest(1)                                                                                                                  
    except Exception as e:                                                                                                                                                
        print(f"Failed to fetch filings for {ticker}: {e}", flush=True)
        return []                                                                                                                                                         
    if not filing:
        return []
    print(f"Got filings {ticker}", flush=True)                                                                                                                            
   
    try:                                                                                                                                                                  
        resp = requests.get(filing.filing_url, timeout=10,headers={"User-Agent": "edgar-feed@gmail.com"})
        resp.raise_for_status()                                                                                                                                           
    except Exception as e:
        print(f"Failed to fetch XML for {ticker}: {e}", flush=True)
        return []                                                                                                                                                         
   
    try:                                                                                                                                                                  
        root = ET.fromstring(resp.text)
    except Exception as e:
        print(f"Failed to parse XML for {ticker}: {e}", flush=True)
        return []

    issuer_name = _xml_text(root, "issuer/issuerName")
    owner_el = root.find("reportingOwner")
    if owner_el is None:
        return []

    insider_name = _xml_text(owner_el, "reportingOwnerId/rptOwnerName")                                                                                                   
    rel = owner_el.find("reportingOwnerRelationship")
    insider_role = None                                                                                                                                                   
    if rel is not None:
        insider_role = _xml_text(rel, "officerTitle")                                                                                                                     
        if not insider_role:
            if _xml_text(rel, "isDirector") == "1":                                                                                                                       
                insider_role = "Director"
            elif _xml_text(rel, "isOfficer") == "1":                                                                                                                      
                insider_role = "Officer"
                                                                                                                                                                            
    trades = [] 
    for tx in root.findall("nonDerivativeTable/nonDerivativeTransaction"):
        tx_date = _xml_text(tx, "transactionDate/value")                                                                                                                  
        if not tx_date:
            continue                                                                                                                                                      
        shares_str = _xml_text(tx, "transactionAmounts/transactionShares/value")
        price_str = _xml_text(tx, "transactionAmounts/transactionPricePerShare/value")                                                                                    
        shares_after_str = _xml_text(tx, "postTransactionAmounts/sharesOwnedFollowingTransaction/value")
                                                                                                                                                                            
        try:    
            shares = int(float(shares_str)) if shares_str else None                                                                                                       
        except (ValueError, TypeError):
            shares = None
        try:
            price = float(price_str) if price_str else None                                                                                                               
            if price is not None and math.isnan(price):
                price = None                                                                                                                                              
        except (ValueError, TypeError):
             price = None
        try:
            shares_after = int(float(shares_after_str)) if shares_after_str else None
        except (ValueError, TypeError):                                                                                                                                   
            shares_after = None
                                                                                                                                                                            
        trades.append({
            "accessionNo": filing.accession_no,
            "filedDate": str(filing.filing_date),                                                                                                                         
            "ticker": ticker,
            "issuerName": issuer_name,                                                                                                                                    
            "insiderName": insider_name,
            "insiderRole": insider_role,
            "transactionDate": tx_date,                                                                                                                                   
            "transactionCode": _xml_text(tx, "transactionCoding/transactionCode"),
            "shares": shares,                                                                                                                                             
            "price": price,
            "value": round(shares * price, 2) if shares and price else None,
            "ownershipType": _xml_text(tx, "ownershipNature/directOrIndirectOwnership/value"),
            "sharesAfter": shares_after                                                                                                                                   
          })
    return trades

def post_to_springboot(trades, prices):
    payload = {"trades": trades, "prices": prices}
    response = requests.post(SPRING_BOOT_URL, json=payload)
    if response.status_code != 200:
        print(f"Failed to post to Spring Boot: {response.status_code} {response.text}", flush=True)
    return response.status_code
       