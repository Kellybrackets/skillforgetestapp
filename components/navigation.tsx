"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Search, Menu, X, Bell, Settings, LogOut, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useTheme } from "next-themes"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Mentors", href: "/mentors" },
  { name: "Events", href: "/events" },
  { name: "Equipment", href: "/equipment" },
  { name: "Community", href: "/community" },
  { name: "CareerForge", href: "/career-forge" },
]

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, signOut, loading, initialized } = useAuth()
  
  console.log('🧭 Navigation render - auth state:', { 
    isAuthenticated, 
    loading, 
    initialized, 
    hasUser: !!user,
    pathname 
  })
  
  const { toast } = useToast()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [mounted, setMounted] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't show navigation on specific pages
  if (pathname === "/login" || pathname === "/register" || pathname === "/quiz" || pathname === "/") {
    return null
  }

  // Only hide navigation if we're definitely not authenticated AND auth is fully initialized
  // This prevents hiding navigation during the loading phase
  if (mounted && initialized && !loading && !isAuthenticated) {
    return null
  }

  // Show a minimal loading state for navigation while auth is initializing
  if (!mounted || (loading && !initialized)) {
    return (
      <header className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                SkillForge
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    setMobileMenuOpen(false)
    
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
      console.error('Logout error:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to logout. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleNavigation = (href: string) => {
    setMobileMenuOpen(false)
    router.push(href)
  }

  const getDisplayName = () => {
    if (user?.user_metadata?.full_name && typeof user.user_metadata.full_name === 'string') {
      return user.user_metadata.full_name
    }
    if (user?.email) {
      const name = user.email.split('@')[0]
      return name.charAt(0).toUpperCase() + name.slice(1)
    }
    return 'User'
  }

  const getUserInitial = () => {
    if (user?.user_metadata?.full_name && typeof user.user_metadata.full_name === 'string') {
      return user.user_metadata.full_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase()
    }
    return 'U'
  }

  const userEmail = user?.email || "user@example.com"
  const userInitial = getUserInitial()
  const displayName = getDisplayName()

  return (
    <header className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button onClick={() => handleNavigation('/dashboard')} className="flex items-center">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                SkillForge
              </span>
            </button>
            <nav className="hidden md:ml-8 md:flex md:space-x-2 items-center">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/80 hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {searchOpen ? (
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search courses, mentors..."
                  className="w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  onBlur={() => {
                    if (!searchQuery) setSearchOpen(false)
                  }}
                />
                <X
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground"
                  onClick={() => {
                    setSearchQuery("")
                    setSearchOpen(false)
                  }}
                />
              </div>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
                <Search className="h-5 w-5" />
              </Button>
            )}

            <Button variant="ghost" size="icon" onClick={() => handleNavigation('/notifications')}>
              <Bell className="h-5 w-5" />
            </Button>

            {/* Enhanced User Menu with Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                  {userInitial}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {displayName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userEmail}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleNavigation('/dashboard')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigation('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{isLoggingOut ? 'Logging out...' : 'Log out'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center md:hidden">
            {searchOpen ? (
              <div className="relative flex-1 mx-2">
                <Input
                  type="text"
                  placeholder="Search..."
                  className="w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <X
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  onClick={() => {
                    setSearchQuery("")
                    setSearchOpen(false)
                  }}
                />
              </div>
            ) : (
              <>
                <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
                  <Search className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.name}
              </button>
            ))}
            <div className="pt-4 pb-3 border-t border-border">
              <div className="flex items-center px-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    {userInitial}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium">{displayName}</div>
                  <div className="text-xs text-muted-foreground">{userEmail}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1 px-2">
                <button
                  onClick={() => handleNavigation('/settings')}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:bg-muted hover:text-foreground transition-colors"
                >
                  <div className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Settings
                  </div>
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
                >
                  <div className="flex items-center">
                    <LogOut className="h-5 w-5 mr-2" />
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}