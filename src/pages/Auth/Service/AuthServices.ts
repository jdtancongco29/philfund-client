import { apiRequest } from "@/lib/api"

export const AuthService = {
  /**
   * Logout user
   */
  logout: async (): Promise<{ status: string; message: string }> => {
    const endpoint = "/logout"
    const response = await apiRequest<{ status: string; message: string }>(
      "post",
      endpoint,
      {},
      {
        useAuth: true,
        useBranchId: true,
      },
    )

    return response.data
  },
}

export default AuthService
