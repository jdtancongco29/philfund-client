
export type ApiResponse<T> = {
  status: string
  message: string
  data: T
}


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
export interface CachedBorrowerStep1 {
  code: string;
  branch_id: string;
  bi_risk_level: number;
  bi_last_name: string;
  bi_first_name: string;
  bi_middle_name: string;
  bi_civil_status: string;
  bi_gender: string;
  bi_suffix: string;
  bi_birth_date: string;
  bi_birth_place: string;
  bi_maiden_name: string;
  bi_nickname: string;
  bi_blood_type: string;
  bi_date_of_death: string | null;
  bi_health_condition: number;
  bi_critical_health_condition: string | null;
}
export interface CachedBorrowerResponse {
  status: string;
  message: string;
  data: {
    step_1: CachedBorrowerStep1;
  };
}
export interface ApiError {
  message: string;
  type?: 'network' | 'validation' | 'server';
  validationErrors?: Record<string, string>;
}