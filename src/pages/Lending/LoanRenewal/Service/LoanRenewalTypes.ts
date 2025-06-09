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

// Existing Loan Types
export interface ExistingLoan {
  id: string
  pn_number: string
  loan_type: string
  original_amount: number
  interest_rate: number
  term: number
  total_payable: number
  months_paid: number
  total_payments: number
  outstanding_balance: number
  rebates: number
}

export interface GetExistingLoansResponse {
  count: number
  loans: ExistingLoan[]
}

// Request Payload Types
export interface RenewLoansPayload {
  loan_ids: string[]
  loan_type: string
  new_term: string
  new_principal_amount: number
}

// Filter Types
export interface LoanRenewalFilters {
  division?: string
  district?: string
  borrower_search?: string
}
