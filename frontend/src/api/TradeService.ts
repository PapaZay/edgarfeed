import type {Trade, Page} from "./types";

const BASE = '/api'

export async function getTrades(page = 0): Promise<Page<Trade>> {
    const res = await fetch(`${BASE}/trades?page=${page}&sort=filedDate,desc`)
    return res.json()
}

export async function getTradesById(id: number): Promise<Trade> {
    const res = await fetch(`${BASE}/trades/${id}`)
    return res.json()
}

export async function getTradesByTicker(ticker: string): Promise<Trade[]> {
    const res = await fetch(`${BASE}/tickers/${ticker}/trades`)
    return res.json()
}

export async function getTradesByInsider(name: string): Promise<Trade[]> {
    const res = await fetch(`${BASE}/insiders/${encodeURIComponent(name)}/trades`)
    return res.json()
}

