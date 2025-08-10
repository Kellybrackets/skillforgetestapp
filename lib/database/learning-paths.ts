// lib/database/learning-paths.ts - Database operations for learning paths
import { createSupabaseClient } from '@/lib/supabase'

// ================================
// TYPES AND INTERFACES
// ================================

export interface DatabaseLearningPath {
  id: string
  title: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
  category: 'technical' | 'creative' | 'business' | 'hybrid'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimated_duration: string | null
  prerequisites: string[] | null
  skills: string[]
  career_outcomes: string[] | null
  salary_range: {
    junior: string
    mid: string
    senior: string
  } | null
  unlocks: string[] | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface DatabaseCourse {
  id: string
  learning_path_id: string
  title: string
  description: string | null
  level: string
  duration: string | null
  skills: string[]
  instructor: string | null
  rating: number
  students: number
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface DatabaseProjectBrief {
  id: string
  learning_path_id: string
  title: string
  description: string | null
  difficulty: string
  technologies: string[] | null
  estimated_time: string | null
  skills: string[]
  deliverables: string[] | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface DatabaseInterviewRole {
  id: string
  learning_path_id: string
  role: string
  company: string | null
  description: string | null
  experience: string | null
  skills: string[]
  questions: string[] | null
  tips: string[] | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface LearningPathWithContent {
  path: DatabaseLearningPath
  courses: DatabaseCourse[]
  projects: DatabaseProjectBrief[]
  interviewRoles: DatabaseInterviewRole[]
  interviewQuestions?: { [roleId: string]: string[] }
}

export interface UserLearningPathRecommendation {
  path_id: string
  path_title: string
  recommendation_score: number
}

// ================================
// LEARNING PATHS CRUD OPERATIONS
// ================================

/**
 * Get all active learning paths
 */
export async function getAllLearningPaths(): Promise<DatabaseLearningPath[]> {
  try {
    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase
      .from('learning_paths')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
    
    if (error) {
      console.error('Error fetching learning paths:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('Exception fetching learning paths:', error)
    return []
  }
}

/**
 * Get a specific learning path by ID
 */
export async function getLearningPath(pathId: string): Promise<DatabaseLearningPath | null> {
  try {
    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase
      .from('learning_paths')
      .select('*')
      .eq('id', pathId)
      .eq('is_active', true)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null // Not found
      }
      console.error('Error fetching learning path:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Exception fetching learning path:', error)
    return null
  }
}

/**
 * Get learning paths by category
 */
export async function getLearningPathsByCategory(category: string): Promise<DatabaseLearningPath[]> {
  try {
    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase
      .from('learning_paths')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
    
    if (error) {
      console.error('Error fetching learning paths by category:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('Exception fetching learning paths by category:', error)
    return []
  }
}

/**
 * Search learning paths
 */
export async function searchLearningPaths(query: string): Promise<DatabaseLearningPath[]> {
  try {
    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase
      .from('learning_paths')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
    
    if (error) {
      console.error('Error searching learning paths:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('Exception searching learning paths:', error)
    return []
  }
}

// ================================
// COURSE OPERATIONS
// ================================

/**
 * Get courses for a learning path
 */
export async function getCoursesByPath(pathId: string): Promise<DatabaseCourse[]> {
  try {
    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('learning_path_id', pathId)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
    
    if (error) {
      console.error('Error fetching courses:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('Exception fetching courses:', error)
    return []
  }
}

/**
 * Get a specific course
 */
export async function getCourse(courseId: string): Promise<DatabaseCourse | null> {
  try {
    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .eq('is_active', true)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      console.error('Error fetching course:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Exception fetching course:', error)
    return null
  }
}

// ================================
// PROJECT BRIEF OPERATIONS
// ================================

/**
 * Get project briefs for a learning path
 */
export async function getProjectBriefsByPath(pathId: string): Promise<DatabaseProjectBrief[]> {
  try {
    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase
      .from('project_briefs')
      .select('*')
      .eq('learning_path_id', pathId)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
    
    if (error) {
      console.error('Error fetching project briefs:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('Exception fetching project briefs:', error)
    return []
  }
}

// ================================
// INTERVIEW ROLE OPERATIONS
// ================================

/**
 * Get interview roles for a learning path
 */
export async function getInterviewRolesByPath(pathId: string): Promise<DatabaseInterviewRole[]> {
  try {
    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase
      .from('interview_roles')
      .select('*')
      .eq('learning_path_id', pathId)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
    
    if (error) {
      console.error('Error fetching interview roles:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('Exception fetching interview roles:', error)
    return []
  }
}

// ================================
// COMPLETE LEARNING PATH WITH CONTENT
// ================================

/**
 * Get a complete learning path with all its content
 */
export async function getLearningPathWithContent(pathId: string): Promise<LearningPathWithContent | null> {
  try {
    const [path, courses, projects, interviewRoles] = await Promise.all([
      getLearningPath(pathId),
      getCoursesByPath(pathId),
      getProjectBriefsByPath(pathId),
      getInterviewRolesByPath(pathId)
    ])
    
    if (!path) {
      return null
    }
    
    return {
      path,
      courses,
      projects,
      interviewRoles
    }
  } catch (error) {
    console.error('Exception fetching complete learning path:', error)
    return null
  }
}

// ================================
// USER RECOMMENDATIONS
// ================================

/**
 * Get recommended learning paths for a user
 */
export async function getUserRecommendedPaths(userId: string): Promise<UserLearningPathRecommendation[]> {
  try {
    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase
      .rpc('get_user_recommended_paths', {
        p_user_id: userId
      })
    
    if (error) {
      console.error('Error fetching user recommended paths:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('Exception fetching user recommended paths:', error)
    return []
  }
}

/**
 * Get learning paths with user progress and recommendations
 */
export async function getLearningPathsWithProgress(userId: string): Promise<{
  paths: DatabaseLearningPath[]
  recommendations: UserLearningPathRecommendation[]
  progress: Record<string, any>
}> {
  try {
    const [paths, recommendations] = await Promise.all([
      getAllLearningPaths(),
      getUserRecommendedPaths(userId)
    ])
    
    // Get progress for all paths
    const { getDashboardLearningPathProgress } = await import('../learning-paths/learning-path-progress')
    const pathIds = paths.map(p => p.id)
    const progress = await getDashboardLearningPathProgress(userId, pathIds)
    
    return {
      paths,
      recommendations,
      progress
    }
  } catch (error) {
    console.error('Exception fetching learning paths with progress:', error)
    return {
      paths: [],
      recommendations: [],
      progress: {}
    }
  }
}

// ================================
// DATA MIGRATION AND SEEDING
// ================================

/**
 * Migrate static learning path data to database
 */
export async function migrateLearningPathData(): Promise<boolean> {
  try {
    const supabase = createSupabaseClient()
    
    // Import static data
    const { webDevelopmentData } = await import('../learning-paths/web-development-data')
    const { aiDataScienceData } = await import('../learning-paths/ai-data-science-data')
    const { digitalMarketingData } = await import('../learning-paths/digital-marketing-data')
    const { designCreativityData } = await import('../learning-paths/design-creativity-data')
    
    // Get learning path configs
    const { LEARNING_PATHS_CONFIG } = await import('../learning-paths/learning-paths-registry')
    
    const pathsToMigrate = [
      { id: 'web-development', data: webDevelopmentData },
      { id: 'ai-data-science', data: aiDataScienceData },
      { id: 'digital-marketing', data: digitalMarketingData },
      { id: 'design-creativity', data: designCreativityData }
    ]
    
    for (const { id, data } of pathsToMigrate) {
      const pathConfig = LEARNING_PATHS_CONFIG[id]
      if (!pathConfig) continue
      
      console.log(`Migrating ${id}...`)
      
      // Upsert learning path
      await supabase
        .from('learning_paths')
        .upsert({
          id: pathConfig.id,
          title: pathConfig.title,
          slug: pathConfig.slug,
          description: pathConfig.description,
          icon: pathConfig.icon,
          color: pathConfig.color,
          category: pathConfig.category,
          difficulty: pathConfig.difficulty,
          estimated_duration: pathConfig.estimatedDuration,
          prerequisites: pathConfig.prerequisites,
          skills: pathConfig.skills,
          career_outcomes: pathConfig.careerOutcomes,
          salary_range: pathConfig.salaryRange,
          unlocks: pathConfig.unlocks,
          is_active: true,
          sort_order: 0
        })
      
      // Migrate courses
      if (data.courses) {
        const coursesToInsert = data.courses.map((course, index) => ({
          id: course.id,
          learning_path_id: pathConfig.id,
          title: course.title,
          description: course.description,
          level: course.level,
          duration: course.duration,
          skills: course.skills,
          instructor: course.instructor,
          rating: course.rating,
          students: course.students,
          sort_order: index,
          is_active: true
        }))
        
        await supabase.from('courses').upsert(coursesToInsert)
      }
      
      // Migrate project briefs
      if (data.projectBriefs) {
        const projectsToInsert = data.projectBriefs.map((project, index) => ({
          id: project.id,
          learning_path_id: pathConfig.id,
          title: project.title,
          description: project.description,
          difficulty: project.difficulty,
          technologies: project.technologies,
          estimated_time: project.estimatedTime,
          skills: project.skills,
          deliverables: project.deliverables,
          sort_order: index,
          is_active: true
        }))
        
        await supabase.from('project_briefs').upsert(projectsToInsert)
      }
      
      // Migrate interview roles
      if (data.interviewRoles) {
        const rolesToInsert = data.interviewRoles.map((role, index) => ({
          id: role.id,
          learning_path_id: pathConfig.id,
          role: role.role,
          company: role.company,
          description: role.description,
          experience: role.experience,
          skills: role.skills,
          questions: role.questions,
          tips: role.tips,
          sort_order: index,
          is_active: true
        }))
        
        await supabase.from('interview_roles').upsert(rolesToInsert)
      }
      
      console.log(`✅ Migrated ${id}`)
    }
    
    return true
  } catch (error) {
    console.error('Error migrating learning path data:', error)
    return false
  }
}

// ================================
// LOCAL STORAGE FALLBACK
// ================================

const STORAGE_KEYS = {
  LEARNING_PATHS: 'skillforge_learning_paths',
  COURSES: 'skillforge_courses',
  USER_PROGRESS: 'skillforge_user_progress',
  LAST_SYNC: 'skillforge_last_sync'
}

/**
 * Get learning paths with local storage fallback
 */
export async function getLearningPathsWithFallback(): Promise<DatabaseLearningPath[]> {
  try {
    // Try database first
    const paths = await getAllLearningPaths()
    
    if (paths.length > 0) {
      // Cache in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.LEARNING_PATHS, JSON.stringify(paths))
        localStorage.setItem(STORAGE_KEYS.LAST_SYNC, Date.now().toString())
      }
      return paths
    }
    
    // Fallback to localStorage
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(STORAGE_KEYS.LEARNING_PATHS)
      if (cached) {
        console.log('📦 Using cached learning paths from localStorage')
        return JSON.parse(cached)
      }
    }
    
    // Final fallback to static registry
    console.log('📚 Using static learning paths registry as fallback')
    const { LEARNING_PATHS_CONFIG } = await import('../learning-paths/learning-paths-registry')
    return Object.values(LEARNING_PATHS_CONFIG).map(config => ({
      id: config.id,
      title: config.title,
      slug: config.slug,
      description: config.description,
      icon: config.icon,
      color: config.color,
      category: config.category as any,
      difficulty: config.difficulty as any,
      estimated_duration: config.estimatedDuration,
      prerequisites: config.prerequisites || null,
      skills: config.skills,
      career_outcomes: config.careerOutcomes,
      salary_range: config.salaryRange,
      unlocks: config.unlocks,
      is_active: true,
      sort_order: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))
    
  } catch (error) {
    console.error('Error in getLearningPathsWithFallback:', error)
    return []
  }
}

/**
 * Get learning path with content and local storage fallback
 */
export async function getLearningPathWithContentFallback(pathId: string): Promise<LearningPathWithContent | null> {
  try {
    // Try database first
    const content = await getLearningPathWithContent(pathId)
    
    if (content) {
      // Cache in localStorage
      if (typeof window !== 'undefined') {
        const cacheKey = `${STORAGE_KEYS.LEARNING_PATHS}_${pathId}`
        localStorage.setItem(cacheKey, JSON.stringify(content))
      }
      return content
    }
    
    // Fallback to localStorage
    if (typeof window !== 'undefined') {
      const cacheKey = `${STORAGE_KEYS.LEARNING_PATHS}_${pathId}`
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        console.log(`📦 Using cached learning path ${pathId} from localStorage`)
        return JSON.parse(cached)
      }
    }
    
    // Final fallback to static data
    console.log(`📚 Using static data for learning path ${pathId}`)
    return await getStaticLearningPathContent(pathId)
    
  } catch (error) {
    console.error(`Error in getLearningPathWithContentFallback for ${pathId}:`, error)
    return null
  }
}

/**
 * Get static learning path content as final fallback
 */
async function getStaticLearningPathContent(pathId: string): Promise<LearningPathWithContent | null> {
  try {
    const { LEARNING_PATHS_CONFIG } = await import('../learning-paths/learning-paths-registry')
    const pathConfig = LEARNING_PATHS_CONFIG[pathId]
    
    if (!pathConfig) {
      return null
    }
    
    // Import static data based on pathId
    let staticData: any = null
    
    switch (pathId) {
      case 'web-development':
        const { webDevelopmentData } = await import('../learning-paths/web-development-data')
        staticData = webDevelopmentData
        break
      case 'ai-data-science':
        const { aiDataScienceData } = await import('../learning-paths/ai-data-science-data')
        staticData = aiDataScienceData
        break
      case 'digital-marketing':
        const { digitalMarketingData } = await import('../learning-paths/digital-marketing-data')
        staticData = digitalMarketingData
        break
      case 'design-creativity':
        const { designCreativityData } = await import('../learning-paths/design-creativity-data')
        staticData = designCreativityData
        break
      default:
        return null
    }
    
    if (!staticData) {
      return null
    }
    
    // Transform static data to database format
    const path: DatabaseLearningPath = {
      id: pathConfig.id,
      title: pathConfig.title,
      slug: pathConfig.slug,
      description: pathConfig.description,
      icon: pathConfig.icon,
      color: pathConfig.color,
      category: pathConfig.category as any,
      difficulty: pathConfig.difficulty as any,
      estimated_duration: pathConfig.estimatedDuration,
      prerequisites: pathConfig.prerequisites || null,
      skills: pathConfig.skills,
      career_outcomes: pathConfig.careerOutcomes,
      salary_range: pathConfig.salaryRange,
      unlocks: pathConfig.unlocks,
      is_active: true,
      sort_order: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const courses = staticData.courses?.map((course: any, index: number) => ({
      id: course.id,
      learning_path_id: pathConfig.id,
      title: course.title,
      description: course.description,
      level: course.level,
      duration: course.duration,
      skills: course.skills,
      instructor: course.instructor,
      rating: course.rating,
      students: course.students,
      sort_order: index,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })) || []
    
    const projects = staticData.projectBriefs?.map((project: any, index: number) => ({
      id: project.id,
      learning_path_id: pathConfig.id,
      title: project.title,
      description: project.description,
      difficulty: project.difficulty,
      technologies: project.technologies,
      estimated_time: project.estimatedTime,
      skills: project.skills,
      deliverables: project.deliverables,
      sort_order: index,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })) || []
    
    const interviewRoles = staticData.interviewRoles?.map((role: any, index: number) => ({
      id: role.id,
      learning_path_id: pathConfig.id,
      role: role.role,
      company: role.company,
      description: role.description,
      experience: role.experience,
      skills: role.skills,
      questions: role.questions,
      tips: role.tips,
      sort_order: index,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })) || []
    
    return {
      path,
      courses,
      projects,
      interviewRoles
    }
    
  } catch (error) {
    console.error(`Error loading static content for ${pathId}:`, error)
    return null
  }
}

/**
 * Store user progress in local storage with sync flag
 */
export function storeProgressLocally(userId: string, pathId: string, progressData: any): void {
  if (typeof window === 'undefined') return
  
  try {
    const storageKey = `${STORAGE_KEYS.USER_PROGRESS}_${userId}_${pathId}`
    const dataToStore = {
      ...progressData,
      lastUpdated: Date.now(),
      needsSync: true
    }
    
    localStorage.setItem(storageKey, JSON.stringify(dataToStore))
    
    // Add to sync queue
    const syncQueueKey = 'skillforge_sync_queue'
    const existingQueue = localStorage.getItem(syncQueueKey)
    const syncQueue = existingQueue ? JSON.parse(existingQueue) : []
    
    // Add if not already in queue
    if (!syncQueue.some((item: any) => 
      item.userId === userId && item.pathId === pathId && item.type === 'progress'
    )) {
      syncQueue.push({
        type: 'progress',
        userId,
        pathId,
        timestamp: Date.now()
      })
      localStorage.setItem(syncQueueKey, JSON.stringify(syncQueue))
    }
  } catch (error) {
    console.error('Error storing progress locally:', error)
  }
}

/**
 * Get user progress with local storage fallback
 */
export function getProgressLocally(userId: string, pathId: string): any | null {
  if (typeof window === 'undefined') return null
  
  try {
    const storageKey = `${STORAGE_KEYS.USER_PROGRESS}_${userId}_${pathId}`
    const stored = localStorage.getItem(storageKey)
    
    if (stored) {
      return JSON.parse(stored)
    }
    
    return null
  } catch (error) {
    console.error('Error getting progress locally:', error)
    return null
  }
}

/**
 * Sync local progress data to database when connection is available
 */
export async function syncLocalProgressToDatabase(): Promise<void> {
  if (typeof window === 'undefined') return
  
  try {
    const syncQueueKey = 'skillforge_sync_queue'
    const syncQueue = localStorage.getItem(syncQueueKey)
    
    if (!syncQueue) return
    
    const queue = JSON.parse(syncQueue)
    const syncPromises = []
    
    for (const item of queue) {
      if (item.type === 'progress') {
        const progressData = getProgressLocally(item.userId, item.pathId)
        
        if (progressData && progressData.needsSync) {
          // Try to sync to database via API
          const syncPromise = fetch('/api/progress/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: item.userId,
              pathId: item.pathId,
              progressData
            })
          })
          .then(response => {
            if (response.ok) {
              // Mark as synced
              delete progressData.needsSync
              progressData.lastSynced = Date.now()
              const storageKey = `${STORAGE_KEYS.USER_PROGRESS}_${item.userId}_${item.pathId}`
              localStorage.setItem(storageKey, JSON.stringify(progressData))
              return item
            }
            throw new Error('Sync failed')
          })
          .catch(error => {
            console.error('Failed to sync progress:', error)
            return null
          })
          
          syncPromises.push(syncPromise)
        }
      }
    }
    
    // Wait for all sync operations
    const results = await Promise.allSettled(syncPromises)
    
    // Remove successfully synced items from queue
    const successfulSyncs = results
      .filter(result => result.status === 'fulfilled' && result.value)
      .map(result => (result as PromiseFulfilledResult<any>).value)
    
    if (successfulSyncs.length > 0) {
      const remainingQueue = queue.filter((item: any) => 
        !successfulSyncs.some(synced => 
          synced.userId === item.userId && 
          synced.pathId === item.pathId && 
          synced.type === item.type
        )
      )
      
      localStorage.setItem(syncQueueKey, JSON.stringify(remainingQueue))
      console.log(`✅ Synced ${successfulSyncs.length} progress items to database`)
    }
    
  } catch (error) {
    console.error('Error syncing local progress to database:', error)
  }
}

/**
 * Clear local storage cache
 */
export function clearLearningPathsCache(): void {
  if (typeof window !== 'undefined') {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
    // Also clear sync queue
    localStorage.removeItem('skillforge_sync_queue')
  }
}