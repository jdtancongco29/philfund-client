import { apiRequest } from "@/lib/api"
import type {
  ApiErrorResponse,
  CachedBorrowerResponse,
  CachedBorrowerStep1,
  CachedBorrowerStep2,
  CachedBorrowerStep3,
  CachedBorrowerStep4,
  CachedBorrowerStep5,
  CreateBorrowerRequest,
  CreateBorrowerResponse,
  CreateBorrowerAddressDetailsRequest,
  CreateBorrowerWorkInfoRequest,
  CreateBorrowerAuthorizationRequest,
  FormData,
  Dependent,
  BorrowerClassificationResponse,
  BorrowerGroupResponse,
  BorrowerDistrictResponse,
  BorrowerDivisionResponse,
  BorrowerSchoolResponse,
  BankResponse,
} from "./AddBorrowersTypes"

// Add the new interface for step-six request
export interface CreateBorrowerCashCardRequest {
  cashcard_bank_name: string
  cashcard_acc_num: string
  cashcard_num: string
  cashcard_exp: string
}

/**
 * Transform cash card data to step-six API request format
 */
export const transformCashCardToRequest = (formData: FormData): CreateBorrowerCashCardRequest => {
  const formatDate = (date: Date | undefined): string => {
    if (!date) return ""
    return date.toISOString().split("T")[0]
  }

  console.log("=== Cash Card Transform Debug ===")
  console.log("Input formData:", {
    bankName: formData.bankName,
    cardNumber: formData.cardNumber,
    accountNumber: formData.accountNumber,
    cardExpiryDate: formData.cardExpiryDate,
  })

  const payload = {
    cashcard_bank_name: formData.bankName,
    cashcard_acc_num: formData.accountNumber,
    cashcard_num: formData.cardNumber,
    cashcard_exp: formatDate(formData.cardExpiryDate),
  }

  console.log("Output payload:", payload)

  return payload
}

/**
 * API function for creating borrower cash card information (Step Six)
 */
export const createBorrowerCashCardApi = async (formData: FormData): Promise<CreateBorrowerResponse> => {
  const endpoint = "/borrower-profile/step-six"
  const payload = transformCashCardToRequest(formData)

  const response = await apiRequest<CreateBorrowerResponse>("post", endpoint, payload, {
    useAuth: true,
    useBranchId: true,
  })

  return response.data
}

/**
 * Transform FormData to API request format
 */
export const transformFormDataToRequest = (
  formData: FormData,
  branchId: string,
  borrowerCode: string,
): CreateBorrowerRequest => {
  // Helper function to format date
  const formatDate = (date: Date | undefined): string | null => {
    if (!date) return null
    return date.toISOString().split("T")[0]
  }

  // Map health condition string to number
  const mapHealthCondition = (healthCondition: string): number => {
    const healthMap: Record<string, number> = {
      excellent: 1,
      good: 2,
      fair: 3,
      poor: 4,
    }
    return healthMap[healthCondition.toLowerCase()] || 2
  }

  return {
    code: borrowerCode,
    branch_id: branchId,
    bi_risk_level: formData.bi_risk_level,
    bi_last_name: formData.lastName,
    bi_first_name: formData.firstName,
    bi_middle_name: formData.middleName,
    bi_civil_status: formData.civilStatus.toLowerCase(),
    bi_gender: formData.gender.toLowerCase(),
    bi_suffix: formData.suffix || null,
    bi_birth_date: formatDate(formData.birthDate) || "",
    bi_birth_place: formData.birthPlace,
    bi_maiden_name: formData.maidenName || null,
    bi_nickname: formData.nickname || null,
    bi_blood_type: formData.bloodType || null,
    bi_date_of_death: formatDate(formData.dateOfDeath),
    bi_health_condition: mapHealthCondition(formData.healthCondition),
    bi_critical_health_condition: null,
    spouse:
      formData.civilStatus.toLowerCase() === "married"
        ? {
            name: formData.spouseName || null,
            occupation: formData.spouseOccupation || null,
            address: formData.spouseAddress || null,
            contact_number: formData.spouseContact || null,
          }
        : null,
  }
}

/**
 * Transform work information to step-four API request format
 */
