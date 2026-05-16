import {useEffect, useState} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import { getTradesById } from '../api/TradeService'
import type {Trade} from '../api/types'

const CODE_LABELS: Record<string, string> = {
    P: 'Purchase',
    S: 'Sale',
    A: 'Award',
    M: 'Exercise',
}

export default function TradeDetailPage(){
    const {id} = useParams<{id: string}>();
    const navigate = useNavigate()
    const [trade, setTrade] = useState<Trade | null>(null)

    useEffect(() => {
        if (!id) return
        getTradesById(Number(id)).then(setTrade)
    }, [id])

    if (!trade) return <p className='p-8 text-gray-500'>Loading...</p>

    return (
        <div className='min-h-screen bg-gray-950 text-gray-100 p-8 max-w-2xl mx-auto'>
            <button onClick={() => navigate(-1)} className='text-sm text-gray-400 hover:text-gray-200 mg-6 inline-block'>
                ← Back
            </button>

            <h1 className='text-2xl font-bold mb-1 font-mono'>{trade.ticker}</h1>
            <p className='text-gray-400 mb-6'>{trade.issuerName}</p>

            <div className='bg-gray-900 rounded-lg border border-gray-800 divide-y divide-gray-800'>
                <Row label="Insider" value={
                    <button onClick={() => navigate(`/insider/${encodeURIComponent(trade.insiderName)}`)}
                    className='hover:text-blue-300'>{trade.insiderName}</button>
                } />
                <Row label="Role" value={trade.insiderRole ?? '-'} />
                <Row label="Type" value={
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        trade.transactionCode === 'P' ? 'bg-green-900 text-green-300' :
                        trade.transactionCode === 'S' ? 'bg-red-900 text-red-300' :
                        'bg-gray-800 text-gray-300'
                    }`}>
                        {CODE_LABELS[trade.transactionCode] ?? trade.transactionCode}
                    </span>
                } />
                <Row label="Transaction Date" value={trade.transactionDate} />
                <Row label="Filed Date" value={trade.filedDate} />
                <Row label="Shares" value={trade.shares?.toLocaleString() ?? '—'} />
                <Row label="Price" value={trade.price != null ? `$${Number(trade.price).toFixed(2)}` : '—'} />
                <Row label="Value" value={trade.value != null ? `$${Number(trade.value).toLocaleString()}` : '—'} />
                <Row label="Shares After" value={trade.sharesAfter?.toLocaleString() ?? '—'} />
                <Row label="Ownership" value={trade.ownershipType === 'D' ? 'Direct' : trade.ownershipType === 'I' ? 'Indirect' : '—'} />
                <Row label="Accession No" value={<span className='font-mono text-xs text-gray-400'>{trade.accessionNo}</span>} />
            </div>
        </div>
    )
}
function Row({label, value}: {label: string; value: React.ReactNode}){
    return (
        <div className='flex justify-between items-center px-4 py-3 text-sm'>
            <span className='text-gray-400'>{label}</span>
            <span>{value}</span>
        </div>
    )
}