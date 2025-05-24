// Common Types
export type ApiResponse<T> = {
  status: string;
  message: string;
  data: T;
};

// Division reference type
export interface Division {
  id: string;
  name: string;
}

// District Types
export interface District {
  id: string;
  code: string;
  division_id: string;
  division_name: string;
  division: Division;
  branch_id: string;
  name: string;
  status: boolean;
  schools?: unknown[];
}

export interface DistrictDetail extends District {
  schools: unknown[];
}

export interface PaginationInfo {
  current_page: number;
  per_page: number;
  total_pages: number;
  total_items: number;
}

export interface GetAllDistrictsResponse {
  count: number;
  districts: District[];
  pagination: PaginationInfo;
}

// Request Payload Types
export interface CreateDistrictPayload {
  code: string;
  name: string;
  branch_id: string;
  division_id: string;
}

export interface UpdateDistrictPayload {
  code: string;
  name: string;
  branch_id: string;
  division_id: string;
}

export interface UpdateDistrictStatusPayload {
  status: number;
}