export const transformWorkInfoToRequest = (formData: FormData): CreateBorrowerWorkInfoRequest => {
  const formatDate = (date: Date | undefined): string | null => {
    if (!date) return null
    return date.toISOString().split("T")[0]
  }

  return {
    group_id: formData.category,
    classification_id: formData.classification,
    employee_id: formData.deped_employee_id,
    date_of_appointment: formatDate(formData.date_of_appointment) || "",
    division_id: formData.division,
    district_id: formData.district,
    school_id: formData.school,
    principal_name: formData.pricipal_name,
    supervisor_name: formData.supervisor_name,
    prc_id: formData.prc_id_no,
    prc_reg_no: formData.prc_registration_no,
    prc_placed_issued: formData.prc_place_issued,
    prc_reg_date: formatDate(formData.gov_date_issued),
    prc_exp_date: formatDate(formData.gov_expiration_date),
    valid_id_type: formData.gov_valid_id_type,
    valid_id_no: formData.valid_id_no,
    valid_id_place_issued: formData.gov_place_issued,
    valid_id_date_issued: formatDate(formData.gov_date_issued),
    valid_id_exp_date: formatDate(formData.gov_expiration_date),
    atm_bank_id: formData.bank,
    atm_bank_branch: formData.atm_bank_branch,
    atm_acc_no: formData.atm_account_number,
    atm_card_no: formData.atm_card_number,
    atm_exp_date: formatDate(formData.atm_expiration_date),
    umid_card_type: formData.umid_type || null,
    umid_card_no: formData.umid_card_no || null,
    umid_bank_branch: formData.atm_bank_branch || null,
  }
}

/**
 * Transform authorization data to step-five API request format
 */
export const transformAuthorizationToRequest = (formData: FormData): CreateBorrowerAuthorizationRequest => {
  const formatDate = (date: Date | undefined): string | null => {
    if (!date) return null
    return date.toISOString().split("T")[0]
  }

  return {
    authorized: formData.authorizedPersons.map((person) => ({
      full_name: person.name,
      relationship: person.relationship,
      address: person.address,
      contact_number: person.contactNumber,
      year_known: person.yearsKnown,
      valid_id_type: person.validIdType,
      valid_id_number: person.validIdNumber,
      place_issued: person.placeIssued,
      date_issued: formatDate(person.dateIssued) || "",
      signature: person.signature,
      photo: person.photo,
    })),
  }
}

export const fetchBorrowerClassificationsApi = async (): Promise<BorrowerClassificationResponse> => {
  const endpoint = "/borrower/classification"

  const response = await apiRequest<BorrowerClassificationResponse>("get", endpoint, undefined, {
    useAuth: true,
    useBranchId: true,
  })

  return response.data
}

/**
 * API function for fetching borrower groups
 */
export const fetchBorrowerGroupsApi = async (): Promise<BorrowerGroupResponse> => {
  const endpoint = "/borrower/group"

  const response = await apiRequest<BorrowerGroupResponse>("get", endpoint, undefined, {
    useAuth: true,
    useBranchId: true,
  })

  return response.data
}

export const fetchBorrowerDistrictsApi = async (): Promise<BorrowerDistrictResponse> => {
  const endpoint = "/borrower/district"

  const response = await apiRequest<BorrowerDistrictResponse>("get", endpoint, undefined, {
    useAuth: true,
    useBranchId: true,
  })

  return response.data
}

export const fetchBorrowerDivisionsApi = async (): Promise<BorrowerDivisionResponse> => {
  const endpoint = "/borrower/division"

  const response = await apiRequest<BorrowerDivisionResponse>("get", endpoint, undefined, {
    useAuth: true,
    useBranchId: true,
  })

  return response.data
}

export const fetchBorrowerSchoolsApi = async (): Promise<BorrowerSchoolResponse> => {
  const endpoint = "/borrower/school"

  const response = await apiRequest<BorrowerSchoolResponse>("get", endpoint, undefined, {
    useAuth: true,
    useBranchId: true,
  })

  return response.data
}

export const fetchBanksApi = async (): Promise<BankResponse> => {
  const endpoint = "/bank/"

  const response = await apiRequest<BankResponse>("get", endpoint, undefined, {
    useAuth: true,
    useBranchId: true,
  })

  return response.data
}

/**
 * Transform dependents data to step-two API request format
 */
export const transformDependentsToRequest = (formData: FormData) => {
  const formatDate = (date: Date | undefined): string | null => {
    if (!date) return null
    return date.toISOString().split("T")[0]
  }

  const validDependents = formData.dependents
    .filter((dep) => dep.name.trim() && dep.birthdate)
    .map((dep) => ({
      name: dep.name.trim(),
      birthdate: formatDate(dep.birthdate),
    }))

  return {
    dependents: validDependents,
  }
}

/**
 * Transform address details to step-three API request format
 */
export const transformAddressDetailsToRequest = (formData: FormData): CreateBorrowerAddressDetailsRequest => {
  return {
    current_province: formData.province,
    current_citymun: formData.municipality,
    current_barangay: formData.barangay,
    current_street: formData.street,
    place_status: formData.place_status,
    permanent_province: formData.permanent_province || formData.province,
    permanent_citymun: formData.permanent_municipality || formData.municipality,
    permanent_barangay: formData.permanent_barangay || formData.barangay,
    permanent_street: formData.permanent_street || formData.street,
    email: formData.email,
    first_contact_info: formData.contactNumber1,
    first_network_info: formData.network_provider1,
    second_contact_info: formData.contctNumber2,
    second_network_info: formData.network_provider2,
  }
}

