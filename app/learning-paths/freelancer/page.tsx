"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InterviewWindow } from "@/components/interview-window"
import { ProjectSubmission } from "@/components/project-submission"
import { ProjectReview } from "@/components/project-review"
import {
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  FileText,
  Headphones,
  Layout,
  MessageSquare,
  Mic,
  Play,
  Upload,
  Users,
  AlertCircle,
} from "lucide-react"

// Mock course data
const courses = [
  {
    id: 1,
    title: "Personal Branding for Freelancers",
    description: "Learn how to build a strong personal brand that attracts clients",
    duration: "3 weeks",
    lessons: 12,
    progress: 100,
    status: "completed",
    image:
      "/images/pexels-bohlemedia-1114425.jpg",
  },
  {
    id: 2,
    title: "Client Communication Mastery",
    description: "Master the art of professional client communication",
    duration: "2 weeks",
    lessons: 8,
    progress: 65,
    status: "in-progress",
    image:
      "/images/pexels-chevanon-1108101.jpg",
  },
  {
    id: 3,
    title: "Pricing Your Services",
    description: "Learn how to price your services for maximum profit",
    duration: "2 weeks",
    lessons: 6,
    progress: 25,
    status: "in-progress",
    image: "/images/pexels-cottonbro-5082578.jpg",
  },
  {
    id: 4,
    title: "Finding Your First Clients",
    description: "Strategies to find and secure your first freelance clients",
    duration: "4 weeks",
    lessons: 14,
    progress: 0,
    status: "not-started",
    image:
      "/images/pexels-energepic-com-27411-159888.jpg",
  },
  {
    id: 5,
    title: "Managing Freelance Finances",
    description: "Learn how to manage your finances as a freelancer",
    duration: "3 weeks",
    lessons: 10,
    progress: 0,
    status: "not-started",
    image: "/images/pexels-fauxels-3183150.jpg",
  },
]

// Mock interview roles
const interviewRoles = [
  { id: "graphic-designer", name: "Graphic Designer" },
  { id: "web-developer", name: "Web Developer" },
  { id: "content-writer", name: "Content Writer" },
  { id: "digital-marketer", name: "Digital Marketer" },
  { id: "ui-ux-designer", name: "UI/UX Designer" },
  { id: "ai-consultant", name: "AI Consultant" },
]

// Mock interview questions by role
const interviewQuestions = {
  "graphic-designer": [
    "How would you approach designing a logo for a South African tourism company?",
    "Can you walk me through your design process from brief to final delivery?",
    "How do you handle client feedback that contradicts best design practices?",
    "What's your approach to pricing design projects of varying complexity?",
    "How do you stay updated with the latest design trends in South Africa?",
  ],
  "web-developer": [
    "How would you optimize a website for South African internet conditions?",
    "What's your approach to making websites accessible to diverse South African users?",
    "How do you handle projects with tight deadlines?",
    "What's your experience with e-commerce solutions for the South African market?",
    "How do you price website development projects?",
  ],
  "content-writer": [
    "How do you adapt your writing style for different South African audiences?",
    "What's your research process for writing about unfamiliar topics?",
    "How do you handle clients who request multiple revisions?",
    "What's your approach to SEO writing for local South African businesses?",
    "How do you determine your pricing for different types of content?",
  ],
}

// Mock project briefs
const projectBriefs = [
  {
    id: 1,
    title: "Design a logo for a Johannesburg tech startup",
    description:
      "Create a modern, tech-focused logo for 'InnovateJHB', a new startup hub in Sandton that supports AI and blockchain startups.",
    skills: ["Logo Design", "Branding"],
    difficulty: "Intermediate",
    deadline: "7 days",
    status: "in-progress",
    feedback: null,
    image: "/images/pexels-fauxels-3183170.jpg",
  },
  {
    id: 2,
    title: "Build a landing page for a Cape Town winery",
    description:
      "Develop a responsive landing page for 'Stellenbosch Estates', showcasing their award-winning wines and vineyard tours.",
    skills: ["Web Development", "UI Design"],
    difficulty: "Intermediate",
    deadline: "14 days",
    status: "not-started",
    feedback: null,
    image: "/images/workshop11.jpg",
  },
  {
    id: 3,
    title: "Write content for a Durban tourism company",
    description:
      "Create engaging content for 'Durban Adventures', highlighting local attractions, activities, and cultural experiences.",
    skills: ["Content Writing", "SEO"],
    difficulty: "Beginner",
    deadline: "10 days",
    status: "reviewed",
    feedback: {
      technical: [
        "Good use of keywords for local SEO",
        "Content is engaging and well-researched",
        "Consider adding more specific calls-to-action",
        "Add more details about pricing and booking options",
      ],
      clientReady: [
        "Excellent work capturing Durban's vibrant culture",
        "The content flows naturally and is very engaging",
        "Consider adding a section about seasonal activities",
        "Ready for client presentation with minor adjustments",
      ],
    },
    image: "/images/pexels-izabrella-988952.jpg",
  },
]

