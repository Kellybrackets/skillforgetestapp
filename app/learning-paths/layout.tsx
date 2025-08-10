// app/learning-paths/layout.tsx - Nested layout for learning paths section
import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Target, Users } from "lucide-react"

export default function LearningPathsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Learning Paths Header */}
      <div className="border-b bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h1 className="text-xl font-bold text-foreground">Learning Paths</h1>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                href="/learning-paths" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                All Paths
              </Link>
              <Link 
                href="/learning-paths/web-development" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Web Development
              </Link>
              <Link 
                href="/learning-paths/ai-data-science" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                AI & Data Science
              </Link>
              <Link 
                href="/learning-paths/design-creativity" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Design & Creativity
              </Link>
              <Link 
                href="/learning-paths/digital-marketing" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Digital Marketing
              </Link>
            </nav>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Community
              </Button>
              <Button variant="outline" size="sm">
                <Target className="h-4 w-4 mr-2" />
                My Progress
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Paths Content */}
      <div className="flex-1">
        {children}
      </div>

      {/* Learning Paths Footer */}
      <footer className="border-t bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Learning Paths</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/learning-paths/freelancer" className="hover:text-foreground">Web Development</Link></li>
                <li><Link href="/learning-paths/ai-data-science" className="hover:text-foreground">AI & Data Science</Link></li>
                <li><Link href="/learning-paths/design-creativity" className="hover:text-foreground">Design & Creativity</Link></li>
                <li><Link href="/learning-paths/digital-marketing" className="hover:text-foreground">Digital Marketing</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/learning-paths" className="hover:text-foreground">Path Comparison</Link></li>
                <li><Link href="/quiz" className="hover:text-foreground">Skills Assessment</Link></li>
                <li><Link href="/dashboard" className="hover:text-foreground">Progress Tracking</Link></li>
                <li><Link href="/help" className="hover:text-foreground">Help & Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/community" className="hover:text-foreground">Discussion Forums</Link></li>
                <li><Link href="/mentors" className="hover:text-foreground">Find a Mentor</Link></li>
                <li><Link href="/events" className="hover:text-foreground">Live Events</Link></li>
                <li><Link href="/success-stories" className="hover:text-foreground">Success Stories</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/contact" className="hover:text-foreground">Contact Us</Link></li>
                <li><Link href="/faq" className="hover:text-foreground">FAQ</Link></li>
                <li><Link href="/feedback" className="hover:text-foreground">Give Feedback</Link></li>
                <li><Link href="/careers" className="hover:text-foreground">Career Guidance</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 SkillForge. Empowering learners across South Africa.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}