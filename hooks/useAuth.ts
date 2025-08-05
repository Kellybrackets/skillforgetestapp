'use client'

import { useState, useEffect, useRef } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import { User, Session, AuthError } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  initialized: boolean
}

// Global state management
let globalAuthState: AuthState = {
  user: null,
  session: null,
  loading: true,
  initialized: false,
}

let subscribers: Set<(state: AuthState) => void> = new Set()
let isInitialized = false

const notifySubscribers = () => {
  subscribers.forEach(callback => callback(globalAuthState))
}

const updateGlobalState = (newState: Partial<AuthState>) => {
  globalAuthState = { ...globalAuthState, ...newState }
  notifySubscribers()
}

// Initialize auth once globally
const initializeAuth = async () => {
  if (isInitialized) return
  isInitialized = true
  
  try {
    const supabase = createSupabaseClient()
    console.log('🔐 Initializing global auth...')
    
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('🔐 Session error:', error)
    }
    
    updateGlobalState({
      user: session?.user ?? null,
      session,
      loading: false,
      initialized: true,
    })
    
    // Set up auth state listener
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔐 Auth state changed:', event, !!session)
      updateGlobalState({
        user: session?.user ?? null,
        session,
        loading: false,
        initialized: true,
      })
    })
    
  } catch (error) {
    console.error('🔐 Init auth error:', error)
    updateGlobalState({
      user: null,
      session: null,
      loading: false,
      initialized: true,
    })
  }
}

export const useAuth = () => {
  const [localState, setLocalState] = useState(globalAuthState)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    
    // Initialize auth on first use
    initializeAuth()
    
    // Subscribe to global state changes
    const updateLocalState = (newState: AuthState) => {
      if (mountedRef.current) {
        setLocalState(newState)
      }
    }
    
    subscribers.add(updateLocalState)
    
    // Set initial state
    updateLocalState(globalAuthState)
    
    return () => {
      mountedRef.current = false
      subscribers.delete(updateLocalState)
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    console.log('🔐 Sign in attempt')
    const supabase = createSupabaseClient()
    return await supabase.auth.signInWithPassword({ email, password })
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      console.log('🔐 Sign up attempt for:', email)
      
      const supabase = createSupabaseClient()
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName?.trim() || '',
          },
        },
      })

      if (error) {
        console.error('❌ Signup error:', error.message)
        return { data: null, error }
      }

      console.log('✅ Signup successful')
      return { data, error: null }
    } catch (error: any) {
      console.error('💥 Signup exception:', error)
      return { 
        data: null, 
        error: { message: error.message || 'Signup failed' } as AuthError 
      }
    }
  }

  const signOut = async () => {
    console.log('🔐 Sign out attempt')
    const supabase = createSupabaseClient()
    const result = await supabase.auth.signOut()
    
    if (!result.error) {
      isInitialized = false
    }
    
    return result
  }

  const updateUser = async (attributes: any) => {
    console.log('🔐 Update user attempt')
    const supabase = createSupabaseClient()
    return await supabase.auth.updateUser(attributes)
  }

  return {
    ...localState,
    isAuthenticated: !!localState.user && localState.initialized,
    isEmailConfirmed: !!localState.user?.email_confirmed_at,
    signIn,
    signUp,
    signOut,
    updateUser,
  }
}