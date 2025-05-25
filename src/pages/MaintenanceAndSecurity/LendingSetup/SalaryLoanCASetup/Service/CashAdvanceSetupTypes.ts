// Common Types
export type ApiResponse<T> = {
  status: string
  message: string
  data: T
}

// COA reference type
export interface ChartOfAccount {
  id: string
  code: string
  name: string
}

// Classification reference type
export interface Classification {
  id: string
  name: string
}

// Loan reference type
export interface Loan {
  id: string
  code: string
  name: string
}

// Base interfaces
export interface CashAdvanceSetup {
  id: string
  code: string
  name: string
  interest_rate: string
  surcharge_rate: string
  type: "bonus loan" | "salary loan"
  max_amt: string | null
  max_rate: string | null
  status: boolean
  coa_loan_receivable: ChartOfAccount
  coa_interest_receivable: ChartOfAccount
  coa_unearned_interest: ChartOfAccount
  coa_interest_income: ChartOfAccount
  coa_other_income_penalty: ChartOfAccount
  coa_allowance_doubtful: ChartOfAccount
  coa_bad_dept_expense: ChartOfAccount
  coa_garnished: ChartOfAccount
  classifications: Classification[]
  loan: Loan | null
}

export interface CashAdvanceSetupDetail extends CashAdvanceSetup {}

// Table item interface (formatted for display)
export interface CashAdvanceSetupTableItem {
  id: string
  code: string
  name: string
  type: string
  interest_rate: string
  surcharge_rate: string
  max_amt: string
  max_rate: string
  status: boolean
}

// API Response interfaces
export interface GetAllCashAdvanceSetupsResponse {
  count: number
  cash_advance_setups: CashAdvanceSetup[]
  pagination: PaginationInfo
}

export interface CashAdvanceSetupResponse {
  status: string
  message: string
  data: CashAdvanceSetup
}

export interface CashAdvanceSetupDeleteResponse {
  status: string
  message: string
  data: null
}

export interface GetAllCOAResponse {
  count: number
  chartOfAccounts: ChartOfAccount[]
  pagination: PaginationInfo
}

// Pagination Info interface
export interface PaginationInfo {
  current_page: number
  per_page: number
  total_pages: number
  total_items: number
}

// Request interfaces
export interface CreateCashAdvanceSetupPayload {
  code: string
  name: string
  interest_rate: number
  surcharge_rate: number
  max_amt: number | null
  max_rate: number | null
  type: "bonus loan" | "salary loan"
  loan_code: string
  eligible_class: string[]
  coa_loan_receivable: string
  coa_interest_receivable: string
  coa_unearned_interest: string
  coa_interest_income: string
  coa_other_income_penalty: string
  coa_allowance_doubtful: string
  coa_bad_dept_expense: string
  coa_garnished: string
}

export interface UpdateCashAdvanceSetupPayload extends CreateCashAdvanceSetupPayload {}

export interface UpdateCashAdvanceSetupStatusPayload {
  status: number
}

// Form data interface
export interface CashAdvanceSetupFormData {
  code: string
  name: string
  interest_rate: number
  surcharge_rate: number
  max_amt: number | null
  max_rate: number | null
  type: "bonus loan" | "salary loan"
  loan_code: string
  eligible_class: string[]
  coa_loan_receivable: string
  coa_interest_receivable: string
  coa_unearned_interest: string
  coa_interest_income: string
  coa_other_income_penalty: string
  coa_allowance_doubtful: string
  coa_bad_dept_expense: string
  coa_garnished: string
}
