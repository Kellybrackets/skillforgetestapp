'use client'

import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import { User, Session, AuthError } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  initialized: boolean
}

interface AuthContextType extends AuthState {
  isAuthenticated: boolean
  isEmailConfirmed: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string, fullName?: string) => Promise<any>
  signOut: () => Promise<any>
  updateUser: (attributes: any) => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    initialized: false,
  })
  
  const initRef = useRef(false)
  const mountedRef = useRef(true)

  console.log('🔐 AuthProvider render - state:', authState)

  useEffect(() => {
    mountedRef.current = true
    
    // Prevent multiple initializations
    if (initRef.current) {
      console.log('🔐 Auth already initialized, skipping...')
      return
    }
    
    initRef.current = true
    console.log('🔐 AuthProvider initializing...')
    
    const initAuth = async () => {
      try {
        const supabase = createSupabaseClient()
        console.log('🔐 Getting session...')
        
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('🔐 Session error:', error)
        } else {
          console.log('🔐 Session result:', !!session)
        }
        
        if (mountedRef.current) {
          setAuthState({
            user: session?.user ?? null,
            session,
            loading: false,
            initialized: true,
          })
          console.log('🔐 Auth state initialized')
        }
        
        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('🔐 Auth state changed:', event, !!session)
            
            if (mountedRef.current) {
              setAuthState({
                user: session?.user ?? null,
                session,
                loading: false,
                initialized: true,
              })
            }
          }
        )
        
        return () => {
          subscription.unsubscribe()
        }
        
      } catch (error) {
        console.error('🔐 Init auth error:', error)
        if (mountedRef.current) {
          setAuthState({
            user: null,
            session: null,
            loading: false,
            initialized: true,
          })
        }
      }
    }
    
    const cleanup = initAuth()
    
    return () => {
      mountedRef.current = false
      cleanup?.then(cleanupFn => cleanupFn?.())
      console.log('🔐 AuthProvider cleanup')
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
    
    // Reset the initialization flag on sign out
    if (!result.error) {
      initRef.current = false
    }
    
    return result
  }

  const updateUser = async (attributes: any) => {
    console.log('🔐 Update user attempt')
    const supabase = createSupabaseClient()
    return await supabase.auth.updateUser(attributes)
  }

  const value: AuthContextType = {
    ...authState,
    isAuthenticated: !!authState.user && authState.initialized,
    isEmailConfirmed: !!authState.user?.email_confirmed_at,
    signIn,
    signUp,
    signOut,
    updateUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}