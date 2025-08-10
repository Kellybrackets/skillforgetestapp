// app/api/learning-paths/[pathId]/route.ts - API routes for specific learning path
import { NextRequest, NextResponse } from 'next/server'
import { 
  getLearningPath,
  getLearningPathWithContent,
  getCoursesByPath,
  getProjectBriefsByPath,
  getInterviewRolesByPath
} from '@/lib/database/learning-paths'

interface RouteParams {
  params: {
    pathId: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { pathId } = params
    const { searchParams } = new URL(request.url)
    const includeContent = searchParams.get('includeContent') === 'true'
    const contentType = searchParams.get('contentType') // 'courses', 'projects', 'interviews'
    
    // If full content requested, return everything
    if (includeContent) {
      const data = await getLearningPathWithContent(pathId)
      if (!data) {
        return NextResponse.json(
          { error: 'Learning path not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(data)
    }
    
    // If specific content type requested
    if (contentType) {
      let content
      switch (contentType) {
        case 'courses':
          content = await getCoursesByPath(pathId)
          break
        case 'projects':
          content = await getProjectBriefsByPath(pathId)
          break
        case 'interviews':
          content = await getInterviewRolesByPath(pathId)
          break
        default:
          return NextResponse.json(
            { error: 'Invalid content type' },
            { status: 400 }
          )
      }
      return NextResponse.json({ [contentType]: content })
    }
    
    // Default: return just the learning path
    const path = await getLearningPath(pathId)
    if (!path) {
      return NextResponse.json(
        { error: 'Learning path not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(path)
    
  } catch (error) {
    console.error('Error in learning-path API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch learning path' },
      { status: 500 }
    )
  }
}