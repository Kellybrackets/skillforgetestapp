import { createSupabaseClient } from '@/lib/supabase'

export interface LearningPathProgress {
  learning_path_id: string
  total_courses: number
  completed_courses: number
  progress_percentage: number
  started_at?: string
  last_updated?: string
}

export interface CourseProgress {
  course_id: string
  course_title: string
  status: 'not_started' | 'in_progress' | 'completed'
  progress_percentage: number
  started_at?: string
  completed_at?: string
  last_updated?: string
}

/**
 * Get learning path progress summary for a user
 */
export async function getUserLearningPathProgress(userId: string): Promise<Record<string, LearningPathProgress>> {
  try {
    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase
      .from('user_learning_path_summary')
      .select('*')
      .eq('user_id', userId)
    
    if (error) {
      console.error('Error fetching learning path progress:', error)
      return {}
    }
    
    // Convert to object keyed by learning_path_id for easy lookup
    const progressMap: Record<string, LearningPathProgress> = {}
    data?.forEach(item => {
      progressMap[item.learning_path_id] = item
    })
    
    return progressMap
  } catch (error) {
    console.error('Exception fetching learning path progress:', error)
    return {}
  }
}

/**
 * Get progress for a specific learning path
 */
export async function getSpecificPathProgress(
  userId: string, 
  pathId: string
): Promise<LearningPathProgress | null> {
  try {
    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase
      .from('user_learning_path_summary')
      .select('*')
      .eq('user_id', userId)
      .eq('learning_path_id', pathId)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No progress yet, return default
        return {
          learning_path_id: pathId,
          total_courses: 0,
          completed_courses: 0,
          progress_percentage: 0
        }
      }
      console.error('Error fetching specific path progress:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Exception fetching specific path progress:', error)
    return null
  }
}

/**
 * Get detailed course progress for a specific learning path
 */
export async function getCourseProgress(
  userId: string, 
  pathId: string
): Promise<CourseProgress[]> {
  try {
    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase
      .from('user_course_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('learning_path_id', pathId)
      .order('last_updated', { ascending: false })
    
    if (error) {
      console.error('Error fetching course progress:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('Exception fetching course progress:', error)
    return []
  }
}

/**
 * Update course progress manually
 */
export async function updateCourseProgress(
  userId: string,
  pathId: string,
  courseId: string,
  courseTitle: string,
  status: 'not_started' | 'in_progress' | 'completed',
  progressPercentage: number = 0
): Promise<boolean> {
  try {
    const supabase = createSupabaseClient()
    
    const updateData: any = {
      user_id: userId,
      learning_path_id: pathId,
      course_id: courseId,
      course_title: courseTitle,
      status,
      progress_percentage: progressPercentage,
      last_updated: new Date().toISOString()
    }
    
    // Set timestamps based on status
    if (status === 'in_progress') {
      updateData.started_at = new Date().toISOString()
    }
    
    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString()
      updateData.progress_percentage = 100
      updateData.started_at = new Date().toISOString() // Ensure started_at is set
    }
    
    const { error } = await supabase
      .from('user_course_progress')
      .upsert(updateData, {
        onConflict: 'user_id,learning_path_id,course_id'
      })
    
    if (error) {
      console.error('Error updating course progress:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Exception updating course progress:', error)
    return false
  }
}

/**
 * Mark course as completed using database function
 */
export async function markCourseCompleted(
  userId: string,
  pathId: string,
  courseId: string,
  courseTitle: string
): Promise<boolean> {
  try {
    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase
      .rpc('mark_course_completed', {
        p_user_id: userId,
        p_learning_path_id: pathId,
        p_course_id: courseId,
        p_course_title: courseTitle
      })
    
    if (error) {
      console.error('Error marking course completed:', error)
      return false
    }
    
    return data === true
  } catch (error) {
    console.error('Exception marking course completed:', error)
    return false
  }
}

/**
 * Start a course using database function
 */
export async function startCourse(
  userId: string,
  pathId: string,
  courseId: string,
  courseTitle: string
): Promise<boolean> {
  try {
    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase
      .rpc('start_course', {
        p_user_id: userId,
        p_learning_path_id: pathId,
        p_course_id: courseId,
        p_course_title: courseTitle
      })
    
    if (error) {
      console.error('Error starting course:', error)
      return false
    }
    
    return data === true
  } catch (error) {
    console.error('Exception starting course:', error)
    return false
  }
}

/**
 * Get learning path progress for dashboard (includes default values)
 */
export async function getDashboardLearningPathProgress(
  userId: string,
  pathIds: string[]
): Promise<Record<string, LearningPathProgress>> {
  const progressMap = await getUserLearningPathProgress(userId)
  
  // Ensure all requested paths have entries (with defaults if no progress)
  const result: Record<string, LearningPathProgress> = {}
  
  pathIds.forEach(pathId => {
    result[pathId] = progressMap[pathId] || {
      learning_path_id: pathId,
      total_courses: 0,
      completed_courses: 0,
      progress_percentage: 0
    }
  })
  
  return result
}