/**
 * API function for creating borrower basic info (Step One)
 */
export const createBorrowerBasicInfoApi = async (params: {
  formData: FormData
  branchId: string
  borrowerCode: string
}): Promise<CreateBorrowerResponse> => {
  const endpoint = "/borrower-profile/step-one"
  const payload = transformFormDataToRequest(params.formData, params.branchId, params.borrowerCode)

  const response = await apiRequest<CreateBorrowerResponse>("post", endpoint, payload, {
    useAuth: true,
    useBranchId: true,
  })

  return response.data
}

/**
 * API function for creating borrower dependents (Step Two)
 */
export const createBorrowerDependentsApi = async (formData: FormData): Promise<CreateBorrowerResponse> => {
  const endpoint = "/borrower-profile/step-two"
  const payload = transformDependentsToRequest(formData)

  const response = await apiRequest<CreateBorrowerResponse>("post", endpoint, payload, {
    useAuth: true,
    useBranchId: true,
  })

  return response.data
}

/**
 * API function for creating borrower address details (Step Three)
 */
export const createBorrowerAddressDetailsApi = async (formData: FormData): Promise<CreateBorrowerResponse> => {
  const endpoint = "/borrower-profile/step-three"
  const payload = transformAddressDetailsToRequest(formData)

  const response = await apiRequest<CreateBorrowerResponse>("post", endpoint, payload, {
    useAuth: true,
    useBranchId: true,
  })

  return response.data
}

/**
 * API function for creating borrower work information (Step Four)
 */
export const createBorrowerWorkInfoApi = async (formData: FormData): Promise<CreateBorrowerResponse> => {
  const endpoint = "/borrower-profile/step-four"
  const payload = transformWorkInfoToRequest(formData)

  const response = await apiRequest<CreateBorrowerResponse>("post", endpoint, payload, {
    useAuth: true,
    useBranchId: true,
  })

  return response.data
}

/**
 * API function for creating borrower authorization (Step Five)
 */
export const createBorrowerAuthorizationApi = async (formData: FormData): Promise<CreateBorrowerResponse> => {
  const endpoint = "/borrower-profile/step-five"

  // Create FormData for file uploads
  const formDataPayload = new FormData()

  // Add authorized persons data
  formData.authorizedPersons.forEach((person, index) => {
    formDataPayload.append(`authorized[${index}][full_name]`, person.name)
    formDataPayload.append(`authorized[${index}][relationship]`, person.relationship)
    formDataPayload.append(`authorized[${index}][address]`, person.address)
    formDataPayload.append(`authorized[${index}][contact_number]`, person.contactNumber)
    formDataPayload.append(`authorized[${index}][year_known]`, person.yearsKnown)
    formDataPayload.append(`authorized[${index}][valid_id_type]`, person.validIdType)
    formDataPayload.append(`authorized[${index}][valid_id_number]`, person.validIdNumber)
    formDataPayload.append(`authorized[${index}][place_issued]`, person.placeIssued)

    if (person.dateIssued) {
      const formattedDate = person.dateIssued.toISOString().split("T")[0]
      formDataPayload.append(`authorized[${index}][date_issued]`, formattedDate)
    }

    // Console logs to check signature and photo
    console.log(`Person ${index} - Signature check:`, {
      exists: !!person.signature,
      isFile: person.signature instanceof File,
      fileName: person.signature?.name || "N/A",
      fileSize: person.signature?.size || 0,
      isEmpty: !person.signature || person.signature.size === 0,
    })

    console.log(`Person ${index} - Photo check:`, {
      exists: !!person.photo,
      isFile: person.photo instanceof File,
      fileName: person.photo?.name || "N/A",
      fileSize: person.photo?.size || 0,
      isEmpty: !person.photo || person.photo.size === 0,
    })

    // Replace the existing file append logic
    // Only append files if they are valid File objects with names and size > 0
    if (person.signature && person.signature instanceof File) {
      console.log(`✓ Appending signature for person ${index}:`, person.signature.name)
      formDataPayload.append(`authorized[${index}][signature]`, person.signature)
    } else {
      console.log(`✗ Skipping signature for person ${index} - invalid or empty file`)
    }

    if (person.photo && person.photo instanceof File) {
      console.log(`✓ Appending photo for person ${index}:`, person.photo.name)
      formDataPayload.append(`authorized[${index}][photo]`, person.photo)
    } else {
      console.log(`✗ Skipping photo for person ${index} - invalid or empty file`)
    }
  })
  // Use the apiRequest function without the headers option
  console.log("=== FormData Debug ===")
  for (const [key, value] of formDataPayload.entries()) {
    if (value instanceof File) {
      console.log(`${key}:`, {
        name: value.name,
        size: value.size,
        type: value.type,
        lastModified: value.lastModified,
      })
    } else {
      console.log(`${key}:`, value)
    }
  }
  const response = await apiRequest<CreateBorrowerResponse>("post", endpoint, formDataPayload, {
    useAuth: true,
    useBranchId: true,
    // The Content-Type will be automatically set to multipart/form-data
    // when FormData is used as the request body
  })

  return response.data
}

