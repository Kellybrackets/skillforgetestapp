// types/user.ts - Create this new file
export interface UserProfile {
    id: string
    email?: string
    full_name?: string
    avatar_url?: string | null
    created_at?: string
    updated_at?: string
  }
  
  export interface UserPreferences {
    id: string
    user_id: string
    email_notifications?: boolean
    course_reminders?: boolean
    mentor_messages?: boolean
    marketing_emails?: boolean
    community_updates?: boolean
    event_notifications?: boolean
    push_notifications?: boolean
    theme?: 'light' | 'dark' | 'system'
    language?: string
    timezone?: string
    dashboard_layout?: string
    profile_visibility?: 'public' | 'private' | 'connections'
    show_progress?: boolean
    show_badges?: boolean
    allow_mentor_contact?: boolean
    created_at?: string
    updated_at?: string
  }
  
  // Parameter types for functions
  export interface CreateUserProfileData {
    full_name?: string
    avatar_url?: string | null
  }
  
  export interface UpdateUserProfileData {
    full_name?: string
    avatar_url?: string | null | undefined
  }
  
  export interface UpdateUserPreferencesData {
    email_notifications?: boolean
    course_reminders?: boolean
    mentor_messages?: boolean
    marketing_emails?: boolean
    community_updates?: boolean
    event_notifications?: boolean
    push_notifications?: boolean
    theme?: 'light' | 'dark' | 'system'
    language?: string
    timezone?: string
    dashboard_layout?: string
    profile_visibility?: 'public' | 'private' | 'connections'
    show_progress?: boolean
    show_badges?: boolean
    allow_mentor_contact?: boolean
  }