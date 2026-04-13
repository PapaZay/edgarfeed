import type {Price} from './types'

const BASE = '/api'

export async function getPricesByTicker(ticker: string): Promise<Price[]> {
    const res = await fetch(`${BASE}/tickers/${ticker}/prices`)
    return res.json()
}