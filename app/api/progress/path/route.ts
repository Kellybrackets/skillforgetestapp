// app/api/progress/path/route.ts - API for learning path progress
import { NextRequest, NextResponse } from 'next/server'
import { 
  getUserLearningPathProgress,
  getSpecificPathProgress,
  getDashboardLearningPathProgress
} from '@/lib/learning-paths/learning-path-progress'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const pathId = searchParams.get('pathId')
    const pathIds = searchParams.get('pathIds')?.split(',')
    const dashboard = searchParams.get('dashboard') === 'true'
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }
    
    // Get specific path progress
    if (pathId) {
      const progress = await getSpecificPathProgress(userId, pathId)
      return NextResponse.json({ progress })
    }
    
    // Get multiple paths for dashboard
    if (dashboard && pathIds) {
      const progress = await getDashboardLearningPathProgress(userId, pathIds)
      return NextResponse.json({ progress })
    }
    
    // Get all path progress for user
    const allProgress = await getUserLearningPathProgress(userId)
    return NextResponse.json({ progress: allProgress })
    
  } catch (error) {
    console.error('Error fetching path progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}