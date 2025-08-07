// components/providers/app-providers.tsx
"use client"

import React from "react"
import { ThemeProvider } from "next-themes"
import { AuthProvider } from "@/components/providers/auth-provider"

interface AppProvidersProps {
  children: React.ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  )
}