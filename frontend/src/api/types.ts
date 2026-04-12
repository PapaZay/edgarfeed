export interface Trade {
    id: number
    accessionNo: string
    filedDate: string
    ticker: string
    issuerName: string
    insiderName: string
    insiderRole: string
    transactionRole: string
    transactionCode: string
    shares: number
    price: number
    value: number
    ownershipType: string
    shareAfter: number
}

export interface Price {
    id: number
    ticker: string
    date: string
    open: number
    high: number
    low: number
    close: number
    volume: number
}

export interface Page<T> {
    content: T[]
    totalPages: number
    number: number
}