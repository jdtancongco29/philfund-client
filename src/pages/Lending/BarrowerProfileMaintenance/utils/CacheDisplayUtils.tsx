import { CachedBorrowerResponse } from "../Services/AddBorrowersTypes"


/**
 * Format cached dependents data for display
 */
export const formatCachedDependents = (cachedResponse: CachedBorrowerResponse): string => {
  if (!cachedResponse.data?.step_2?.dependents) {
    return "No dependents data cached"
  }

  const dependents = cachedResponse.data.step_2.dependents
  const validDependents = dependents.filter((dep) => dep.name.trim())

  if (validDependents.length === 0) {
    return "No valid dependents found in cache"
  }

  return `${validDependents.length} dependent(s) loaded from cache: ${validDependents
    .map((dep) => dep.name)
    .join(", ")}`
}

/**
 * Calculate age from birthdate string
 */
export const calculateAge = (birthdate: string): number => {
  const today = new Date()
  const birth = new Date(birthdate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age
}

/**
 * Format dependent information for display
 */
export const formatDependentInfo = (dependent: { name: string; birthdate: string }): string => {
  const age = calculateAge(dependent.birthdate)
  return `${dependent.name} (Age: ${age})`
}

/**
 * Validate cached dependents data
 */
export const validateCachedDependents = (
  cachedResponse: CachedBorrowerResponse,
): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} => {
  const errors: string[] = []
  const warnings: string[] = []

  if (!cachedResponse.data?.step_2?.dependents) {
    return { isValid: true, errors, warnings }
  }

  const dependents = cachedResponse.data.step_2.dependents

  dependents.forEach((dep, index) => {
    if (!dep.name.trim()) {
      warnings.push(`Dependent ${index + 1}: Name is empty`)
    }

    if (!dep.birthdate) {
      errors.push(`Dependent ${index + 1}: Birthdate is missing`)
    } else {
      const birthDate = new Date(dep.birthdate)
      const today = new Date()

      if (birthDate > today) {
        errors.push(`Dependent ${index + 1}: Birthdate cannot be in the future`)
      }

      const age = calculateAge(dep.birthdate)
      if (age > 100) {
        warnings.push(`Dependent ${index + 1}: Age (${age}) seems unusually high`)
      }
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}
