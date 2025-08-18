// app/api/learning-paths/route.ts - Optimized API routes for learning paths
import { NextRequest, NextResponse } from 'next/server'
import { 
  getAllLearningPaths, 
  getLearningPathsByCategory, 
  searchLearningPaths,
  getLearningPathsWithProgress,
  migrateLearningPathData 
} from '@/lib/database/learning-paths'
import { createSupabaseClient } from '@/lib/supabase'

// Simple in-memory cache for static data
const cache = new Map<string, { data: any; expires: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

function getCachedData(key: string) {
  const cached = cache.get(key)
  if (cached && cached.expires > Date.now()) {
    return cached.data
  }
  return null
}

function setCachedData(key: string, data: any) {
  cache.set(key, {
    data,
    expires: Date.now() + CACHE_DURATION
  })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const userId = searchParams.get('userId')
    const includeProgress = searchParams.get('includeProgress') === 'true'
    
    // Create cache key
    const cacheKey = `${category || 'all'}-${search || 'none'}-${userId || 'none'}-${includeProgress}`
    
    // If user ID and progress requested, return complete data (no caching for user-specific data)
    if (userId && includeProgress) {
      const data = await getLearningPathsWithProgress(userId)
      
      // Set cache headers for client-side caching
      const response = NextResponse.json(data)
      response.headers.set('Cache-Control', 'private, max-age=300') // 5 minutes
      return response
    }
    
    // Check cache for non-user-specific data
    if (!userId) {
      const cachedData = getCachedData(cacheKey)
      if (cachedData) {
        const response = NextResponse.json(cachedData)
        response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600')
        response.headers.set('X-Cache', 'HIT')
        return response
      }
    }
    
    let paths
    
    // Handle search (no caching for search to ensure fresh results)
    if (search) {
      paths = await searchLearningPaths(search)
      const result = { paths, total: paths.length }
      const response = NextResponse.json(result)
      response.headers.set('Cache-Control', 'public, max-age=60') // 1 minute for search
      return response
    }
    
    // Handle category filter
    if (category) {
      paths = await getLearningPathsByCategory(category)
      const result = { paths, total: paths.length }
      setCachedData(cacheKey, result)
      const response = NextResponse.json(result)
      response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600')
      response.headers.set('X-Cache', 'MISS')
      return response
    }
    
    // Default: return all paths
    paths = await getAllLearningPaths()
    const result = { paths, total: paths.length }
    setCachedData(cacheKey, result)
    
    const response = NextResponse.json(result)
    response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600')
    response.headers.set('X-Cache', 'MISS')
    return response
    
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