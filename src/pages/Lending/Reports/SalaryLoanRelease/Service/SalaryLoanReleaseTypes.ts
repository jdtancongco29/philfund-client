// Common Types
export type ApiResponse<T> = {
  status: string
  message: string
  data: T
}

// Salary Loan Release Types
export interface SalaryLoanRelease {
  id: string
  dateGenerated: string
  borrowerName: string
  division: string
  school: string
  loanType: string
  pnNo: string
  reference: string
  principal: number
  terms: number
  deferredInterest: number
  totalPayable: number
  amortization: number
  startDate: string
  dueDate: string
  serviceCharge: number
  fileFee: number
  notarialFee: number
  netFee: number
  customerNetFee: number
  otherCharges: number
  loanBalance: number
  otherDeductions: number
  cashAdvance: number
  salaryDeduction: number
  netProceeds: number
}

export interface PaginationInfo {
  current_page: number
  per_page: number
  total_pages: number
  total_items: number
}

export interface GetAllSalaryLoanReleaseResponse {
  count: number
  loans: SalaryLoanRelease[]
  pagination: PaginationInfo
}

export interface Branch {
  id: string
  name: string
}

export interface Division {
  id: string
  name: string
}

export interface School {
  id: string
  name: string
}

export interface FilterOptions {
  branches: Branch[]
  divisions: Division[]
  schools: School[]
}

// Request Payload Types
export type SalaryLoanReleaseFilters = {
  branch?: string
  borrowerName?: string
  division?: string
  school?: string
  dateFrom?: string
  dateTo?: string
  [key: string]: string | undefined
}