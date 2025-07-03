export interface LoginRequest {
  email: string
  password: string
}

export interface Admin {
  id: number
  firstName: string
  lastName: string
  email: string
  avatar: string | null
  isActive: boolean
  lastLoginAt: string
  roles: Role[]
  createdAt: string | null
  updatedAt: string
}

export interface Role {
  id: number
  name: string
  description: string
}

export interface LoginResponse {
  success: boolean
  message: string
  data: {
    admin: Admin
    token: string
    refreshToken: string
  }
}

export interface LogoutResponse {
  success: boolean
  message: string
}

export interface RefreshTokenResponse {
  success: boolean
  message: string
  data?: {
    token: string
    refreshToken: string
  }
}

export interface ApiError {
  success: false
  message: string
  errors?: Record<string, string[]>
}
