"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { AuthAPI } from "@/lib/api/auth"
import { AuthStorage } from "@/lib/auth/storage"
import type { Admin, LoginRequest } from "@/lib/types/auth"
import { toast } from "@/hooks/use-toast"

interface AuthContextType {
  user: Admin | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<boolean>
  logout: () => Promise<void>
  refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Admin | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      const token = AuthStorage.getToken()
      const userData = AuthStorage.getUserData()

      if (token && userData) {
        // Validate token
        const isValid = await AuthAPI.validateToken()
        if (isValid) {
          setUser(userData)
        } else {
          AuthStorage.clearAll()
        }
      }
    } catch (error) {
      console.error("Auth initialization error:", error)
      AuthStorage.clearAll()
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await AuthAPI.login(credentials)

      if (response.success && response.data) {
        const { admin, token, refreshToken } = response.data

        AuthStorage.setTokens(token, refreshToken)
        AuthStorage.setUserData(admin)
        setUser(admin)

        toast({
          title: "Success",
          description: response.message,
        })

        return true
      }

      return false
    } catch (error: any) {
      console.error("Login error:", error)
      toast({
        title: "Login Failed",
        description: error.response?.data?.message || "Invalid credentials",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await AuthAPI.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      AuthStorage.clearAll()
      setUser(null)
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      })
    }
  }

  const refreshAuth = async (): Promise<void> => {
    try {
      const response = await AuthAPI.refreshToken()
      if (response.success && response.data) {
        AuthStorage.setTokens(response.data.token, response.data.refreshToken)
      }
    } catch (error) {
      console.error("Token refresh error:", error)
      await logout()
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
