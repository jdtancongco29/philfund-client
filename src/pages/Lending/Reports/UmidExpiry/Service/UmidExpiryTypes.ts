// Common Types
export type ApiResponse<T> = {
  status: string
  message: string
  data: T
}

// UMID Expiry Types
export interface UmidExpiryItem {
  id: string
  borrowerName: string
  expiryDate: string
  daysRemaining: number
  accountNumber: string
  umidCardNumber: string
  typeOfUmidCard: string
  status: string
  phoneNumber: string
  email: string
  branch: string
  createdAt: string
  updatedAt: string
}

export interface PaginationInfo {
  current_page: number
  per_page: number
  total_pages: number
  total_items: number
}

export interface GetAllUmidExpiryResponse {
  count: number
  umidCards: UmidExpiryItem[]
  pagination: PaginationInfo
}

// Filter Types
export interface UmidExpiryFilters {
  search: string | null
  branch: string | null
  bank: string | null
  expiryThreshold: string | null
}

// Request Payload Types
export interface CreateUmidExpiryPayload {
  borrowerName: string
  expiryDate: string
  accountNumber: string
  umidCardNumber: string
  typeOfUmidCard: string
  phoneNumber: string
  email: string
  branch: string
}

export interface UpdateUmidExpiryPayload extends CreateUmidExpiryPayload {
  id: string
}
