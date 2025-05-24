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

// Group reference type
export interface Group {
  id: string
  name: string
}

// Salary Loan Types
export interface SalaryLoan {
  id: string
  code: string
  name: string
  interest_rate: string
  surcharge_rate: string
  min_amount: string
  max_amount: string
  vis_service: string
  vis_insurance: string
  vis_notarial: string
  vis_gross_reciept: string
  vis_computer: string
  vis_other_charges: string
  pga_service_charge: string
  pga_insurance: string
  pga_notarial: string
  pga_gross_reciept: string
  def_interest?: string
  def_charge?: string
  def_computer?: string
  status: boolean
  coa_service_charge: ChartOfAccount
  coa_notarial: ChartOfAccount
  coa_gross_receipt: ChartOfAccount
  coa_computer: ChartOfAccount
  coa_pga_accounts_payable: ChartOfAccount
  coa_sl_receivable: ChartOfAccount
  coa_sl_interest_receivable: ChartOfAccount
  coa_sl_unearned_interest_income: ChartOfAccount
  coa_sl_interest_income: ChartOfAccount
  coa_sl_other_income_penalty: ChartOfAccount
  coa_sl_allowance_doubtful_account: ChartOfAccount
  coa_sl_bad_dept_expense: ChartOfAccount
  coa_sl_garnished: ChartOfAccount
  groups: Group[]
}

export interface SalaryLoanDetail extends SalaryLoan {}

export interface PaginationInfo {
  current_page: number
  per_page: number
  total_pages: number
  total_items: number
}

export interface GetAllSalaryLoansResponse {
  count: number
  salary_loan_setups: SalaryLoan[]
  pagination: PaginationInfo
}

export interface GetAllCOAResponse {
  count: number
  chartOfAccounts: ChartOfAccount[]
  pagination: PaginationInfo
}

// Request Payload Types
export interface CreateSalaryLoanPayload {
  code: string
  name: string
  interest_rate: number
  surcharge_rate: number
  min_amount: number
  max_amount: number
  vis_service: number
  vis_insurance: number
  vis_notarial: number
  vis_gross_reciept: number
  vis_computer: number
  vis_other_charges: number
  pga_service_charge: number
  pga_insurance: number
  pga_notarial: number
  pga_gross_reciept: number
  def_interest: number
  def_charge: number
  def_computer: number
  coa_sl_receivable: string
  coa_sl_interest_income: string
  coa_service_charge: string
  coa_notarial: string
  coa_gross_receipt: string
  coa_computer: string
  coa_pga_accounts_payable: string
  coa_sl_interest_receivable: string
  coa_sl_unearned_interest_income: string
  coa_sl_other_income_penalty: string
  coa_sl_allowance_doubtful_account: string
  coa_sl_bad_dept_expense: string
  coa_sl_garnished: string
  eligible_groups: string[]
}

export interface UpdateSalaryLoanPayload extends CreateSalaryLoanPayload {}

export interface UpdateSalaryLoanStatusPayload {
  status: number
}
