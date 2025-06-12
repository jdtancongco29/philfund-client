// Common Types
export type ApiResponse<T> = {
  status: string
  message: string
  data: T
}

// CheckEncashment Types
export interface CheckEncashment {
  id: string
  reference_code: string
  reference_no: string
  check_no: string
  payee: string
  date: string
  amount: number
  processing_fee: number
  net_amount: number
  remarks?: string
  journal_entries: JournalEntry[]
}

export interface JournalEntry {
  id: string
  code: string
  name: string
  debit: number | null
  credit: number | null
}

export interface PaginationInfo {
  current_page: number
  per_page: number
  total_pages: number
  total_items: number
}

export interface GetAllCheckEncashmentResponse {
  count: number
  encashments: CheckEncashment[]
  pagination: PaginationInfo
}

// Request Payload Types
export interface CreateCheckEncashmentPayload {
  reference_code: string
  reference_no: string
  check_no: string
  payee: string
  date: string
  amount: number
  processing_fee: number
  net_amount: number
  remarks?: string
  journal_entries: JournalEntry[]
}

export interface UpdateCheckEncashmentPayload {
  reference_code: string
  reference_no: string
  check_no: string
  payee: string
  date: string
  amount: number
  processing_fee: number
  net_amount: number
  remarks?: string
  journal_entries: JournalEntry[]
}