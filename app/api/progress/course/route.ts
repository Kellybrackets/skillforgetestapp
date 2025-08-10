// app/api/progress/course/route.ts - API for course progress tracking
import { NextRequest, NextResponse } from 'next/server'
import { 
  updateCourseProgress, 
  markCourseCompleted, 
  startCourse,
  getCourseProgress
} from '@/lib/learning-paths/learning-path-progress'
import { createSupabaseClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const pathId = searchParams.get('pathId')
    
    if (!userId || !pathId) {
      return NextResponse.json(
        { error: 'userId and pathId are required' },
        { status: 400 }
      )
    }
    
    const progress = await getCourseProgress(userId, pathId)
    return NextResponse.json({ progress })
    
  } catch (error) {
    console.error('Error fetching course progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      action, 
      userId, 
      pathId, 
      courseId, 
      courseTitle, 
      status, 
      progressPercentage 
    } = body
    
    if (!action || !userId || !pathId || !courseId || !courseTitle) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    let success = false
    
    switch (action) {
      case 'start':
        success = await startCourse(userId, pathId, courseId, courseTitle)
        break
        
      case 'update':
        if (status && progressPercentage !== undefined) {
          success = await updateCourseProgress(
            userId, 
            pathId, 
            courseId, 
            courseTitle, 
            status, 
            progressPercentage
          )
        } else {
          return NextResponse.json(
            { error: 'Status and progressPercentage required for update' },
            { status: 400 }
          )
        }
        break
        
      case 'complete':
        success = await markCourseCompleted(userId, pathId, courseId, courseTitle)
        break
        
      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: start, update, or complete' },
          { status: 400 }
        )
    }
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: `Course ${action} successful` 
      })
    } else {
      return NextResponse.json(
        { error: `Failed to ${action} course` },
        { status: 500 }
      )
    }
    
  } catch (error) {
    console.error('Error updating course progress:', error)
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  // Alias for POST for updating progress
  return POST(request)
}