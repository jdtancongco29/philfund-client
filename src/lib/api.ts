// src/lib/api.ts
import axios from "axios";
import Cookies from "js-cookie";
const API_URL = import.meta.env.VITE_API_URL;
interface ApiOptions {
  useAuth?: boolean // Enables Authorization: Bearer <token>
  useBranchId?: boolean // Enables X-Branch-Id from cookie
  customHeaders?: Record<string, string> // Custom headers
  responseType?: XMLHttpRequestResponseType
}

// Get token from cookies
const getToken = (): string | undefined => {
  const token = Cookies.get("authToken")
  return token
}

// Get branch ID from user cookie
export const getBranchId = (): string | undefined => {
  try {
    const raw = Cookies.get("current_branch")

    if (!raw) return undefined

    // Strip quotes if value is a JSON string
    const currentBranch = raw.replace(/^"|"$/g, "")
    return currentBranch
  } catch (error) {
    console.error("Failed to parse user cookie:", error)
    return undefined
  }
}

export const getCode = (): string | undefined => {
  try {
    const raw = Cookies.get("code")

    if (!raw) return undefined

    // Strip quotes if value is a JSON string
    const currentBranch = raw.replace(/^"|"$/g, "")
    return currentBranch
  } catch (error) {
    console.error("Failed to parse user cookie:", error)
    return undefined
  }
}

// Main API request function
export const apiRequest = async <T = any>(
  method: "get" | "post" | "put" | "delete",
  endpoint: string,
  data: any = null,
  options: ApiOptions = {},
) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  }

  if (options.useAuth) {
    const token = getToken()
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    } else {
      console.warn("No token found in cookies.")
    }
  }

  if (options.useBranchId) {
    const branchId = getBranchId()
    if (branchId) {
      headers["X-Branch-Id"] = branchId
    }
  }

  if (options.customHeaders) {
    Object.entries(options.customHeaders).forEach(([key, value]) => {
      headers[key] = value
    })
  }

  const fullUrl = `${API_URL}${endpoint}`
  const config = {
    method,
    url: fullUrl,
    headers,
    data,
    responseType: options.responseType || "json",
  }

  return axios.request<T>(config)
}
