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

// Loan Pay Off Types
export interface LoanPayOff {
  id: string
  borrower_id: string
  borrower_name: string
  reference_code: string
  reference_name: string
  date_range_from: string
  date_range_to: string
  paid_by_insurance: number
  loan_type: string
  search_user: string
  status: "draft" | "processed" | "approved"
  journal_entries: JournalEntry[]
}

export interface JournalEntry {
  id: string
  code: string
  name: string
  debit: number | null
  credit: number | null
}

// Request Payload Types
export interface CreateLoanPayOffPayload {
  borrower_id: string
  reference_code: string
  reference_name: string
  date_range_from: string
  date_range_to: string
  paid_by_insurance: number
  loan_type: string
  search_user: string
}

export interface UpdateLoanPayOffPayload extends CreateLoanPayOffPayload {
  id: string
}

// Filter Types
export interface LoanPayOffFilters {
  division?: string
  district?: string
  borrower_search?: string
}
