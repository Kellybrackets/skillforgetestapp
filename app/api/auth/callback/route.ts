import { createSupabaseClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/quiz'

  if (code) {
    const supabase = createSupabaseClient()
    
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Auth callback error:', error)
        return NextResponse.redirect(new URL('/login?error=auth_callback_error', request.url))
      }
    } catch (error) {
      console.error('Auth callback exception:', error)
      return NextResponse.redirect(new URL('/login?error=auth_callback_error', request.url))
    }
  }

  // Redirect to the intended destination
  return NextResponse.redirect(new URL(next, request.url))
}
