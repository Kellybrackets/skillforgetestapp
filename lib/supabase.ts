import { createBrowserClient, createServerClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// For client-side usage (browser)
export const createSupabaseClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// For server-side usage (API routes, middleware)
export const createSupabaseServerClient = (cookieStore: any) => {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // Handle cookie errors in Server Components
          console.warn('Cookie set error:', error)
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set({ name, value: '', ...options })
        } catch (error) {
          // Handle cookie errors in Server Components
          console.warn('Cookie remove error:', error)
        }
      },
    },
  })
}

// Enhanced auth functions with better error handling
export const signUp = async (email: string, password: string, fullName?: string) => {
  const supabase = createSupabaseClient()
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          full_name: fullName?.trim() || '',
        },
      },
    })
    
    return { data, error }
  } catch (error: any) {
    console.error('SignUp error:', error)
    return { data: null, error: { message: error.message || 'Signup failed' } }
  }
}

export const signIn = async (email: string, password: string) => {
  const supabase = createSupabaseClient()
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })
    
    if (error) {
      console.error('SignIn error:', error.message)
    }
    
    return { data, error }
  } catch (error: any) {
    console.error('SignIn error:', error)
    return { data: null, error: { message: error.message || 'Login failed' } }
  }
}

export const signOut = async () => {
  const supabase = createSupabaseClient()
  
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('SignOut error:', error.message)
    }
    
    return { error }
  } catch (error: any) {
    console.error('SignOut error:', error)
    return { error: { message: error.message || 'Logout failed' } }
  }
}

export const getCurrentUser = async () => {
  const supabase = createSupabaseClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('GetCurrentUser error:', error.message)
    }
    
    return { user, error }
  } catch (error: any) {
    console.error('GetCurrentUser error:', error)
    return { user: null, error: { message: error.message || 'Failed to get user' } }
  }
}

export const getSession = async () => {
  const supabase = createSupabaseClient()
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('GetSession error:', error.message)
    }
    
    return { session, error }
  } catch (error: any) {
    console.error('GetSession error:', error)
    return { session: null, error: { message: error.message || 'Failed to get session' } }
  }
}

// Helper function to refresh session
export const refreshSession = async () => {
  const supabase = createSupabaseClient()
  
  try {
    const { data, error } = await supabase.auth.refreshSession()
    
    if (error) {
      console.error('RefreshSession error:', error.message)
    }
    
    return { data, error }
  } catch (error: any) {
    console.error('RefreshSession error:', error)
    return { data: null, error: { message: error.message || 'Failed to refresh session' } }
  }
}