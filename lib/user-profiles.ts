// lib/user-profiles.ts - Database operations for user profiles
import { createSupabaseClient } from '@/lib/supabase'
import type { 
  UserProfile, 
  UserPreferences, 
  CreateUserProfileData, 
  UpdateUserProfileData, 
  UpdateUserPreferencesData 
} from '@/types/user'

// Get user profile by user ID
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
    
    return data as UserProfile
  } catch (error) {
    console.error('Exception fetching user profile:', error)
    return null
  }
}

// Get or create user profile
export const getOrCreateUserProfile = async (
  userId: string, 
  defaultData?: CreateUserProfileData
): Promise<UserProfile | null> => {
  try {
    const supabase = createSupabaseClient()
    
    // First try to get existing profile
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (existingProfile) {
      return existingProfile as UserProfile
    }
    
    // If no profile exists, create one (profiles table auto-creates via trigger)
    if (fetchError?.code === 'PGRST116') { // No rows returned
      const profileData = {
        id: userId,
        email: '',
        full_name: defaultData?.full_name || '',
        avatar_url: defaultData?.avatar_url || null
      }
      
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert(profileData)
        .select('*')
        .single()
      
      if (createError) {
        console.error('Error creating user profile:', createError)
        return null
      }
      
      return newProfile as UserProfile
    }
    
    console.error('Error fetching user profile:', fetchError)
    return null
  } catch (error) {
    console.error('Exception in getOrCreateUserProfile:', error)
    return null
  }
}

// Update user profile
export const updateUserProfile = async (
  userId: string, 
  updates: UpdateUserProfileData
): Promise<UserProfile | null> => {
  try {
    const supabase = createSupabaseClient()
    
    console.log('🔍 Updating user profile:', { userId, updates })
    
    // Convert undefined to null for database and clean up the object
    const cleanedUpdates: any = {}
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        cleanedUpdates[key] = value === undefined ? null : value
      } else {
        // Explicitly set undefined values to null for avatar_url
        if (key === 'avatar_url') {
          cleanedUpdates[key] = null
        }
      }
    })
    
    console.log('🔍 Cleaned updates being sent to database:', cleanedUpdates)
    
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...cleanedUpdates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select('*')
      .single()
    
    if (error) {
      console.error('❌ Database update error:', error)
      console.error('❌ Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      return null
    }
    
    console.log('✅ Profile updated successfully:', data)
    return data as UserProfile
  } catch (error) {
    console.error('Exception updating user profile:', error)
    return null
  }
}

// Get user preferences
export const getUserPreferences = async (userId: string): Promise<UserPreferences | null> => {
  try {
    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching user preferences:', error)
      return null
    }
    
    return data as UserPreferences
  } catch (error) {
    console.error('Exception fetching user preferences:', error)
    return null
  }
}

// Get or create user preferences
export const getOrCreateUserPreferences = async (userId: string): Promise<UserPreferences | null> => {
  try {
    const supabase = createSupabaseClient()
    
    // First try to get existing preferences
    const { data: existingPrefs, error: fetchError } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (existingPrefs) {
      return existingPrefs as UserPreferences
    }
    
    // If no preferences exist, create default ones
    if (fetchError?.code === 'PGRST116') { // No rows returned
      const defaultPrefs = {
        user_id: userId,
        email_notifications: true,
        course_reminders: true,
        mentor_messages: true,
        marketing_emails: false,
        community_updates: true,
        event_notifications: true,
        push_notifications: true,
        theme: 'system' as const,
        language: 'en',
        timezone: 'UTC',
        dashboard_layout: 'default',
        profile_visibility: 'public' as const,
        show_progress: true,
        show_badges: true,
        allow_mentor_contact: true
      }
      
      const { data: newPrefs, error: createError } = await supabase
        .from('user_preferences')
        .insert(defaultPrefs)
        .select('*')
        .single()
      
      if (createError) {
        console.error('Error creating user preferences:', createError)
        return null
      }
      
      return newPrefs as UserPreferences
    }
    
    console.error('Error fetching user preferences:', fetchError)
    return null
  } catch (error) {
    console.error('Exception in getOrCreateUserPreferences:', error)
    return null
  }
}

// Update user preferences
export const updateUserPreferences = async (
  userId: string, 
  updates: UpdateUserPreferencesData
): Promise<UserPreferences | null> => {
  try {
    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase
      .from('user_preferences')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select('*')
      .single()
    
    if (error) {
      console.error('Error updating user preferences:', error)
      return null
    }
    
    return data as UserPreferences
  } catch (error) {
    console.error('Exception updating user preferences:', error)
    return null
  }
}

// Log user activity
export const logUserActivity = async (
  userId: string, 
  activityType: string, 
  activityData?: any
): Promise<boolean> => {
  try {
    const supabase = createSupabaseClient()
    
    const { error } = await supabase
      .from('user_activity')
      .insert({
        user_id: userId,
        activity_type: activityType,
        activity_data: activityData || {}
      })
    
    if (error) {
      console.error('Error logging user activity:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Exception logging user activity:', error)
    return false
  }
}

// PUBLIC PROFILE FUNCTIONS (for viewing other users)
export const getPublicUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url, created_at')
      .eq('id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching public user profile:', error)
      return null
    }
    
    return data as UserProfile || null
  } catch (error) {
    console.error('Exception fetching public user profile:', error)
    return null
  }
}

export const searchUserProfiles = async (query: string, limit: number = 20): Promise<UserProfile[]> => {
  try {
    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, email, created_at')
      .or(`full_name.ilike.%${query}%, email.ilike.%${query}%`)
      .limit(limit)
    
    if (error) {
      console.error('Error searching user profiles:', error)
      return []
    }
    
    return (data as UserProfile[]) || []
  } catch (error) {
    console.error('Exception searching user profiles:', error)
    return []
  }
}