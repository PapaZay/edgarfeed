import {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { getTrades } from '../api/TradeService'
import type {Trade, Page} from '../api/types'

const CODE_LABELS: Record<string, string> = {
    P: 'Purchase',
    S: "Sale",
    A: 'Award',
    M: 'Exercise',
}

export default function FeedPage(){
    const [data, setData] = useState<Page<Trade> | null>(null)
    const [page, setPage] = useState(0)
    const navigate = useNavigate()
    
    useEffect(() => {
        getTrades(page).then(setData)
    }, [page])

    if (!data) return <p className='p-8 text-gray-500'>Loading...</p>

    return (
        <div className='min-h-screen bg-gray-950 text-gray-100 p-8'>
            <h1 className='text-2xl font-bold mb-6'>EdgarFeed</h1>

        <div className='overflow-x-auto rounded-lg border border-gray-800'>

            <table className='w-full text-sm'>
                <thead className='bg-gray-900 text-gray-400 uppercase text-xs'>
                    <tr>
                        <th className='px-4 py-3 text-left'>Filed</th>
                        <th className='px-4 py-3 text-left'>Ticker</th>
                        <th className='px-4 py-3 text-left'>Insider</th>
                        <th className='px-4 py-3 text-left'>Role</th>
                        <th className='px-4 py-3 text-left'>Code</th>
                        <th className='px-4 py-3 text-right'>Shares</th>
                        <th className='px-4 py-3 text-right'>Price</th>
                        <th className='px-4 py-3 text-right'>Value</th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-800'>
                    {data.content.map(trade => (
                        <tr key={trade.id} className='hover:bg-gray-900'>
                            <td className='px-4 py-3 text-gray-400'>{trade.filedDate}</td>
                            <td className='px-4 py-3'>
                                <button
                                onClick={() => navigate(`/ticker/${trade.ticker}`)}
                                className='font-mono font-semibold text-blue-400 hover:text-blue-300'>
                                    {trade.ticker}
                                </button>
                            </td>
                            <td className='px-4 py-3'>
                                <button 
                                onClick={() => navigate(`/insider/${encodeURIComponent(trade.insiderName)}`)}
                                className='hover:text-blue-300'>
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
                                {trade.price != null ? `$${trade.price.toFixed(2)}` : '-'}
                            </td>
                            <td className='px-4 py-3 text-right font-mono font-semibold'>
                                {trade.value != null ? `$${Number(trade.value).toLocaleString()}` : '-'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
            <div className='flex items-center gap-4 mt-4 text-sm text-gray-400'>
                <button
                onClick={() => setPage(p => p - 1)}
                disabled={page === 0}
                className='px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed'>
                    Prev
                </button>
                <span>Page {page + 1} of {data.totalPages}</span>
                <button
                onClick={() => setPage(p => p + 1)}
                disabled={page + 1 >= data.totalPages}
                className='px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed'>
                    Next
                </button>
            </div>
        </div>
    )
}