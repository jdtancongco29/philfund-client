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
  riskLevel: string
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

