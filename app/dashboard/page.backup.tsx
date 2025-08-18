"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { PricingModal } from "@/components/pricing-modal"
import ChatInterface from "@/components/chat-interface"
import {
  Search,
  Briefcase,
  Code,
  PaintbrushIcon as PaintBrush,
  Calendar,
  TrendingUp,
  BookOpen,
  FileText,
  Layout,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  User,
  Brain,
  Palette,
  Globe,
  Target,
  Star,
} from "lucide-react"
import { EmptyState } from "@/components/empty-state"
import { Spinner } from "@/components/ui/spinner"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { useAuth } from "@/components/providers/auth-provider"
import { getUserBadge, getUserSkillLevels, getRecommendedPaths, getUserQuizResults, hasUserCompletedQuiz } from "@/lib/quiz"
import LearningPathsRegistry, { LearningPathConfig } from "@/lib/learning-paths/learning-paths-registry"
import { getDashboardLearningPathProgress } from "@/lib/learning-paths/learning-path-progress"
import { fetchLearningPathsWithProgress } from "@/lib/api/learning-paths-api"
import { DatabaseLearningPath } from "@/lib/database/learning-paths"

// Icon mapping for dynamic paths
const iconMap = {
  Globe,
  Brain,
  Palette,
  Target,
  BookOpen,
  TrendingUp
}

// Color mapping to ensure Tailwind includes these classes
const pathColorMap: Record<string, string> = {
  'web-development': 'from-blue-500 to-cyan-600',
  'ai-data-science': 'from-purple-500 to-violet-600',
  'design-creativity': 'from-pink-500 to-red-600',
  'digital-marketing': 'from-green-500 to-emerald-600',
}

// Get path color with fallback
const getPathColor = (pathId: string, originalColor?: string | null): string => {
  return originalColor || pathColorMap[pathId] || 'from-blue-500 to-cyan-600'
}

// Mock courses data
const allCourses = [
  {
    id: 1,
    title: "Introduction to Machine Learning",
    category: "AI",
    level: "Beginner",
    duration: "8 weeks",
    instructor: "Sandile Thamie Mhlanga",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/robot-6cOHn645w15yILvVe77ERMNr7gcg12.jpeg",
    progress: 0,
    price: "R1,200",
  },
  {
    id: 2,
    title: "Advanced Portrait Photography",
    category: "Photography",
    level: "Intermediate",
    duration: "6 weeks",
    instructor: "Keletso Ntseno",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/workshop9.jpg-FKG43Gm91PVBVt0FFnfrMSVypOHukL.jpeg",
    progress: 0,
    price: "R950",
  },
  {
    id: 3,
    title: "Digital Marketing Fundamentals",
    category: "Marketing",
    level: "Beginner",
    duration: "4 weeks",
    instructor: "Dichwanyo Makgothi",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/digital_marketing.jpg-KsyMLv6ojesthsA3XqZbVd20ReIKGl.jpeg",
    progress: 0,
    price: "R750",
  },
  {
    id: 4,
    title: "UI/UX Design Principles",
    category: "Design",
    level: "Intermediate",
    duration: "10 weeks",
    instructor: "Matthew Olifant",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pexels-cottonbro-5082578.jpg-jNuNHxSLPMsfEKBnotexPcBDBKmVcv.jpeg",
    progress: 0,
    price: "R1,500",
  },
  {
    id: 5,
    title: "Video Production Masterclass",
    category: "Video",
    level: "Advanced",
    duration: "12 weeks",
    instructor: "Vuyolwethu Mbhele",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/videography1.jpg-Z6krXKkrUyhOxgWUoLi2ERjbDnhKfj.jpeg",
    progress: 0,
    price: "R2,200",
  },
  {
    id: 6,
    title: "Full-Stack Web Development",
    category: "Development",
    level: "Intermediate",
    duration: "16 weeks",
    instructor: "Tsehla Motjolopane",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/webdev.jpg-X9sk18hV2Wy7pFXNGNJcWOfDLsu29E.jpeg",
    progress: 0,
    price: "R3,500",
  },
  {
    id: 7,
    title: "Data Science Fundamentals",
    category: "Data Science",
    level: "Beginner",
    duration: "10 weeks",
    instructor: "Realeboha Nthathakane",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/datasci.jpg-7xyCPyuFPQdPNeLC1O69lLk256v4Yj.jpeg",
    progress: 0,
    price: "R1,800",
  },
  {
    id: 8,
    title: "Blockchain Development",
    category: "Blockchain",
    level: "Advanced",
    duration: "8 weeks",
    instructor: "Tadiwanashe Tuwe",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/blockchain.jpg-CLAPeokOfhPwN3BwjEML4aOKHk1stN.jpeg",
    progress: 0,
    price: "R2,500",
  },
]

