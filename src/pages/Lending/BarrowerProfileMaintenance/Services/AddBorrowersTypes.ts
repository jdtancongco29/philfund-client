export interface Dependent {
  id: string
  name: string
  birthdate: Date | undefined
}

export interface AuthorizedPerson {
  id: string
  name: string
  relationship: string
  address: string
  contactNumber: string
  yearsKnown: string
  validIdType: string
  validIdNumber: string
  placeIssued: string
  dateIssued: Date | undefined
  signature: File | null
  photo: File | null
}

export interface FormData {
  bi_risk_level: string
  lastName: string
  firstName: string
  middleName: string
  suffix: string
  civilStatus: string
  gender: string
  birthDate: Date | undefined
  age: string
  birthPlace: string
  maidenName: string
  nickname: string
  bloodType: string
  healthCondition: string
  dateOfDeath: Date | undefined
  spouseName: string
  spouseOccupation: string
  spouseAddress: string
  spouseContact: string
  dependents: Dependent[]
  address: string
  province: string
  municipality: string
  barangay: string
  street: string
  place_status: string
  is_permanent: boolean
  permanent_address: string
  permanent_province: string
  permanent_municipality: string
  permanent_barangay: string
  permanent_street: string
  email: string
  contactNumber1: string
  network_provider1: string
  contctNumber2: string
  network_provider2: string
  classification: string
  date_of_appointment: Date | undefined
  category: string
  division: string
  district: string
  school: string
  deped_employee_id: string
  pricipal_name: string
  supervisor_name: string
  prc_id_no: string
  prc_registration_no: string
  prc_place_issued: string
  gov_valid_id_type: string
  valid_id_no: string
  gov_place_issued: string
  gov_date_issued: Date | undefined
  gov_expiration_date: Date | undefined
  bank: string
  atm_account_number: string
  atm_card_number: string
  atm_expiration_date: Date | undefined
  umid_type: string
  umid_card_no: string
  atm_bank_branch: string
  authorizedPersons: AuthorizedPerson[]
  bankName: string
  cardNumber: string
  accountNumber: string
  cardExpiryDate: Date | undefined
  borrowerPhoto: File | null
  borrowerSignature: File | null
  homeSketch: File | null
  googleMapUrl: string
  isInterviewed: boolean
  interviewedBy: string
}

export interface ValidationErrors {
  [key: string]: string
}

