import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { getUserBadge, getUserSkillLevels, getRecommendedPaths, getUserQuizResults, hasUserCompletedQuiz } from '@/lib/quiz'
import { fetchLearningPathsWithProgress } from '@/lib/api/learning-paths-api'
import { getDashboardLearningPathProgress } from '@/lib/learning-paths/learning-path-progress'
import LearningPathsRegistry, { LearningPathConfig } from '@/lib/learning-paths/learning-paths-registry'
import { DatabaseLearningPath } from '@/lib/database/learning-paths'

interface QuizResults {
  answers: Record<number, string>
  score: number
  badge: string
  completedAt: string
}

// Custom hook for quiz data
export function useQuizData() {
  const { user } = useAuth()
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userBadge, setUserBadge] = useState<any>(null)
  const [userSkillLevels, setUserSkillLevels] = useState<Record<string, number>>({})
  const [recommendedPaths, setRecommendedPaths] = useState<string[]>([])

  useEffect(() => {
    const loadQuizResults = async () => {
      try {
        const storedResults = localStorage.getItem("quizResults")
        
        if (storedResults) {
          const results = JSON.parse(storedResults)
          const isReallyComplete = !!(
            results.badge && 
            results.answers && 
            Object.keys(results.answers).length > 0 &&
            (results.completedAt || results.analysis || results.skillLevels || results.summary)
          )
          
          if (isReallyComplete) {
            let formattedResults: QuizResults
            if (results.badge && typeof results.badge === 'object') {
              formattedResults = {
                answers: results.answers || {},
                score: results.score || 0,
                badge: results.badge.name || 'Student',
                completedAt: results.completedAt || new Date().toISOString()
              }
            } else {
              formattedResults = results as QuizResults
            }
            
            setQuizResults(formattedResults)
            setIsLoading(false)
            return
          } else {
            localStorage.removeItem("quizResults")
          }
        }
        
        // Check database if no localStorage data
        if (user?.id) {
          try {
            const hasCompleted = await hasUserCompletedQuiz(user.id)
            
            if (hasCompleted) {
              const dbResults = await getUserQuizResults(user.id)
              
              if (dbResults?.assessment_data) {
                const formattedResults: QuizResults = {
                  answers: dbResults.assessment_data.answers?.reduce((acc: any, answer: any) => {
                    acc[answer.questionId] = answer.value
                    return acc
                  }, {}) || {},
                  score: Object.keys(dbResults.assessment_data.skillLevels || {}).length * 10,
                  badge: dbResults.assessment_data.badge?.name || 'Student',
                  completedAt: dbResults.assessment_data.completed_at || dbResults.completed_at || new Date().toISOString()
                }
                
                setQuizResults(formattedResults)
                localStorage.setItem("quizResults", JSON.stringify(formattedResults))
              } else {
                const minimalResults: QuizResults = {
                  answers: {},
                  score: 0,
                  badge: 'Student',
                  completedAt: new Date().toISOString()
                }
                setQuizResults(minimalResults)
              }
            }
          } catch (error) {
            console.error('Error checking database quiz status:', error)
          }
        }
        
      } catch (error) {
        console.error('Error loading quiz results:', error)
        localStorage.removeItem("quizResults")
      } finally {
        setIsLoading(false)
      }
    }
    
    loadQuizResults()
  }, [user?.id])

  // Load advanced quiz data
  useEffect(() => {
    const loadAdvancedQuizData = async () => {
      if (user?.id && !isLoading) {
        try {
          const [badge, skillLevels, { paths }] = await Promise.all([
            getUserBadge(user.id),
            getUserSkillLevels(user.id),
            getRecommendedPaths(user.id)
          ])
          
          setUserBadge(badge)
          setUserSkillLevels(skillLevels)
          setRecommendedPaths(paths)
        } catch (error) {
          console.error('Error loading advanced quiz data:', error)
        }
      }
    }
    
    loadAdvancedQuizData()
  }, [user?.id, isLoading])

  return {
    quizResults,
    userBadge,
    userSkillLevels,
    recommendedPaths,
    isLoading
  }
}

