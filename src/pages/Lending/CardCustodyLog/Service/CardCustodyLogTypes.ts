// Common Types
export type ApiResponse<T> = {
  status: string
  message: string
  data: T
}

// CardCustodyLog Types
export interface CardCustodyLog {
  id: string
  reference_code: string
  reference_name: string
  date: string
  name: string
  card_type: string
  transaction: string
  is_borrower: boolean
  custodian: string
  date_returned?: string
  remarks?: string
  processed_by: string
}

export interface PaginationInfo {
  current_page: number
  per_page: number
  total_pages: number
  total_items: number
}

export interface GetAllCardCustodyLogResponse {
  count: number
  logs: CardCustodyLog[]
  pagination: PaginationInfo
}

// Request Payload Types
export interface CreateCardCustodyLogPayload {
  reference_code: string
  reference_name: string
  date: string
  name: string
  card_type: string
  transaction: string
  is_borrower: boolean
  custodian: string
  date_returned?: string | null
  remarks?: string
}

export interface UpdateCardCustodyLogPayload {
  reference_code: string
  reference_name: string
  date: string
  name: string
  card_type: string
  transaction: string
  is_borrower: boolean
  custodian: string
  date_returned?: string | null
  remarks?: string
}
