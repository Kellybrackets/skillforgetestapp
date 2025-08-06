"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
import { Palette, Brain, Code, TrendingUp, BookOpen, Award, User, Star, Lightbulb, Cpu, Megaphone, Globe } from "lucide-react"
import Link from "next/link"
import confetti from "canvas-confetti"
import { useAuth } from "@/hooks/useAuth"
import { saveQuizResults } from "@/lib/quiz"
import { 
  quizQuestions, 
  getNextQuestion, 
  analyzeQuizResults, 
  getBadge,
  getQuizProgress,
  validateQuizCompletion,
  getSafeNextQuestion,
  type QuizAnswer 
} from "@/lib/quiz-logic"

// Icon mapping for badges
const iconMap = {
  palette: Palette,
  brain: Brain,
  code: Code,
  'trending-up': TrendingUp,
  lightbulb: Lightbulb,
  cpu: Cpu,
  megaphone: Megaphone,
  globe: Globe,
  star: Star,
}

export default function AdvancedQuizPage() {
  const router = useRouter()
  const { user, loading, isAuthenticated, initialized } = useAuth()
  
  const [currentQuestionId, setCurrentQuestionId] = useState<string>("q1")
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [currentAnswer, setCurrentAnswer] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [quizResults, setQuizResults] = useState<{
    summary: string
    skillLevels: Record<string, number>
    recommendedCourses: string[]
    recommendedMentors: string[]
    badge: { name: string; description: string; icon: string }
  } | null>(null)
  const [redirectTimer, setRedirectTimer] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const [questionHistory, setQuestionHistory] = useState<string[]>(["q1"])

  // Set mounted flag
  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect unauthenticated users
  useEffect(() => {
    if (mounted && initialized && !loading && !isAuthenticated) {
      console.log('🔒 User not authenticated, redirecting to login')
      router.push('/login?redirectTo=/quiz')
    }
  }, [mounted, initialized, loading, isAuthenticated, router])

  const getDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
    }
    if (user?.email) {
      return user.email.split('@')[0]
    }
    return 'Student'
  }

  const handleAnswer = (value: string) => {
    setCurrentAnswer(value)
  }

  const handleNext = () => {
    if (!currentAnswer) return

    // Save the current answer
    const newAnswer: QuizAnswer = {
      questionId: currentQuestionId,
      value: currentAnswer,
    }

    const updatedAnswers = [...answers, newAnswer]
    setAnswers(updatedAnswers)

    // Get the next question based on the current answer
    let nextQuestionId = getNextQuestion(currentQuestionId, currentAnswer)
    
    // If flow is broken, try to recover with a safe next question
    if (!nextQuestionId) {
      nextQuestionId = getSafeNextQuestion(currentQuestionId, updatedAnswers)
    }

    if (nextQuestionId) {
      setCurrentQuestionId(nextQuestionId)
      setQuestionHistory([...questionHistory, nextQuestionId])
      setCurrentAnswer("")
    } else {
      // No more questions, submit the quiz
      handleSubmit(updatedAnswers)
    }
  }

  const handlePrevious = () => {
    if (questionHistory.length <= 1) return

    // Remove current question from history
    const newHistory = questionHistory.slice(0, -1)
    const previousQuestionId = newHistory[newHistory.length - 1]

    // Remove the last answer
    const updatedAnswers = answers.slice(0, -1)

    setQuestionHistory(newHistory)
    setCurrentQuestionId(previousQuestionId)
    setAnswers(updatedAnswers)
    
    // Set the previous answer if it exists
    const previousAnswer = updatedAnswers.find(a => a.questionId === previousQuestionId)
    setCurrentAnswer(previousAnswer?.value || "")
  }

  const handleSubmit = async (finalAnswers: QuizAnswer[]) => {
    setIsSubmitting(true)

    try {
      // Validate quiz completion before proceeding
      if (!validateQuizCompletion(finalAnswers)) {
        console.warn('⚠️ Quiz validation failed, but proceeding with submission')
      }

      // Analyze results using your advanced logic
      const analysis = analyzeQuizResults(finalAnswers)
      const badge = getBadge(finalAnswers)

      console.log('📊 Quiz Analysis:', { analysis, badge })

      setQuizResults({
        summary: analysis.summary,
        skillLevels: analysis.skillLevels,
        recommendedCourses: analysis.recommendedCourses,
        recommendedMentors: analysis.recommendedMentors,
        badge
      })

      // Save to database using your existing schema
      if (user?.id) {
        console.log('💾 Saving quiz results to database...')
        const dbSaved = await saveQuizResults(finalAnswers, user.id)
        
        if (!dbSaved) {
          console.error('❌ Failed to save to database')
        } else {
          console.log('✅ Quiz results saved to database successfully')
        }
      }

      // Also save to localStorage for immediate access (backup)
      const localStorageData = {
        answers: finalAnswers,
        analysis,
        badge,
        completedAt: new Date().toISOString(),
      }
      localStorage.setItem("quizResults", JSON.stringify(localStorageData))
      console.log('📱 Quiz results also saved to localStorage')

      // Simulate processing time
      setTimeout(() => {
        setIsSubmitting(false)
        setShowResults(true)

        // Trigger confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })

        // Start redirect timer
        setRedirectTimer(10)
      }, 1500)

    } catch (error) {
      console.error('💥 Error saving quiz results:', error)
      
      // Still continue with localStorage as fallback
      const localStorageData = {
        answers: finalAnswers,
        analysis: analyzeQuizResults(finalAnswers),
        badge: getBadge(finalAnswers),
        completedAt: new Date().toISOString(),
      }
      localStorage.setItem("quizResults", JSON.stringify(localStorageData))
      
      setTimeout(() => {
        setIsSubmitting(false)
        setShowResults(true)
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
        setRedirectTimer(10)
      }, 1500)
    }
  }

  // Handle redirect timer
  useEffect(() => {
    if (redirectTimer === null) return

    if (redirectTimer <= 0) {
      console.log('🚀 Quiz completed, redirecting to dashboard')
      router.push("/dashboard")
      return
    }

    const timer = setTimeout(() => {
      setRedirectTimer(redirectTimer - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [redirectTimer, router])

  // Show loading while checking auth
  if (!mounted || loading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center space-x-2">
          <Spinner size="lg" />
          <span>Loading assessment...</span>
        </div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to take the assessment</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <Link href="/login?redirectTo=/quiz">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQuestion = quizQuestions[currentQuestionId]
  const hasAnsweredCurrent = currentAnswer !== ""
  
  // Calculate progress using enhanced progress calculation
  const progress = getQuizProgress(answers)

  // Get icon component for badge
  const getBadgeIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Star
    return <IconComponent className="h-8 w-8 text-primary" />
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      {/* Header with user info */}
      <div className="w-full max-w-3xl mb-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Welcome, {getDisplayName()}!</span>
          </div>
          <span>Advanced Skills Assessment</span>
        </div>
      </div>

      <div className="max-w-3xl w-full mx-auto">
        {!showResults ? (
          <Card className="w-full">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Skills Assessment</CardTitle>
              <CardDescription>
                Question {questionHistory.length} • Personalized Learning Path
              </CardDescription>

              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <h3 className="text-lg font-medium">{currentQuestion?.text}</h3>
              
              {currentQuestion?.options && (
                <RadioGroup
                  value={currentAnswer}
                  onValueChange={handleAnswer}
                  className="space-y-3"
                >
                  {currentQuestion.options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={option.id} />
                      <Label htmlFor={option.id} className="cursor-pointer flex-1">
                        {option.text}
                      </Label>
                      {option.skillValue && (
                        <Badge variant="outline" className="text-xs">
                          Skill +{option.skillValue}
                        </Badge>
                      )}
                    </div>
                  ))}
                </RadioGroup>
              )}

              {currentQuestion?.skillArea && (
                <div className="bg-muted/30 rounded-lg p-3 border">
                  <p className="text-sm text-muted-foreground">
                    <Award className="h-4 w-4 inline mr-1" />
                    This question assesses: <span className="font-medium capitalize">{currentQuestion.skillArea}</span>
                  </p>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={questionHistory.length <= 1 || isSubmitting}
              >
                Previous
              </Button>
              
              <Button 
                onClick={handleNext} 
                disabled={!hasAnsweredCurrent || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Analyzing...
                  </>
                ) : (
                  "Next"
                )}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Results Card */}
            <Card className="w-full">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center mb-4">
                  {quizResults?.badge && getBadgeIcon(quizResults.badge.icon)}
                </div>
                <CardTitle className="text-2xl font-bold">Assessment Complete!</CardTitle>
                <CardDescription>
                  You've earned the badge: <span className="font-semibold">{quizResults?.badge?.name}</span>
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Badge */}
                {quizResults?.badge && (
                  <div className="text-center p-4 bg-muted/30 rounded-lg border">
                    <h3 className="font-bold text-lg">{quizResults.badge.name}</h3>
                    <p className="text-sm text-muted-foreground">{quizResults.badge.description}</p>
                  </div>
                )}

                {/* Summary */}
                <div className="space-y-2">
                  <h4 className="font-semibold">Your Learning Profile</h4>
                  <p className="text-sm text-muted-foreground">{quizResults?.summary}</p>
                </div>

                {/* Skill Levels */}
                {quizResults?.skillLevels && Object.keys(quizResults.skillLevels).length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold">Skill Assessment</h4>
                    {Object.entries(quizResults.skillLevels).map(([skill, level]) => (
                      <div key={skill} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{skill}</span>
                          <span>{level}/10</span>
                        </div>
                        <Progress value={level * 10} className="h-2" />
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-sm text-center text-muted-foreground">
                  Redirecting to dashboard in {redirectTimer} seconds...{" "}
                  <Button variant="link" onClick={() => router.push("/dashboard")} className="p-0 h-auto">
                    Go now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5 text-primary" />
                    Recommended Courses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {quizResults?.recommendedCourses.map((course, index) => (
                      <div key={index} className="p-2 bg-muted/30 rounded text-sm">
                        {course}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5 text-primary" />
                    Recommended Mentors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {quizResults?.recommendedMentors.map((mentor, index) => (
                      <div key={index} className="p-2 bg-muted/30 rounded text-sm">
                        {mentor}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center">
              <Button size="lg" asChild>
                <Link href="/dashboard">Continue to Dashboard</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}