// Custom hook for learning paths with caching
export function useLearningPaths() {
  const { user } = useAuth()
  const [paths, setPaths] = useState<(LearningPathConfig | DatabaseLearningPath)[]>([])
  const [pathsLoading, setPathsLoading] = useState(true)
  const [realCourseProgress, setRealCourseProgress] = useState<Record<string, any>>({})
  const [useDatabase, setUseDatabase] = useState(true)

  const loadPaths = useMemo(() => {
    return async (userSkillLevels: Record<string, number>, recommendedPaths: string[], quizResults: QuizResults | null) => {
      setPathsLoading(true)
      try {
        let pathsData: (LearningPathConfig | DatabaseLearningPath)[] = []
        let dbRecommendations: any[] = []
        let dbProgress: Record<string, any> = {}
        
        // Try database first
        if (useDatabase && user?.id) {
          try {
            const dbData = await fetchLearningPathsWithProgress(user.id)
            if (dbData.paths && dbData.paths.length > 0) {
              pathsData = dbData.paths
              dbRecommendations = dbData.recommendations || []
              dbProgress = dbData.progress || {}
            }
          } catch (error) {
            console.warn('Database failed, falling back to registry:', error)
            setUseDatabase(false)
          }
        }
        
        // Fallback to registry
        if (pathsData.length === 0) {
          pathsData = LearningPathsRegistry.getAllPaths()
          
          // Apply quiz-based personalization
          if (quizResults || Object.keys(userSkillLevels).length > 0) {
            const interests = extractInterestsFromQuiz(quizResults)
            const skillLevel = extractSkillLevelFromSkillLevels(userSkillLevels)
            
            if (interests.length > 0 || skillLevel) {
              const recommendedByQuiz = LearningPathsRegistry.getRecommendedPaths(interests, skillLevel)
              pathsData = recommendedByQuiz
            }
          }
        }

        // Personalize paths
        const personalizedPaths = pathsData.map(path => {
          let progress = 0
          let isRecommended = false
          
          if ('category' in path && dbRecommendations.length > 0) {
            const dbRecommendation = dbRecommendations.find(r => r.path_id === path.id)
            isRecommended = dbRecommendation && dbRecommendation.recommendation_score > 50
            
            const pathProgress = dbProgress[path.id]
            if (pathProgress) {
              progress = pathProgress.progress_percentage || 0
            }
          } else {
            // Registry path logic
            const pathMappings: Record<string, string[]> = {
              'Web Development': [
                'Frontend Development Mastery', 'Advanced Frontend Development',
                'Backend Development', 'Full-Stack Web Development', 'Web Development Learning Path'
              ],
              'AI & Data Science': [
                'Data Science Fundamentals', 'Advanced Machine Learning',
                'AI & Data Science Learning Path'
              ],
              'Design & Creativity': [
                'UI/UX Design Fundamentals', 'Advanced UI/UX Design',
                'Design & Creativity Learning Path'
              ],
              'Digital Marketing': [
                'Digital Marketing Professional', 'Digital Marketing Learning Path'
              ]
            }
            
            const pathKeys = pathMappings[path.title] || []
            isRecommended = pathKeys.some(key => recommendedPaths.includes(key))
            
            // Calculate progress based on skill levels
            if (path.title === 'Web Development' && (userSkillLevels.webdev || userSkillLevels.frontend || userSkillLevels.backend)) {
              progress = Math.max(userSkillLevels.webdev || 0, userSkillLevels.frontend || 0, userSkillLevels.backend || 0) * 10
            } else if (path.title === 'AI & Data Science' && (userSkillLevels.ai || userSkillLevels.python)) {
              progress = Math.max(userSkillLevels.ai || 0, userSkillLevels.python || 0) * 10
            }
          }
          
          return {
            ...path,
            defaultProgress: Math.round(progress),
            isRecommended
          }
        })
        
        // Sort: recommended first, then by progress
        personalizedPaths.sort((a, b) => {
          if (a.isRecommended && !b.isRecommended) return -1
          if (!a.isRecommended && b.isRecommended) return 1
          if (a.defaultProgress !== b.defaultProgress) return b.defaultProgress - a.defaultProgress
          return a.id.localeCompare(b.id)
        })
        
        setPaths(personalizedPaths)
        setRealCourseProgress(dbProgress)
        
        // Safety fallback
        if (personalizedPaths.length === 0) {
          const fallbackPaths = LearningPathsRegistry.getAllPaths()
          setPaths(fallbackPaths)
        }
        
      } catch (error) {
        console.error('Error loading personalized paths:', error)
        const fallbackPaths = LearningPathsRegistry.getAllPaths()
        setPaths(fallbackPaths)
      } finally {
        setPathsLoading(false)
      }
    }
  }, [user?.id, useDatabase])

  return {
    paths,
    pathsLoading,
    realCourseProgress,
    loadPaths
  }
}

// Helper functions
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