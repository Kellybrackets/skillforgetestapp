"use client"

import { useEffect, useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SessionDebug() {
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const [storageInfo, setStorageInfo] = useState<any>(null)

  const checkSession = async () => {
    const supabase = createSupabaseClient()
    
    // Check session
    const { data: { session }, error } = await supabase.auth.getSession()
    const { data: { user } } = await supabase.auth.getUser()
    
    setSessionInfo({
      hasSession: !!session,
      hasUser: !!user,
      userEmail: user?.email || 'none',
      sessionExpiry: session?.expires_at || 'none',
      error: error?.message || 'none'
    })

    // Check localStorage
    if (typeof window !== 'undefined') {
      const localStorage = window.localStorage
      const allKeys = Object.keys(localStorage)
      const supabaseKeys = allKeys.filter(key => key.includes('supabase'))
      
      const storageData: any = {}
      supabaseKeys.forEach(key => {
        try {
          const value = localStorage.getItem(key)
          storageData[key] = value ? JSON.parse(value) : value
        } catch (e) {
          storageData[key] = localStorage.getItem(key)
        }
      })
      
      setStorageInfo({
        totalKeys: allKeys.length,
        supabaseKeys: supabaseKeys.length,
        supabaseData: storageData,
        cookies: document.cookie
      })
    }
  }

  const clearStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear()
      sessionStorage.clear()
      // Clear cookies
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
      })
      checkSession()
    }
  }

  useEffect(() => {
    checkSession()
  }, [])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Session Debug</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={checkSession} size="sm">Refresh</Button>
            <Button onClick={clearStorage} variant="outline" size="sm">Clear All</Button>
          </div>
          
          {sessionInfo && (
            <div className="space-y-2">
              <h3 className="font-semibold">Session Info:</h3>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(sessionInfo, null, 2)}
              </pre>
            </div>
          )}
          
          {storageInfo && (
            <div className="space-y-2">
              <h3 className="font-semibold">Storage Info:</h3>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(storageInfo, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}