// Progress tracker data
const progressData = [
  {
    id: 1,
    title: "Personal Branding",
    category: "Freelancer Path",
    status: "completed",
    progress: 100,
    unlocks: "CV Builder",
    completedDate: "2023-04-15",
  },
  {
    id: 2,
    title: "Portfolio Development",
    category: "Freelancer Path",
    status: "in-progress",
    progress: 60,
    unlocks: "Portfolio Builder",
    dueDate: "2023-05-20",
  },
  {
    id: 3,
    title: "Client Communication",
    category: "Freelancer Path",
    status: "not-started",
    progress: 0,
    unlocks: "Client Management Tools",
    startDate: "2023-06-01",
  },
  {
    id: 4,
    title: "AI Fundamentals",
    category: "AI Creator Path",
    status: "in-progress",
    progress: 45,
    unlocks: "AI Project Templates",
    dueDate: "2023-05-25",
  },
]

// Badges data
const badges = [
  { id: 1, name: "CV Pro", description: "Completed 5 CV sections", icon: FileText, achieved: true },
  { id: 2, name: "Portfolio Master", description: "Published 3 projects", icon: Layout, achieved: false },
  { id: 3, name: "Fast Learner", description: "Completed 3 courses in 30 days", icon: Clock, achieved: true },
]

interface QuizResults {
  answers: Record<number, string>
  score: number
  badge: string
  completedAt: string
}

