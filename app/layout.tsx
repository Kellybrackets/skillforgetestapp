// app/layout.tsx - Updated to use AppProviders
import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { AppProviders } from "@/components/providers/app-providers"
import Navigation from "@/components/navigation"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "SkillForge - Learn with AI",
  description: "AI-powered learning platform for skill development",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AppProviders>
          <div className="min-h-screen bg-background">
            <Navigation />
            <main className="flex-1">
              {children}
            </main>
          </div>
          <Toaster />
        </AppProviders>
      </body>
    </html>
  )
}