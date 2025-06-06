// Common Types
export type ApiResponse<T> = {
  status: string;
  message: string;
  data: T;
};

// Group reference type
export interface Group {
  id: string;
  name: string;
  code?: string;
}

// BorrowerClassification Types
export interface BorrowerClassification {
  id: string;
  branch_id: string;
  group: Group;
  code: string;
  name: string;
  qualified_for_restructure: boolean;
  bonus_loan_eligible: boolean;
  allow_3mo_grace: boolean;
  eligible_for_bonus_loan?: boolean;
  allow_grace_period?: boolean;
  status: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface BorrowerClassificationDetail extends BorrowerClassification {}

export interface PaginationInfo {
  current_page: number;
  per_page: number;
  total_pages: number;
  total_items: number;
}

export interface GetAllClassificationsResponse {
  count: number;
  classifications: BorrowerClassification[];
  pagination: PaginationInfo;
}

// Request Payload Types
export interface CreateClassificationPayload {
  code: string;
  name: string;
  qualified_for_restructure: number;
  bonus_loan_eligible: number;
  allow_3mo_grace?: number;
  branch_id: string;
  group_id: string;
}

export interface UpdateClassificationPayload {
  code: string;
  name: string;
  qualified_for_restructure: number;
  bonus_loan_eligible: number;
  allow_3mo_grace?: number;
  branch_id: string;
  group_id: string;
}

export interface UpdateClassificationStatusPayload {
  status: number;
}
