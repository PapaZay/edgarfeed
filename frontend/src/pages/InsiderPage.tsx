import {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import { getTradesByInsider } from '../api/TradeService';
import type {Trade} from '../api/types';


const CODE_LABELS: Record<string, string> = {
    P: 'Purchase',
    S: 'Sale',
    A: 'Award',
    M: "Exercise",
}

export default function InsiderPage() {
    const {name} = useParams<{name: string}>()
    const navigate = useNavigate()
    const [trades, setTrades] = useState<Trade[]>([])

    useEffect(() => {
        if (!name) return
        getTradesByInsider(decodeURIComponent(name)).then(setTrades)
    }, [name])
    
    return (
        <div className='min-h-screen bg-gray-950 text-gray-100 p-8'>
            <button
            onClick={() => navigate('/')}
            className='text-sm text-gray-400 hover:text-gray-200 mb-6 inline-block'>
               ← Back to Feed
            </button>
            <h1 className='text-2xl font-bold mb-1'>{decodeURIComponent(name ?? '')}</h1>
            {trades[0] && <p className='text-gray-400 mb-6'>{trades[0].insiderRole}</p>}

            <div className='overflow-x-auto rounded-lg border border-gray-800'>
                <table className='w-full text-sm'>
                    <thead className='bg-gray-900 text-gray-400 uppercase text-xs'>
                        <tr>
                            <th className='px-4 py-3 text-left'>Date</th>
                            <th className='px-4 py-3 text-left'>Ticker</th>
                            <th className='px-4 py-3 text-left'>Company</th>
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
                                    onClick={() => navigate(`/ticker/${trade.ticker}`)}
                                    className='font-mono font-semibold text-blue-400 hover:text-blue-300'>
                                        {trade.ticker}
                                    </button>
                                </td>
                                <td className='px-4 py-3 text-gray-400'>{trade.issuerName}</td>
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