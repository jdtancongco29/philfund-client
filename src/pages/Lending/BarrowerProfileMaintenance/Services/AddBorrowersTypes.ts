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

// Add these type imports to match your API pattern
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

// Define the API request interface based on the sample request
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
  bi_birth_date: string // Format: YYYY-MM-DD
  bi_birth_place: string
  bi_maiden_name: string | null
  bi_nickname: string | null
  bi_blood_type: string | null
  bi_date_of_death: string | null // Format: YYYY-MM-DD
  bi_health_condition: number
  bi_critical_health_condition: string | null
  spouse: {
    name: string | null
    occupation: string | null
    address: string | null
    contact_number: string | null
  } | null
}

// Step Two API request interface for dependents
export interface CreateBorrowerDependentsRequest {
  dependents: {
    name: string
    birthdate: string // Format: YYYY-MM-DD
  }[]
}

// API response interface
export interface CreateBorrowerResponse {
  id: string
  code: string
  message?: string
  success: boolean
  status: string
}

// Step Two API response interface
export interface CreateBorrowerDependentsResponse {
  id: string
  code: string
  message?: string
  success: boolean
  status: string
  dependents_count?: number
}

// Cache API response interfaces
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

// Cached Step Two data interface
export interface CachedBorrowerStep2 {
  dependents: {
    name: string
    birthdate: string // Format: YYYY-MM-DD
  }[]
}

// Updated cache response to include step_2
export interface CachedBorrowerResponse {
  status: string
  message: string
  data: {
    step_1?: CachedBorrowerStep1
    step_2?: CachedBorrowerStep2
    step_3?: any // Placeholder for future steps
    step_4?: any
    step_5?: any
    step_6?: any
    step_7?: any
  } | null
}

// Error response interface
export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  status: number
}

// Enhanced error interface for API responses
export interface ApiErrorResponse {
  message: string
  errors?: Record<string, string[]>
  status?: number
}

// Step validation result interfaces
export interface StepValidationResult {
  isValid: boolean
  errors: ValidationErrors
}

// Step submission result interfaces
export interface StepSubmissionResult {
  success: boolean
  data?: any
  message?: string
  errors?: ValidationErrors
}

// Dependent validation interface
export interface DependentValidation {
  id: string
  nameError?: string
  birthdateError?: string
  ageError?: string
}

// Form step status interface
export interface FormStepStatus {
  step_1: boolean
  step_2: boolean
  step_3: boolean
  step_4: boolean
  step_5: boolean
  step_6: boolean
  step_7: boolean
}

// Progress tracking interface
export interface BorrowerProfileProgress {
  current_step: number
  completed_steps: string[]
  total_steps: number
  completion_percentage: number
  last_updated: string
}
