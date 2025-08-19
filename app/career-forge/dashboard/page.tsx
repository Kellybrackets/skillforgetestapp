"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Calendar, Clock, Play, Settings, Trash2, Plus, ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface GeneratedInterview {
  id: string;
  title: string;
  type: "technical" | "behavioral";
  role: string;
  level: string;
  techStack: string;
  questionCount: number;
  createdAt: Date;
  status: "ready" | "in-progress" | "completed";
}

export default function InterviewDashboard() {
  const router = useRouter()
  const [interviews, setInterviews] = useState<GeneratedInterview[]>([])

  useEffect(() => {
    // Load generated interviews from localStorage
    const stored = localStorage.getItem('generatedInterviews')
    if (stored) {
      const parsedInterviews = JSON.parse(stored).map((interview: any) => ({
        ...interview,
        createdAt: new Date(interview.createdAt)
      }))
      setInterviews(parsedInterviews)
    }
  }, [])

  const handleDeleteInterview = (id: string) => {
    const updatedInterviews = interviews.filter(interview => interview.id !== id)
    setInterviews(updatedInterviews)
    localStorage.setItem('generatedInterviews', JSON.stringify(updatedInterviews))
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <Link href="/career-forge">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to CareerForge
                </Button>
              </Link>
            </div>
            <h1 className="text-4xl font-bold mb-2">Interview Dashboard</h1>
            <p className="text-xl text-muted-foreground">
              Manage and practice your generated interviews
            </p>
          </div>
          
          <Link href="/career-forge/ai-interview-prep">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-5 h-5 mr-2" />
              Create New Interview
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{interviews.length}</div>
              <p className="text-xs text-muted-foreground">
                Generated and ready
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ready to Practice</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {interviews.filter(i => i.status === "ready").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Unused interviews
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {interviews.filter(i => {
                  const weekAgo = new Date()
                  weekAgo.setDate(weekAgo.getDate() - 7)
                  return i.createdAt > weekAgo
                }).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Created this week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Interview Cards */}
        {interviews.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Interviews Generated Yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first personalized interview to get started with practice sessions.
              </p>
              <Link href="/career-forge/ai-interview-prep">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Interview
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interviews.map((interview) => (
              <Card key={interview.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg mb-2">{interview.title}</CardTitle>
                      <div className="flex gap-2 mb-2">
                        <Badge variant="secondary" className="capitalize">
                          {interview.type}
                        </Badge>
                        <Badge variant="outline">
                          {interview.questionCount} questions
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteInterview(interview.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Role & Level</p>
                      <p className="font-medium">{interview.role} • {interview.level}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Tech Focus</p>
                      <p className="font-medium">{interview.techStack}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Created {formatDate(interview.createdAt)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <div className={`w-2 h-2 rounded-full ${
                        interview.status === "ready" ? "bg-green-500" : 
                        interview.status === "in-progress" ? "bg-yellow-500" : "bg-gray-500"
                      }`} />
                      <span className="capitalize">{interview.status.replace('-', ' ')}</span>
                    </div>
                    
                    <div className="pt-4 space-y-2">
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Interview
                        <span className="ml-2 text-xs opacity-75">(Coming Soon)</span>
                      </Button>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" disabled>
                          <Settings className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" disabled>
                          <Clock className="w-4 h-4 mr-1" />
                          History
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Help Section */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>How to Use Your Interview Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2 text-purple-600 dark:text-purple-400">
                  Creating Interviews
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Click "Create New Interview" to generate personalized questions</li>
                  <li>• Each interview is tailored to your specific role and experience</li>
                  <li>• Configure technical focus areas and difficulty level</li>
                  <li>• Generated interviews are saved automatically</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-blue-600 dark:text-blue-400">
                  Practice Sessions (Coming Soon)
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Start practice sessions with generated questions</li>
                  <li>• Voice-powered interview simulation</li>
                  <li>• Real-time feedback and performance tracking</li>
                  <li>• Review and improve your responses</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}