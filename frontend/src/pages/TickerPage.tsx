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

    const tradeDates = new Set(trades.map(t => t.transactionDate))

    return (
        <div className='min-h-screen bg-gray-950 text-gray-100 p-8'>
            <button
            onClick={() => navigate('/')}
            className='text-sm text-gray-400 hover:text-gray-200 mb-6 inline-block'>
               ← Back to Feed
            </button>

            <h1 className='text-2xl font-bold mb-2 font-mono'>{symbol}</h1>
            {trades[0] && <p className='text-gray-400 mb-6'>{trades[0].issuerName}</p>}

            {chartData.length > 0 && (
                <div className='bg-gray-900 rounded-lg border border-gray-400 p-4 mb-8'>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} />
                            <YAxis domain={['auto', 'auto']} tick={{fontSize: 11, fill: '#9ca3af'}} tickLine={false} axisLine={false} />
                            <Tooltip
                            contentStyle={{backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '6px'}}
                            labelStyle={{color: '#9ca3af'}}
                            itemStyle={{color: '#60a5fa'}}
                        />
                        {Array.from(tradeDates).map(date => (
                            <ReferenceLine key={date} x={date} stroke='#facc15' strokeDasharray='3 3' />
                        ))}
                        <Line type='monotone' dataKey="close" stroke="#60a5fa" dot={false} strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                    <p className='text-xs text-gray-500 mt-2'>Yellow lines indicate insider transaction dates</p>
                </div>
            )}
        </div>
    )


}