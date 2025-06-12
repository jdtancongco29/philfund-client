// Updated types to match the new form structure
export type ApiResponse<T> = {
  status: string
  message: string
  data: T
}

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

export interface CashAdvance {
  id: string
  transaction_date: string
  borrower_id: string
  borrower_name: string
  promissory_note_number: string
  cash_advance_type: "salary" | "bonus"
  type_of_cash_advance: string
  interest_rate: number
  surcharge_rate: number
  principal: number
  interest_amount: number
  date_due: string
  total_deductions: number
  net_proceeds: number
  reference_code?: string
  reference_number?: string
  amount?: number
  journal_entries?: JournalEntry[]
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

export interface CreateCashAdvancePayload {
  transaction_date: string
  borrower_id: string
  promissory_note_number: string
  cash_advance_type: "salary" | "bonus"
  type_of_cash_advance: string
  interest_rate: number
  surcharge_rate: number
  principal: number
  interest_amount: number
  date_due: string
  total_deductions: number
  net_proceeds: number
  prepared_by: string
  approved_by: string
  remarks: string
}

export interface UpdateCashAdvancePayload extends CreateCashAdvancePayload {
  id: string
}

export interface CashAdvanceFilters {
  division?: string
  district?: string
  borrower_search?: string
}