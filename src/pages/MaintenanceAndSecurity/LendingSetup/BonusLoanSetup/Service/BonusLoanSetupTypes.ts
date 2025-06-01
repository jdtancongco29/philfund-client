// Common Types
export type ApiResponse<T> = {
  status: string;
  message: string;
  data: T;
};

// COA reference type
export interface ChartOfAccount {
  id: string;
  code: string;
  name: string;
}

// Classification reference type
export interface Classification {
  id: string;
  name: string;
}

// Bonus Loan Types
export interface BonusLoan {
  id: string;
  code: string;
  name: string;
  interest_rate: string;
  surcharge_rate: string;
  release_month: number;
  cut_off_date: string;
  max_amt: string;
  max_rate: string | null;
  status: boolean;
  coa_loan_receivable: ChartOfAccount;
  coa_loan_interest_receivable: ChartOfAccount;
  coa_interest_receivable: ChartOfAccount;
  coa_interest_income: ChartOfAccount;
  coa_garnished_expense: ChartOfAccount;
  coa_unearned_interest: ChartOfAccount;
  coa_other_income_penalty: ChartOfAccount;
  coa_allowance_doubtful_account: ChartOfAccount;
  coa_bad_dept_expense: ChartOfAccount;
  classifications: Classification[];
}

export type BonusLoanDetail = BonusLoan;

export interface PaginationInfo {
  current_page: number;
  per_page: number;
  total_pages: number;
  total_items: number;
}

export interface GetAllBonusLoansResponse {
  count: number;
  bonus_loan_setups: BonusLoan[];
  pagination: PaginationInfo;
}

export interface GetAllCOAResponse {
  count: number;
  chartOfAccounts: ChartOfAccount[];
  pagination: PaginationInfo;
}

// Request Payload Types
export interface CreateBonusLoanPayload {
  code: string;
  name: string;
  interest_rate: number;
  surcharge_rate: number;
  release_month: number;
  cut_off_date: string;
  max_amt: number | null;
  max_rate: number | null;
  eligible_class: string[];
  coa_loan_receivable: string;
  coa_interest_receivable: string;
  coa_interest_income: string;
  coa_garnished_expense: string;
  coa_unearned_interest: string;
  coa_other_income_penalty: string;
  coa_allowance_doubtful_account: string;
  coa_bad_dept_expense: string;
}

export type UpdateBonusLoanPayload = CreateBonusLoanPayload;

export interface UpdateBonusLoanStatusPayload {
  status: number;
}
