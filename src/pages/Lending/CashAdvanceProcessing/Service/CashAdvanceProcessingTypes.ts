// src/pages/Lending/CashAdvanceProcessing/Service/CashAdvanceProcessingTypes.ts

// Common Types
export type ApiResponse<T> = {
  status: string
  message: string
  data: T
}

// Borrower Types
export interface Borrower {
  id: string
  name: string
  division: string
  district: string
  address: string
  phone: string
  email: string
  age?: number
}

export interface GetBorrowersResponse {
  count: number
  borrowers: Borrower[]
  pagination: {
    current_page: number
    per_page: number
    total_pages: number
    total_items: number
  }
}

// Division and District Types
export interface Division {
  id: string
  name: string
}

export interface District {
  id: string
  name: string
  division_id: string
}

export interface GetDivisionsResponse {
  count: number
  divisions: Division[]
}

export interface GetDistrictsResponse {
  count: number
  districts: District[]
}

// Cash Advance Types
export interface CashAdvance {
  id: string
  transaction_date: string
  borrower_id: string
  borrower_name: string
  reference_code: string
  reference_number: string
  amount: number
  journal_entries: JournalEntry[]
  prepared_by: string
  approved_by: string
  status: "draft" | "processed" | "approved"
  remarks: string
}

export interface JournalEntry {
  id: string
  code: string
  name: string
  debit: number | null
  credit: number | null
}

// Request Payload Types
export interface CreateCashAdvancePayload {
  transaction_date: string
  borrower_id: string
  reference_code: string
  reference_number: string
  amount: number
  prepared_by: string
  approved_by: string
  remarks: string
}

export interface UpdateCashAdvancePayload extends CreateCashAdvancePayload {
  id: string
}

// Filter Types
export interface CashAdvanceFilters {
  division?: string
  district?: string
  borrower_search?: string
}
