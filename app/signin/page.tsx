"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, ArrowRight, Mail, Lock, MapPin } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/lib/auth/context"
import { useRouter } from "next/navigation"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const { login, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const success = await login({ email, password })

    if (success) {
      router.push("/")
    }
  }

  // Show loading spinner if already authenticated
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-primary/10 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/15 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-3/4 left-1/3 w-64 h-64 bg-primary/8 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Geometric pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-4 h-4 bg-primary rotate-45"></div>
        <div className="absolute top-20 right-20 w-3 h-3 bg-primary rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-2 h-8 bg-primary"></div>
        <div className="absolute bottom-10 right-10 w-6 h-6 bg-primary rotate-45"></div>
        <div className="absolute top-1/2 left-5 w-1 h-12 bg-primary"></div>
        <div className="absolute top-1/3 right-5 w-5 h-5 bg-primary rounded-full"></div>
      </div>

      <Card className="relative w-full max-w-md bg-card/95 backdrop-blur-sm border-primary/20 shadow-2xl animate-pulse-glow">
        <div className="p-8 space-y-8">
          {/* Header with Logo */}
          <div className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 relative mb-6">
              <Image src="/logo.png" alt="Nexus Terminus Logo" width={80} height={80} className="object-contain" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Nexus Terminus</h1>
              <h2 className="text-xl font-semibold text-primary mb-3">Welcome Back</h2>
              <p className="text-muted-foreground flex items-center justify-center gap-2">
                <MapPin className="h-4 w-4" />
                Indoor Navigation & Mapping Platform
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail
                    className={`h-4 w-4 transition-colors ${
                      focusedField === "email" ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                  }}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="superadmin@kingsman.com"
                  className={`pl-10 h-12 transition-all duration-200 bg-background/50 ${
                    errors.email
                      ? "border-destructive focus:border-destructive focus:ring-destructive"
                      : "border-border focus:border-primary focus:ring-primary"
                  } ${focusedField === "email" ? "shadow-lg shadow-primary/20" : ""}`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive animate-in slide-in-from-left-1 duration-200">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock
                    className={`h-4 w-4 transition-colors ${
                      focusedField === "password" ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
                  }}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  className={`pl-10 pr-12 h-12 transition-all duration-200 bg-background/50 ${
                    errors.password
                      ? "border-destructive focus:border-destructive focus:ring-destructive"
                      : "border-border focus:border-primary focus:ring-primary"
                  } ${focusedField === "password" ? "shadow-lg shadow-primary/20" : ""}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive animate-in slide-in-from-left-1 duration-200">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg hover:shadow-xl transition-all duration-200 group"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Access Platform
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
            <p className="text-sm text-foreground text-center">
              <span className="font-medium text-primary">Demo Access:</span>
              <br />
              superadmin@kingsman.com / admin123456
            </p>
          </div>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">© 2024 Nexus Terminus. Secure Indoor Navigation Platform.</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
