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

// Bonus Loan Types
export interface BonusLoan {
  id: string
  transaction_date: string
  borrower_id: string
  borrower_name: string
  loan_type: string
  promissory_no: string
  date_granted: string
  principal_amount: number
  interest_amount: number
  cut_off_date: string
  no_of_days: number
  computed_interest: number
  total_payable: number
  co_makers: CoMaker[]
  existing_payables: ExistingPayable[]
  prepared_by: string
  approved_by: string
  status: "draft" | "processed" | "approved"
  remarks: string
}

export interface CoMaker {
  id: string
  name: string
  address: string
  contact: string
}

export interface ExistingPayable {
  id: string
  pn_no: string
  loan_type: string
  monthly_amortization: number
  overdraft: number
  total: number
  amount_paid: string
}

// Request Payload Types
export interface CreateBonusLoanPayload {
  transaction_date: string
  borrower_id: string
  loan_type: string
  promissory_no: string
  date_granted: string
  principal_amount: number
  interest_amount: number
  cut_off_date: string
  no_of_days: number
  computed_interest: number
  total_payable: number
  co_makers: Omit<CoMaker, "id">[]
  prepared_by: string
  approved_by: string
  remarks: string
}

export interface UpdateBonusLoanPayload extends CreateBonusLoanPayload {
  id: string
}

// Filter Types
export interface BonusLoanFilters {
  division?: string
  district?: string
  borrower_search?: string
}
