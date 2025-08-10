// lib/api/learning-paths-api.ts - Frontend API client for learning paths
import { 
  DatabaseLearningPath, 
  LearningPathWithContent, 
  UserLearningPathRecommendation,
  getLearningPathsWithFallback
} from '@/lib/database/learning-paths'

// ================================
// API CLIENT FUNCTIONS
// ================================

/**
 * Fetch all learning paths
 */
export async function fetchLearningPaths(): Promise<DatabaseLearningPath[]> {
  try {
    const response = await fetch('/api/learning-paths')
    if (!response.ok) {
      throw new Error('Failed to fetch learning paths')
    }
    const data = await response.json()
    return data.paths || []
  } catch (error) {
    console.error('Error fetching learning paths from API:', error)
    // Fallback to database/localStorage
    return await getLearningPathsWithFallback()
  }
}

/**
 * Fetch learning paths with user progress
 */
export async function fetchLearningPathsWithProgress(userId: string): Promise<{
  paths: DatabaseLearningPath[]
  recommendations: UserLearningPathRecommendation[]
  progress: Record<string, any>
}> {
  try {
    const response = await fetch(`/api/learning-paths?userId=${userId}&includeProgress=true`)
    if (!response.ok) {
      throw new Error('Failed to fetch learning paths with progress')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching learning paths with progress:', error)
    // Fallback: get paths without progress
    const paths = await fetchLearningPaths()
    return {
      paths,
      recommendations: [],
      progress: {}
    }
  }
}

/**
 * Fetch a specific learning path with content
 */
export async function fetchLearningPathWithContent(pathId: string): Promise<LearningPathWithContent | null> {
  try {
    const response = await fetch(`/api/learning-paths/${pathId}?includeContent=true`)
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error('Failed to fetch learning path content')
    }
    return await response.json()
  } catch (error) {
    console.error(`Error fetching learning path ${pathId}:`, error)
    // Fallback to database function with local storage fallback
    const { getLearningPathWithContentFallback } = await import('@/lib/database/learning-paths')
    return await getLearningPathWithContentFallback(pathId)
  }
}

/**
 * Search learning paths
 */
export async function searchLearningPaths(query: string): Promise<DatabaseLearningPath[]> {
  try {
    const response = await fetch(`/api/learning-paths?search=${encodeURIComponent(query)}`)
    if (!response.ok) {
      throw new Error('Failed to search learning paths')
    }
    const data = await response.json()
    return data.paths || []
  } catch (error) {
    console.error('Error searching learning paths:', error)
    return []
  }
}

/**
 * Filter learning paths by category
 */
export async function fetchLearningPathsByCategory(category: string): Promise<DatabaseLearningPath[]> {
  try {
    const response = await fetch(`/api/learning-paths?category=${encodeURIComponent(category)}`)
    if (!response.ok) {
      throw new Error('Failed to fetch learning paths by category')
    }
    const data = await response.json()
    return data.paths || []
  } catch (error) {
    console.error('Error fetching learning paths by category:', error)
    return []
  }
}

// ================================
// PROGRESS API FUNCTIONS
// ================================

/**
 * Get user's course progress for a learning path
 */