export default function DashboardPage() {
  const authData = useAuth()
  
  // Add debugging
  console.log('🔍 Dashboard auth data:', authData)
  
  const { user, loading, isAuthenticated, signOut, initialized } = authData
  
  const [recommendedCourse, setRecommendedCourse] = useState<string>("")
  const [showChat, setShowChat] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredCourses, setFilteredCourses] = useState(allCourses)
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false)
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null)
  const [isLoadingQuizResults, setIsLoadingQuizResults] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Advanced quiz integration state
  const [userBadge, setUserBadge] = useState<any>(null)
  const [userSkillLevels, setUserSkillLevels] = useState<Record<string, number>>({})
  const [recommendedPaths, setRecommendedPaths] = useState<string[]>([])
  
  // NEW: Dynamic learning paths state
  const [personalizedPaths, setPersonalizedPaths] = useState<(LearningPathConfig & { defaultProgress?: number; isRecommended?: boolean } | DatabaseLearningPath & { defaultProgress?: number; isRecommended?: boolean })[]>([])
  const [pathsLoading, setPathsLoading] = useState(true)
  const [realCourseProgress, setRealCourseProgress] = useState<Record<string, any>>({})
  const [useDatabase, setUseDatabase] = useState(true)

  // Set mounted flag
  useEffect(() => {
    setMounted(true)
    console.log('🏠 Dashboard mounted')
  }, [])

  // Debug auth state
  useEffect(() => {
    console.log('🔐 Auth state:', { 
      mounted, 
      loading, 
      initialized, 
      isAuthenticated, 
      hasUser: !!user,
      isLoadingQuizResults 
    })
  }, [mounted, loading, initialized, isAuthenticated, user, isLoadingQuizResults])

  // FIXED: Load quiz results from localStorage with proper validation and database sync
  useEffect(() => {
    if (!mounted) return
    
    const loadQuizResults = async () => {
      try {
        const storedResults = localStorage.getItem("quizResults")
        
        if (storedResults) {
          const results = JSON.parse(storedResults)
          console.log('📱 Found localStorage quiz data:', Object.keys(results))
          
          // Validate that localStorage data is actually complete
          const isReallyComplete = !!(
            results.badge && 
            results.answers && 
            Object.keys(results.answers).length > 0 &&
            (results.completedAt || results.analysis || results.skillLevels || results.summary)
          )
          
          if (isReallyComplete) {
            // Handle different quiz result formats
            let formattedResults: QuizResults
            if (results.badge && typeof results.badge === 'object') {
              // New format with badge object
              formattedResults = {
                answers: results.answers || {},
                score: results.score || 0,
                badge: results.badge.name || 'Student',
                completedAt: results.completedAt || new Date().toISOString()
              }
            } else {
              // Old format or simple badge
              formattedResults = results as QuizResults
            }
            
            setQuizResults(formattedResults)
            console.log('✅ Quiz results loaded from localStorage:', formattedResults.badge)
            setIsLoadingQuizResults(false)
            return
          } else {
            console.log('🗑️ localStorage quiz data incomplete, clearing...')
            localStorage.removeItem("quizResults")
          }
        }
        
        // If no localStorage or incomplete data, check database
        if (user?.id) {
          console.log('🔍 Checking database for quiz completion...')
          try {
            const hasCompleted = await hasUserCompletedQuiz(user.id)
            
            if (hasCompleted) {
              // User has completed quiz in database but not in localStorage
              // Try to get full results from database
              const dbResults = await getUserQuizResults(user.id)
              
              if (dbResults?.assessment_data) {
                const formattedResults: QuizResults = {
                  answers: dbResults.assessment_data.answers?.reduce((acc: any, answer: any) => {
                    acc[answer.questionId] = answer.value
                    return acc
                  }, {}) || {},
                  score: Object.keys(dbResults.assessment_data.skillLevels || {}).length * 10, // Approximate score
                  badge: dbResults.assessment_data.badge?.name || 'Student',
                  completedAt: dbResults.assessment_data.completed_at || dbResults.completed_at || new Date().toISOString()
                }
                
                setQuizResults(formattedResults)
                
                // Sync back to localStorage
                localStorage.setItem("quizResults", JSON.stringify(formattedResults))
                console.log('✅ Quiz results synced from database to localStorage')
              } else {
                console.log('📊 Quiz completed in database but no detailed results available')
                // Create minimal quiz results to show completed state
                const minimalResults: QuizResults = {
                  answers: {},
                  score: 0,
                  badge: 'Student',
                  completedAt: new Date().toISOString()
                }
                setQuizResults(minimalResults)
              }
            } else {
              console.log('📊 No quiz completion found in database')
            }
          } catch (error) {
            console.error('Error checking database quiz status:', error)
          }
        }
        
      } catch (error) {
        console.error('Error loading quiz results:', error)
        // Clear corrupted data
        localStorage.removeItem("quizResults")
      } finally {
        setIsLoadingQuizResults(false)
      }
    }
    
    loadQuizResults()
  }, [mounted, user?.id]) // Add user?.id as dependency

  // Load advanced quiz data from database and personalize learning paths
  useEffect(() => {
    const loadAdvancedQuizData = async () => {
      if (user?.id) {
        try {
          console.log('📊 Loading advanced quiz data...')
          
          // Load badge
          const badge = await getUserBadge(user.id)
          setUserBadge(badge)
          
          // Load skill levels
          const skillLevels = await getUserSkillLevels(user.id)
          setUserSkillLevels(skillLevels)
          
          // Load recommended paths
          const { paths } = await getRecommendedPaths(user.id)
          setRecommendedPaths(paths)
          
          console.log('✅ Advanced quiz data loaded:', { badge, skillLevels, paths })
          console.log('🎯 Recommended paths from database:', paths)
        } catch (error) {
          console.error('Error loading advanced quiz data:', error)
          // Don't block the UI if this fails
        }
      }
    }
    
    // Only load if we have a user and we're done loading quiz results
    if (user?.id && !isLoadingQuizResults) {
      loadAdvancedQuizData()
    }
  }, [user?.id, isLoadingQuizResults])

  // NEW: Load and personalize learning paths using database or registry
  useEffect(() => {
    const loadPersonalizedPaths = async () => {
      setPathsLoading(true)
      try {
        let paths: (LearningPathConfig | DatabaseLearningPath)[] = []
        let dbRecommendations: any[] = []
        let dbProgress: Record<string, any> = {}
        
        // Try database first
        if (useDatabase && user?.id) {
          try {
            console.log('📚 Trying to load from database...')
            const dbData = await fetchLearningPathsWithProgress(user.id)
            if (dbData.paths && dbData.paths.length > 0) {
              console.log('✅ Using database paths:', dbData.paths.length)
              paths = dbData.paths
              dbRecommendations = dbData.recommendations || []
              dbProgress = dbData.progress || {}
            }
          } catch (error) {
            console.warn('⚠️ Database failed, falling back to registry:', error)
            setUseDatabase(false)
          }
        }
        
        // Fallback to registry if database failed or not available
        if (paths.length === 0) {
          console.log('📚 Using registry fallback')
          paths = LearningPathsRegistry.getAllPaths()
          
          // Apply quiz-based personalization for registry paths
          if (quizResults || Object.keys(userSkillLevels).length > 0) {
            const interests = extractInterestsFromQuiz(quizResults)
            const skillLevel = extractSkillLevelFromSkillLevels(userSkillLevels)
            
            console.log('🎯 Extracted interests and skill level:', { interests, skillLevel })
            
            if (interests.length > 0 || skillLevel) {
              const recommendedByQuiz = LearningPathsRegistry.getRecommendedPaths(interests, skillLevel)
              console.log('📚 Recommended paths by quiz analysis:', recommendedByQuiz.map(p => p.title))
              paths = recommendedByQuiz
            }
          }
        }
        
        console.log('📚 Final paths to display:', paths.map(p => p.title))

        // Apply progress and recommendation-based sorting
        const personalizedPathsData = paths.map(path => {
          let progress = 0
          let isRecommended = false
          
          // For database paths, use direct recommendation scores
          if ('category' in path && dbRecommendations.length > 0) {
            const dbRecommendation = dbRecommendations.find(r => r.path_id === path.id)
            isRecommended = dbRecommendation && dbRecommendation.recommendation_score > 50
            
            // Use database progress if available
            const pathProgress = dbProgress[path.id]
            if (pathProgress) {
              progress = pathProgress.progress_percentage || 0
            }
          } else {
            // For registry paths, use legacy mapping logic
            const pathMappings: Record<string, string[]> = {
              'Web Development': [
                'Frontend Development Mastery', 'Advanced Frontend Development',
                'Backend Development', 'Advanced Backend Development', 
                'Full-Stack Web Development', 'Web Development Learning Path'
              ],
              'AI & Data Science': [
                'Data Science Fundamentals', 'Advanced Machine Learning',
                'Natural Language Processing', 'Computer Vision & Image AI',
                'Data Analytics Fundamentals', 'SQL & Database Analytics',
                'Advanced Business Intelligence', 'AI & Data Science Learning Path'
              ],
              'Design & Creativity': [
                'UI/UX Design Fundamentals', 'Advanced UI/UX Design', 'Design Systems Mastery',
                'Graphic Design Professional', 'Creative Design Fundamentals',
                'Animation & Motion Graphics', '3D Modeling & Animation',
                'Motion Graphics & 2D Animation', 'Video Production & Editing',
                'Character Animation', 'Photography Mastery',
                'Design & Creativity Learning Path'
              ],
              'Digital Marketing': [
                'Digital Marketing Professional', 'Social Media Marketing',
                'Content Marketing Mastery', 'SEO & Analytics',
                'Email Marketing Automation', 'Digital Marketing Learning Path'
              ]
            }
            
            const pathKeys = pathMappings[path.title] || []
            isRecommended = pathKeys.some(key => recommendedPaths.includes(key))
            
            // Calculate progress based on skill levels for registry paths
            if (path.title === 'Web Development' && (userSkillLevels.webdev || userSkillLevels.frontend || userSkillLevels.backend)) {
              progress = Math.max(userSkillLevels.webdev || 0, userSkillLevels.frontend || 0, userSkillLevels.backend || 0) * 10
            } else if (path.title === 'AI & Data Science' && (userSkillLevels.ai || userSkillLevels.python)) {
              progress = Math.max(userSkillLevels.ai || 0, userSkillLevels.python || 0) * 10
            } else if (path.title === 'Design & Creativity' && (userSkillLevels.design || userSkillLevels.uiux)) {
              progress = Math.max(userSkillLevels.design || 0, userSkillLevels.uiux || 0) * 10
            } else if (path.title === 'Digital Marketing' && (userSkillLevels.marketing || userSkillLevels.social)) {
              progress = Math.max(userSkillLevels.marketing || 0, userSkillLevels.social || 0) * 10
            }
          }
          
          // Debug logging
          if (recommendedPaths.length > 0 || dbRecommendations.length > 0) {
            console.log(`🎯 Checking ${path.title}:`, {
              isRecommended,
              progress,
              source: 'category' in path ? 'database' : 'registry'
            })
          }
          
          return {
            ...path,
            defaultProgress: Math.round(progress),
            isRecommended
          }
        })
        
        // Sort paths: recommended first, then by progress, then by original order
        personalizedPathsData.sort((a, b) => {
          if (a.isRecommended && !b.isRecommended) return -1
          if (!a.isRecommended && b.isRecommended) return 1
          if (a.defaultProgress !== b.defaultProgress) return b.defaultProgress - a.defaultProgress
          return a.id.localeCompare(b.id)
        })
        
        console.log('📊 Final personalized paths:', personalizedPathsData.map(p => ({
          title: p.title,
          isRecommended: p.isRecommended,
          progress: p.defaultProgress,
          source: 'category' in p ? 'database' : 'registry'
        })))
        
        setPersonalizedPaths(personalizedPathsData)
        setRealCourseProgress(dbProgress) // Use database progress if available
        console.log('🎯 Personalized paths loaded:', personalizedPathsData.length)
        
        // Safety check: If no paths are loaded, use defaults
        if (personalizedPathsData.length === 0) {
          console.warn('⚠️ No personalized paths found, falling back to all paths')
          const fallbackPaths = LearningPathsRegistry.getAllPaths()
          setPersonalizedPaths(fallbackPaths)
        }
        
      } catch (error) {
        console.error('Error loading personalized paths:', error)
        // Fallback to default paths
        const fallbackPaths = LearningPathsRegistry.getAllPaths()
        console.log('🔄 Using fallback paths:', fallbackPaths.map(p => p.title))
        setPersonalizedPaths(fallbackPaths)
      } finally {
        setPathsLoading(false)
      }
    }
    
    // Load paths when quiz data is ready
    if (!isLoadingQuizResults) {
      loadPersonalizedPaths()
    }
  }, [isLoadingQuizResults, quizResults, userSkillLevels, recommendedPaths, user?.id, useDatabase])

  // Load actual course progress from database
  useEffect(() => {
    async function loadCourseProgress() {
      if (!user?.id || personalizedPaths.length === 0) return
      try {
        const pathIds = personalizedPaths.map((path) => path.id)
        const progress = await getDashboardLearningPathProgress(user.id, pathIds)
        setRealCourseProgress(progress)
        console.log('✅ Real course progress loaded:', progress)
      } catch (error) {
        console.error('❌ Error loading course progress:', error)
      }
    }

    loadCourseProgress()
  }, [user?.id, personalizedPaths])

  // Helper functions for quiz analysis
  const extractInterestsFromQuiz = (quizResults: QuizResults | null): string[] => {
    if (!quizResults?.answers) return []
    
    const interests: string[] = []
    Object.values(quizResults.answers).forEach((answer: any) => {
      if (typeof answer === 'string') {
        switch (answer) {
          case 'design':
            interests.push('design', 'creativity', 'ui/ux')
            break
          case 'ai':
            interests.push('ai', 'machine learning', 'data science')
            break
          case 'marketing':
            interests.push('marketing', 'social media', 'analytics')
            break
          case 'coding':
            interests.push('programming', 'web development', 'software')
            break
        }
      }
    })
    return interests
  }

  const extractSkillLevelFromSkillLevels = (skillLevels: Record<string, number>): string | undefined => {
    const levels = Object.values(skillLevels)
    if (levels.length === 0) return undefined
    
    const avgLevel = levels.reduce((sum, level) => sum + level, 0) / levels.length
    if (avgLevel >= 7) return 'advanced'
    if (avgLevel >= 4) return 'intermediate'
    return 'beginner'
  }

  // Get path icon component
  const getPathIcon = (iconName: string) => {
    const IconComponent = (iconMap as any)[iconName] || BookOpen
    return IconComponent
  }

  // Redirect unauthenticated users  
  useEffect(() => {
    if (mounted && initialized && !loading && !isAuthenticated) {
      console.log('🔒 User not authenticated, redirecting to login')
      // Note: Using window.location instead of router to avoid navigation component conflicts
      window.location.href = '/login?redirectTo=/dashboard'
    }
  }, [mounted, initialized, loading, isAuthenticated])

  // Set recommended course based on quiz results
  useEffect(() => {
    if (!quizResults) {
      setRecommendedCourse("Introduction to Digital Skills")
      return
    }

    const goal = quizResults.answers[1] || ""

    if (goal === "design") setRecommendedCourse("UI/UX Design Principles")
    else if (goal === "ai") setRecommendedCourse("Introduction to Machine Learning")
    else if (goal === "marketing") setRecommendedCourse("Digital Marketing Fundamentals")
    else if (goal === "coding") setRecommendedCourse("Full-Stack Web Development")
    else setRecommendedCourse("Introduction to Digital Skills")
  }, [quizResults])

  // Filter courses based on search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCourses(allCourses)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = allCourses.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.category.toLowerCase().includes(query) ||
          course.instructor.toLowerCase().includes(query),
      )
      setFilteredCourses(filtered)
    }
  }, [searchQuery])

  const handleLogout = async () => {
    try {
      const { error } = await signOut()
      
      if (error) {
        throw new Error(error.message)
      }
      
      console.log('👋 Logged out successfully')
      window.location.href = "/login"
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleRetakeQuiz = () => {
    // Clear quiz results and redirect to quiz
    localStorage.removeItem("quizResults")
    document.cookie = "quizCompleted=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    document.cookie = "quizResults=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    console.log('🔄 Quiz results cleared, redirecting to quiz')
    window.location.href = '/quiz'
  }

  const getDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
    }
    if (user?.email) {
      return user.email.split('@')[0]
    }
    return 'Student'
  }

  // Updated getInterestArea function to work with advanced quiz results
  const getInterestArea = () => {
    if (!quizResults) return "General"
    
    // If we have advanced quiz data, use it
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
    
    // Fallback to old logic if advanced data not available
    const answers = quizResults.answers
    if (answers[1] === "design") return "Design & Creativity"
    if (answers[1] === "ai") return "AI & Machine Learning" 
    if (answers[1] === "marketing") return "Digital Marketing"
    if (answers[1] === "coding") return "Web Development"
    return "General"
  }

  // Simplified loading condition  
  if (!mounted) {
    console.log('❌ Not mounted yet')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Spinner size="lg" />
          <span>Mounting...</span>
        </div>
      </div>
    )
  }

  if (loading) {
    console.log('❌ Still loading auth')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Spinner size="lg" />
          <span>Loading auth...</span>
        </div>
      </div>
    )
  }

  if (!initialized) {
    console.log('❌ Not initialized')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Spinner size="lg" />
          <span>Initializing...</span>
        </div>
      </div>
    )
  }

  console.log('✅ All checks passed, rendering dashboard')

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    console.log('❌ Not authenticated, showing login prompt')
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

  console.log('✅ User is authenticated, rendering dashboard')

  return (
    <>
      {/* Header with user info */}
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

        {/* Enhanced Quiz Results or Assessment Prompt */}
        {quizResults ? (
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
                <Button variant="outline" onClick={handleRetakeQuiz} className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Retake Assessment
                </Button>
              </div>
            </CardHeader>
            
            {/* Show skill levels if available */}
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
        ) : (
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
        )}

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
        const IconComponent = getPathIcon(path.icon || 'BookOpen')
        
        // Handle both database and registry paths
        const pathId = path.id
        const pathTitle = path.title
        const pathSlug = 'slug' in path && path.slug ? path.slug : path.id
        const pathCourses = 'courses' in path ? path.courses : ('defaultProgress' in path ? 6 : 0)
        const pathColor = getPathColor(pathId, path.color)
        const pathUnlocks = ('unlocks' in path ? path.unlocks : []) || []
        const pathEstimatedDuration = 'estimated_duration' in path ? path.estimated_duration : 
                                     'estimatedDuration' in path ? path.estimatedDuration : '3-6 months'
        
        // Get actual progress from database
        const pathProgress = realCourseProgress[pathId] || {
          learning_path_id: pathId,
          total_courses: pathCourses,
          completed_courses: 0,
          progress_percentage: path.defaultProgress || 0
        }
        
        return (
          <div key={pathId} className="bg-white dark:bg-gray-950 rounded-lg shadow-sm border overflow-hidden">
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
              {/* Course Progress Display */}
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
              
              {/* Duration */}
              <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                <span>Duration</span>
                <span>{pathEstimatedDuration}</span>
              </div>
              
              {/* Unlocks section */}
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
              
              {/* Status Indicator */}
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
      })}
    </div>
  )}
