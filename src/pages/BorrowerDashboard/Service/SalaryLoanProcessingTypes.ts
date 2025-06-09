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

// Salary Loan Types
export interface SalaryLoan {
  id: string
  transaction_date: string
  pn_no: string
  borrower_id: string
  borrower_name: string
  date_granted: string
  principal: number
  terms: number
  interest_rate: number
  interest: number
  installment_period: string
  due_date: string
  total_payable: number
  monthly_amortization: number
  total_interest_over_term: number
  cash_card_amount: number
  computer_fee: number
  service_charge: number
  insurance: number
  notarial_fees: number
  gross_receipts_tax: number
  processing_fee: number
  total_deductions: number
  net_proceeds: number
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

// Voucher Types
export interface CheckVoucher {
  id: string
  loan_id: string
  promissory_note_number: string
  reference_code: string
  reference_number: string
  borrower_name: string
  bank: string
  check_number: string
  amount_on_check: number
  amount_in_words: string
  monthly_amortization_amount: number
  interest_rate: number
  installment_period: string
  journal_entries: JournalEntry[]
  include_journal_entries_in_printing: boolean
}

export interface JournalEntry {
  id: string
  code: string
  name: string
  debit: number | null
  credit: number | null
}

// Transaction History Types
export interface AmortizationSchedule {
  id: string
  loan_id: string
  date: string
  principal_amount_paid: number
  principal_interest_paid: number
  total_running_balance: number
}

export interface GetAmortizationScheduleResponse {
  count: number
  schedule: AmortizationSchedule[]
}

// Bank Types
export interface Bank {
  id: string
  name: string
  code: string
}

export interface GetBanksResponse {
  count: number
  banks: Bank[]
}

// Request Payload Types
export interface CreateSalaryLoanPayload {
  transaction_date: string
  borrower_id: string
  date_granted: string
  principal: number
  terms: number
  interest_rate: number
  installment_period: string
  due_date: string
  cash_card_amount: number
  computer_fee: number
  service_charge: number
  insurance: number
  notarial_fees: number
  gross_receipts_tax: number
  processing_fee: number
  co_makers: Omit<CoMaker, "id">[]
  prepared_by: string
  approved_by: string
  remarks: string
}

export interface UpdateSalaryLoanPayload extends CreateSalaryLoanPayload {
  id: string
}

export interface CreateCheckVoucherPayload {
  loan_id: string
  reference_code: string
  reference_number: string
  bank: string
  check_number: string
  include_journal_entries_in_printing: boolean
}

// Filter Types
export interface SalaryLoanFilters {
  division?: string
  district?: string
  borrower_search?: string
}
