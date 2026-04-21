import {useEffect, useState} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import { getTradesByTicker } from '../api/TradeService'
import { getPricesByTicker } from '../api/PriceService'
import type {Trade, Price} from '../api/types'
import { LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'

const CODE_LABELS: Record<string, string> = {
    P: 'Purchase',
    S: 'Sale',
    A: 'Award',
    M: 'Exercise',
}

export default function TickerPage() {
    const { symbol } = useParams<{symbol: string}>()
    const navigate = useNavigate()
    const [trades, setTrades] = useState<Trade[]>([])
    const [prices, setPrices] = useState<Price[]>([])

    useEffect(() => {
        if (!symbol) return
        getTradesByTicker(symbol).then(setTrades)
        getPricesByTicker(symbol).then(setPrices)
    }, [symbol])

    const chartData = prices.slice().sort((a, b) => a.date.localeCompare(b.date)).map(p => ({date: p.date, close: Number(p.close)}))


}