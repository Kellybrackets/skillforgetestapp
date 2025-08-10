"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Eye, EyeOff, UserPlus, Info } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"

function RegisterPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const authData = useAuth()
  
  // Add debugging and safe destructuring
  console.log('📝 Register page auth data:', authData)
  console.log('📝 Available auth methods:', Object.keys(authData))
  
  const { 
    signUp, 
    user, 
    loading: authLoading, 
    isAuthenticated, 
    initialized 
  } = authData
  
  // Check if signUp exists
  if (!signUp) {
    console.error('❌ signUp method not available in auth data')
  }
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Get redirect URL from query params
  const redirectTo = searchParams.get('redirectTo') || '/quiz'

  // Set mounted flag
  useEffect(() => {
    setMounted(true)
    console.log('📝 Register page mounted')
  }, [])

  // Debug auth state
  useEffect(() => {
    console.log('📝 Register auth state:', { 
      mounted, 
      authLoading, 
      initialized, 
      isAuthenticated, 
      hasUser: !!user 
    })
  }, [mounted, authLoading, initialized, isAuthenticated, user])

  // Redirect authenticated users
  useEffect(() => {
    if (mounted && initialized && isAuthenticated && !authLoading && !isLoading && !emailSent) {
      console.log('User already authenticated, redirecting to:', redirectTo)
      router.push(redirectTo)
    }
  }, [mounted, initialized, isAuthenticated, authLoading, isLoading, emailSent, router, redirectTo])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear errors when user starts typing
    if (error) setError("")
  }

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError("Full name is required")
      return false
    }
    
    if (formData.fullName.trim().length < 2) {
      setError("Full name must be at least 2 characters long")
      return false
    }
    
    if (!formData.email.trim()) {
      setError("Email address is required")
      return false
    }
    
    // Enhanced email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      return false
    }
    
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      return false
    }
    
    // Enhanced password validation
    const hasUpperCase = /[A-Z]/.test(formData.password)
    const hasLowerCase = /[a-z]/.test(formData.password)
    const hasNumbers = /\d/.test(formData.password)
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      setError("Password must contain at least one uppercase letter, one lowercase letter, and one number")
      return false
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    
    console.log("📝 Starting registration process...")
    
    if (!validateForm()) return

    setIsLoading(true)

    try {
      const { data, error: authError } = await signUp(
        formData.email,
        formData.password,
        formData.fullName
      )

      if (authError) {
        console.error("❌ Registration error:", authError)
        
        // Handle specific error cases
        if (authError.message.includes('already exists') || 
            authError.message.includes('already registered') ||
            authError.message.includes('User already registered')) {
          setError("An account with this email already exists. Would you like to log in instead?")
        } else if (authError.message.includes('Invalid email')) {
          setError("Please enter a valid email address")
        } else if (authError.message.includes('Password') || authError.message.includes('password')) {
          setError("Password does not meet requirements. Please ensure it's at least 8 characters long.")
        } else if (authError.message.includes('rate limit') || authError.message.includes('too many')) {
          setError("Too many registration attempts. Please wait a few minutes before trying again.")
        } else {
          setError(authError.message || "Registration failed. Please try again.")
        }
        return
      }

      if (data.user) {
        console.log("✅ Registration successful!")
        
        // Check if email confirmation is required
        if (!data.user.email_confirmed_at) {
          setEmailSent(true)
          setSuccess(
            "Registration successful! We've sent a confirmation email to your address. " +
            "Please check your inbox and click the confirmation link to complete your registration."
          )
          
          // Don't redirect immediately, show success message
          setTimeout(() => {
            setSuccess(prev => prev + " You can close this page and return after confirming your email.")
          }, 3000)
        } else {
          // Email is already confirmed (auto-confirm enabled)
          setSuccess("Registration successful! Redirecting to your dashboard...")
          setTimeout(() => {
            console.log("🚀 Redirecting after successful registration to:", redirectTo)
            router.push(redirectTo)
          }, 2000)
        }
      }

    } catch (err: any) {
      console.error("💥 Registration error:", err)
      setError('An unexpected error occurred during registration. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading while checking auth state
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
          <span>Mounting...</span>
        </div>
      </div>
    )
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
          <span>Loading auth...</span>
        </div>
      </div>
    )
  }

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
          <span>Initializing...</span>
        </div>
      </div>
    )
  }

  if (isAuthenticated && !emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin h-6 w-6 border-2 border-green-600 border-t-transparent rounded-full"></div>
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <Card className="w-full max-w-md animate-slide-up">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <UserPlus className="h-6 w-6" />
            Create Account
          </CardTitle>
          <CardDescription className="text-center">
            Sign up for your SkillForge account to start learning
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error}
                  {error.includes('already exists') && (
                    <div className="mt-2">
                      <Link href={`/login${redirectTo !== '/quiz' ? `?redirectTo=${redirectTo}` : ''}`} 
                            className="text-sm underline hover:no-underline">
                        Go to login page
                      </Link>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className={emailSent ? "border-blue-200 bg-blue-50" : ""}>
                {emailSent ? <Info className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                <AlertDescription className="text-sm leading-relaxed">
                  {success}
                </AlertDescription>
              </Alert>
            )}
            
            {!emailSent && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="input-focus"
                    autoComplete="name"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="input-focus"
                    autoComplete="email"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="input-focus pr-10"
                      autoComplete="new-password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters with uppercase, lowercase, and numbers
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="input-focus pr-10"
                      autoComplete="new-password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            {!emailSent ? (
              <>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
                
                <p className="text-sm text-center text-muted-foreground">
                  Already have an account?{" "}
                  <Link 
                    href={`/login${redirectTo !== '/quiz' ? `?redirectTo=${redirectTo}` : ''}`} 
                    className="text-primary hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </>
            ) : (
              <div className="text-center space-y-3">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/login">
                    Go to Login Page
                  </Link>
                </Button>
                <p className="text-xs text-muted-foreground">
                  Didn't receive the email? Check your spam folder or try registering again in a few minutes.
                </p>
              </div>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterPageInner />
    </Suspense>
  )
}