/**
 * API function for fetching cached borrower profile data
 */
export const fetchCachedBorrowerProfileApi = async (): Promise<CachedBorrowerResponse> => {
  const endpoint = "/borrower-profile/cached"

  const response = await apiRequest<CachedBorrowerResponse>("get", endpoint, undefined, {
    useAuth: true,
    useBranchId: true,
  })

  return response.data
}

/**
 * Fetch cached data and transform to form format
 */
export const getCachedFormData = async (): Promise<Partial<FormData> | null> => {
  try {
    const cachedResponse = await fetchCachedBorrowerProfileApi()

    if (cachedResponse.status === "FETCHED" && cachedResponse.data) {
      let formData: Partial<FormData> = {}

      // Transform step_1 data if available
      if (cachedResponse.data.step_1) {
        formData = { ...formData, ...transformCachedStep1ToFormData(cachedResponse.data.step_1) }
      }

      // Transform step_2 data if available
      if (cachedResponse.data.step_2) {
        formData = { ...formData, ...transformCachedStep2ToFormData(cachedResponse.data.step_2) }
      }

      // Transform step_3 data if available
      if (cachedResponse.data.step_3) {
        formData = { ...formData, ...transformCachedStep3ToFormData(cachedResponse.data.step_3) }
      }

      // Transform step_4 data if available
      if (cachedResponse.data.step_4) {
        formData = { ...formData, ...transformCachedStep4ToFormData(cachedResponse.data.step_4) }
      }

      // Transform step_5 data if available
      if (cachedResponse.data.step_5) {
        formData = { ...formData, ...transformCachedStep5ToFormData(cachedResponse.data.step_5) }
      }

      return formData
    }

    return null
  } catch (error) {
    console.error("Error fetching cached form data:", error)
    return null
  }
}

export const transformCachedStep1ToFormData = (cachedData: CachedBorrowerStep1): Partial<FormData> => {
  const parseDate = (dateString: string | null): Date | undefined => {
    if (!dateString) return undefined
    return new Date(dateString)
  }

  const mapHealthConditionToString = (healthCondition: number): string => {
    const healthMap: Record<number, string> = {
      1: "excellent",
      2: "good",
      3: "fair",
      4: "poor",
    }
    return healthMap[healthCondition] || "good"
  }

  return {
    lastName: cachedData.bi_last_name,
    firstName: cachedData.bi_first_name,
    middleName: cachedData.bi_middle_name,
    suffix: cachedData.bi_suffix || "",
    civilStatus: cachedData.bi_civil_status,
    gender: cachedData.bi_gender,
    birthDate: parseDate(cachedData.bi_birth_date),
    birthPlace: cachedData.bi_birth_place,
    maidenName: cachedData.bi_maiden_name || "",
    nickname: cachedData.bi_nickname || "",
    bloodType: cachedData.bi_blood_type || "",
    dateOfDeath: parseDate(cachedData.bi_date_of_death),
    bi_risk_level: cachedData.bi_risk_level,
    healthCondition: mapHealthConditionToString(cachedData.bi_health_condition),
    spouseName: "",
    spouseOccupation: "",
    spouseAddress: "",
    spouseContact: "",
  }
}

export const transformCachedStep2ToFormData = (cachedData: CachedBorrowerStep2): Partial<FormData> => {
  const parseDate = (dateString: string): Date | undefined => {
    if (!dateString) return undefined
    return new Date(dateString)
  }

  const transformedDependents: Dependent[] = cachedData.dependents.map((dep, index) => ({
    id: (index + 1).toString(),
    name: dep.name,
    birthdate: parseDate(dep.birthdate),
  }))

  while (transformedDependents.length < 3) {
    transformedDependents.push({
      id: (transformedDependents.length + 1).toString(),
      name: "",
      birthdate: undefined,
    })
  }

  return {
    dependents: transformedDependents,
  }
}

