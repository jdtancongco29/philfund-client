import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createBorrowerBasicInfoApi,
  createBorrowerDependentsApi,
  createBorrowerAddressDetailsApi,
  createBorrowerWorkInfoApi,
  fetchCachedBorrowerProfileApi,
  getCachedFormData,
  mapApiFieldToFormField,
} from '../Services/AddBorrowersService'
import type {
  CreateBorrowerResponse,
  CachedBorrowerResponse,
  ValidationErrors,
} from '../Services/AddBorrowersTypes'

// Query keys
export const borrowerQueryKeys = {
  all: ['borrowers'] as const,
  cached: () => [...borrowerQueryKeys.all, 'cached'] as const,
  cachedFormData: () => [...borrowerQueryKeys.all, 'cached-form-data'] as const,
}

// Hook for creating borrower basic info (Step One)
export const useCreateBorrowerBasicInfo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createBorrowerBasicInfoApi,
    onSuccess: (data: CreateBorrowerResponse) => {
      queryClient.invalidateQueries({ queryKey: borrowerQueryKeys.cached() })
      queryClient.invalidateQueries({ queryKey: borrowerQueryKeys.cachedFormData() })
      
      toast.success(data.status, {
        description: data.message || "Basic information saved successfully",
        duration: 5000,
      })
    },
    onError: (error: any) => {
      console.error("Error saving basic info:", error)

      if (error.validationErrors && Object.keys(error.validationErrors).length > 0) {
        toast.error("Validation Error", {
          description: "Please correct the highlighted fields and try again",
          duration: 5000,
        })
      } else if (error.type === "network") {
        toast.error("Network Error", {
          description: "Unable to connect to server. Please check your internet connection.",
          duration: 5000,
        })
      } else {
        const errorMessage = error.message || "Failed to save basic information"
        toast.error("Error", {
          description: errorMessage,
          duration: 5000,
        })
      }
    },
  })
}

// Hook for creating borrower dependents (Step Two)
export const useCreateBorrowerDependents = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createBorrowerDependentsApi,
    onSuccess: (data: CreateBorrowerResponse) => {
      queryClient.invalidateQueries({ queryKey: borrowerQueryKeys.cached() })
      queryClient.invalidateQueries({ queryKey: borrowerQueryKeys.cachedFormData() })
      
      toast.success(data.status, {
        description: data.message || "Dependents information saved successfully",
        duration: 5000,
      })
    },
    onError: (error: any) => {
      console.error("Error saving dependents:", error)

      if (error.validationErrors && Object.keys(error.validationErrors).length > 0) {
        toast.error("Validation Error", {
          description: "Please correct the highlighted fields and try again",
          duration: 5000,
        })
      } else if (error.type === "network") {
        toast.error("Network Error", {
          description: "Unable to connect to server. Please check your internet connection.",
          duration: 5000,
        })
      } else {
        const errorMessage = error.message || "Failed to save dependents information"
        toast.error("Error", {
          description: errorMessage,
          duration: 5000,
        })
      }
    },
  })
}

// Hook for creating borrower address details (Step Three)
export const useCreateBorrowerAddressDetails = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createBorrowerAddressDetailsApi,
    onSuccess: (data: CreateBorrowerResponse) => {
      queryClient.invalidateQueries({ queryKey: borrowerQueryKeys.cached() })
      queryClient.invalidateQueries({ queryKey: borrowerQueryKeys.cachedFormData() })
      
      toast.success(data.status, {
        description: data.message || "Address details saved successfully",
        duration: 5000,
      })
    },
    onError: (error: any) => {
      console.error("Error saving address details:", error)

      if (error.validationErrors && Object.keys(error.validationErrors).length > 0) {
        toast.error("Validation Error", {
          description: "Please correct the highlighted fields and try again",
          duration: 5000,
        })
      } else if (error.type === "network") {
        toast.error("Network Error", {
          description: "Unable to connect to server. Please check your internet connection.",
          duration: 5000,
        })
      } else {
        const errorMessage = error.message || "Failed to save address details"
        toast.error("Error", {
          description: errorMessage,
          duration: 5000,
        })
      }
    },
  })
}

