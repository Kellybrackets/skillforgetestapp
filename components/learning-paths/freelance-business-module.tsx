// components/learning-paths/freelance-business-module.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  CheckCircle,
  Clock,
  FileText,
  X,
  DollarSign,
  Users,
  Target,
  TrendingUp,
  MessageSquare,
  Calendar,
  Briefcase,
} from "lucide-react"

interface FreelanceBusinessModuleProps {
  skillArea: string
  onClose: () => void
}

// Freelance business courses - same across all paths but contextualized
const freelanceCourses = [
  {
    id: 1,
    title: "Personal Branding for Freelancers",
    description: "Build a strong personal brand that attracts clients",
    duration: "2 weeks",
    lessons: 8,
    progress: 100,
    status: "completed",
  },
  {
    id: 2,
    title: "Client Communication Mastery",
    description: "Master professional client communication and relationship management",
    duration: "2 weeks",
    lessons: 10,
    progress: 65,
    status: "in-progress",
  },
  {
    id: 3,
    title: "Pricing Your Services",
    description: "Learn to price your services competitively and profitably",
    duration: "1 week",
    lessons: 6,
    progress: 0,
    status: "not-started",
  },
  {
    id: 4,
    title: "Finding & Securing Clients",
    description: "Strategies to find and win your ideal freelance clients",
    duration: "3 weeks",
    lessons: 12,
    progress: 0,
    status: "not-started",
  },
  {
    id: 5,
    title: "Freelance Finance Management",
    description: "Manage taxes, invoicing, and financial planning",
    duration: "2 weeks",
    lessons: 8,
    progress: 0,
    status: "not-started",
  },
]

// Business tools and resources
const businessTools = [
  {
    category: "Client Management",
    tools: [
      { name: "Contract Templates", description: "Ready-to-use freelance contracts", status: "available" },
      { name: "Project Proposal Template", description: "Professional proposal templates", status: "available" },
      { name: "Client Onboarding Checklist", description: "Streamline new client setup", status: "locked" },
    ]
  },
  {
    category: "Financial Tools",
    tools: [
      { name: "Invoice Generator", description: "Create professional invoices", status: "available" },
      { name: "Rate Calculator", description: "Calculate your hourly/project rates", status: "available" },
      { name: "Tax Planning Guide", description: "South African freelance tax guide", status: "locked" },
    ]
  },
  {
    category: "Marketing Assets",
    tools: [
      { name: "Portfolio Templates", description: "Showcase your work professionally", status: "available" },
      { name: "Social Media Kit", description: "Professional social media templates", status: "locked" },
      { name: "Email Signature Templates", description: "Professional email signatures", status: "locked" },
    ]
  },
]

