"use client"

import React, { useState, useEffect, useMemo, Suspense, memo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Calendar,
  TrendingUp,
  BookOpen,
  CheckCircle,
  RefreshCw,
  User,
  Star,
} from "lucide-react"
import { EmptyState } from "@/components/empty-state"
import { Spinner } from "@/components/ui/spinner"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/components/providers/auth-provider"
import { getDashboardLearningPathProgress } from "@/lib/learning-paths/learning-path-progress"

// Dynamic imports for heavy components
import { PricingModal } from "@/components/pricing-modal"
import dynamic from "next/dynamic"

const ChatInterface = dynamic(
  () => import("@/components/chat-interface"),
  {
    loading: () => <div className="flex justify-center"><Spinner /></div>,
    ssr: false,
  }
)

// Optimized data imports
import { 
  getCourseData, 
  getProgressData, 
  getBadgesData,
  iconMap,
  getPathColor,
  type Course
} from "@/lib/constants/dashboard-data"

// Custom hooks
import { useQuizData, useLearningPaths } from "@/hooks/use-dashboard-data"

// Memoized components
const QuizResultsCard = memo(({ 
  userBadge, 
  userSkillLevels, 
  getInterestArea, 
  onRetakeQuiz 
}: {
  userBadge: any
  userSkillLevels: Record<string, number>
  getInterestArea: () => string
  onRetakeQuiz: () => void
}) => (
  <Card className="mb-8 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <div>
            <CardTitle className="text-green-800 dark:text-green-200">
              Skills Assessment Completed!
            </CardTitle>
            <CardDescription className="text-green-600 dark:text-green-300">
              {userBadge && typeof userBadge === 'object' ? (
                `Badge Earned: ${userBadge.name} • ${Object.keys(userSkillLevels).length} skills assessed`
              ) : (
                `Personalized for: ${getInterestArea()}`
              )}
            </CardDescription>
          </div>
        </div>
        <Button variant="outline" onClick={onRetakeQuiz} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Retake Assessment
        </Button>
      </div>
    </CardHeader>
    
    {Object.keys(userSkillLevels).length > 0 && (
      <CardContent>
        <div className="space-y-3">
          <h4 className="font-semibold text-green-800 dark:text-green-200">Your Skill Levels</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(userSkillLevels).map(([skill, level]) => (
              <div key={skill} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="capitalize font-medium">{skill}</span>
                  <span>{level}/10</span>
                </div>
                <Progress value={level * 10} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    )}
  </Card>
))

const AssessmentPromptCard = memo(() => (
  <Card className="mb-8 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
    <CardHeader>
      <CardTitle className="text-blue-800 dark:text-blue-200">Complete Your Skills Assessment</CardTitle>
      <CardDescription className="text-blue-600 dark:text-blue-300">
        Take our advanced assessment to get personalized learning recommendations and skill analysis
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Button asChild className="flex items-center gap-2">
        <Link href="/quiz">
          <TrendingUp className="h-4 w-4" />
          Start Skills Assessment (8-10 minutes)
        </Link>
      </Button>
    </CardContent>
  </Card>
))

const LearningPathCard = memo(({ 
  path, 
  pathProgress, 
  getPathIcon 
}: {
  path: any
  pathProgress: any
  getPathIcon: (iconName: string) => any
}) => {
  const IconComponent = getPathIcon(path.icon || 'BookOpen')
  
  const pathId = path.id
  const pathTitle = path.title
  const pathSlug = 'slug' in path && path.slug ? path.slug : path.id
  const pathCourses = 'courses' in path ? path.courses : ('defaultProgress' in path ? 6 : 0)
  const pathColor = getPathColor(pathId, path.color)
  const pathUnlocks = ('unlocks' in path ? path.unlocks : []) || []
  const pathEstimatedDuration = 'estimated_duration' in path ? path.estimated_duration : 
                               'estimatedDuration' in path ? path.estimatedDuration : '3-6 months'
  
  return (
    <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm border overflow-hidden">
      <div className={`bg-gradient-to-r ${pathColor} p-6 text-white relative`}>
        {path.isRecommended && (
          <Badge variant="secondary" className="absolute top-3 right-3 bg-white/20 text-white border-white/30">
            Recommended
          </Badge>
        )}
        <div className="mb-2">
          <IconComponent className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold mb-1">{pathTitle}</h3>
        <p className="text-white/90 text-sm">{'description' in path ? path.description : 'Learn essential skills for your career'}</p>
      </div>
      <div className="p-4">
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{pathProgress.progress_percentage}%</span>
          </div>
          <Progress value={pathProgress.progress_percentage} className="h-2 mb-2" />
          <div className="text-xs text-muted-foreground">
            {pathProgress.completed_courses}/{pathProgress.total_courses || pathCourses} courses completed
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
          <span>Duration</span>
          <span>{pathEstimatedDuration}</span>
        </div>
        
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2">What you'll unlock:</p>
          <div className="flex flex-wrap gap-1">
            {pathUnlocks.slice(0, 2).map((unlock, index) => (
              <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                {unlock}
              </Badge>
            ))}
            {pathUnlocks.length > 2 && (
              <Badge variant="outline" className="text-xs px-2 py-1">
                +{pathUnlocks.length - 2} more
              </Badge>
            )}
            {pathUnlocks.length === 0 && (
              <Badge variant="secondary" className="text-xs px-2 py-1">
                Practical Skills
              </Badge>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          {pathProgress.progress_percentage > 0 ? (
            <div className="flex items-center text-xs text-blue-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>In Progress</span>
            </div>
          ) : path.isRecommended ? (
            <div className="flex items-center text-xs text-amber-600">
              <Star className="h-3 w-3 mr-1" />
              <span>Recommended for You</span>
            </div>
          ) : (
            <div className="flex items-center text-xs text-muted-foreground">
              <BookOpen className="h-3 w-3 mr-1" />
              <span>Ready to Start</span>
            </div>
          )}
        </div>
        
        <Link href={`/learning-paths/${pathSlug}`}>
          <Button className="w-full" variant={path.isRecommended ? "default" : "outline"}>
            {pathProgress.progress_percentage > 0 ? "Continue Path" : "Explore Path"}
          </Button>
        </Link>
      </div>
    </div>
  )
})

const CourseCard = memo(({ course }: { course: Course }) => (
  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
    <div className="aspect-video relative">
      <Image
        src={course.image || "/placeholder.svg"}
        alt={course.title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={false}
        loading="lazy"
      />
      <Badge variant="secondary" className="absolute top-3 right-3">
        {course.category}
      </Badge>
    </div>
    <CardHeader className="pb-2">
      <CardTitle className="text-lg">{course.title}</CardTitle>
      <CardDescription>{course.instructor}</CardDescription>
    </CardHeader>
    <CardContent className="pb-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{course.level}</span>
        <span className="text-muted-foreground">{course.duration}</span>
      </div>
      <div className="mt-2">
        <p className="font-medium">{course.price}</p>
      </div>
    </CardContent>
    <div className="px-6 pb-6">
      <Button variant="outline" className="w-full">
        Enroll Now
      </Button>
    </div>
  </Card>
))

export default function OptimizedDashboardPage() {
  const { user, loading, isAuthenticated, signOut, initialized } = useAuth()
  const { quizResults, userBadge, userSkillLevels, isLoading: isLoadingQuizResults } = useQuizData()
  const { paths: personalizedPaths, pathsLoading, realCourseProgress, loadPaths } = useLearningPaths()
  
  // Local state
  const [searchQuery, setSearchQuery] = useState("")
  const [showChat, setShowChat] = useState(false)
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Memoized data
  const allCourses = useMemo(() => getCourseData(), [])
  const progressData = useMemo(() => getProgressData(), [])
  const badges = useMemo(() => getBadgesData(), [])

  // Filtered courses with optimization
  const filteredCourses = useMemo(() => {
    if (searchQuery.trim() === "") return allCourses
    
    const query = searchQuery.toLowerCase()
    return allCourses.filter(
      (course) =>
        course.title.toLowerCase().includes(query) ||
        course.category.toLowerCase().includes(query) ||
        course.instructor.toLowerCase().includes(query),
    )
  }, [searchQuery, allCourses])

  // Memoized recommended course
  const recommendedCourse = useMemo(() => {
    if (!quizResults) return "Introduction to Digital Skills"

    const goal = quizResults.answers[1] || ""
    if (goal === "design") return "UI/UX Design Principles"
    if (goal === "ai") return "Introduction to Machine Learning"
    if (goal === "marketing") return "Digital Marketing Fundamentals"
    if (goal === "coding") return "Full-Stack Web Development"
    return "Introduction to Digital Skills"
  }, [quizResults])

  // Memoized callbacks
  const handleRetakeQuiz = useCallback(() => {
    localStorage.removeItem("quizResults")
    document.cookie = "quizCompleted=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    document.cookie = "quizResults=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    window.location.href = '/quiz'
  }, [])

  const getPathIcon = useCallback((iconName: string) => {
    return (iconMap as any)[iconName] || BookOpen
  }, [])

  const getDisplayName = useCallback(() => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
    }
    if (user?.email) {
      return user.email.split('@')[0]
    }
    return 'Student'
  }, [user])

  const getInterestArea = useCallback(() => {
    if (!quizResults) return "General"
    
    if (Object.keys(userSkillLevels).length > 0) {
      const topSkill = Object.entries(userSkillLevels).reduce((max, [skill, level]) => 
        level > max.level ? { skill, level } : max, { skill: '', level: 0 }
      )
      
      switch (topSkill.skill) {
        case 'design':
        case 'uiux':
          return "Design & Creativity"
        case 'ai':
        case 'python':
          return "AI & Machine Learning"
        case 'marketing':
        case 'social':
          return "Digital Marketing"
        case 'webdev':
        case 'frontend':
        case 'backend':
          return "Web Development"
        default:
          return topSkill.skill ? topSkill.skill.charAt(0).toUpperCase() + topSkill.skill.slice(1) : "General"
      }
    }
    
    const answers = quizResults.answers
    if (answers[1] === "design") return "Design & Creativity"
    if (answers[1] === "ai") return "AI & Machine Learning" 
    if (answers[1] === "marketing") return "Digital Marketing"
    if (answers[1] === "coding") return "Web Development"
    return "General"
  }, [quizResults, userSkillLevels])

  // Load personalized paths when quiz data is ready
  useEffect(() => {
    if (!isLoadingQuizResults) {
      loadPaths(userSkillLevels, [], quizResults)
    }
  }, [isLoadingQuizResults, userSkillLevels, quizResults, loadPaths])

  // Load course progress
  useEffect(() => {
    const loadCourseProgress = async () => {
      if (!user?.id || personalizedPaths.length === 0) return
      try {
        const pathIds = personalizedPaths.map((path) => path.id)
        const progress = await getDashboardLearningPathProgress(user.id, pathIds)
        // Update progress in the hook would be better, but this works for now
      } catch (error) {
        console.error('Error loading course progress:', error)
      }
    }

    loadCourseProgress()
  }, [user?.id, personalizedPaths])

  // Set mounted flag
  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect unauthenticated users  
  useEffect(() => {
    if (mounted && initialized && !loading && !isAuthenticated) {
      window.location.href = '/login?redirectTo=/dashboard'
    }
  }, [mounted, initialized, loading, isAuthenticated])

  // Loading states
  if (!mounted || loading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Spinner size="lg" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <Link href="/login?redirectTo=/dashboard">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="border-b bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-foreground">SkillForge Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              {(quizResults || userBadge) && (
                <Badge variant="secondary" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  {userBadge && typeof userBadge === 'object' ? userBadge.name : 
                   userBadge || 
                   (quizResults ? quizResults.badge : '')}
                </Badge>
              )}
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{getDisplayName()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome Back, {getDisplayName()}!</h1>
            <p className="mt-1 text-muted-foreground">
              {quizResults 
                ? `Continue your learning journey in ${getInterestArea()}`
                : "Take our skills assessment to get personalized recommendations"
              }
            </p>
          </div>
          <div className="mt-4 md:mt-0 relative">
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Quiz Results or Prompt */}
        {quizResults ? (
          <QuizResultsCard 
            userBadge={userBadge}
            userSkillLevels={userSkillLevels}
            getInterestArea={getInterestArea}
            onRetakeQuiz={handleRetakeQuiz}
          />
        ) : (
          <AssessmentPromptCard />
        )}

        {/* Learning Paths Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Learning Paths</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/learning-paths">View All Paths</Link>
            </Button>
          </div>

          {pathsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-32 bg-muted animate-pulse" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-3 bg-muted rounded animate-pulse mb-4" />
                    <div className="h-8 bg-muted rounded animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {personalizedPaths.map((path) => {
                const pathId = path.id
                const pathProgress = realCourseProgress[pathId] || {
                  learning_path_id: pathId,
                  total_courses: 'courses' in path ? path.courses : 6,
                  completed_courses: 0,
                  progress_percentage: path.defaultProgress || 0
                }
                
                return (
                  <LearningPathCard
                    key={pathId}
                    path={path}
                    pathProgress={pathProgress}
                    getPathIcon={getPathIcon}
                  />
                )
              })}
            </div>
          )}
        </div>

        {/* Progress Tracker */}
        <div className="mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Progress Tracker</CardTitle>
                <Badge variant="outline">{progressData.length} items</Badge>
              </div>
              <CardDescription>Track your progress across learning paths</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progressData.map((item) => (
                  <div key={item.id} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.category}</p>

                        <div className="mt-2 space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span>{item.progress}%</span>
                          </div>
                          <Progress value={item.progress} className="h-2" />
                        </div>

                        {item.unlocks && (
                          <div className="mt-2">
                            <Badge variant="outline" className="text-xs">
                              Unlocks: {item.unlocks}
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <Badge
                          variant={
                            item.status === "completed"
                              ? "default"
                              : item.status === "in-progress"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {item.status === "completed"
                            ? "Completed"
                            : item.status === "in-progress"
                              ? "In Progress"
                              : "Not Started"}
                        </Badge>

                        <div className="mt-2 text-xs text-muted-foreground">
                          {item.completedDate && `Completed: ${new Date(item.completedDate).toLocaleDateString()}`}
                          {item.dueDate && `Due: ${new Date(item.dueDate).toLocaleDateString()}`}
                          {item.startDate && `Starts: ${new Date(item.startDate).toLocaleDateString()}`}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Progress
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Badges */}
        <div className="mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Your Badges</CardTitle>
              <CardDescription>Achievements you've earned on your learning journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-lg border ${
                      badge.achieved ? "bg-primary/5 border-primary/20" : "bg-muted/30 border-muted"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          badge.achieved ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <badge.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className={`font-medium ${badge.achieved ? "" : "text-muted-foreground"}`}>{badge.name}</h3>
                        <p className="text-xs text-muted-foreground">{badge.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommended Course */}
        <section className="mb-8">
          <Card className="overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3 h-48 md:h-auto relative">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pexels-kevin-ku-92347-577585.jpg-UdUjjOglvSMj6extUmfFFagDIycyaA.jpeg"
                  alt="Recommended Course"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={false}
                />
                <Badge variant="default" className="absolute top-4 right-4">
                  Recommended
                </Badge>
              </div>
              <div className="md:w-2/3 p-6">
                <CardTitle className="text-2xl mb-2">{recommendedCourse}</CardTitle>
                <CardDescription className="mb-4">
                  {quizResults 
                    ? "Based on your skills assessment, we've created a personalized learning path for you."
                    : "Start with this beginner-friendly course to build your foundation."
                  }
                </CardDescription>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium flex items-center">
                      <Calendar className="h-4 w-4 mr-1" /> 8 weeks
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Level</p>
                    <p className="font-medium flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" /> Beginner
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Modules</p>
                    <p className="font-medium flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" /> 12 modules
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="font-medium">R1,200</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={() => setIsPricingModalOpen(true)}>Start Learning</Button>
                  <Button variant="outline">View Details</Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Courses Grid */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{searchQuery ? "Search Results" : "Popular Courses"}</h2>
          </div>

          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Search className="h-12 w-12" />}
              title="No courses found"
              description={`We couldn't find any courses matching "${searchQuery}". Try a different search term or browse our categories.`}
              action={{
                label: "Clear Search",
                onClick: () => setSearchQuery(""),
              }}
              className="py-12"
            />
          )}
        </section>

        {/* AI Learning Assistant */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>AI Learning Assistant</CardTitle>
              <CardDescription>Get personalized help with your learning journey</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setShowChat(!showChat)} className="w-full">
                {showChat ? "Hide Chat" : "Chat with AI Mentor"}
              </Button>

              {showChat && (
                <Suspense fallback={<div className="mt-4 flex justify-center"><Spinner /></div>}>
                  <div className="mt-4">
                    <ChatInterface recommendedCourse={recommendedCourse} />
                  </div>
                </Suspense>
              )}
            </CardContent>
          </Card>
        </section>
      </div>

      <Suspense fallback={null}>
        <PricingModal open={isPricingModalOpen} onOpenChange={setIsPricingModalOpen} />
      </Suspense>
    </>
  )
}