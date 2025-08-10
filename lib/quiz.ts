// lib/quiz.ts - Complete integrated Quiz database operations

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

// Enhanced learning path mapping function with updated routing
const mapToLearningPaths = (answers: QuizAnswer[], skillLevels: Record<string, number>): string[] => {
  const recommendations: string[] = []
  
  // Find the primary interest from the first question
  const primaryInterestAnswer = answers.find(answer => answer.questionId === 'q1')
  const primaryInterest = primaryInterestAnswer?.value
  
  // Get additional context from other answers
  const timeCommitment = answers.find(answer => answer.questionId === 'q4-time')?.value || 'medium'
  const learningStyle = answers.find(answer => answer.questionId === 'q5-learning')?.value || 'interactive'
  const goal = answers.find(answer => answer.questionId === 'q6-goals')?.value || 'personal'
  
  // Get the highest skill level to determine experience
  const maxSkillLevel = Math.max(...Object.values(skillLevels))
  
  // Get specific sub-interest
  let subInterest = ''
  if (primaryInterest === 'design') {
    subInterest = answers.find(answer => answer.questionId === 'q2-design')?.value || ''
  } else if (primaryInterest === 'ai') {
    subInterest = answers.find(answer => answer.questionId === 'q2-ai')?.value || ''
  } else if (primaryInterest === 'marketing') {
    subInterest = answers.find(answer => answer.questionId === 'q2-marketing')?.value || ''
  } else if (primaryInterest === 'webdev') {
    subInterest = answers.find(answer => answer.questionId === 'q2-webdev')?.value || ''
  }

  // Map to learning paths based on primary interest and specifics
  switch (primaryInterest) {
    case 'design':
      if (subInterest === 'uiux') {
        if (maxSkillLevel >= 7) {
          recommendations.push('Advanced UI/UX Design', 'Design Systems Mastery')
        } else {
          recommendations.push('UI/UX Design Fundamentals', 'Design & Creativity Learning Path')
        }
      } else if (subInterest === 'graphic') {
        recommendations.push('Graphic Design Professional', 'Design & Creativity Learning Path')
      } else if (subInterest === 'animation') {
        // Get specific animation type from q3-animation
        const animationType = answers.find(answer => answer.questionId === 'q3-animation')?.value || ''
        if (animationType === '3d') {
          recommendations.push('3D Modeling & Animation', 'Design & Creativity Learning Path')
        } else if (animationType === '2d') {
          recommendations.push('Motion Graphics & 2D Animation', 'Design & Creativity Learning Path')
        } else if (animationType === 'video') {
          recommendations.push('Video Production & Editing', 'Design & Creativity Learning Path')
        } else if (animationType === 'character') {
          recommendations.push('Character Animation', 'Design & Creativity Learning Path')
        } else {
          recommendations.push('Animation & Motion Graphics', 'Design & Creativity Learning Path')
        }
      } else if (subInterest === 'photo') {
        recommendations.push('Photography Mastery', 'Design & Creativity Learning Path')
      } else {
        // Fallback for design
        recommendations.push('Creative Design Fundamentals', 'Design & Creativity Learning Path')
      }
      break
      
    case 'ai':
      if (subInterest === 'ml-basics') {
        if (maxSkillLevel >= 7) {
          recommendations.push('Advanced Machine Learning', 'AI & Data Science Learning Path')
        } else {
          recommendations.push('Data Science Fundamentals', 'AI & Data Science Learning Path')
        }
      } else if (subInterest === 'nlp') {
        recommendations.push('Natural Language Processing', 'AI & Data Science Learning Path')
      } else if (subInterest === 'cv') {
        recommendations.push('Computer Vision & Image AI', 'AI & Data Science Learning Path')
      } else if (subInterest === 'data-analytics') {
        // Get specific data analytics level from q3-data-analytics
        const analyticsLevel = answers.find(answer => answer.questionId === 'q3-data-analytics')?.value || ''
        if (analyticsLevel === 'advanced') {
          recommendations.push('Advanced Business Intelligence', 'AI & Data Science Learning Path')
        } else if (analyticsLevel === 'intermediate') {
          recommendations.push('SQL & Database Analytics', 'AI & Data Science Learning Path')
        } else {
          recommendations.push('Data Analytics Fundamentals', 'AI & Data Science Learning Path')
        }
      } else {
        // Fallback for AI
        recommendations.push('Data Science Fundamentals', 'AI & Data Science Learning Path')
      }
      break
      
    case 'marketing':
      if (subInterest === 'social') {
        recommendations.push('Social Media Marketing', 'Digital Marketing Learning Path')
      } else if (subInterest === 'content') {
        recommendations.push('Content Marketing Mastery', 'Digital Marketing Learning Path')
      } else if (subInterest === 'seo') {
        recommendations.push('SEO & Analytics', 'Digital Marketing Learning Path')
      } else if (subInterest === 'email') {
        recommendations.push('Email Marketing Automation', 'Digital Marketing Learning Path')
      } else {
        // Fallback for marketing
        recommendations.push('Digital Marketing Professional', 'Digital Marketing Learning Path')
      }
      break
      
    case 'webdev':
      if (subInterest === 'frontend') {
        if (maxSkillLevel >= 7) {
          recommendations.push('Advanced Frontend Development', 'Web Development Learning Path')
        } else {
          recommendations.push('Frontend Development Mastery', 'Web Development Learning Path')
        }
      } else if (subInterest === 'backend') {
        if (maxSkillLevel >= 7) {
          recommendations.push('Advanced Backend Development', 'Web Development Learning Path')
        } else {
          recommendations.push('Backend Development', 'Web Development Learning Path')
        }
      } else if (subInterest === 'fullstack') {
        if (maxSkillLevel >= 7) {
          recommendations.push('Full-Stack Web Development', 'Web Development Learning Path')
        } else {
          recommendations.push('Full-Stack Web Development', 'Web Development Learning Path')
        }
      } else if (subInterest === 'mobile') {
        recommendations.push('Mobile App Development', 'Web Development Learning Path')
      } else {
        // Fallback for webdev
        recommendations.push('Frontend Development Mastery', 'Web Development Learning Path')
      }
      break
      
    default:
      // Fallback to general paths
      recommendations.push('Digital Literacy Fundamentals', 'Web Development Learning Path')
  }

  // Add goal-based paths
  if (goal === 'freelance') {
    recommendations.push('Freelancer Success Skills') // This will trigger the freelance module
  } else if (goal === 'employment') {
    recommendations.push('Job Readiness Program', 'Interview & Portfolio Preparation')
  } else if (goal === 'business') {
    recommendations.push('Entrepreneurship Bootcamp', 'Startup Fundamentals')
  }

  // Add time-based adjustments
  if (timeCommitment === 'intensive') {
    recommendations.push('Accelerated Learning Track')
  } else if (timeCommitment === 'low') {
    recommendations.push('Part-Time Learning Path')
  }

  // Add advanced paths for experienced learners
  if (maxSkillLevel >= 8) {
    recommendations.push('Advanced Specialization Track')
  }

  // Remove duplicates and limit to top 5 recommendations
  const uniqueRecommendations = [...new Set(recommendations)]
  return uniqueRecommendations.slice(0, 5)
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

// Quiz completion redirect logic for app/quiz/page.tsx
export const handleQuizCompletion = (answers: QuizAnswer[], router: any) => {
  const primaryInterestAnswer = answers.find(answer => answer.questionId === 'q1')
  const primaryInterest = primaryInterestAnswer?.value
  
  // Redirect to appropriate learning path based on primary interest
  switch (primaryInterest) {
    case 'design':
      router.push('/learning-paths/design-creativity')
      break
    case 'ai':
      router.push('/learning-paths/ai-data-science')
      break
    case 'marketing':
      router.push('/learning-paths/digital-marketing')
      break
    case 'webdev':
      router.push('/learning-paths/web-development')
      break
    default:
      router.push('/learning-paths') // Goes to path selection page
  }
}