"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createSupabaseClient } from '@/lib/supabase'

export default function SimpleLoginTest() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const supabase = createSupabaseClient()
      
      console.log('🔐 Starting login...')
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('🔐 Login result:', { data: !!data, error: error?.message })

      if (error) {
        setMessage(`Error: ${error.message}`)
        return
      }

      if (data.user) {
        console.log('✅ Login successful! User:', data.user.email)
        setMessage('Login successful! Redirecting...')
        
        // Force redirect without middleware interference
        setTimeout(() => {
          console.log('🚀 Redirecting to /quiz')
          window.location.href = '/quiz'
        }, 1000)
      }

    } catch (err: any) {
      console.error('💥 Login error:', err)
      setMessage(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Simple Login Test</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          {message && (
            <div className="text-sm p-2 bg-gray-100 rounded">
              {message}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}