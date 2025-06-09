// Common Types
export type ApiResponse<T> = {
  status: string
  message: string
  data: T
}

// UnsoldNoAccountsRecord Types
export interface UnsoldNoAccountsRecord {
  id: string
  reference_code: string
  reference_name: string
  date: string
  name: string
  card_type: string
  category: string
  remarks?: string
  amount: number
  released_by: string
  received_by: string
}

export interface PaginationInfo {
  current_page: number
  per_page: number
  total_pages: number
  total_items: number
}

export interface GetAllUnsoldNoAccountsResponse {
  count: number
  records: UnsoldNoAccountsRecord[]
  pagination: PaginationInfo
}

// Request Payload Types
export interface CreateUnsoldNoAccountsPayload {
  reference_code: string
  reference_name: string
  date: string
  name: string
  card_type: string
  category: string
  remarks?: string
  amount: number
  released_by: string
  received_by: string
}

export interface UpdateUnsoldNoAccountsPayload {
  reference_code: string
  reference_name: string
  date: string
  name: string
  card_type: string
  category: string
  remarks?: string
  amount: number
  released_by: string
  received_by: string
}
