"use client"

import SimpleLoginTest from '@/components/SimpleLoginTest'
import SessionDebug from '@/components/SessionDebug'

export default function TestLoginPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center">Login Test & Debug</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <SimpleLoginTest />
          </div>
          <div>
            <SessionDebug />
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-600">
          Test login and check if session/cookies are being stored properly
        </div>
      </div>
    </div>
  )
}