// hooks/use-learning-path.ts - Dynamic path loading hook
import { useState, useEffect } from 'react'
import LearningPathsRegistry, { LearningPathConfig } from '@/lib/learning-paths/learning-paths-registry'
import { LearningPathData } from '@/lib/learning-paths/learning-paths-utils'

export interface UseLearningPathReturn {
  config: LearningPathConfig | null
  data: LearningPathData | null
  loading: boolean
  error: string | null
  stats: {
    totalCourses: number
    estimatedHours: number
    skillsCount: number
    careerOpportunities: number
  } | null
}

export function useLearningPath(pathId: string): UseLearningPathReturn {
  const [config, setConfig] = useState<LearningPathConfig | null>(null)
  const [data, setData] = useState<LearningPathData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPath() {
      setLoading(true)
      setError(null)

      try {
        // Load configuration
        const pathConfig = LearningPathsRegistry.getPath(pathId)
        if (!pathConfig) {
          throw new Error(`Learning path '${pathId}' not found`)
        }
        setConfig(pathConfig)

        // Load data
        const pathData = await LearningPathsRegistry.loadPathData(pathId)
        if (!pathData) {
          throw new Error(`Failed to load data for path '${pathId}'`)
        }
        setData(pathData)

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
        setError(errorMessage)
        console.error('Error loading learning path:', err)
      } finally {
        setLoading(false)
      }
    }

    if (pathId) {
      loadPath()
    }
  }, [pathId])

  const stats = config ? LearningPathsRegistry.getPathStats(pathId) : null

  return {
    config,
    data,
    loading,
    error,
    stats
  }
}

// Hook for managing all paths
export function useAllLearningPaths() {
  const [paths, setPaths] = useState<LearningPathConfig[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    try {
      const allPaths = LearningPathsRegistry.getAllPaths()
      setPaths(allPaths)
    } catch (error) {
      console.error('Error loading all paths:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const searchPaths = (query: string) => {
    return LearningPathsRegistry.searchPaths(query)
  }

  const getPathsByCategory = (category: LearningPathConfig['category']) => {
    return LearningPathsRegistry.getPathsByCategory(category)
  }

  const getPathsByDifficulty = (difficulty: LearningPathConfig['difficulty']) => {
    return LearningPathsRegistry.getPathsByDifficulty(difficulty)
  }

  const getRecommendedPaths = (userInterests?: string[], userSkillLevel?: string) => {
    return LearningPathsRegistry.getRecommendedPaths(userInterests, userSkillLevel)
  }

  return {
    paths,
    loading,
    searchPaths,
    getPathsByCategory,
    getPathsByDifficulty,
    getRecommendedPaths
  }
}