export const transformCachedStep3ToFormData = (cachedData: CachedBorrowerStep3): Partial<FormData> => {
  return {
    province: cachedData.current_province,
    municipality: cachedData.current_citymun,
    barangay: cachedData.current_barangay,
    street: cachedData.current_street,
    place_status: cachedData.place_status,
    permanent_province: cachedData.permanent_province,
    permanent_municipality: cachedData.permanent_citymun,
    permanent_barangay: cachedData.permanent_barangay,
    permanent_street: cachedData.permanent_street,
    email: cachedData.email,
    contactNumber1: cachedData.first_contact_info,
    network_provider1: cachedData.first_network_info,
    contctNumber2: cachedData.second_contact_info,
    network_provider2: cachedData.second_network_info,
    is_permanent:
      cachedData.current_province !== cachedData.permanent_province ||
      cachedData.current_citymun !== cachedData.permanent_citymun ||
      cachedData.current_barangay !== cachedData.permanent_barangay ||
      cachedData.current_street !== cachedData.permanent_street,
  }
}

export const transformCachedStep4ToFormData = (cachedData: CachedBorrowerStep4): Partial<FormData> => {
  const parseDate = (dateString: string | null): Date | undefined => {
    if (!dateString) return undefined
    return new Date(dateString)
  }

  return {
    category: cachedData.group_id,
    classification: cachedData.classification_id,
    deped_employee_id: cachedData.employee_id,
    date_of_appointment: parseDate(cachedData.date_of_appointment),
    division: cachedData.division_id,
    district: cachedData.district_id,
    school: cachedData.school_id,
    pricipal_name: cachedData.principal_name,
    supervisor_name: cachedData.supervisor_name,
    prc_id_no: cachedData.prc_id,
    prc_registration_no: cachedData.prc_reg_no,
    prc_place_issued: cachedData.prc_placed_issued,
    gov_date_issued: parseDate(cachedData.prc_reg_date),
    gov_expiration_date: parseDate(cachedData.prc_exp_date),
    gov_valid_id_type: cachedData.valid_id_type,
    valid_id_no: cachedData.valid_id_no,
    gov_place_issued: cachedData.valid_id_place_issued,
    bank: cachedData.atm_bank_id,
    atm_bank_branch: cachedData.atm_bank_branch,
    atm_account_number: cachedData.atm_acc_no,
    atm_card_number: cachedData.atm_card_no,
    atm_expiration_date: parseDate(cachedData.atm_exp_date),
    // umid_type: cachedData.umid_card_type,
    // umid_card_no: cachedData.umid_card_no,
  }
}

export const transformCachedStep5ToFormData = (cachedData: CachedBorrowerStep5): Partial<FormData> => {
  const parseDate = (dateString: string | null): Date | undefined => {
    if (!dateString) return undefined
    return new Date(dateString)
  }

  const transformedAuthorizedPersons = cachedData.authorized.map((person, index) => ({
    id: (index + 1).toString(),
    name: person.full_name,
    relationship: person.relationship,
    address: person.address,
    contactNumber: person.contact_number,
    yearsKnown: person.year_known,
    validIdType: person.valid_id_type,
    validIdNumber: person.valid_id_number,
    placeIssued: person.place_issued,
    dateIssued: parseDate(person.date_issued),
    signature: null, // Files can't be cached
    photo: null, // Files can't be cached
  }))

  return {
    authorizedPersons: transformedAuthorizedPersons,
  }
}

/**
 * Map API field names to form field names
 */