// Hook for creating borrower work information (Step Four)
export const useCreateBorrowerWorkInfo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createBorrowerWorkInfoApi,
    onSuccess: (data: CreateBorrowerResponse) => {
      queryClient.invalidateQueries({ queryKey: borrowerQueryKeys.cached() })
      queryClient.invalidateQueries({ queryKey: borrowerQueryKeys.cachedFormData() })
      
      toast.success(data.status, {
        description: data.message || "Work information saved successfully",
        duration: 5000,
      })
    },
    onError: (error: any) => {
      console.error("Error saving work information:", error)

      if (error.validationErrors && Object.keys(error.validationErrors).length > 0) {
        toast.error("Validation Error", {
          description: "Please correct the highlighted fields and try again",
          duration: 5000,
        })
      } else if (error.type === "network") {
        toast.error("Network Error", {
          description: "Unable to connect to server. Please check your internet connection.",
          duration: 5000,
        })
      } else {
        const errorMessage = error.message || "Failed to save work information"
        toast.error("Error", {
          description: errorMessage,
          duration: 5000,
        })
      }
    },
  })
}

// Hook for fetching cached borrower profile
export const useCachedBorrowerProfile = () => {
  return useQuery({
    queryKey: borrowerQueryKeys.cached(),
    queryFn: fetchCachedBorrowerProfileApi,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404 || error?.response?.status === 422) {
        return false
      }
      return failureCount < 3
    },
  })
}

// Hook for fetching cached form data
export const useCachedFormData = () => {
  return useQuery({
    queryKey: borrowerQueryKeys.cachedFormData(),
    queryFn: getCachedFormData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404 || error?.response?.status === 422) {
        return false
      }
      return failureCount < 3
    },
  })
}

// Custom hook for handling validation errors from mutations
export const useValidationErrors = () => {
  const extractValidationErrors = (error: any): ValidationErrors => {
    if (error?.validationErrors) {
      return error.validationErrors
    }

    if (error?.response?.data?.errors) {
      const validationErrors: ValidationErrors = {}
      Object.entries(error.response.data.errors).forEach(([field, messages]) => {
        if (Array.isArray(messages) && messages.length > 0) {
          const formFieldName = mapApiFieldToFormField(field)
          validationErrors[formFieldName] = messages[0]
        }
      })
      return validationErrors
    }

    return {}
  }

  return { extractValidationErrors }
}

// Hook for managing borrower form state with mutations
export const useBorrowerForm = () => {
  const createBasicInfoMutation = useCreateBorrowerBasicInfo()
  const createDependentsMutation = useCreateBorrowerDependents()
  const createAddressDetailsMutation = useCreateBorrowerAddressDetails()
  const createWorkInfoMutation = useCreateBorrowerWorkInfo()
  const { data: cachedProfile, isLoading: isCachedProfileLoading } = useCachedBorrowerProfile()
  const { data: cachedFormData, isLoading: isCachedFormDataLoading } = useCachedFormData()
  const { extractValidationErrors } = useValidationErrors()

  const isLoading = createBasicInfoMutation.isPending || 
                   createDependentsMutation.isPending || 
                   createAddressDetailsMutation.isPending ||
                   createWorkInfoMutation.isPending
  const isCacheLoading = isCachedProfileLoading || isCachedFormDataLoading

  return {
    // Mutations
    createBasicInfo: createBasicInfoMutation,
    createDependents: createDependentsMutation,
    createAddressDetails: createAddressDetailsMutation,
    createWorkInfo: createWorkInfoMutation,
    
    // Cached data
    cachedProfile,
    cachedFormData,
    
    // Loading states
    isLoading,
    isCacheLoading,
    
    // Utilities
    extractValidationErrors,
    
    // Helper functions
    getEnabledTabs: (cachedProfile: CachedBorrowerResponse | undefined) => {
      const enabledTabs = ["basic-info"] // Basic info is always enabled

      if (cachedProfile?.status === "FETCHED" && cachedProfile.data) {
        // If we have step_1 data, enable dependents tab
        if (cachedProfile.data.step_1) {
          enabledTabs.push("dependents")
        }

        // If we have step_2 data, enable address-details tab
        if (cachedProfile.data.step_2) {
          enabledTabs.push("address-details")
        }

        // If we have step_3 data, enable work-information tab
        if (cachedProfile.data.step_3) {
          enabledTabs.push("work-information")
        }

        // If we have step_4 data, enable authorization tab
        if (cachedProfile.data.step_4) {
          enabledTabs.push("authorization")
        }
      }

      return enabledTabs
    },
  }
}
