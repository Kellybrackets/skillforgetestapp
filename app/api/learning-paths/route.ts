// app/api/learning-paths/route.ts - API routes for learning paths
import { NextRequest, NextResponse } from 'next/server'
import { 
  getAllLearningPaths, 
  getLearningPathsByCategory, 
  searchLearningPaths,
  getLearningPathsWithProgress,
  migrateLearningPathData 
} from '@/lib/database/learning-paths'
import { createSupabaseClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const userId = searchParams.get('userId')
    const includeProgress = searchParams.get('includeProgress') === 'true'
    
    // If user ID and progress requested, return complete data
    if (userId && includeProgress) {
      const data = await getLearningPathsWithProgress(userId)
      return NextResponse.json(data)
    }
    
    let paths
    
    // Handle search
    if (search) {
      paths = await searchLearningPaths(search)
      return NextResponse.json({ paths, total: paths.length })
    }
    
    // Handle category filter
    if (category) {
      paths = await getLearningPathsByCategory(category)
      return NextResponse.json({ paths, total: paths.length })
    }
    
    // Default: return all paths
    paths = await getAllLearningPaths()
    return NextResponse.json({ paths, total: paths.length })
    
  } catch (error) {
    console.error('Error in learning-paths API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch learning paths' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Handle data migration request
    if (body.action === 'migrate') {
      const success = await migrateLearningPathData()
      return NextResponse.json({ 
        success, 
        message: success ? 'Migration completed successfully' : 'Migration failed' 
      })
    }
    
    return NextResponse.json(
      { error: 'Unknown action' },
      { status: 400 }
    )
    
  } catch (error) {
    console.error('Error in learning-paths POST API:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}