export const mapApiFieldToFormField = (apiField: string): string => {
  const fieldMap: Record<string, string> = {
    bi_last_name: "lastName",
    bi_first_name: "firstName",
    bi_middle_name: "middleName",
    bi_suffix: "suffix",
    bi_civil_status: "civilStatus",
    bi_gender: "gender",
    bi_birth_date: "birthDate",
    bi_birth_place: "birthPlace",
    bi_maiden_name: "maidenName",
    bi_nickname: "nickname",
    bi_blood_type: "bloodType",
    bi_date_of_death: "dateOfDeath",
    bi_health_condition: "healthCondition",
    bi_risk_level: "riskLevel",
    "spouse.name": "spouseName",
    "spouse.occupation": "spouseOccupation",
    "spouse.address": "spouseAddress",
    "spouse.contact_number": "spouseContact",
    // Dependents field mappings
    "dependents.0.name": "1_name",
    "dependents.0.birthdate": "1_birthdate",
    "dependents.1.name": "2_name",
    "dependents.1.birthdate": "2_birthdate",
    "dependents.2.name": "3_name",
    "dependents.2.birthdate": "3_birthdate",
    dependents: "dependents",
    // Address field mappings
    current_province: "province",
    current_citymun: "municipality",
    current_barangay: "barangay",
    current_street: "street",
    place_status: "place_status",
    permanent_province: "permanent_province",
    permanent_citymun: "permanent_municipality",
    permanent_barangay: "permanent_barangay",
    permanent_street: "permanent_street",
    email: "email",
    first_contact_info: "contactNumber1",
    first_network_info: "network_provider1",
    second_contact_info: "contctNumber2",
    second_network_info: "network_provider2",
    // Work information field mappings
    group_id: "category",
    classification_id: "classification",
    employee_id: "deped_employee_id",
    date_of_appointment: "date_of_appointment",
    division_id: "division",
    district_id: "district",
    school_id: "school",
    principal_name: "pricipal_name",
    supervisor_name: "supervisor_name",
    prc_id: "prc_id_no",
    prc_reg_no: "prc_registration_no",
    prc_placed_issued: "prc_place_issued",
    prc_reg_date: "gov_date_issued",
    prc_exp_date: "gov_expiration_date",
    valid_id_type: "gov_valid_id_type",
    valid_id_no: "valid_id_no",
    valid_id_place_issued: "gov_place_issued",
    valid_id_date_issued: "gov_date_issued",
    valid_id_exp_date: "gov_expiration_date",
    atm_bank_id: "bank",
    atm_bank_branch: "atm_bank_branch",
    atm_acc_no: "atm_account_number",
    atm_card_no: "atm_card_number",
    atm_exp_date: "atm_expiration_date",
    umid_card_type: "umid_type",
    umid_card_no: "umid_card_no",
    umid_bank_branch: "atm_bank_branch",
    // Authorization field mappings
    "authorized.0.full_name": "authorization_0_name",
    "authorized.0.relationship": "authorization_0_relationship",
    "authorized.0.address": "authorization_0_address",
    "authorized.0.contact_number": "authorization_0_contactNumber",
    "authorized.0.year_known": "authorization_0_yearsKnown",
    "authorized.0.valid_id_type": "authorization_0_validIdType",
    "authorized.0.valid_id_number": "authorization_0_validIdNumber",
    "authorized.0.place_issued": "authorization_0_placeIssued",
    "authorized.0.date_issued": "authorization_0_dateIssued",
    "authorized.0.signature": "authorization_0_signature",
    "authorized.0.photo": "authorization_0_photo",
    authorized: "authorization",
    // Cash card field mappings
    cashcard_bank_name: "bankName",
    cashcard_acc_num: "accountNumber",
    cashcard_num: "cardNumber",
    cashcard_exp: "cardExpiryDate",
  }

  return fieldMap[apiField] || apiField
}

/**
 * Validate required fields for step one
 */
export const validateStepOneFields = (formData: FormData): Record<string, string> => {
  const errors: Record<string, string> = {}

  if (!formData.lastName.trim()) {
    errors.lastName = "Last name is required"
  }

  if (!formData.firstName.trim()) {
    errors.firstName = "First name is required"
  }

  if (!formData.civilStatus) {
    errors.civilStatus = "Civil status is required"
  }

  if (!formData.gender) {
    errors.gender = "Gender is required"
  }

  if (!formData.birthDate) {
    errors.birthDate = "Birth date is required"
  }

  if (!formData.birthPlace.trim()) {
    errors.birthPlace = "Birth place is required"
  }

  if (!formData.bi_risk_level) {
    errors.bi_risk_level = "Risk level is required"
  }

  if (!formData.healthCondition) {
    errors.healthCondition = "Health condition is required"
  }

  if (formData.civilStatus.toLowerCase() === "married") {
    if (!formData.spouseName?.trim()) {
      errors.spouseName = "Spouse name is required for married borrowers"
    }
  }

  if (formData.birthDate && formData.birthDate > new Date()) {
    errors.birthDate = "Birth date cannot be in the future"
  }

  if (formData.dateOfDeath && formData.birthDate && formData.dateOfDeath <= formData.birthDate) {
    errors.dateOfDeath = "Date of death must be after birth date"
  }

  return errors
}

/**
 * Validate dependents data for step two
 */
export const validateStepTwoFields = (formData: FormData): Record<string, string> => {
  const errors: Record<string, string> = {}

  if (!formData.dependents || formData.dependents.length === 0) {
    errors.dependents = "At least one dependent is required"
    return errors
  }

  let hasValidDependent = false

  formData.dependents.forEach((dep) => {
    const trimmedName = dep.name.trim()

    if (!trimmedName) {
      errors[`${dep.id}_name`] = "Name is required"
    }

    if (!dep.birthdate) {
      errors[`${dep.id}_birthdate`] = "Birthdate is required"
    } else {
      const today = new Date()
      const todayString = today.toISOString().split("T")[0]

      let birthdateString: string
      if (dep.birthdate instanceof Date) {
        birthdateString = dep.birthdate.toISOString().split("T")[0]
      } else {
        birthdateString = dep.birthdate
      }

      if (birthdateString > todayString) {
        errors[`${dep.id}_birthdate`] = "Birthdate cannot be in the future"
      }
    }

    if (trimmedName && dep.birthdate) {
      hasValidDependent = true
    }
  })

  if (!hasValidDependent) {
    errors.dependents = "At least one dependent must have both name and birthdate"
  }

  return errors
}

