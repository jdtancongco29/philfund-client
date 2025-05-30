import { District } from "../../DistrictSetup/Service/DistrictSetupTypes";

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
  code: string;
}

// School Types
export interface School {
  id: string;
  code: string;
  district: District;
  division: Division;
  district_id: string;
  district_name: string;
  name: string;
  status: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SchoolDetail extends School {}

export interface PaginationInfo {
  current_page: number;
  per_page: number;
  total_pages: number;
  total_items: number;
}

export interface GetAllSchoolsResponse {
  count: number;
  schools: School[];
  pagination: PaginationInfo;
}

// Request Payload Types
export interface CreateSchoolPayload {
  code: string;
  name: string;
  branch_id: string;
  division_id: string;
  district_id: string;
}

export interface UpdateSchoolPayload {
  code: string;
  name: string;
  branch_id: string;
  division_id: string;
  district_id: string;
}

export interface UpdateSchoolStatusPayload {
  status: number;
}