export interface AddBorrowerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export interface StepOneResult {
  success: boolean
  borrowerId?: string
  borrowerCode?: string
  message?: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface CreateBorrowerRequest {
  code: string
  branch_id: string
  bi_risk_level: string
  bi_last_name: string
  bi_first_name: string
  bi_middle_name: string
  bi_civil_status: string
  bi_gender: string
  bi_suffix: string | null
  bi_birth_date: string
  bi_birth_place: string
  bi_maiden_name: string | null
  bi_nickname: string | null
  bi_blood_type: string | null
  bi_date_of_death: string | null
  bi_health_condition: number
  bi_critical_health_condition: string | null
  spouse: {
    name: string | null
    occupation: string | null
    address: string | null
    contact_number: string | null
  } | null
}

export interface CreateBorrowerDependentsRequest {
  dependents: {
    name: string
    birthdate: string
  }[]
}

export interface CreateBorrowerAddressDetailsRequest {
  current_province: string
  current_citymun: string
  current_barangay: string
  current_street: string
  place_status: string
  permanent_province: string
  permanent_citymun: string
  permanent_barangay: string
  permanent_street: string
  email: string
  first_contact_info: string
  first_network_info: string
  second_contact_info: string
  second_network_info: string
}

export interface CreateBorrowerWorkInfoRequest {
  group_id: string
  classification_id: string
  employee_id: string
  date_of_appointment: string
  division_id: string
  district_id: string
  school_id: string
  principal_name: string
  supervisor_name: string
  prc_id: string
  prc_reg_no: string
  prc_placed_issued: string
  prc_reg_date: string | null
  prc_exp_date: string | null
  valid_id_type: string
  valid_id_no: string
  valid_id_place_issued: string
  valid_id_date_issued: string | null
  valid_id_exp_date: string | null
  atm_bank_id: string
  atm_bank_branch: string
  atm_acc_no: string
  atm_card_no: string
  atm_exp_date: string | null
  umid_card_type: string | null
  umid_card_no: string | null
  umid_bank_branch: string | null
}

export interface CreateBorrowerAuthorizationRequest {
  authorized: {
    full_name: string
    relationship: string
    address: string
    contact_number: string
    year_known: string
    valid_id_type: string
    valid_id_number: string
    place_issued: string
    date_issued: string
    signature: File | null
    photo: File | null
  }[]
}

export interface CreateBorrowerResponse {
  id: string
  code: string
  message?: string
  success: boolean
  status: string
}

export interface CreateBorrowerDependentsResponse {
  id: string
  code: string
  message?: string
  success: boolean
  status: string
  dependents_count?: number
}

export interface CachedBorrowerStep1 {
  code: string
  branch_id: string
  bi_risk_level: string
  bi_last_name: string
  bi_first_name: string
  bi_middle_name: string
  bi_civil_status: string
  bi_gender: string
  bi_suffix: string | null
  bi_birth_date: string
  bi_birth_place: string
  bi_maiden_name: string | null
  bi_nickname: string | null
  bi_blood_type: string | null
  bi_date_of_death: string | null
  bi_health_condition: number
  bi_critical_health_condition: string | null
}

export interface CachedBorrowerStep2 {
  dependents: {
    name: string
    birthdate: string
  }[]
}

export interface CachedBorrowerStep3 {
  current_province: string
  current_citymun: string
  current_barangay: string
  current_street: string
  place_status: string
  permanent_province: string
  permanent_citymun: string
  permanent_barangay: string
  permanent_street: string
  email: string
  first_contact_info: string
  first_network_info: string
  second_contact_info: string
  second_network_info: string
}

export interface CachedBorrowerStep4 {
  group_id: string
  classification_id: string
  employee_id: string
  date_of_appointment: string
  division_id: string
  district_id: string
  school_id: string
  principal_name: string
  supervisor_name: string
  prc_id: string
  prc_reg_no: string
  prc_placed_issued: string
  prc_reg_date: string | null
  prc_exp_date: string | null
  valid_id_type: string
  valid_id_no: string
  valid_id_place_issued: string
  valid_id_date_issued: string | null
  valid_id_exp_date: string | null
  atm_bank_id: string
  atm_bank_branch: string
  atm_acc_no: string
  atm_card_no: string
  atm_exp_date: string | null
  umid_card_type: string | null
  umid_card_no: string | null
  umid_bank_branch: string | null
}

export interface CachedBorrowerStep5 {
  authorized: {
    full_name: string
    relationship: string
    address: string
    contact_number: string
    year_known: string
    valid_id_type: string
    valid_id_number: string
    place_issued: string
    date_issued: string | null
  }[]
}

export interface CachedBorrowerResponse {
  status: string
  message: string
  data: {
    step_1?: CachedBorrowerStep1
    step_2?: CachedBorrowerStep2
    step_3?: CachedBorrowerStep3
    step_4?: CachedBorrowerStep4
    step_5?: CachedBorrowerStep5
    step_6?: any
    step_7?: any
  } | null
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  status: number
}

export interface ApiErrorResponse {
  message: string
  errors?: Record<string, string[]>
  status?: number
}

export interface StepValidationResult {
  isValid: boolean
  errors: ValidationErrors
}

export interface StepSubmissionResult {
  success: boolean
  data?: any
  message?: string
  errors?: ValidationErrors
}

export interface DependentValidation {
  id: string
  nameError?: string
  birthdateError?: string
  ageError?: string
}

export interface FormStepStatus {
  step_1: boolean
  step_2: boolean
  step_3: boolean
  step_4: boolean
  step_5: boolean
  step_6: boolean
  step_7: boolean
}

export interface BorrowerProfileProgress {
  current_step: number
  completed_steps: string[]
  total_steps: number
  completion_percentage: number
  last_updated: string
}

export interface BorrowerClassification {
  id: string
  branch_id: string
  group: {
    id: string
    name: string
  }
  code: string
  name: string
  qualified_for_restructure: boolean
  bonus_loan_eligible: boolean
  allow_3mo_grace: boolean
  status: boolean
}

export interface BorrowerClassificationResponse {
  status: string
  message: string
  data: {
    count: number
    classifications: BorrowerClassification[]
    pagination: {
      current_page: number
      per_page: number
      total_pages: number
      total_items: number
    }
  }
}

// New interfaces for BorrowerGroup
export interface BorrowerGroup {
  id: string
  branch_id: string
  code: string
  name: string
  status: boolean
}

export interface BorrowerGroupResponse {
  status: string
  message: string
  data: {
    count: number
    groups: BorrowerGroup[]
    pagination: {
      current_page: number
      per_page: number
      total_pages: number
      total_items: number
    }
  }
}
// District interfaces
export interface BorrowerDistrict {
  id: string
  code: string
  branch_id: string
  division: {
    id: string
    code: string
    name: string
  }
  name: string
  status: boolean
}

export interface BorrowerDistrictResponse {
  status: string
  message: string
  data: {
    count: number
    districts: BorrowerDistrict[]
    pagination: {
      current_page: number
      per_page: number
      total_pages: number
      total_items: number
    }
  }
}

export interface BorrowerDivision {
  id: string
  code: string
  group: {
    id: string
    code: string
    name: string
  }
  branch_id: string
  name: string
  status: boolean
}

export interface BorrowerDivisionResponse {
  status: string
  message: string
  data: {
    count: number
    division: BorrowerDivision[]
    pagination: {
      current_page: number
      per_page: number
      total_pages: number
      total_items: number
    }
  }
}

export interface BorrowerSchool {
  id: string
  code: string
  division: {
    id: string
    code: string
    name: string
  }
  district: {
    id: string
    code: string
    name: string
  }
  name: string
  status: boolean
}

export interface BorrowerSchoolResponse {
  status: string
  message: string
  data: {
    count: number
    schools: BorrowerSchool[]
    pagination: {
      current_page: number
      per_page: number
      total_pages: number
      total_items: number
    }
  }
}

export interface Bank {
  id: string
  branch_id: string
  branch_name: string
  coa: {
    id: string
    code: string
    name: string
  }
  code: string
  name: string
  address: string
  account_type: string
  status: number
}

export interface BankResponse {
  status: string
  message: string
  data: {
    count: number
    banks: Bank[]
    pagination: {
      current_page: number
      per_page: number
      total_pages: number
      total_items: number
    }
  }
}
export interface WorkFormData {
  // Employment Information
  classification: string
  date_of_appointment: Date | undefined
  category: string
  division: string
  district: string
  school: string
  deped_employee_id: string
  pricipal_name: string
  supervisor_name: string
  prc_id_no: string
  prc_registration_no: string
  prc_place_issued: string
  gov_valid_id_type: string
  valid_id_no: string
  gov_place_issued: string
  gov_date_issued: Date | undefined
  gov_expiration_date: Date | undefined
  bank: string
  atm_account_number: string
  atm_card_number: string
  atm_expiration_date: Date | undefined
  umid_type: string
  umid_card_no: string
  atm_bank_branch: string
}
export interface CreateBorrowerCashCardRequest {
  cashcard_bank_name: string
  cashcard_acc_num: string
  cashcard_num: string
  cashcard_exp: string
}

// Add the new interface for step-seven request
export interface CreateBorrowerVerificationRequest {
  ver_g_map_link: string
  ver_interviewed_by: string
  ver_interview_status: string
  ver_taken_by: string
  ver_auth_by: string
  ver_date: string
  ver_signature_taken_by: string
  ver_signature_auth_by: string
  ver_signature_taken_date: string
  ver_cl_prof_taken_by: string
  ver_audited_by: string
  ver_borrower_photo?: File
  ver_borrower_signature?: File
  ver_home_sketch?: File
}