/**
 * Validate address details for step three
 */
export const validateStepThreeFields = (formData: FormData): Record<string, string> => {
  const errors: Record<string, string> = {}

  // Current address validation
  if (!formData.province.trim()) {
    errors.province = "Province is required"
  }

  if (!formData.municipality.trim()) {
    errors.municipality = "Municipality/City is required"
  }

  if (!formData.barangay.trim()) {
    errors.barangay = "Barangay is required"
  }

  if (!formData.place_status.trim()) {
    errors.place_status = "Place status is required"
  }

  // Permanent address validation (if different from current)
  if (formData.is_permanent) {
    if (!formData.permanent_province.trim()) {
      errors.permanent_province = "Permanent province is required"
    }

    if (!formData.permanent_municipality.trim()) {
      errors.permanent_municipality = "Permanent municipality/city is required"
    }

    if (!formData.permanent_barangay.trim()) {
      errors.permanent_barangay = "Permanent barangay is required"
    }

    if (!formData.permanent_street.trim()) {
      errors.permanent_street = "Permanent street is required"
    }
  }

  // Contact information validation
  if (!formData.email.trim()) {
    errors.email = "Email is required"
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address"
    }
  }

  if (!formData.contactNumber1.trim()) {
    errors.contactNumber1 = "First contact number is required"
  }

  if (!formData.network_provider1.trim()) {
    errors.network_provider1 = "First network provider is required"
  }

  if (!formData.contctNumber2.trim()) {
    errors.contctNumber2 = "Second contact number is required"
  }

  if (!formData.network_provider2.trim()) {
    errors.network_provider2 = "Second network provider is required"
  }

  return errors
}

/**
 * Validate work information for step four
 */
export const validateStepFourFields = (formData: FormData): Record<string, string> => {
  const errors: Record<string, string> = {}

  if (!formData.classification) {
    errors.classification = "Classification is required"
  }
  if (!formData.date_of_appointment) {
    errors.date_of_appointment = "Date of Appointment is required"
  }
  if (!formData.category) {
    errors.category = "Category is required"
  }
  if (!formData.division) {
    errors.division = "Division is required"
  }
  if (!formData.district) {
    errors.district = "District is required"
  }
  if (!formData.school.trim()) {
    errors.school = "School is required"
  }
  if (!formData.deped_employee_id.trim()) {
    errors.deped_employee_id = "DepEd Employee ID is required"
  }
  if (!formData.pricipal_name.trim()) {
    errors.pricipal_name = "Principal Name is required"
  }
  if (!formData.supervisor_name.trim()) {
    errors.supervisor_name = "Supervisor Name is required"
  }
  if (!formData.prc_id_no.trim()) {
    errors.prc_id_no = "PRC ID No. is required"
  }
  if (!formData.prc_registration_no.trim()) {
    errors.prc_registration_no = "PRC Registration No. is required"
  }
  if (!formData.prc_place_issued.trim()) {
    errors.prc_place_issued = "PRC Place of Issue is required"
  }
  if (!formData.gov_date_issued) {
    errors.gov_date_issued = "Date of Issue is required"
  }
  if (!formData.gov_expiration_date) {
    errors.gov_expiration_date = "Expiration Date is required"
  }
  if (!formData.gov_valid_id_type.trim()) {
    errors.gov_valid_id_type = "Government Valid ID Type is required"
  }
  if (!formData.bank.trim()) {
    errors.bank = "Bank is required"
  }
  if (!formData.atm_account_number.trim()) {
    errors.atm_account_number = "ATM Account Number is required"
  }
  if (!formData.atm_card_number.trim()) {
    errors.atm_card_number = "ATM Card Number is required"
  }

  if (!formData.umid_type.trim()) {
    errors.umid_type = "UMID Type is required"
  }
  if (!formData.umid_card_no.trim()) {
    errors.umid_card_no = "UMID Card No. is required"
  }
  if (!formData.atm_bank_branch.trim()) {
    errors.atm_bank_branch = "ATM Bank Branch is required"
  }

  return errors
}

/**
 * Validate authorization data for step five
 */
