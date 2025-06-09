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

// Change Voucher Types
export interface ChangeVoucherEntry {
  id: string
  date: string
  change_voucher: string
  payee: string
  amount_paid: number
  change: number
  reference_code: string
  reference_no: string
  transaction_date: string
  change_voucher_number: string
  borrower_name: string
}

export interface GetChangeVoucherEntriesResponse {
  count: number
  entries: ChangeVoucherEntry[]
}

// Request Payload Types
export interface UpdateChangeVoucherEntryPayload {
  id: string
  reference_code: string
  reference_no: string
  transaction_date: string
  change_voucher_number: string
  borrower_name: string
}

// Filter Types
export interface ChangeVoucherFilters {
  division?: string
  district?: string
  borrower_search?: string
  date_from?: string
  date_to?: string
}