export async function fetchCourseProgress(userId: string, pathId: string) {
  try {
    const response = await fetch(`/api/progress/course?userId=${userId}&pathId=${pathId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch course progress')
    }
    const data = await response.json()
    return data.progress || []
  } catch (error) {
    console.error('Error fetching course progress:', error)
    return []
  }
}

/**
 * Update course progress
 */
export async function updateCourseProgressAPI(
  userId: string,
  pathId: string,
  courseId: string,
  courseTitle: string,
  status: 'not_started' | 'in_progress' | 'completed',
  progressPercentage: number = 0
): Promise<boolean> {
  try {
    const response = await fetch('/api/progress/course', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'update',
        userId,
        pathId,
        courseId,
        courseTitle,
        status,
        progressPercentage
      }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to update course progress')
    }
    
    const data = await response.json()
    return data.success || false
  } catch (error) {
    console.error('Error updating course progress via API:', error)
    
    // Fallback: Store progress locally
    const { storeProgressLocally } = await import('@/lib/database/learning-paths')
    const progressData = {
      courses: {
        [courseId]: {
          title: courseTitle,
          status,
          progressPercentage,
          lastUpdated: Date.now()
        }
      }
    }
    
    storeProgressLocally(userId, pathId, progressData)
    console.log('📦 Stored course progress locally for offline sync')
    return true
  }
}

/**
 * Start a course
 */
export async function startCourseAPI(
  userId: string,
  pathId: string,
  courseId: string,
  courseTitle: string
): Promise<boolean> {
  try {
    const response = await fetch('/api/progress/course', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'start',
        userId,
        pathId,
        courseId,
        courseTitle
      }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to start course')
    }
    
    const data = await response.json()
    return data.success || false
  } catch (error) {
    console.error('Error starting course via API:', error)
    
    // Fallback: Store progress locally
    const { storeProgressLocally } = await import('@/lib/database/learning-paths')
    const progressData = {
      courses: {
        [courseId]: {
          title: courseTitle,
          status: 'in_progress',
          progressPercentage: 0,
          startedAt: Date.now(),
          lastUpdated: Date.now()
        }
      }
    }
    
    storeProgressLocally(userId, pathId, progressData)
    console.log('📦 Stored course start locally for offline sync')
    return true
  }
}

/**
 * Complete a course
 */
export async function completeCourseAPI(
  userId: string,
  pathId: string,
  courseId: string,
  courseTitle: string
): Promise<boolean> {
  try {
    const response = await fetch('/api/progress/course', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'complete',
        userId,
        pathId,
        courseId,
        courseTitle
      }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to complete course')
    }
    
    const data = await response.json()
    return data.success || false
  } catch (error) {
    console.error('Error completing course via API:', error)
    
    // Fallback: Store progress locally
    const { storeProgressLocally } = await import('@/lib/database/learning-paths')
    const progressData = {
      courses: {
        [courseId]: {
          title: courseTitle,
          status: 'completed',
          progressPercentage: 100,
          completedAt: Date.now(),
          lastUpdated: Date.now()
        }
      }
    }
    
    storeProgressLocally(userId, pathId, progressData)
    console.log('📦 Stored course completion locally for offline sync')
    return true
  }
}

/**
 * Get learning path progress for dashboard
 */
export async function fetchDashboardProgress(userId: string, pathIds: string[]) {
  try {
    const response = await fetch(`/api/progress/path?userId=${userId}&pathIds=${pathIds.join(',')}&dashboard=true`)
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard progress')
    }
    const data = await response.json()
    return data.progress || {}
  } catch (error) {
    console.error('Error fetching dashboard progress:', error)
    return {}
  }
}

// ================================
// DATA MIGRATION FUNCTIONS
// ================================

/**
 * Migrate static data to database
 */
export async function migrateLearningPathDataAPI(): Promise<boolean> {
  try {
    const response = await fetch('/api/learning-paths', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'migrate'
      }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to migrate data')
    }
    
    const data = await response.json()
    return data.success || false
  } catch (error) {
    console.error('Error migrating learning path data:', error)
    return false
  }
}

// ================================
// CACHE MANAGEMENT
// ================================

const CACHE_KEYS = {
  LEARNING_PATHS: 'learningPaths',
  USER_PROGRESS: 'userProgress'
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

interface CachedData<T> {
  data: T
  timestamp: number
}

/**
 * Get cached data
 */
function getCachedData<T>(key: string): T | null {
  if (typeof window === 'undefined') return null
  
  try {
    const cached = localStorage.getItem(key)
    if (!cached) return null
    
    const parsed: CachedData<T> = JSON.parse(cached)
    const now = Date.now()
    
    // Check if cache is still valid
    if (now - parsed.timestamp < CACHE_DURATION) {
      return parsed.data
    } else {
      // Cache expired, remove it
      localStorage.removeItem(key)
      return null
    }
  } catch (error) {
    console.error('Error reading cache:', error)
    return null
  }
}

/**
 * Set cached data
 */
function setCachedData<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return
  
  try {
    const cached: CachedData<T> = {
      data,
      timestamp: Date.now()
    }
    localStorage.setItem(key, JSON.stringify(cached))
  } catch (error) {
    console.error('Error setting cache:', error)
  }
}

/**
 * Fetch learning paths with caching
 */
export async function fetchLearningPathsCached(): Promise<DatabaseLearningPath[]> {
  // Check cache first
  const cached = getCachedData<DatabaseLearningPath[]>(CACHE_KEYS.LEARNING_PATHS)
  if (cached) {
    console.log('📦 Using cached learning paths')
    return cached
  }
  
  // Fetch fresh data
  const paths = await fetchLearningPaths()
  
  // Cache the result
  setCachedData(CACHE_KEYS.LEARNING_PATHS, paths)
  
  return paths
}

/**
 * Clear all API caches
 */
export function clearAPICache(): void {
  if (typeof window === 'undefined') return
  
  Object.values(CACHE_KEYS).forEach(key => {
    localStorage.removeItem(key)
  })
}