// app/api/profiles/[userId]/route.ts - Public profile viewing
import { NextRequest, NextResponse } from 'next/server'
import { getPublicUserProfile } from '@/lib/user-profiles'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const profile = await getPublicUserProfile(params.userId)
    
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found or not public' }, { status: 404 })
    }
    
    return NextResponse.json({ profile })
  } catch (error: any) {
    console.error('Public profile GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}