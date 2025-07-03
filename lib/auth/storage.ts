import type { Admin } from "@/lib/types/auth"

export class AuthStorage {
  private static readonly TOKEN_KEY = "auth_token"
  private static readonly REFRESH_TOKEN_KEY = "refresh_token"
  private static readonly USER_DATA_KEY = "user_data"

  static setTokens(token: string, refreshToken: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.TOKEN_KEY, token)
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken)
    }
  }

  static getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.TOKEN_KEY)
    }
    return null
  }

  static getRefreshToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY)
    }
    return null
  }

  static setUserData(userData: Admin): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData))
    }
  }

  static getUserData(): Admin | null {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem(this.USER_DATA_KEY)
      return userData ? JSON.parse(userData) : null
    }
    return null
  }

  static clearAll(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.TOKEN_KEY)
      localStorage.removeItem(this.REFRESH_TOKEN_KEY)
      localStorage.removeItem(this.USER_DATA_KEY)
    }
  }

  static isAuthenticated(): boolean {
    return !!this.getToken()
  }
}
