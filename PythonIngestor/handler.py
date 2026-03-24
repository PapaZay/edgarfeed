import requests
import yfinance as yf
from edgar import Company, set_identity
from tickers import SP500_TICKERS

SPRING_BOOT_URL = "http://localhost:8080/internal/ingest"

def handler(event, context):
    
    