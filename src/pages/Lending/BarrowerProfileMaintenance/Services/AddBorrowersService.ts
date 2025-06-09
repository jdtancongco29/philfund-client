import { apiRequest } from "@/lib/api"
import type {
  ApiErrorResponse,
  CachedBorrowerResponse,
  CachedBorrowerStep1,
  CreateBorrowerRequest,
  CreateBorrowerResponse,
  FormData,
  CachedBorrowerStep2,
  Dependent,
} from "./AddBorrowersTypes"

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
    bi_critical_health_condition: null, // Not mapped from form data
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
 * Transform dependents data to step-two API request format
 */
export const transformDependentsToRequest = (formData: FormData) => {
  const formatDate = (date: Date | undefined): string | null => {
    if (!date) return null
    return date.toISOString().split("T")[0]
  }

  // Filter out empty dependents and format the data
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
 * Submit dependents data (Step Two)
 */
export const createBorrowerDependents = async (formData: FormData): Promise<CreateBorrowerResponse> => {
  const endpoint = "/borrower-profile/step-two"

  try {
    const payload = transformDependentsToRequest(formData)

    const response = await apiRequest<CreateBorrowerResponse>("post", endpoint, payload, {
      useAuth: true,
      useBranchId: true,
    })

    return response.data
  } catch (error: any) {
    let errorMessage = "Failed to save dependents information"
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
}

/**
 * Fetch cached borrower profile data
 */
export const fetchCachedBorrowerProfile = async (): Promise<CachedBorrowerResponse> => {
  const endpoint = "/borrower-profile/cached"

  try {
    const response = await apiRequest<CachedBorrowerResponse>("get", endpoint, undefined, {
      useAuth: true,
      useBranchId: true,
    })

    return response.data
  } catch (error: any) {
    let errorMessage = "Failed to fetch cached borrower profile"

    if (error.response) {
      const errorData = error.response.data as ApiErrorResponse
      if (errorData.message) {
        errorMessage = errorData.message
      }

      console.error("API Error Response:", {
        status: error.response.status,
        message: errorMessage,
        errors: errorData.errors,
      })

      const enhancedError = new Error(errorMessage) as any
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
}

/**
 * Fetch cached data and transform to form format
 */
export const getCachedFormData = async (): Promise<Partial<FormData> | null> => {
  try {
    const cachedResponse = await fetchCachedBorrowerProfile()

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

      return formData
    }

    return null
  } catch (error) {
    console.error("Error fetching cached form data:", error)
    return null
  }
}

export const transformCachedStep1ToFormData = (cachedData: CachedBorrowerStep1): Partial<FormData> => {
  // Helper function to parse date
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
  // Helper function to parse date
  const parseDate = (dateString: string): Date | undefined => {
    if (!dateString) return undefined
    return new Date(dateString)
  }

  // Transform cached dependents to form format
  const transformedDependents: Dependent[] = cachedData.dependents.map((dep, index) => ({
    id: (index + 1).toString(),
    name: dep.name,
    birthdate: parseDate(dep.birthdate),
  }))

  // Ensure we always have at least 3 dependent slots (pad with empty ones if needed)
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

/**
 * Create borrower basic info (Step One) with comprehensive error handling
 */
export const createBorrowerBasicInfo = async (
  formData: FormData,
  branchId: string,
  borrowerCode: string,
): Promise<CreateBorrowerResponse> => {
  const endpoint = "/borrower-profile/step-one"

  try {
    const payload = transformFormDataToRequest(formData, branchId, borrowerCode)

    const response = await apiRequest<CreateBorrowerResponse>("post", endpoint, payload, {
      useAuth: true,
      useBranchId: true,
    })

    return response.data
  } catch (error: any) {
    let errorMessage = "Failed to create borrower basic info"
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
}

/**
 * Map API field names to form field names
 */
const mapApiFieldToFormField = (apiField: string): string => {
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

  // Validate spouse information if married
  if (formData.civilStatus.toLowerCase() === "married") {
    if (!formData.spouseName?.trim()) {
      errors.spouseName = "Spouse name is required for married borrowers"
    }
  }

  // Validate birth date is not in the future
  if (formData.birthDate && formData.birthDate > new Date()) {
    errors.birthDate = "Birth date cannot be in the future"
  }

  // Validate date of death is after birth date
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

  formData.dependents.forEach((dep, index) => {
    const trimmedName = dep.name.trim()

    if (!trimmedName) {
      errors[`${dep.id}_name`] = "Name is required"
    }

    if (!dep.birthdate) {
      errors[`${dep.id}_birthdate`] = "Birthdate is required"
    } else {
      // Validate birthdate is not in the future
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const birthdate = new Date(dep.birthdate)
      birthdate.setHours(0, 0, 0, 0)

      if (birthdate > today) {
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