export const validateStepFiveFields = (formData: FormData): Record<string, string> => {
  const errors: Record<string, string> = {}

  if (!formData.authorizedPersons || formData.authorizedPersons.length === 0) {
    errors.authorization = "At least one authorized person is required"
    return errors
  }

  let hasValidAuthorizedPerson = false

  formData.authorizedPersons.forEach((person, index) => {
    const prefix = `authorization_${index}`

    if (!person.name.trim()) {
      errors[`${prefix}_name`] = "Full Name is required"
    }

    if (!person.relationship.trim()) {
      errors[`${prefix}_relationship`] = "Relationship is required"
    }

    if (!person.address.trim()) {
      errors[`${prefix}_address`] = "Address is required"
    }

    if (!person.contactNumber.trim()) {
      errors[`${prefix}_contactNumber`] = "Contact Number is required"
    }

    if (!person.yearsKnown.trim()) {
      errors[`${prefix}_yearsKnown`] = "Years Known is required"
    }

    if (!person.validIdType) {
      errors[`${prefix}_validIdType`] = "Valid ID Type is required"
    }

    if (!person.validIdNumber.trim()) {
      errors[`${prefix}_validIdNumber`] = "Valid ID Number is required"
    }

    if (!person.placeIssued.trim()) {
      errors[`${prefix}_placeIssued`] = "Place Issued is required"
    }

    if (!person.dateIssued) {
      errors[`${prefix}_dateIssued`] = "Date Issued is required"
    }

    // Validate signature file
    if (!person.signature || !(person.signature instanceof File) || person.signature.size === 0) {
      errors[`${prefix}_signature`] = "Signature is required"
    }

    // Validate photo file
    if (!person.photo || !(person.photo instanceof File) || person.photo.size === 0) {
      errors[`${prefix}_photo`] = "Photo is required"
    }

    // Check if this person has all required fields filled including files
    if (
      person.name.trim() &&
      person.relationship.trim() &&
      person.address.trim() &&
      person.contactNumber.trim() &&
      person.yearsKnown.trim() &&
      person.validIdType &&
      person.validIdNumber.trim() &&
      person.placeIssued.trim() &&
      person.dateIssued &&
      person.signature instanceof File &&
      person.signature.size > 0 &&
      person.photo instanceof File &&
      person.photo.size > 0
    ) {
      hasValidAuthorizedPerson = true
    }
  })

  // if (!hasValidAuthorizedPerson) {
  //   errors.authorization =
  //     "At least one authorized person must have all required fields completed including signature and photo"
  // }

  return errors
}

/**
 * Validate cash card information for step six
 */
export const validateStepSixFields = (formData: FormData): Record<string, string> => {
  const errors: Record<string, string> = {}

  if (!formData.bankName.trim()) {
    errors.bankName = "Cash Card Bank name is required"
  }

  if (!formData.cardNumber.trim()) {
    errors.cardNumber = "Cash card number is required"
  } else if (formData.cardNumber.length < 10) {
    errors.cardNumber = "Card number must be at least 10 digits"
  }

  if (!formData.accountNumber.trim()) {
    errors.accountNumber = "Account number is required"
  } else if (formData.accountNumber.length < 8) {
    errors.accountNumber = "Account number must be at least 8 digits"
  }

  if (!formData.cardExpiryDate) {
    errors.cardExpiryDate = "Cash card expiry date is required"
  } else {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const expiryDate = new Date(formData.cardExpiryDate)
    expiryDate.setHours(0, 0, 0, 0)

    if (expiryDate <= today) {
      errors.cardExpiryDate = "Card expiry date must be in the future"
    }
  }

  return errors
}

/**
 * Enhanced error handler for API responses
 */
export const handleApiError = (error: any) => {
  let errorMessage = "An unexpected error occurred"
  const validationErrors: Record<string, string> = {}

  if (error.response) {
    const errorData = error.response.data as ApiErrorResponse
    if (errorData.message) {
      errorMessage = errorData.message
    }

    if (errorData.errors) {
      Object.entries(errorData.errors).forEach(([field, messages]) => {
        if (Array.isArray(messages) && messages.length > 0) {
          const formFieldName = mapApiFieldToFormField(field)
          validationErrors[formFieldName] = messages[0]
        }
      })
    }

    console.error("API Error Response:", {
      status: error.response.status,
      message: errorMessage,
      errors: errorData.errors,
      validationErrors,
    })

    const enhancedError = new Error(errorMessage) as any
    enhancedError.validationErrors = validationErrors
    enhancedError.status = error.response.status
    enhancedError.originalError = errorData

    throw enhancedError
  } else if (error.request) {
    errorMessage = "Network error: Unable to connect to server"
    console.error("Network Error:", error.request)

    const networkError = new Error(errorMessage) as any
    networkError.type = "network"
    throw networkError
  } else {
    errorMessage = error.message || "An unexpected error occurred"
    console.error("Unexpected Error:", error.message)

    throw new Error(errorMessage)
  }
}
