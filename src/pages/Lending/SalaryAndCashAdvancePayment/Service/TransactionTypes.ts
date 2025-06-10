// Common Types
export type ApiResponse<T> = {
    status: string
    message: string
    data: T
}

// Transaction Types
export interface Transaction {
    id: string
    borrower_name: string
    transaction_date: string
    loan_type: string
    pn_number: string
    mode_of_payment: string
    amount_transacted: number
    reference: string
    surcharge_amount: number
    caod: number
    slod: number
    cai: number
    sli: number
    capod: number
    lpod: number
    cap: number
    lp: number
    atm_number?: string
    payment_amount: number
    remarks?: string
    transaction_number?: string
    borrower_payment_count?: number
    district?: string
}

export interface PaginationInfo {
    current_page: number
    per_page: number
    total_pages: number
    total_items: number
}

export interface GetAllTransactionsResponse {
    count: number
    transactions: Transaction[]
    pagination: PaginationInfo
}

// Journal Entry Type
export interface JournalEntry {
    id: string
    code: string
    name: string
    debit: number | null
    credit: number | null
}
