"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api"
import Cookies from "js-cookie"

type Module = {
  id: string
  name: string
}

type Permission = {
  user_id: string
  module: Module
  can_edit: boolean
  can_delete: boolean
  can_add: boolean
  can_access: boolean
  can_print: boolean
  can_void: boolean
  can_export: boolean
}

type PermissionResponse = {
  status: string
  message: string
  data: Permission[]
}

type PermissionContextType = {
  permissions: Permission[]
  loading: boolean
  error: string | null
  refetchPermissions: () => void
  userId: string | null
}

type Props = {
  children: React.ReactNode
}

const PermissionContext = createContext<PermissionContextType | null>(null)

// Get user ID from cookies or localStorage
const getUserId = (): string | null => {
  try {
    // Try to get from cookie first
    const userCookie = Cookies.get("user")
    if (userCookie) {
      const userData = JSON.parse(userCookie)
      return userData.id || userData.user_id || null
    }

    // Fallback to localStorage
    const userLocal = localStorage.getItem("user")
    if (userLocal) {
      const userData = JSON.parse(userLocal)
      return userData.id || userData.user_id || null
    }

    return null
  } catch (error) {
    console.error("Failed to get user ID:", error)
    return null
  }
}

// Permission service
const PermissionService = {
  getUserPermissions: async (userId: string): Promise<PermissionResponse> => {
    const response = await apiRequest<PermissionResponse>("get", `/user/permission/${userId}`, null, {
      useAuth: true,
      useBranchId: true,
    })
    return response.data
  },
}

export const PermissionProvider = ({ children }: Props) => {
  const [userId, setUserId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  // Get user ID on mount
  useEffect(() => {
    const id = getUserId()
    setUserId(id)
  }, [])

  // Fetch permissions using React Query
  const {
    data: permissionData,
    isLoading,
    error,
    // refetch,
  } = useQuery({
    queryKey: ["user-permissions", userId],
    queryFn: () => PermissionService.getUserPermissions(userId!),
    enabled: !!userId, // Only run query if userId exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  // Mutation for refreshing permissions manually
  const refreshPermissionsMutation = useMutation({
    mutationFn: () => PermissionService.getUserPermissions(userId!),
    onSuccess: (data) => {
      // Update the cache with new data
      queryClient.setQueryData(["user-permissions", userId], data)
    },
    onError: (error) => {
      console.error("Failed to refresh permissions:", error)
    },
  })

  const permissions = permissionData?.data || []
  const loading = isLoading || refreshPermissionsMutation.isPending
  const errorMessage = error?.message || refreshPermissionsMutation.error?.message || null

  const refetchPermissions = () => {
    if (userId) {
      refreshPermissionsMutation.mutate()
    }
  }

  return (
    <PermissionContext.Provider
      value={{
        permissions,
        loading,
        error: errorMessage,
        refetchPermissions,
        userId,
      }}
    >
      {children}
    </PermissionContext.Provider>
  )
}

export const usePermissions = () => {
  const context = useContext(PermissionContext)

  if (!context) {
    throw new Error("usePermissions must be used within a PermissionProvider")
  }

  return context
}

// Utility hooks for common permission checks
export const useModulePermissions = (moduleName: string) => {
  const { permissions, loading, error } = usePermissions()

  const modulePermission = permissions.find((p) => p.module.name === moduleName)

  return {
    permissions: modulePermission,
    loading,
    error,
    hasAccess: modulePermission?.can_access ?? false,
    canAdd: modulePermission?.can_add ?? false,
    canEdit: modulePermission?.can_edit ?? false,
    canDelete: modulePermission?.can_delete ?? false,
    canExport: modulePermission?.can_export ?? false,
    canPrint: modulePermission?.can_print ?? false,
    canVoid: modulePermission?.can_void ?? false,
  }
}

// Hook for checking specific permissions
export const useHasPermission = (moduleName: string, permission: keyof Omit<Permission, "user_id" | "module">) => {
  const { permissions } = usePermissions()

  const modulePermission = permissions.find((p) => p.module.name === moduleName)
  return modulePermission?.[permission] ?? false
}