</div>
        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Portfolio Builder Card - 1 column */}
          <div className="md:col-span-1">
            <Card className="h-full bg-gradient-to-br from-white to-red-50 dark:from-gray-900 dark:to-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-[#FF6B6B]">
                  <Layout className="h-5 w-5" />
                  Portfolio Builder
                </CardTitle>
                <CardDescription>Showcase your best work</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Completion</span>
                    <span className="font-medium">25%</span>
                  </div>
                  <Progress value={25} className="h-2 [&>div]:bg-[#FF6B6B]" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>About Me</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <span>Projects (1/3)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    <span>Testimonials</span>
                  </div>
                </div>

                <div className="bg-background rounded-md p-3 border text-sm">
                  <p className="font-medium mb-1">SEO Score: 45%</p>
                  <p className="text-muted-foreground">Add keywords to your About section</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-[#FF6B6B] hover:bg-[#e55a5a]">Continue Editing</Button>
              </CardFooter>
            </Card>
          </div>

          {/* Progress Tracker - 2 columns */}
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Progress Tracker</CardTitle>
                  <Badge variant="outline">4 items</Badge>
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
        </div>

        {/* Badges Section */}
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

        {/* Recommended Course Section */}
        <section className="mb-8">
          <Card className="overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3 h-48 md:h-auto relative">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pexels-kevin-ku-92347-577585.jpg-UdUjjOglvSMj6extUmfFFagDIycyaA.jpeg"
                  alt="Recommended Course"
                  className="w-full h-full object-cover"
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

        {/* Search Results / All Courses */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{searchQuery ? "Search Results" : "Popular Courses"}</h2>
          </div>

          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative">
                    <img
                      src={course.image || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-full object-cover"
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
                <div className="mt-4">
                  <ChatInterface recommendedCourse={recommendedCourse} />
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>

      <PricingModal open={isPricingModalOpen} onOpenChange={setIsPricingModalOpen} />
    </>
  )
}