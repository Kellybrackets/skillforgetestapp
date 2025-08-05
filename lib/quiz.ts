// lib/quiz.ts - Fixed Quiz database operations

import { createSupabaseClient } from '@/lib/supabase'
import { QuizAnswer, analyzeQuizResults, getBadge } from './quiz-logic'

export interface QuizResult {
  id?: string
  user_id: string
  assessment_data: {
    answers: QuizAnswer[]
    skillLevels: Record<string, number>
    badge: {
      name: string
      description: string
      icon: string
    }
    summary: string
    quiz_type: 'advanced_assessment'
    completed_at: string
  }
  recommended_paths?: string[]
  completed_at?: string
}

// Check if user has completed the quiz
export const hasUserCompletedQuiz = async (userId: string): Promise<boolean> => {
    try {
      const supabase = createSupabaseClient()
      
      // Make sure we have a valid session first
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        console.log('❌ No active session for database query')
        return false // Don't throw, just return false
      }
      
      console.log('🔍 Querying database with session for user:', userId)
      
      // Use select with count to avoid multiple rows issue
      const { data, error, count } = await supabase
        .from('user_assessments')
        .select('id', { count: 'exact' })
        .eq('user_id', userId)
      
      if (error) {
        console.log('Database error details:', error)
        console.error('Database access error:', error)
        return false // Don't throw, just return false
      }
      
      const hasCompleted = (count || 0) > 0
      console.log(`📊 User ${userId} quiz completion status:`, hasCompleted, `(${count} records found)`)
      return hasCompleted
      
    } catch (error: any) {
      console.error('Exception checking quiz completion:', error)
      return false // Don't throw, return false to prevent app breaking
    }
  }

// Get user's quiz results
export const getUserQuizResults = async (userId: string): Promise<QuizResult | null> => {
  try {
    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase
      .from('user_assessments')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(1)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching quiz results:', error)
      return null
    }
    
    return data || null
    
  } catch (error) {
    console.error('Exception fetching quiz results:', error)
    return null
  }
}

// Map quiz results to learning paths from your database
const mapToLearningPaths = (answers: QuizAnswer[], skillLevels: Record<string, number>): string[] => {
  const recommendations: string[] = []
  
  // Find the primary interest from the first question
  const primaryInterestAnswer = answers.find(answer => answer.questionId === 'q1')
  const primaryInterest = primaryInterestAnswer?.value
  
  // Get the highest skill level to determine experience
  const maxSkillLevel = Math.max(...Object.values(skillLevels))
  
  // Map to your existing learning paths based on interest and skill level
  switch (primaryInterest) {
    case 'design':
      // Check for specific design area
      const designSpecific = answers.find(answer => answer.questionId === 'q2-design')?.value
      if (designSpecific === 'uiux') {
        recommendations.push('Frontend Development Mastery') // Your existing path
      } else {
        recommendations.push('Frontend Development Mastery') // Default for design
      }
      break
      
    case 'ai':
      recommendations.push('Data Science Fundamentals') // Your existing path
      break
      
    case 'marketing':
      recommendations.push('Digital Marketing Professional') // Your existing path
      break
      
    case 'webdev':
      // Check for specific web dev area and skill level
      const webdevSpecific = answers.find(answer => answer.questionId === 'q2-webdev')?.value
      if (webdevSpecific === 'fullstack' || maxSkillLevel >= 7) {
        recommendations.push('Full-Stack Web Development') // Your existing path
      } else {
        recommendations.push('Frontend Development Mastery') // Your existing path
      }
      break
      
    default:
      // Fallback to a general path
      recommendations.push('Frontend Development Mastery')
  }
  
  // Add cloud path for advanced users
  if (maxSkillLevel >= 8) {
    recommendations.push('Cloud-Native Development')
  }
  
  return recommendations
}

// Save quiz results to database using existing user_assessments table
export const saveQuizResults = async (quizAnswers: QuizAnswer[], userId: string): Promise<boolean> => {
  try {
    const supabase = createSupabaseClient()
    
    console.log('🔍 Starting quiz analysis...')
    
    // Analyze the quiz results using your advanced logic
    const analysis = analyzeQuizResults(quizAnswers)
    const badge = getBadge(quizAnswers)
    
    console.log('📊 Analysis complete:', {
      summary: analysis.summary,
      skillLevels: analysis.skillLevels,
      badge: badge.name,
    })
    
    // Map to your learning paths
    const recommendedPaths = mapToLearningPaths(quizAnswers, analysis.skillLevels)
    
    const assessmentData = {
      answers: quizAnswers,
      skillLevels: analysis.skillLevels,
      badge,
      summary: analysis.summary,
      quiz_type: 'advanced_assessment' as const,
      completed_at: new Date().toISOString()
    }
    
    console.log('💾 Saving to database...')
    
    const { error } = await supabase
      .from('user_assessments')
      .insert({
        user_id: userId,
        assessment_data: assessmentData,
        recommended_paths: recommendedPaths,
        completed_at: new Date().toISOString()
      })
    
    if (error) {
      console.error('Database save error:', error)
      return false
    }
    
    console.log('✅ Quiz results saved successfully')
    return true
    
  } catch (error) {
    console.error('Exception in saveQuizResults:', error)
    return false
  }
}

// Delete quiz results (for retaking) - removes from user_assessments
export const deleteQuizResults = async (userId: string): Promise<boolean> => {
  try {
    const supabase = createSupabaseClient()
    
    const { error } = await supabase
      .from('user_assessments')
      .delete()
      .eq('user_id', userId)
    
    if (error) {
      console.error('Error deleting quiz results:', error)
      return false
    }
    
    console.log('🗑️ Quiz results deleted from user_assessments table')
    return true
    
  } catch (error) {
    console.error('Exception deleting quiz results:', error)
    return false
  }
}

// Get recommended learning paths for a user
export const getRecommendedPaths = async (userId: string) => {
  try {
    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase
      .from('user_assessments')
      .select('recommended_paths, assessment_data')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(1)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching recommended paths:', error)
      return { paths: [], analysis: null }
    }
    
    return { 
      paths: data?.recommended_paths || [], 
      analysis: data?.assessment_data || null 
    }
    
  } catch (error) {
    console.error('Exception fetching recommended paths:', error)
    return { paths: [], analysis: null }
  }
}

// Get user's skill levels from assessment
export const getUserSkillLevels = async (userId: string): Promise<Record<string, number>> => {
  try {
    const results = await getUserQuizResults(userId)
    return results?.assessment_data?.skillLevels || {}
  } catch (error) {
    console.error('Error fetching user skill levels:', error)
    return {}
  }
}

// Get user's badge from assessment
export const getUserBadge = async (userId: string) => {
  try {
    const results = await getUserQuizResults(userId)
    return results?.assessment_data?.badge || null
  } catch (error) {
    console.error('Error fetching user badge:', error)
    return null
  }
}