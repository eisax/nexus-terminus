import axios, { type AxiosInstance, type AxiosResponse } from "axios"
import { toast } from "@/hooks/use-toast"

// Create axios instance with default config
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL:  "http://localhost:3000",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  })

  // Request interceptor to add auth token
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("auth_token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    },
  )

  // Response interceptor for error handling and token refresh
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response
    },
    async (error) => {
      const originalRequest = error.config

      // Handle 401 errors (unauthorized)
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          const refreshToken = localStorage.getItem("refresh_token")
          if (refreshToken) {
            const response = await axios.post(
              `http://localhost:3000/api/v1/auth/refresh-token`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${refreshToken}`,
                },
              },
            )

            if (response.data.success && response.data.data) {
              localStorage.setItem("auth_token", response.data.data.token)
              localStorage.setItem("refresh_token", response.data.data.refreshToken)
              originalRequest.headers.Authorization = `Bearer ${response.data.data.token}`
              return client(originalRequest)
            }
          }
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem("auth_token")
          localStorage.removeItem("refresh_token")
          localStorage.removeItem("user_data")
          window.location.href = "/signin"
          return Promise.reject(refreshError)
        }
      }

      // Handle other errors
      if (error.response?.data?.message) {
        toast({
          title: "Error",
          description: error.response.data.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
      }

      return Promise.reject(error)
    },
  )

  return client
}

export const apiClient = createApiClient()
