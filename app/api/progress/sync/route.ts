// app/api/progress/sync/route.ts - API for syncing offline progress
import { NextRequest, NextResponse } from 'next/server'
import { 
  updateCourseProgress, 
  markCourseCompleted, 
  startCourse 
} from '@/lib/learning-paths/learning-path-progress'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, pathId, progressData } = body
    
    if (!userId || !pathId || !progressData) {
      return NextResponse.json(
        { error: 'userId, pathId, and progressData are required' },
        { status: 400 }
      )
    }
    
    console.log(`🔄 Syncing offline progress for user ${userId}, path ${pathId}`)
    
    // Sync course progress if present
    if (progressData.courses) {
      const syncPromises = []
      
      for (const [courseId, courseData] of Object.entries(progressData.courses)) {
        const data = courseData as any
        
        if (data.status && data.status !== 'not_started') {
          let syncPromise: Promise<boolean>
          
          switch (data.status) {
            case 'in_progress':
              syncPromise = updateCourseProgress(
                userId,
                pathId,
                courseId,
                data.title || 'Course',
                'in_progress',
                data.progressPercentage || 0
              )
              break
              
            case 'completed':
              syncPromise = markCourseCompleted(
                userId,
                pathId,
                courseId,
                data.title || 'Course'
              )
              break
              
            default:
              syncPromise = startCourse(
                userId,
                pathId,
                courseId,
                data.title || 'Course'
              )
              break
          }
          
          syncPromises.push(syncPromise)
        }
      }
      
      // Wait for all course syncs to complete
      const results = await Promise.allSettled(syncPromises)
      const successCount = results.filter(r => r.status === 'fulfilled' && r.value).length
      const failCount = results.length - successCount
      
      console.log(`✅ Synced ${successCount} course progress items, ${failCount} failed`)
    }
    
    // Sync path-level progress if present
    if (progressData.pathProgress) {
      // Handle path-level progress sync if needed
      console.log('📊 Path-level progress sync not yet implemented')
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Progress synced successfully' 
    })
    
  } catch (error) {
    console.error('Error syncing offline progress:', error)
    return NextResponse.json(
      { error: 'Failed to sync progress' },
      { status: 500 }
    )
  }
}