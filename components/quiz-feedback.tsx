"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { QuizAnswer } from "@/lib/quiz-logic"
import {
  Brain,
  Code,
  Palette,
  TrendingUp,
  Award,
  BookOpen,
  Calendar,
  Star,
  Lightbulb,
  Cpu,
  Megaphone,
  Globe,
} from "lucide-react"
import Link from "next/link"
import confetti from "canvas-confetti"
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts"

interface QuizFeedbackProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  answers: QuizAnswer[]
  analysis: {
    summary: string
    skillLevels: Record<string, number>
    recommendedCourses: string[]
    recommendedMentors: string[]
  }
  badge: {
    name: string
    description: string
    icon: string
  }
}

export function QuizFeedback({ open, onOpenChange, answers, analysis, badge }: QuizFeedbackProps) {
  const [showBadge, setShowBadge] = useState(false)

  useEffect(() => {
    if (open) {
      // Trigger confetti when the feedback modal opens
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      }, 500)

      // Show badge with delay for animation effect
      setTimeout(() => {
        setShowBadge(true)
      }, 1000)
    } else {
      setShowBadge(false)
    }
  }, [open])

  // Format skill data for radar chart
  const skillChartData = Object.entries(analysis.skillLevels).map(([skill, value]) => {
    // Convert skill keys to readable labels
    const skillLabels: Record<string, string> = {
      design: "Design",
      uiux: "UI/UX",
      ai: "AI",
      python: "Python",
      marketing: "Marketing",
      social: "Social Media",
      webdev: "Web Dev",
      frontend: "Frontend",
      backend: "Backend",
      interests: "Interests",
    }

    return {
      subject: skillLabels[skill] || skill,
      value: value / 10, // Normalize to 0-1 scale
      fullMark: 1,
    }
  })

  // Get the appropriate icon for the badge
  const BadgeIcon = () => {
    switch (badge.icon) {
      case "palette":
        return <Palette className="h-8 w-8 text-primary" />
      case "brain":
        return <Brain className="h-8 w-8 text-primary" />
      case "trending-up":
        return <TrendingUp className="h-8 w-8 text-primary" />
      case "code":
        return <Code className="h-8 w-8 text-primary" />
      case "lightbulb":
        return <Lightbulb className="h-8 w-8 text-primary" />
      case "cpu":
        return <Cpu className="h-8 w-8 text-primary" />
      case "megaphone":
        return <Megaphone className="h-8 w-8 text-primary" />
      case "globe":
        return <Globe className="h-8 w-8 text-primary" />
      default:
        return <Star className="h-8 w-8 text-primary" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Your Learning Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Badge Section */}
          <div className="flex flex-col items-center justify-center py-4">
            <div
              className={`transition-all duration-700 ease-out ${showBadge ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-70"></div>
                <div className="relative bg-background rounded-full p-6">
                  <BadgeIcon />
                </div>
              </div>
            </div>

            <h3
              className={`mt-4 text-xl font-bold transition-all duration-500 delay-300 ${showBadge ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
            >
              {badge.name}
            </h3>

            <p
              className={`text-sm text-muted-foreground text-center max-w-xs transition-all duration-500 delay-500 ${showBadge ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
            >
              {badge.description}
            </p>
          </div>

          {/* Summary */}
          <div className="bg-muted/30 rounded-lg p-4 border">
            <h3 className="font-medium mb-2">Analysis Summary</h3>
            <p className="text-sm text-muted-foreground">{analysis.summary}</p>
          </div>

          {/* Skill Chart */}
          <div>
            <h3 className="font-medium mb-4">Your Skill Profile</h3>
            <div className="h-[300px] w-full flex items-center justify-center">
              {skillChartData.length > 0 ? (
                <div className="w-full h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillChartData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 1]} />
                      <Radar name="Skills" dataKey="value" stroke="#6E56CF" fill="#6E56CF" fillOpacity={0.3} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">No skill data available</div>
              )}
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-4">
            <h3 className="font-medium">Recommended Next Steps</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/dashboard" className="block">
                <Card className="h-full hover:border-primary transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Recommended Courses</h4>
                        <ul className="mt-2 space-y-1 text-sm">
                          {analysis.recommendedCourses.map((course, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <Badge variant="outline" className="h-1.5 w-1.5 p-0 rounded-full bg-primary" />
                              {course}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/mentors" className="block">
                <Card className="h-full hover:border-primary transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Recommended Mentors</h4>
                        <ul className="mt-2 space-y-1 text-sm">
                          {analysis.recommendedMentors.map((mentor, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <Badge variant="outline" className="h-1.5 w-1.5 p-0 rounded-full bg-primary" />
                              {mentor}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button variant="outline" asChild className="sm:mr-auto">
            <Link href="/mentors">
              <Award className="mr-2 h-4 w-4" />
              Find a Mentor
            </Link>
          </Button>

          <Button asChild>
            <Link href="/dashboard">
              <Calendar className="mr-2 h-4 w-4" />
              View Dashboard
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
