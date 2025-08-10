"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Briefcase, BookOpen, Lightbulb, AlertCircle, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { hasUserCompletedQuiz } from "@/lib/quiz"

function LoginPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn, isAuthenticated, loading, initialized, user } = useAuth()
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // Get redirect URL from search params
  const redirectToParam = searchParams.get('redirectTo')

  // Set mounted flag
  useEffect(() => {
    setMounted(true)
  }, [])

// Cache quiz results to prevent repeated database calls
const quizCheckCache = new Map<string, boolean>()

const checkQuizCompletion = async (userId?: string): Promise<boolean> => {
  console.log('🔍 Checking quiz completion for user:', userId)
  
  // Return cached result if available
  if (userId && quizCheckCache.has(userId)) {
    const cached = quizCheckCache.get(userId)!
    console.log('📋 Using cached quiz result:', cached)
    return cached
  }
  
  // Check localStorage first (fast and reliable)
  try {
    const localQuizResults = localStorage.getItem("quizResults")
    if (localQuizResults) {
      const results = JSON.parse(localQuizResults)
      console.log('📱 Parsed quiz results keys:', Object.keys(results))
      
      const isComplete = !!(
        results.badge ||
        results.analysis ||
        results.completedAt ||
        results.answers ||
        (typeof results.score === 'number') ||
        results.skillLevels ||
        results.summary
      )
      
      if (isComplete) {
        console.log('✅ Quiz completed (localStorage)')
        if (userId) quizCheckCache.set(userId, true) // Cache the result
        return true
      }
    } else {
      console.log('📱 No quiz results in localStorage')
    }
  } catch (error) {
    console.error('❌ localStorage check failed:', error)
  }
  
  // Check database if localStorage doesn't show completion
  if (userId) {
    try {
      console.log('🔍 Checking database for quiz completion...')
      const hasCompleted = await hasUserCompletedQuiz(userId)
      console.log('📊 Database quiz check result:', hasCompleted)
      quizCheckCache.set(userId, hasCompleted) // Cache the result
      return hasCompleted
    } catch (error) {
      console.error('❌ Database quiz check failed:', error)
      quizCheckCache.set(userId, false) // Cache false result to prevent repeated failures
    }
  }
  
  console.log('❌ Quiz not completed')
  return false
}

  // Function to determine where to redirect after login
  const getRedirectDestination = async (userId?: string): Promise<string> => {
    console.log('🎯 Determining redirect destination...')
    console.log('📍 redirectToParam:', redirectToParam)
    console.log('👤 User ID:', userId)
    
    // If there's a specific redirect param and it's not settings/profile, use it
    if (redirectToParam && 
        !redirectToParam.includes('/settings') && 
        !redirectToParam.includes('/profile')) {
      console.log('🔗 Using redirect parameter:', redirectToParam)
      return redirectToParam
    }
    
    // Check quiz completion using our improved logic
    const quizCompleted = await checkQuizCompletion(userId)
    
    if (quizCompleted) {
      console.log('✅ Quiz completed, redirecting to dashboard')
      return '/dashboard'
    } else {
      console.log('📋 Quiz not completed, redirecting to quiz')
      return '/quiz'
    }
  }

  // Handle already authenticated users
  useEffect(() => {
    if (mounted && initialized && !loading && isAuthenticated && user?.id) {
      console.log('🔄 Already authenticated, determining redirect...')
      
      getRedirectDestination(user.id).then(destination => {
        console.log('🚀 Redirecting to:', destination)
        router.push(destination)
      }).catch(error => {
        console.error('Error determining redirect:', error)
        // Fallback to quiz
        router.push('/quiz')
      })
    }
  }, [mounted, initialized, loading, isAuthenticated, user, router])

  // Show URL errors
  useEffect(() => {
    if (!mounted) return
    
    const urlError = searchParams.get('error')
    if (urlError) {
      switch (urlError) {
        case 'session_expired':
          setError('Your session has expired. Please log in again.')
          break
        case 'session_timeout':
          setError('Your session timed out. Please log in again.')
          break
        default:
          setError('Please log in to continue.')
      }
    }
  }, [mounted, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    console.log("🔐 Starting login process")

    try {
      const { data, error: authError } = await signIn(email, password)

      if (authError) {
        console.error("❌ Login failed:", authError.message)
        
        if (authError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password.')
        } else if (authError.message.includes('Email not confirmed')) {
          setError('Please confirm your email address first.')
        } else if (authError.message.includes('Too many requests')) {
          setError('Too many attempts. Please wait before trying again.')
        } else {
          setError(authError.message || 'Login failed.')
        }
        setIsLoading(false)
        return
      }

      if (data?.user) {
        console.log("✅ Login successful, got user data:", data.user.id)
        
        // Use the user data from the login response directly
        const loggedInUser = data.user
        
        // Give a moment for the auth state to update, then redirect
        setTimeout(async () => {
          try {
            console.log('🔍 Checking quiz completion for user:', loggedInUser.id)
            const destination = await getRedirectDestination(loggedInUser.id)
            console.log("🚀 Redirecting to:", destination)
            router.push(destination)
          } catch (error) {
            console.error('Error determining redirect after login:', error)
            router.push('/quiz') // Fallback
          }
        }, 100)
      }

    } catch (err: any) {
      console.error("💥 Login exception:", err)
      setError("Login failed. Please try again.")
      setIsLoading(false)
    }
  }

  // Show loading while checking auth state
  if (!mounted || loading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  // Don't show form if already authenticated (prevents flash)
  if (isAuthenticated) {
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
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-col md:flex-row flex-1">
        {/* Left side */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary to-purple-800 text-white p-8 flex-col justify-center items-center">
          <div className="max-w-md mx-auto">
            <h1 className="text-4xl font-bold mb-6">Welcome to SkillForge</h1>
            <p className="text-lg mb-8">
              Accelerate your learning journey with AI-powered recommendations and expert mentorship.
            </p>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-white/20 p-2 rounded-lg mr-4">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Professional Skills</h3>
                  <p className="opacity-90">Learn from industry experts</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-white/20 p-2 rounded-lg mr-4">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Personalized Learning</h3>
                  <p className="opacity-90">AI-tailored courses</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-white/20 p-2 rounded-lg mr-4">
                  <Lightbulb className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Community Support</h3>
                  <p className="opacity-90">Connect with peers and mentors</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - login form */}
        <div className="flex-1 flex items-center justify-center p-8 bg-background">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Login to SkillForge</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                      <span>Logging in...</span>
                    </div>
                  ) : (
                    "Login"
                  )}
                </Button>
                
                <p className="text-sm text-center text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="text-primary hover:underline">
                    Register
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageInner />
    </Suspense>
  )
}