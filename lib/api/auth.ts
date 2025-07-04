
import type { LoginRequest, LoginResponse, LogoutResponse, RefreshTokenResponse } from "@/lib/types/auth"
import { apiClient } from "./client"

export class AuthAPI {
  private static readonly BASE_PATH = "/api/v1/auth"

  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(`${this.BASE_PATH}/login`, credentials)
    return response.data
  }

  static async logout(): Promise<LogoutResponse> {
    const response = await apiClient.post<LogoutResponse>(`${this.BASE_PATH}/logout`)
    return response.data
  }

  static async refreshToken(): Promise<RefreshTokenResponse> {
    const refreshToken = localStorage.getItem("refresh_token")
    const response = await apiClient.post<RefreshTokenResponse>(
      `${this.BASE_PATH}/refresh-token`,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      },
    )
    return response.data
  }

//   static async validateToken(): Promise<boolean> {
//     try {
//       const token = localStorage.getItem("auth_token")
//       if (!token) return false

//       // You can add a validate endpoint or just try to make an authenticated request
//       const response = await apiClient.get("/api/v1/auth/me")
//       return response.status === 200
//     } catch {
//       return false
//     }
//   }


  static async validateToken(): Promise<boolean> {
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) return false

      // Try to refresh the token to validate it
      const refreshResponse = await this.refreshToken()
      
      // If refresh is successful, update the stored tokens
      if (refreshResponse.success && refreshResponse.data) {
        localStorage.setItem("auth_token", refreshResponse.data.token)
        localStorage.setItem("refresh_token", refreshResponse.data.refreshToken)
        return true
      }
      
      return false
    } catch {
      return false
    }
  }
}