export function FreelanceBusinessModule({ skillArea, onClose }: FreelanceBusinessModuleProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const calculateProgress = () => {
    const totalProgress = freelanceCourses.reduce((acc, course) => acc + course.progress, 0)
    return totalProgress / freelanceCourses.length
  }

  const getSkillAreaContext = () => {
    switch (skillArea) {
      case "Web Development":
        return {
          examples: ["build client websites", "develop web applications", "create e-commerce solutions"],
          rates: "R300-R1,500 per hour",
          projects: "R5,000-R50,000 per project"
        }
      case "Design & Creativity":
        return {
          examples: ["design brand identities", "create marketing materials", "develop UI/UX solutions"],
          rates: "R250-R1,200 per hour", 
          projects: "R3,000-R30,000 per project"
        }
      case "Digital Marketing":
        return {
          examples: ["manage social media campaigns", "create content strategies", "run PPC campaigns"],
          rates: "R200-R800 per hour",
          projects: "R2,000-R20,000 per month"
        }
      case "AI & Data Science":
        return {
          examples: ["build ML models", "analyze business data", "create AI solutions"],
          rates: "R400-R2,000 per hour",
          projects: "R10,000-R100,000 per project"
        }
      default:
        return {
          examples: ["deliver professional services", "solve client problems", "create value"],
          rates: "R250-R1,000 per hour",
          projects: "R5,000-R40,000 per project"
        }
    }
  }

  const context = getSkillAreaContext()

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">Freelance Business Skills</DialogTitle>
              <DialogDescription>
                Learn to monetize your {skillArea.toLowerCase()} skills as a successful freelancer
              </DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="pricing">Pricing Guide</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-primary" />
                    Why Freelance with {skillArea}?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">High Demand Services</h4>
                    <p className="text-sm text-muted-foreground">
                      Use your {skillArea.toLowerCase()} skills to {context.examples.join(", ")} for clients worldwide.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Flexible Income</h4>
                    <p className="text-sm text-muted-foreground">
                      Earn {context.rates} or take on projects ranging from {context.projects}.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Location Independence</h4>
                    <p className="text-sm text-muted-foreground">
                      Work from anywhere in South Africa or serve international clients remotely.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Progress</CardTitle>
                  <CardDescription>Business skills completion</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overall Progress</span>
                        <span>{Math.round(calculateProgress())}%</span>
                      </div>
                      <Progress value={calculateProgress()} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 border rounded-lg">
                        <div className="text-2xl font-bold text-primary">2/5</div>
                        <div className="text-xs text-muted-foreground">Courses</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="text-2xl font-bold text-green-600">3/9</div>
                        <div className="text-xs text-muted-foreground">Tools</div>
                      </div>
                    </div>

                    <Button className="w-full" onClick={() => setActiveTab("courses")}>
                      Continue Learning
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Success Path: From Skills to Income</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="bg-blue-500/10 p-3 rounded-full w-fit mx-auto mb-3">
                      <Target className="h-6 w-6 text-blue-500" />
                    </div>
                    <h4 className="font-medium mb-1">1. Build Portfolio</h4>
                    <p className="text-xs text-muted-foreground">Showcase your {skillArea.toLowerCase()} work</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="bg-green-500/10 p-3 rounded-full w-fit mx-auto mb-3">
                      <Users className="h-6 w-6 text-green-500" />
                    </div>
                    <h4 className="font-medium mb-1">2. Find Clients</h4>
                    <p className="text-xs text-muted-foreground">Connect with businesses needing your skills</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="bg-purple-500/10 p-3 rounded-full w-fit mx-auto mb-3">
                      <DollarSign className="h-6 w-6 text-purple-500" />
                    </div>
                    <h4 className="font-medium mb-1">3. Price Right</h4>
                    <p className="text-xs text-muted-foreground">Set competitive rates for your services</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="bg-orange-500/10 p-3 rounded-full w-fit mx-auto mb-3">
                      <TrendingUp className="h-6 w-6 text-orange-500" />
                    </div>
                    <h4 className="font-medium mb-1">4. Scale Up</h4>
                    <p className="text-xs text-muted-foreground">Grow your freelance business</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {freelanceCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={
                          course.status === "completed"
                            ? "default"
                            : course.status === "in-progress"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {course.status === "completed"
                          ? "Completed"
                          : course.status === "in-progress"
                            ? "In Progress"
                            : "Not Started"}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center">
                        <Clock className="h-4 w-4 mr-1" /> {course.duration}
                      </span>
                      <span className="text-muted-foreground flex items-center">
                        <FileText className="h-4 w-4 mr-1" /> {course.lessons} lessons
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                    <Button 
                      variant={course.status === "completed" ? "outline" : "default"} 
                      className="w-full"
                      size="sm"
                    >
                      {course.status === "completed"
                        ? "Review"
                        : course.status === "in-progress"
                          ? "Continue"
                          : "Start Course"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools" className="mt-6">
            <div className="space-y-6">
              {businessTools.map((category, index) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold mb-3">{category.category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {category.tools.map((tool, toolIndex) => (
                      <Card key={toolIndex} className={tool.status === "locked" ? "opacity-60" : ""}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium">{tool.name}</h4>
                            {tool.status === "available" ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <Badge variant="outline" className="text-xs">Locked</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{tool.description}</p>
                          <Button 
                            size="sm" 
                            className="w-full" 
                            disabled={tool.status === "locked"}
                            variant={tool.status === "locked" ? "outline" : "default"}
                          >
                            {tool.status === "available" ? "Download" : "Complete Course to Unlock"}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Pricing Guide Tab */}
          <TabsContent value="pricing" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{skillArea} Freelance Rates in South Africa</CardTitle>
                  <CardDescription>Market rates based on experience level</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Beginner (0-1 years)</div>
                        <div className="text-sm text-muted-foreground">Building portfolio</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">R150-R400/hr</div>
                        <div className="text-sm text-muted-foreground">R2K-R8K/project</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Intermediate (1-3 years)</div>
                        <div className="text-sm text-muted-foreground">Proven track record</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">R300-R800/hr</div>
                        <div className="text-sm text-muted-foreground">R5K-R25K/project</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Expert (3+ years)</div>
                        <div className="text-sm text-muted-foreground">Specialized expertise</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">R600-R2000/hr</div>
                        <div className="text-sm text-muted-foreground">R15K-R100K/project</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pricing Calculator</CardTitle>
                  <CardDescription>Calculate your rates based on your goals</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Monthly Income Goal (Rands)</label>
                    <input 
                      type="number" 
                      placeholder="e.g., 25000" 
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Hours per week</label>
                    <input 
                      type="number" 
                      placeholder="e.g., 30" 
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  
                  <Button className="w-full">Calculate My Rate</Button>
                  
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <div className="text-sm text-muted-foreground">Your recommended hourly rate</div>
                    <div className="text-2xl font-bold text-primary">R208/hour</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Pricing Tips for {skillArea} Freelancers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium text-green-600">✅ Do:</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Research market rates for your specific skills</li>
                      <li>• Factor in taxes, equipment, and business expenses</li>
                      <li>• Offer value-based pricing for complex projects</li>
                      <li>• Create clear project scopes and contracts</li>
                      <li>• Start with competitive rates and increase gradually</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium text-red-600">❌ Don't:</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Undervalue your {skillArea.toLowerCase()} expertise</li>
                      <li>• Accept projects below your minimum rate</li>
                      <li>• Work without contracts or clear terms</li>
                      <li>• Compete solely on price</li>
                      <li>• Forget to include revision rounds in pricing</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}