// Calculate overall progress
const calculateOverallProgress = () => {
  const courseProgress = courses.reduce((acc, course) => acc + course.progress, 0) / courses.length

  // Mock interview and project progress
  const interviewProgress = 40 // 40% of interviews completed
  const projectProgress = 33 // 33% of projects completed (1 of 3)

  // Weight: 60% courses, 20% interviews, 20% projects
  return courseProgress * 0.6 + interviewProgress * 0.2 + projectProgress * 0.2
}

export default function FreelancerPathPage() {
  const [activeTab, setActiveTab] = useState("courses")
  const [selectedRole, setSelectedRole] = useState("graphic-designer")
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [showInterviewFeedback, setShowInterviewFeedback] = useState(false)
  const [interviewMode, setInterviewMode] = useState<"text" | "voice">("text")

  const overallProgress = calculateOverallProgress()

  const handleStartInterview = () => {
    // In a real app, this would initialize the interview process
    console.log(`Starting interview for ${selectedRole}`)
  }

  const handleProjectSelect = (projectId: number) => {
    setSelectedProject(projectId)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Freelancer Learning Path</h1>
          <p className="mt-1 text-muted-foreground">Build skills to start your freelance career</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button variant="outline" className="mr-2">
            <Users className="mr-2 h-4 w-4" />
            Join Community
          </Button>
          <Button>
            <Play className="mr-2 h-4 w-4" />
            Continue Learning
          </Button>
        </div>
      </div>

      {/* Overall Progress */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Your Progress</h2>
              <p className="text-muted-foreground">Track your journey to becoming a freelancer</p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <span className="text-2xl font-bold">{Math.round(overallProgress)}%</span>
              <p className="text-muted-foreground">Overall Completion</p>
            </div>
          </div>

          <Progress value={overallProgress} className="h-2 mb-4" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="flex items-center p-4 border rounded-lg">
              <div className="bg-[#6E56CF]/10 p-2 rounded-full mr-4">
                <FileText className="h-5 w-5 text-[#6E56CF]" />
              </div>
              <div>
                <p className="font-medium">Course Modules</p>
                <p className="text-muted-foreground">5/12 completed</p>
              </div>
            </div>
            <div className="flex items-center p-4 border rounded-lg">
              <div className="bg-[#FF6B6B]/10 p-2 rounded-full mr-4">
                <MessageSquare className="h-5 w-5 text-[#FF6B6B]" />
              </div>
              <div>
                <p className="font-medium">Interview Prep</p>
                <p className="text-muted-foreground">2/5 completed</p>
              </div>
            </div>
            <div className="flex items-center p-4 border rounded-lg">
              <div className="bg-[#4CAF50]/10 p-2 rounded-full mr-4">
                <Layout className="h-5 w-5 text-[#4CAF50]" />
              </div>
              <div>
                <p className="font-medium">Projects</p>
                <p className="text-muted-foreground">1/3 completed</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="interviews">Interview Prep</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        {/* Courses Tab */}
        <TabsContent value="courses">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <div className="h-48 relative">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge
                    variant={
                      course.status === "completed"
                        ? "default"
                        : course.status === "in-progress"
                          ? "secondary"
                          : "outline"
                    }
                    className="absolute top-3 right-3"
                  >
                    {course.status === "completed"
                      ? "Completed"
                      : course.status === "in-progress"
                        ? "In Progress"
                        : "Not Started"}
                  </Badge>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex justify-between text-sm mb-2">
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
                </CardContent>
                <CardFooter>
                  <Button variant={course.status === "completed" ? "outline" : "default"} className="w-full">
                    {course.status === "completed"
                      ? "Review Course"
                      : course.status === "in-progress"
                        ? "Continue Course"
                        : "Start Course"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Interview Prep Tab */}
        <TabsContent value="interviews">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Mock Interview</CardTitle>
                  <CardDescription>Practice your interview skills with AI-powered mock interviews</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Select Role</label>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {interviewRoles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Interview Mode</label>
                    <div className="flex space-x-2">
                      <Button
                        variant={interviewMode === "text" ? "default" : "outline"}
                        size="sm"
                        className="flex-1"
                        onClick={() => setInterviewMode("text")}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Text
                      </Button>
                      <Button
                        variant={interviewMode === "voice" ? "default" : "outline"}
                        size="sm"
                        className="flex-1"
                        onClick={() => setInterviewMode("voice")}
                      >
                        <Mic className="h-4 w-4 mr-2" />
                        Voice
                      </Button>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">What to expect:</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                        <span>
                          Role-specific questions for {interviewRoles.find((r) => r.id === selectedRole)?.name}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                        <span>Real-time feedback on your responses</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                        <span>Detailed report after completion</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                        <span>Personalized improvement suggestions</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-2">
                    <Button className="w-full bg-[#6E56CF] hover:bg-[#5842b5]" onClick={handleStartInterview}>
                      Start Mock Interview
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Practice Questions</CardTitle>
                  <CardDescription>
                    Common questions for {interviewRoles.find((r) => r.id === selectedRole)?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {interviewQuestions[selectedRole as keyof typeof interviewQuestions]?.map((question, index) => (
                      <li key={index} className="p-3 border rounded-lg">
                        <p>{question}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Interview Simulator</CardTitle>
                  <CardDescription>Practice with our AI interviewer in a realistic setting</CardDescription>
                </CardHeader>
                <CardContent className="h-[500px] flex flex-col">
                  {!showInterviewFeedback ? (
                    <InterviewWindow
                      role={interviewRoles.find((r) => r.id === selectedRole)?.name || ""}
                      mode={interviewMode}
                      onComplete={() => setShowInterviewFeedback(true)}
                    />
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                        <h3 className="font-medium text-green-800 dark:text-green-300 mb-2">
                          Interview Completed Successfully
                        </h3>
                        <p className="text-green-700 dark:text-green-400 text-sm">
                          You've completed the mock interview for{" "}
                          {interviewRoles.find((r) => r.id === selectedRole)?.name}. Here's your feedback and
                          performance analysis.
                        </p>
                      </div>

                      <div>
                        <h3 className="font-medium mb-3">Performance Summary</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="p-4 border rounded-lg">
                            <div className="text-2xl font-bold text-[#6E56CF] mb-1">75%</div>
                            <div className="text-sm text-muted-foreground">Overall Score</div>
                          </div>
                          <div className="p-4 border rounded-lg">
                            <div className="text-2xl font-bold text-[#4CAF50] mb-1">85%</div>
                            <div className="text-sm text-muted-foreground">Technical Knowledge</div>
                          </div>
                          <div className="p-4 border rounded-lg">
                            <div className="text-2xl font-bold text-[#FF6B6B] mb-1">65%</div>
                            <div className="text-sm text-muted-foreground">Communication</div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-3">Detailed Feedback</h3>
                        <div className="space-y-3">
                          <div className="p-4 border rounded-lg">
                            <h4 className="font-medium text-green-600 dark:text-green-400 mb-1">Strengths</h4>
                            <ul className="space-y-1 text-sm">
                              <li className="flex items-start">
                                <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                                <span>Strong technical knowledge of design principles</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                                <span>Clear explanation of your design process</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                                <span>Good examples of past work</span>
                              </li>
                            </ul>
                          </div>

                          <div className="p-4 border rounded-lg">
                            <h4 className="font-medium text-amber-600 dark:text-amber-400 mb-1">
                              Areas for Improvement
                            </h4>
                            <ul className="space-y-1 text-sm">
                              <li className="flex items-start">
                                <AlertCircle className="h-4 w-4 mr-2 text-amber-500 mt-0.5" />
                                <span>
                                  Hesitation when discussing pricing strategies. Review Module 4: "Pricing Your
                                  Services"
                                </span>
                              </li>
                              <li className="flex items-start">
                                <AlertCircle className="h-4 w-4 mr-2 text-amber-500 mt-0.5" />
                                <span>Could provide more specific examples of handling client feedback</span>
                              </li>
                              <li className="flex items-start">
                                <AlertCircle className="h-4 w-4 mr-2 text-amber-500 mt-0.5" />
                                <span>Consider practicing more concise responses to common questions</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between pt-4">
                        <Button variant="outline" onClick={() => setShowInterviewFeedback(false)}>
                          Try Again
                        </Button>
                        <Button>Save Feedback</Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects">
          {selectedProject === null ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectBriefs.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <div className="h-48 relative">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge
                      variant={
                        project.status === "reviewed"
                          ? "default"
                          : project.status === "in-progress"
                            ? "secondary"
                            : "outline"
                      }
                      className="absolute top-3 right-3"
                    >
                      {project.status === "reviewed"
                        ? "Reviewed"
                        : project.status === "in-progress"
                          ? "In Progress"
                          : "Not Started"}
                    </Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.skills.map((skill, index) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center">
                        <Calendar className="h-4 w-4 mr-1" /> {project.deadline}
                      </span>
                      <span className="text-muted-foreground">{project.difficulty}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      variant={project.status === "reviewed" ? "outline" : "default"}
                      onClick={() => handleProjectSelect(project.id)}
                    >
                      {project.status === "reviewed"
                        ? "View Feedback"
                        : project.status === "in-progress"
                          ? "Continue Project"
                          : "Start Project"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div>
              <Button variant="outline" className="mb-6" onClick={() => setSelectedProject(null)}>
                ← Back to Projects
              </Button>

              {(() => {
                const project = projectBriefs.find((p) => p.id === selectedProject)

                if (!project) return null

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                      <Card>
                        <CardHeader>
                          <CardTitle>{project.title}</CardTitle>
                          <CardDescription>Project Brief</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <img
                              src={project.image || "/placeholder.svg"}
                              alt={project.title}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          </div>

                          <div>
                            <h3 className="font-medium mb-2">Description</h3>
                            <p className="text-muted-foreground">{project.description}</p>
                          </div>

                          <Separator />

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h3 className="text-sm font-medium mb-1">Difficulty</h3>
                              <p>{project.difficulty}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium mb-1">Deadline</h3>
                              <p>{project.deadline}</p>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium mb-1">Required Skills</h3>
                            <div className="flex flex-wrap gap-2">
                              {project.skills.map((skill, index) => (
                                <Badge key={index} variant="outline">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <Separator />

                          <div>
                            <h3 className="font-medium mb-2">Deliverables</h3>
                            <ul className="space-y-1 text-sm">
                              <li className="flex items-start">
                                <CheckCircle className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                                <span>Source files (AI, PSD, Figma, etc.)</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                                <span>Final deliverable in appropriate format</span>
                              </li>
                              <li className="flex items-start">
                                <CheckCircle className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                                <span>Brief explanation of your process</span>
                              </li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="lg:col-span-2">
                      {project.status === "reviewed" ? (
                        <ProjectReview feedback={project.feedback} />
                      ) : (
                        <ProjectSubmission projectId={project.id} projectTitle={project.title} />
                      )}
                    </div>
                  </div>
                )
              })()}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Earnings Simulator */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Freelance Earnings Simulator</CardTitle>
          <CardDescription>See your potential earnings as a freelancer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
              <h3 className="text-lg font-medium mb-2">Beginner Level</h3>
              <div className="text-3xl font-bold mb-2">R5,000 - R15,000</div>
              <p className="text-muted-foreground mb-4">Monthly potential</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <span>2-3 small projects per month</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <span>Entry-level rates</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <span>Building portfolio and reviews</span>
                </li>
              </ul>
            </div>

            <div className="p-6 border rounded-lg bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-gray-800">
              <h3 className="text-lg font-medium mb-2">Intermediate Level</h3>
              <div className="text-3xl font-bold mb-2">R15,000 - R35,000</div>
              <p className="text-muted-foreground mb-4">Monthly potential</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <span>3-5 medium projects per month</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <span>Competitive market rates</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <span>Established client relationships</span>
                </li>
              </ul>
            </div>

            <div className="p-6 border rounded-lg bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-gray-800">
              <h3 className="text-lg font-medium mb-2">Expert Level</h3>
              <div className="text-3xl font-bold mb-2">R35,000 - R80,000+</div>
              <p className="text-muted-foreground mb-4">Monthly potential</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <span>2-3 large projects per month</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <span>Premium rates for specialized skills</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <span>Recurring clients and referrals</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
          <CardDescription>Continue your freelancer journey with these recommended actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start p-4 border rounded-lg">
              <div className="bg-[#6E56CF]/10 p-2 rounded-full mr-4">
                <FileText className="h-5 w-5 text-[#6E56CF]" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Complete "Client Communication Mastery"</h3>
                <p className="text-muted-foreground text-sm mb-2">
                  You're 65% through this course. Finish it to unlock advanced communication templates.
                </p>
                <Button size="sm">Continue Course</Button>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="flex items-start p-4 border rounded-lg">
              <div className="bg-[#FF6B6B]/10 p-2 rounded-full mr-4">
                <Headphones className="h-5 w-5 text-[#FF6B6B]" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Practice Web Developer Interview</h3>
                <p className="text-muted-foreground text-sm mb-2">
                  Prepare for client calls by practicing with our AI interviewer.
                </p>
                <Button size="sm" variant="outline">
                  Start Practice
                </Button>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="flex items-start p-4 border rounded-lg">
              <div className="bg-[#4CAF50]/10 p-2 rounded-full mr-4">
                <Upload className="h-5 w-5 text-[#4CAF50]" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Submit Johannesburg Tech Logo Project</h3>
                <p className="text-muted-foreground text-sm mb-2">
                  You've started this project. Complete and submit it for AI feedback.
                </p>
                <Button size="sm" variant="outline">
                  Continue Project
                </Button>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
