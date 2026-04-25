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

            <h2 className='text-lg font-semibold mb-4'>Insider Trades</h2>
            <div className='overflow-x-auto rounded-lg border border-gray-800'>
                <table className='w-full text-xs'>
                    <thead className='bg-gray-900 text-gray-400 uppercase text-xs'>
                        <tr>
                            <th className='px-4 py-3 text-left'>Date</th>
                            <th className='px-4 py-3 text-left'>Insider</th>
                            <th className='px-4 py-3 text-left'>Role</th>
                            <th className='px-4 py-3 text-left'>Type</th>
                            <th className='px-4 py-3 text-right'>Shares</th>
                            <th className='px-4 py-3 text-right'>Price</th>
                            <th className='px-4 py-3 text-right'>Value</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-800'>
                        {trades.map(trade => (
                            <tr key={trade.id} className='hover:bg-gray-900 transition-colors'>
                                <td className='px-4 py-3 text-gray-400'>{trade.transactionDate}</td>
                                <td className='px-4 py-3'>
                                    <button
                                    onClick={() => navigate(`/insider/${encodeURIComponent(trade.insiderName)}`)}
                                    className='hover:text-blue-300'
                                    >
                                        {trade.insiderName}
                                    </button>
                                </td>
                                <td className='px-4 py-3 text-gray-400 text-xs'>{trade.insiderRole}</td>
                                <td className='px-4 py-3'>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                        trade.transactionCode === 'P' ? 'bg-green-900 text-green-300' :
                                        trade.transactionCode === 'S' ? 'bg-red-900 text-red-300' :
                                        'bg-gray-800 text-gray-300'
                                    }`}>
                                        {CODE_LABELS[trade.transactionCode] ?? trade.transactionCode}
                                    </span>
                                </td>
                                <td className='px-4 py-3 text-right font-mono'>{trade.shares?.toLocaleString() ?? '-'}</td>
                                <td className='px-4 py-3 text-right font-mono'>
                                    {trade.price != null ? `$${Number(trade.price).toFixed(2)}` : '-'}
                                </td>
                                <td className='px-4 py-3 text-right font-mono font-semibold'>
                                    {trade.value != null ? `$${Number(trade.value).toLocaleString()}` : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )


}