// Common Types
export type ApiResponse<T> = {
  status: string
  message: string
  data: T
}

// Cards Monitoring Types
export interface CardsMonitoringItem {
  id: string
  borrowerName: string
  cardType: string
  cardStatus: string
  dateSignedOut: string
  signedOutBy: string
  reasonForRelease: string
  custodian: string
  branch: string
  districtName: string
  division: string
  createdAt: string
  updatedAt: string
}

export interface PaginationInfo {
  current_page: number
  per_page: number
  total_pages: number
  total_items: number
}

export interface GetAllCardsMonitoringResponse {
  count: number
  cards: CardsMonitoringItem[]
  pagination: PaginationInfo
}

// Filter Types
export interface CardsMonitoringFilters {
  search: string | null
  branch: string | null
  districtName: string | null
  division: string | null
  cardType: string | null
  cardStatus: string | null
}

// Request Payload Types
export interface CreateCardsMonitoringPayload {
  borrowerName: string
  cardType: string
  cardStatus: string
  dateSignedOut: string
  signedOutBy: string
  reasonForRelease: string
  custodian: string
  branch: string
  districtName: string
  division: string
}

export interface UpdateCardsMonitoringPayload extends CreateCardsMonitoringPayload {
  id: string
}
