// app/api/profiles/search/route.ts - Search public profiles (separate file)
import { NextRequest, NextResponse } from 'next/server'
import { searchUserProfiles} from '@/lib/user-profiles'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    if (!query || query.trim().length < 2) {
      return NextResponse.json({ error: 'Query must be at least 2 characters' }, { status: 400 })
    }
    
    if (limit < 1 || limit > 50) {
      return NextResponse.json({ error: 'Limit must be between 1 and 50' }, { status: 400 })
    }
    
    const profiles = await searchUserProfiles(query.trim(), limit)
    
    return NextResponse.json({ profiles, query: query.trim(), limit })
  } catch (error: any) {
    console.error('Profile search GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
