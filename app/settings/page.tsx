"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useTheme } from "next-themes"
import { Spinner } from "@/components/ui/spinner"
import { User, Bell, Moon, Sun, Shield, CreditCard, LogOut, AlertCircle } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  getUserProfile,
  updateUserProfile,
  getOrCreateUserProfile,
  getUserPreferences,
  updateUserPreferences,
  getOrCreateUserPreferences,
  logUserActivity 
} from "@/lib/user-profiles"
import type { UserProfile, UserPreferences } from "@/types/user"
import { uploadProfilePicture, deleteProfilePicture, resizeImage } from "@/lib/profile-picture"

export default function SettingsPage() {
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const { user, loading, isAuthenticated, signOut, updateUser, initialized } = useAuth()
  const router = useRouter()
  
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSavingNotifications, setIsSavingNotifications] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // Form states
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [bio, setBio] = useState("")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [courseReminders, setCourseReminders] = useState(true)
  const [mentorMessages, setMentorMessages] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)

  // Set mounted flag
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load user data from database when component mounts
  useEffect(() => {
    if (!mounted || !user?.id) return
    
    const loadUserData = async () => {
      if (!user?.id) {
        console.warn('No user ID available')
        return
      }
      
      try {
        // Load user profile directly from database with proper typing
        const profile: UserProfile | null = await getOrCreateUserProfile(user.id, {
          full_name: user.user_metadata?.full_name || ''
        })
        
        // Proper null check with TypeScript
        if (profile) {
          setName(profile.full_name || '')
          setAvatarUrl(profile.avatar_url || null)
        } else {
          // Fallback if profile creation/retrieval failed
          setName(user.user_metadata?.full_name || '')
          setAvatarUrl(user.user_metadata?.avatar_url || null)
        }
        
        // Set bio from auth metadata since profiles table doesn't have bio field
        setBio(user.user_metadata?.bio || '')
        
        // Load user preferences directly from database with proper typing
        const preferences: UserPreferences | null = await getOrCreateUserPreferences(user.id)
        
        if (preferences) {
          setEmailNotifications(preferences.email_notifications ?? true)
          setCourseReminders(preferences.course_reminders ?? true)
          setMentorMessages(preferences.mentor_messages ?? true)
          setMarketingEmails(preferences.marketing_emails ?? false)
        }
        
        // Set email from auth user
        setEmail(user.email || "")
        
      } catch (error) {
        console.error('Error loading user data:', error)
        // Fallback to auth metadata
        setEmail(user.email || "")
        setName(user.user_metadata?.full_name || "")
        setBio(user.user_metadata?.bio || "")
        setAvatarUrl(user.user_metadata?.avatar_url || null)
        
        // Load saved preferences from localStorage as fallback
        const savedNotifications = localStorage.getItem("notificationPreferences")
        if (savedNotifications) {
          try {
            const prefs = JSON.parse(savedNotifications)
            setEmailNotifications(prefs.emailNotifications ?? true)
            setCourseReminders(prefs.courseReminders ?? true)
            setMentorMessages(prefs.mentorMessages ?? true)
            setMarketingEmails(prefs.marketingEmails ?? false)
          } catch (error) {
            console.error("Error loading notification preferences:", error)
          }
        }
        
        // Show warning toast
        toast({
          title: "Warning",
          description: "Some settings may not load properly. Please refresh the page.",
          variant: "destructive"
        })
      }
    }
    
    loadUserData()
  }, [mounted, user, toast])

  // Redirect if not authenticated
  useEffect(() => {
    if (mounted && initialized && !loading && !isAuthenticated) {
      router.push('/login?redirectTo=/settings')
    }
  }, [mounted, initialized, loading, isAuthenticated, router])

  // Profile picture upload function
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user?.id) return

    setIsUploadingAvatar(true)

    try {
      // Store current avatar URL for cleanup
      const oldAvatarUrl = avatarUrl

      // Resize image for better performance
      const resizedFile = await resizeImage(file, 300, 300, 0.8)
      
      // Upload to Supabase Storage
      const result = await uploadProfilePicture(resizedFile, user.id)
      
      if (!result.success) {
        throw new Error(result.error || 'Upload failed')
      }

      console.log('✅ Avatar uploaded successfully:', result.url)

      // Update profile in database first with proper typing
      const updatedProfile: UserProfile | null = await updateUserProfile(user.id, {
        avatar_url: result.url
      })

      if (updatedProfile && result.url) {
        // Update local state
        setAvatarUrl(result.url)
        
        // Also update auth metadata
        try {
          await updateUser({
            data: { avatar_url: result.url }
          })
        } catch (authError) {
          console.warn('Auth metadata update failed:', authError)
        }

        // 🧹 AUTOMATIC CLEANUP: Delete old avatar after successful update
        if (oldAvatarUrl && oldAvatarUrl !== result.url) {
          try {
            console.log('🗑️ Attempting to delete old avatar:', oldAvatarUrl)
            console.log('🗑️ New avatar URL:', result.url)
            const deleteSuccess = await deleteProfilePicture(oldAvatarUrl)
            if (deleteSuccess) {
              console.log('✅ Old avatar cleaned up successfully:', oldAvatarUrl)
            } else {
              console.warn('⚠️ Old avatar cleanup returned false:', oldAvatarUrl)
            }
          } catch (cleanupError) {
            console.error('❌ Old avatar cleanup failed:', cleanupError)
            // Don't show error to user - new upload still succeeded
          }
        } else {
          console.log('🔍 No cleanup needed:', { oldAvatarUrl, newUrl: result.url })
        }

        toast({
          title: "Profile picture updated",
          description: "Your profile picture has been updated successfully.",
        })
      } else {
        throw new Error('Failed to update profile in database')
      }

    } catch (error: any) {
      console.error("❌ Error uploading avatar:", error)
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload profile picture. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const handleRemoveAvatar = async () => {
    if (!user?.id || !avatarUrl) return

    setIsUploadingAvatar(true)

    try {
      // Delete from storage
      await deleteProfilePicture(avatarUrl)

      // Update profile in database with proper typing
      const updatedProfile: UserProfile | null = await updateUserProfile(user.id, {
        avatar_url: undefined
      })

      if (updatedProfile) {
        setAvatarUrl(null)
        
        // Also update auth metadata
        try {
          await updateUser({
            data: { avatar_url: null }
          })
        } catch (authError) {
          console.warn('Auth metadata update failed:', authError)
        }

        toast({
          title: "Profile picture removed",
          description: "Your profile picture has been removed.",
        })
      } else {
        throw new Error('Failed to update profile in database')
      }

    } catch (error: any) {
      console.error("❌ Error removing avatar:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to remove profile picture. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!user?.id) return

    setIsSavingProfile(true)

    try {
      // Update profile directly in database with proper typing
      const updatedProfile: UserProfile | null = await updateUserProfile(user.id, {
        full_name: name.trim()
      })
      
      if (!updatedProfile) {
        throw new Error('Failed to update profile in database')
      }

      console.log('✅ Profile updated successfully')
      
      // Also update auth metadata for backward compatibility
      try {
        await updateUser({
          data: { 
            full_name: name.trim(),
            bio: bio.trim()  // Keep bio in auth metadata
          }
        })
      } catch (authError) {
        console.warn('Auth metadata update failed:', authError)
        // Don't throw - database update succeeded
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error: any) {
      console.error("❌ Error updating profile:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleSaveNotifications = async () => {
    if (!user?.id) return
    
    setIsSavingNotifications(true)

    try {
      // Save directly to database with proper typing
      const updatedPreferences: UserPreferences | null = await updateUserPreferences(user.id, {
        email_notifications: emailNotifications,
        course_reminders: courseReminders,
        mentor_messages: mentorMessages,
        marketing_emails: marketingEmails
      })
      
      if (!updatedPreferences) {
        throw new Error('Failed to save preferences to database')
      }

      // Also save to localStorage for immediate access
      const preferences = {
        emailNotifications,
        courseReminders,
        mentorMessages,
        marketingEmails
      }
      localStorage.setItem("notificationPreferences", JSON.stringify(preferences))
      
      toast({
        title: "Notification preferences saved",
        description: "Your notification settings have been updated.",
      })
    } catch (error: any) {
      console.error("Error saving notification preferences:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save notification preferences.",
        variant: "destructive"
      })
    } finally {
      setIsSavingNotifications(false)
    }
  }

  const handleChangePassword = async () => {
    if (!user?.id) return

    if (!newPassword || newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match or are empty.",
        variant: "destructive"
      })
      return
    }

    if (newPassword.length < 8) {
      toast({
        title: "Error", 
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      })
      return
    }

    setIsChangingPassword(true)

    try {
      const { data, error } = await updateUser({
        password: newPassword
      })

      if (error) {
        throw new Error(error.message)
      }

      console.log('✅ Password updated successfully')
      
      setShowPasswordDialog(false)
      setNewPassword("")
      setConfirmPassword("")
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      })
    } catch (error: any) {
      console.error("❌ Error updating password:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update password. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleThemeChange = async (newTheme: string) => {
    if (!user?.id) return
    
    setTheme(newTheme)
    
    try {
      // Update theme preference directly in database
      await updateUserPreferences(user.id, {
        theme: newTheme as 'light' | 'dark' | 'system'
      })
    } catch (error) {
      console.error('Error saving theme preference:', error)
      // Don't show error to user - theme still works locally
    }
  }

  const handleLogout = async () => {
    setIsLoading(true)
    
    try {
      const { error } = await signOut()
      
      if (error) {
        throw new Error(error.message)
      }
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
      
      router.push('/login')
    } catch (error: any) {
      console.error("Logout error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to logout. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Show loading while checking auth
  if (!mounted || loading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Spinner size="lg" />
          <span>Loading settings...</span>
        </div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to access your settings</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <Link href="/login?redirectTo=/settings">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="mt-1 text-muted-foreground">Manage your account settings and preferences</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{user?.email}</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="profile" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center">
              {theme === "dark" ? <Moon className="h-4 w-4 mr-2" /> : <Sun className="h-4 w-4 mr-2" />}
              Appearance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information and public profile</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed here. Contact support if you need to update your email.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us a bit about yourself..."
                      className="w-full min-h-[100px] bg-card border border-border rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      Brief description for your profile. This will be displayed publicly.
                    </p>
                  </div>

                  <Button onClick={handleSaveProfile} disabled={isSavingProfile}>
                    {isSavingProfile ? <Spinner size="sm" className="mr-2" /> : null}
                    {isSavingProfile ? "Saving..." : "Save Changes"}
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                    <CardDescription>Upload a new profile picture</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage 
                        src={avatarUrl || user?.user_metadata?.avatar_url || undefined} 
                        alt="Profile" 
                      />
                      <AvatarFallback className="text-lg">
                        {name ? getInitials(name) : user?.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex flex-col space-y-2 w-full">
                      <label htmlFor="avatar-upload">
                        <Button 
                          variant="outline" 
                          className="w-full cursor-pointer" 
                          disabled={isUploadingAvatar}
                          asChild
                        >
                          <span>
                            {isUploadingAvatar ? (
                              <>
                                <Spinner size="sm" className="mr-2" />
                                Uploading...
                              </>
                            ) : (
                              "Upload New Picture"
                            )}
                          </span>
                        </Button>
                      </label>
                      
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        disabled={isUploadingAvatar}
                      />
                      
                      {avatarUrl && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleRemoveAvatar}
                          disabled={isUploadingAvatar}
                          className="text-destructive hover:text-destructive"
                        >
                          Remove Picture
                        </Button>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Max size: 5MB. Formats: JPEG, PNG, GIF, WebP
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Security</CardTitle>
                    <CardDescription>Manage your password and security settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center"
                      onClick={() => setShowPasswordDialog(true)}
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full flex items-center" disabled>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Manage Subscription
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center text-destructive hover:text-destructive"
                      onClick={handleLogout}
                      disabled={isLoading}
                    >
                      {isLoading ? <Spinner size="sm" className="mr-2" /> : <LogOut className="mr-2 h-4 w-4" />}
                      {isLoading ? "Logging out..." : "Logout"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how and when you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="course-reminders">Course Reminders</Label>
                    <p className="text-sm text-muted-foreground">Get reminders about upcoming courses and deadlines</p>
                  </div>
                  <Switch id="course-reminders" checked={courseReminders} onCheckedChange={setCourseReminders} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="mentor-messages">Mentor Messages</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when mentors send you messages
                    </p>
                  </div>
                  <Switch id="mentor-messages" checked={mentorMessages} onCheckedChange={setMentorMessages} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Receive promotional emails and special offers</p>
                  </div>
                  <Switch id="marketing-emails" checked={marketingEmails} onCheckedChange={setMarketingEmails} />
                </div>

                <Button onClick={handleSaveNotifications} disabled={isSavingNotifications}>
                  {isSavingNotifications ? <Spinner size="sm" className="mr-2" /> : null}
                  {isSavingNotifications ? "Saving..." : "Save Preferences"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how SkillForge looks on your device</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div
                      className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer transition-all hover:bg-muted/50 ${
                        theme === "light" ? "border-primary bg-primary/5" : "border-border"
                      }`}
                      onClick={() => handleThemeChange("light")}
                    >
                      <div className="h-24 w-full bg-white border rounded-md mb-2 flex items-center justify-center">
                        <Sun className="h-8 w-8 text-yellow-500" />
                      </div>
                      <span className="text-sm font-medium">Light</span>
                    </div>

                    <div
                      className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer transition-all hover:bg-muted/50 ${
                        theme === "dark" ? "border-primary bg-primary/5" : "border-border"
                      }`}
                      onClick={() => handleThemeChange("dark")}
                    >
                      <div className="h-24 w-full bg-gray-900 border rounded-md mb-2 flex items-center justify-center">
                        <Moon className="h-8 w-8 text-blue-300" />
                      </div>
                      <span className="text-sm font-medium">Dark</span>
                    </div>

                    <div
                      className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer transition-all hover:bg-muted/50 ${
                        theme === "system" ? "border-primary bg-primary/5" : "border-border"
                      }`}
                      onClick={() => handleThemeChange("system")}
                    >
                      <div className="h-24 w-full bg-gradient-to-r from-white to-gray-900 border rounded-md mb-2 flex items-center justify-center">
                        <Sun className="h-6 w-6 text-yellow-500 mr-1" />
                        <Moon className="h-6 w-6 text-blue-300" />
                      </div>
                      <span className="text-sm font-medium">System</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Select a theme preference for SkillForge. System will follow your device settings.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Password Change Dialog */}
        {showPasswordDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Enter your new password below</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-800">
                    Password must be at least 8 characters long and should include a mix of letters, numbers, and symbols.
                  </p>
                </div>
              </CardContent>
              <CardContent className="pt-0">
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setShowPasswordDialog(false)
                      setNewPassword("")
                      setConfirmPassword("")
                    }}
                    disabled={isChangingPassword}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={handleChangePassword}
                    disabled={isChangingPassword || !newPassword || newPassword !== confirmPassword}
                  >
                    {isChangingPassword ? <Spinner size="sm" className="mr-2" /> : null}
                    {isChangingPassword ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}