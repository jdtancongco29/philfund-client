// Common Types
export type ApiResponse<T> = {
  status: string
  message: string
  data: T
}

// AtmExpiry Types
export interface AtmExpiryItem {
  id: string
  borrowerName: string
  expiryDate: string
  daysRemaining: number
  accountNumber: string
  atmCardNumber: string
  bankBranch: string
  bankName: string
  status: "Active" | "Expiring Soon" | "Expired"
  phoneNumber: string
  email: string
  issueDate: string
  cardType: string
  lastUsed: string
}

export interface PaginationInfo {
  current_page: number
  per_page: number
  total_pages: number
  total_items: number
}

export interface GetAllAtmExpiryResponse {
  count: number
  atmCards: AtmExpiryItem[]
  pagination: PaginationInfo
}

// Request Payload Types
export interface UpdateAtmExpiryPayload {
  borrowerName: string
  expiryDate: string
  accountNumber: string
  atmCardNumber: string
  bankBranch: string
  bankName: string
  phoneNumber: string
  email: string
}

// Filter Types
export interface AtmExpiryFilters {
  search: string | null
  branch: string | null
  bank: string | null
  expiryThreshold: string | null
}
