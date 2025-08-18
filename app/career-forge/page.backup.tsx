"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { create } from "zustand"
import {
  FileText,
  Layout,
  Smartphone,
  Tablet,
  Monitor,
  PlusCircle,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Share2,
  Sparkles,
  Zap,
  BarChart,
  Star,
  CheckCircle,
  AlertCircle,
  Info,
  Laptop,
  Save,
  Loader2,
  Lightbulb,
  TrendingUp,
  Layers,
  Maximize2,
  ImageIcon,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  DownloadIcon,
  X,
} from "lucide-react"

// Define the store with Zustand
interface CareerForgeState {
  activeTab: string
  setActiveTab: (tab: string) => void
  previewMode: string
  setPreviewMode: (mode: string) => void
  cvData: any
  updateCvData: (data: any) => void
  portfolioData: any
  updatePortfolioData: (data: any) => void
  syncEnabled: boolean
  toggleSync: () => void
  careerXP: number
  addXP: (amount: number) => void
  level: number
  calculateLevel: () => void
  challenges: any[]
  completeChallenge: (id: string) => void
}

const useCareerForgeStore = create<CareerForgeState>((set) => ({
  activeTab: "cv",
  setActiveTab: (tab) => set({ activeTab: tab }),
  previewMode: "desktop",
  setPreviewMode: (mode) => set({ previewMode: mode }),
  cvData: {
    personalInfo: {
      name: "Thabo Mokoena",
      title: "Senior Frontend Developer",
      email: "thabo.mokoena@example.com",
      phone: "+27 71 234 5678",
      location: "Cape Town, South Africa",
      linkedin: "linkedin.com/in/thabomokoena",
      github: "github.com/thabomokoena",
      website: "thabomokoena.dev",
      summary:
        "Experienced frontend developer with 5+ years of expertise in React, Next.js, and TypeScript. Passionate about creating responsive, accessible, and performant web applications.",
    },
    workExperience: [
      {
        id: "job1",
        title: "Senior Frontend Developer",
        company: "TechSA Solutions",
        location: "Cape Town",
        startDate: "2021-06",
        endDate: "Present",
        current: true,
        description:
          "Led the frontend development team in building a responsive e-commerce platform. Improved site performance by 40% and implemented CI/CD pipelines.",
        achievements: [
          "Reduced page load time by 40% through code optimization",
          "Implemented automated testing, achieving 90% code coverage",
          "Mentored 5 junior developers, improving team productivity by 25%",
        ],
        skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "CI/CD"],
      },
      {
        id: "job2",
        title: "Frontend Developer",
        company: "Digital Creatives",
        location: "Johannesburg",
        startDate: "2019-03",
        endDate: "2021-05",
        current: false,
        description:
          "Developed responsive web applications for various clients using React and Redux. Collaborated with designers to implement UI/UX designs.",
        achievements: [
          "Built 15+ client websites with responsive designs",
          "Implemented state management using Redux, improving application stability",
          "Collaborated with UX team to improve user flows, increasing conversion rates by 20%",
        ],
        skills: ["React", "Redux", "JavaScript", "SCSS", "Responsive Design"],
      },
    ],
    education: [
      {
        id: "edu1",
        degree: "BSc Computer Science",
        institution: "University of Cape Town",
        location: "Cape Town",
        startDate: "2015-01",
        endDate: "2018-12",
        description: "Focused on software engineering and web development. Graduated with honors.",
        achievements: ["Dean's List 2017-2018", "Final Year Project: AI-powered content recommendation system"],
      },
    ],
    skills: [
      { id: "skill1", name: "React", level: 90 },
      { id: "skill2", name: "Next.js", level: 85 },
      { id: "skill3", name: "TypeScript", level: 80 },
      { id: "skill4", name: "JavaScript", level: 95 },
      { id: "skill5", name: "HTML/CSS", level: 90 },
      { id: "skill6", name: "Tailwind CSS", level: 85 },
      { id: "skill7", name: "Redux", level: 75 },
      { id: "skill8", name: "Node.js", level: 70 },
      { id: "skill9", name: "Git", level: 85 },
      { id: "skill10", name: "CI/CD", level: 75 },
    ],
    languages: [
      { id: "lang1", name: "English", level: "Native" },
      { id: "lang2", name: "Zulu", level: "Fluent" },
      { id: "lang3", name: "Afrikaans", level: "Intermediate" },
    ],
    certifications: [
      {
        id: "cert1",
        name: "AWS Certified Developer",
        issuer: "Amazon Web Services",
        date: "2022-05",
        expires: "2025-05",
      },
      {
        id: "cert2",
        name: "Professional Scrum Master I",
        issuer: "Scrum.org",
        date: "2021-03",
        expires: null,
      },
    ],
  },
  updateCvData: (data) => set({ cvData: { ...data } }),
  portfolioData: {
    theme: "capeTown",
    about: {
      name: "Thabo Mokoena",
      title: "Senior Frontend Developer",
      bio: "I'm a passionate frontend developer based in Cape Town, South Africa. I specialize in creating responsive, user-friendly web applications with modern technologies like React and Next.js.",
      email: "thabo.mokoena@example.com",
      phone: "+27 71 234 5678",
      location: "Cape Town, South Africa",
      website: "thabomokoena.dev",
      linkedin: "linkedin.com/in/thabomokoena",
      github: "github.com/thabomokoena",
    },
    projects: [
      {
        id: "proj1",
        title: "E-commerce Platform Redesign",
        description:
          "Redesigned and rebuilt the frontend of a major e-commerce platform, improving performance and user experience.",
        longDescription:
          "Led the complete redesign and rebuild of the frontend for a major South African e-commerce platform. The project involved migrating from a legacy codebase to a modern React and Next.js architecture. Implemented responsive design, accessibility improvements, and performance optimizations.",
        tags: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux"],
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pexels-cottonbro-5082578.jpg-jNuNHxSLPMsfEKBnotexPcBDBKmVcv.jpeg",
        link: "https://example.com/project1",
        github: "https://github.com/thabomokoena/ecommerce-redesign",
        featured: true,
        achievements: [
          "Reduced page load time by 40%",
          "Improved mobile conversion rate by 25%",
          "Implemented CI/CD pipeline for faster deployments",
        ],
        jobLink: "job1",
      },
      {
        id: "proj2",
        title: "Financial Dashboard",
        description:
          "Built a comprehensive financial dashboard for tracking investments, expenses, and financial goals.",
        longDescription:
          "Developed a feature-rich financial dashboard that allows users to track investments, expenses, and financial goals in real-time. The application includes data visualization, budget planning tools, and integration with South African banks via secure APIs.",
        tags: ["React", "D3.js", "Node.js", "Express", "MongoDB"],
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/datasci.jpg-7xyCPyuFPQdPNeLC1O69lLk256v4Yj.jpeg",
        link: "https://example.com/project2",
        github: "https://github.com/thabomokoena/financial-dashboard",
        featured: true,
        achievements: [
          "Processed and visualized 10,000+ financial transactions",
          "Implemented secure OAuth 2.0 authentication",
          "Designed responsive UI for all device sizes",
        ],
        jobLink: "job2",
      },
    ],
    testimonials: [
      {
        id: "test1",
        name: "Lerato Ndlovu",
        company: "TechSA Solutions",
        position: "Product Manager",
        content:
          "Thabo is an exceptional developer who consistently delivers high-quality work. His attention to detail and problem-solving skills make him an invaluable asset to any team.",
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: "test2",
        name: "David van der Merwe",
        company: "Digital Creatives",
        position: "CTO",
        content:
          "Working with Thabo was a pleasure. He has a deep understanding of frontend technologies and always goes the extra mile to ensure the best user experience.",
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
    skills: [
      { id: "skill1", name: "React", level: 90 },
      { id: "skill2", name: "Next.js", level: 85 },
      { id: "skill3", name: "TypeScript", level: 80 },
      { id: "skill4", name: "JavaScript", level: 95 },
      { id: "skill5", name: "HTML/CSS", level: 90 },
      { id: "skill6", name: "Tailwind CSS", level: 85 },
      { id: "skill7", name: "Redux", level: 75 },
      { id: "skill8", name: "Node.js", level: 70 },
    ],
  },
  updatePortfolioData: (data) => set({ portfolioData: { ...data } }),
  syncEnabled: true,
  toggleSync: () => set((state) => ({ syncEnabled: !state.syncEnabled })),
  careerXP: 1250,
  addXP: (amount) =>
    set((state) => {
      const newXP = state.careerXP + amount
      return { careerXP: newXP }
    }),
  level: 5,
  calculateLevel: () =>
    set((state) => {
      const level = Math.floor(state.careerXP / 500) + 1
      return { level }
    }),
  challenges: [
    {
      id: "challenge1",
      title: "Add 3 metrics to your CV",
      description: "Add at least 3 quantifiable achievements to your work experience",
      reward: 100,
      completed: true,
    },
    {
      id: "challenge2",
      title: "Complete your portfolio",
      description: "Add at least 3 projects to your portfolio with descriptions and images",
      reward: 150,
      completed: false,
    },
    {
      id: "challenge3",
      title: "Get 5 portfolio views",
      description: "Share your portfolio and get at least 5 unique views",
      reward: 200,
      completed: false,
    },
  ],
  completeChallenge: (id) =>
    set((state) => ({
      challenges: state.challenges.map((challenge) =>
        challenge.id === id ? { ...challenge, completed: true } : challenge,
      ),
    })),
}))

// South African city rate data
const cityRates = {
  "Cape Town": {
    "Frontend Developer": { junior: "R250-350", mid: "R350-500", senior: "R500-800" },
    "Backend Developer": { junior: "R300-400", mid: "R400-550", senior: "R550-850" },
    "Full Stack Developer": { junior: "R300-450", mid: "R450-650", senior: "R650-950" },
    "UI/UX Designer": { junior: "R200-350", mid: "R350-500", senior: "R500-750" },
    "Data Scientist": { junior: "R300-450", mid: "R450-650", senior: "R650-900" },
  },
  Johannesburg: {
    "Frontend Developer": { junior: "R300-400", mid: "R400-550", senior: "R550-850" },
    "Backend Developer": { junior: "R350-450", mid: "R450-600", senior: "R600-900" },
    "Full Stack Developer": { junior: "R350-500", mid: "R500-700", senior: "R700-1000" },
    "UI/UX Designer": { junior: "R250-400", mid: "R400-550", senior: "R550-800" },
    "Data Scientist": { junior: "R350-500", mid: "R500-700", senior: "R700-950" },
  },
  Durban: {
    "Frontend Developer": { junior: "R200-300", mid: "R300-450", senior: "R450-700" },
    "Backend Developer": { junior: "R250-350", mid: "R350-500", senior: "R500-750" },
    "Full Stack Developer": { junior: "R250-400", mid: "R400-600", senior: "R600-850" },
    "UI/UX Designer": { junior: "R180-300", mid: "R300-450", senior: "R450-650" },
    "Data Scientist": { junior: "R250-400", mid: "R400-600", senior: "R600-800" },
  },
  Pretoria: {
    "Frontend Developer": { junior: "R250-350", mid: "R350-500", senior: "R500-750" },
    "Backend Developer": { junior: "R300-400", mid: "R400-550", senior: "R550-800" },
    "Full Stack Developer": { junior: "R300-450", mid: "R450-650", senior: "R650-900" },
    "UI/UX Designer": { junior: "R200-350", mid: "R350-500", senior: "R500-700" },
    "Data Scientist": { junior: "R300-450", mid: "R450-650", senior: "R650-850" },
  },
}

// Template styles
const portfolioTemplates = {
  capeTown: {
    name: "Cape Town Tech",
    description: "Clean, modern design with a professional feel",
    primary: "#3B82F6",
    secondary: "#F0F9FF",
    accent: "#0EA5E9",
    fontPrimary: "Inter, sans-serif",
    fontSecondary: "Inter, sans-serif",
    preview: "/placeholder.svg?height=200&width=300",
  },
  johannesburg: {
    name: "Johannesburg Corporate",
    description: "Bold, professional design for corporate environments",
    primary: "#8B5CF6",
    secondary: "#F5F3FF",
    accent: "#7C3AED",
    fontPrimary: "Inter, sans-serif",
    fontSecondary: "Inter, sans-serif",
    preview: "/placeholder.svg?height=200&width=300",
  },
  durban: {
    name: "Durban Creative",
    description: "Vibrant, creative design with a coastal feel",
    primary: "#EC4899",
    secondary: "#FDF2F8",
    accent: "#DB2777",
    fontPrimary: "Inter, sans-serif",
    fontSecondary: "Inter, sans-serif",
    preview: "/placeholder.svg?height=200&width=300",
  },
  pretoria: {
    name: "Pretoria Government",
    description: "Professional design for government and public sector",
    primary: "#10B981",
    secondary: "#ECFDF5",
    accent: "#059669",
    fontPrimary: "Inter, sans-serif",
    fontSecondary: "Inter, sans-serif",
    preview: "/placeholder.svg?height=200&width=300",
  },
  lagos: {
    name: "Lagos Tech Minimalist",
    description: "Clean, minimalist design for tech professionals",
    primary: "#6366F1",
    secondary: "#EEF2FF",
    accent: "#4F46E5",
    fontPrimary: "Inter, sans-serif",
    fontSecondary: "Inter, sans-serif",
    preview: "/placeholder.svg?height=200&width=300",
  },
  nairobi: {
    name: "Nairobi Startup Bold",
    description: "Bold, innovative design for startup founders",
    primary: "#F59E0B",
    secondary: "#FFFBEB",
    accent: "#D97706",
    fontPrimary: "Inter, sans-serif",
    fontSecondary: "Inter, sans-serif",
    preview: "/placeholder.svg?height=200&width=300",
  },
}

// CV templates
const cvTemplates = {
  modern: {
    name: "Modern Professional",
    description: "Clean, modern design with a professional feel",
    primary: "#3B82F6",
    secondary: "#F0F9FF",
    accent: "#0EA5E9",
    fontPrimary: "Inter, sans-serif",
    fontSecondary: "Inter, sans-serif",
    preview: "/placeholder.svg?height=200&width=300",
  },
  classic: {
    name: "Classic Corporate",
    description: "Traditional design for corporate environments",
    primary: "#1E293B",
    secondary: "#F8FAFC",
    accent: "#475569",
    fontPrimary: "Georgia, serif",
    fontSecondary: "Arial, sans-serif",
    preview: "/placeholder.svg?height=200&width=300",
  },
  creative: {
    name: "Creative Professional",
    description: "Unique design for creative industries",
    primary: "#EC4899",
    secondary: "#FDF2F8",
    accent: "#DB2777",
    fontPrimary: "Inter, sans-serif",
    fontSecondary: "Inter, sans-serif",
    preview: "/placeholder.svg?height=200&width=300",
  },
  executive: {
    name: "Executive Suite",
    description: "Sophisticated design for senior professionals",
    primary: "#10B981",
    secondary: "#ECFDF5",
    accent: "#059669",
    fontPrimary: "Inter, sans-serif",
    fontSecondary: "Inter, sans-serif",
    preview: "/placeholder.svg?height=200&width=300",
  },
}

// Mock AI suggestions
const aiSuggestions = {
  cv: [
    {
      id: "cvSugg1",
      type: "improvement",
      title: "Add more metrics",
      description: "Your work experience could benefit from more quantifiable achievements.",
      example: "Increased website traffic by 45% through SEO optimization",
    },
    {
      id: "cvSugg2",
      type: "gap",
      title: "Missing TypeScript projects",
      description: "Your CV mentions TypeScript skills, but no specific TypeScript projects.",
      example: "Add a TypeScript project to your work experience or portfolio",
    },
    {
      id: "cvSugg3",
      type: "keyword",
      title: "Add 'React Native' keyword",
      description: "Adding React Native to your skills could increase visibility for mobile dev roles.",
      example: "React Native, Mobile Development, iOS, Android",
    },
  ],
  portfolio: [
    {
      id: "portSugg1",
      type: "improvement",
      title: "Add case studies",
      description: "Your portfolio projects would benefit from detailed case studies.",
      example: "Problem → Solution → Results format with metrics",
    },
    {
      id: "portSugg2",
      type: "gap",
      title: "Missing visual design examples",
      description: "Your UI/UX skills need more visual examples in your portfolio.",
      example: "Add wireframes, mockups, or before/after comparisons",
    },
    {
      id: "portSugg3",
      type: "engagement",
      title: "Add interactive elements",
      description: "Interactive elements can increase engagement with your portfolio.",
      example: "Live demos, interactive prototypes, or code sandboxes",
    },
  ],
}

// Device Model component for AR preview
function DeviceModel({ device, children }) {
  return (
    <div
      className={`relative ${
        device === "desktop"
          ? "w-full h-[400px] rounded-lg"
          : device === "tablet"
            ? "w-[320px] h-[400px] rounded-lg mx-auto"
            : "w-[240px] h-[400px] rounded-[24px] mx-auto"
      } bg-white dark:bg-gray-900 shadow-lg overflow-hidden border-4 border-gray-200 dark:border-gray-800`}
    >
      {device === "mobile" && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
      )}
      <div className="w-full h-full overflow-auto p-4">{children}</div>
    </div>
  )
}

// Rate Calculator component
function RateCalculator() {
  const [city, setCity] = useState("Cape Town")
  const [role, setRole] = useState("Frontend Developer")
  const [experience, setExperience] = useState("mid")
  const [rate, setRate] = useState("")

  useEffect(() => {
    if (city && role && experience) {
      setRate(cityRates[city][role][experience])
    }
  }, [city, role, experience])

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">ZAR Rate Calculator</CardTitle>
        <CardDescription>Find competitive hourly rates based on your location and experience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger id="city">
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cape Town">Cape Town</SelectItem>
              <SelectItem value="Johannesburg">Johannesburg</SelectItem>
              <SelectItem value="Durban">Durban</SelectItem>
              <SelectItem value="Pretoria">Pretoria</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger id="role">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
              <SelectItem value="Backend Developer">Backend Developer</SelectItem>
              <SelectItem value="Full Stack Developer">Full Stack Developer</SelectItem>
              <SelectItem value="UI/UX Designer">UI/UX Designer</SelectItem>
              <SelectItem value="Data Scientist">Data Scientist</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience">Experience Level</Label>
          <Select value={experience} onValueChange={setExperience}>
            <SelectTrigger id="experience">
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="junior">Junior (0-2 years)</SelectItem>
              <SelectItem value="mid">Mid-Level (3-5 years)</SelectItem>
              <SelectItem value="senior">Senior (6+ years)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Hourly Rate (ZAR)</span>
            <Badge variant="outline" className="text-lg font-bold">
              {rate || "---"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Rates are based on market research for freelancers in South Africa as of May 2023
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// POPIA Compliance Checker component
function POPIAComplianceChecker() {
  const [text, setText] = useState("")
  const [results, setResults] = useState<any>(null)
  const [checking, setChecking] = useState(false)

  const checkCompliance = () => {
    setChecking(true)
    // Simulate API call
    setTimeout(() => {
      const idNumberRegex = /\d{13}/g
      const hasIdNumber = idNumberRegex.test(text)

      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
      const emails = text.match(emailRegex) || []

      const phoneRegex = /(?:\+27|0)[0-9]{9}/g
      const phones = text.match(phoneRegex) || []

      setResults({
        compliant: !hasIdNumber,
        issues: [
          {
            type: "ID Number",
            found: hasIdNumber,
            severity: "high",
            recommendation: "Remove all ID numbers from public-facing content",
          },
          {
            type: "Email Addresses",
            found: emails.length > 0,
            count: emails.length,
            severity: "medium",
            recommendation: "Consider obfuscating email addresses or using contact forms",
          },
          {
            type: "Phone Numbers",
            found: phones.length > 0,
            count: phones.length,
            severity: "medium",
            recommendation: "Consider obfuscating phone numbers or using contact forms",
          },
        ],
      })
      setChecking(false)
    }, 1500)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">POPIA Compliance Checker</CardTitle>
        <CardDescription>Check your content for potential POPIA compliance issues</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="content">Content to Check</Label>
          <Textarea
            id="content"
            placeholder="Paste your CV or portfolio content here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
          />
        </div>

        <Button onClick={checkCompliance} disabled={checking || !text} className="w-full">
          {checking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking...
            </>
          ) : (
            "Check Compliance"
          )}
        </Button>

        {results && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Status</span>
              <Badge variant={results.compliant ? "success" : "destructive"}>
                {results.compliant ? "Compliant" : "Issues Found"}
              </Badge>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium">Issues</h4>
              {results.issues.map((issue, index) => (
                <div key={index} className="bg-muted/50 rounded-md p-3 text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{issue.type}</span>
                    <Badge
                      variant={issue.found ? (issue.severity === "high" ? "destructive" : "warning") : "outline"}
                      className="text-xs"
                    >
                      {issue.found ? (issue.severity === "high" ? "High Risk" : "Medium Risk") : "Not Found"}
                    </Badge>
                  </div>
                  {issue.found && (
                    <>
                      {issue.count && <p className="text-xs text-muted-foreground mb-1">Found: {issue.count}</p>}
                      <p className="text-xs">{issue.recommendation}</p>
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md p-3 text-sm">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-700 dark:text-blue-300">POPIA Compliance Note</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    This is a basic check only. For comprehensive POPIA compliance, consult with a legal professional
                    specializing in data protection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// AI Suggestion component
function AISuggestion({ suggestion }) {
  return (
    <div className="bg-muted/30 rounded-lg p-4 border border-muted mb-3">
      <div className="flex items-start gap-3">
        <div
          className={`p-2 rounded-full ${
            suggestion.type === "improvement"
              ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
              : suggestion.type === "gap"
                ? "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300"
                : "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
          }`}
        >
          {suggestion.type === "improvement" ? (
            <TrendingUp className="h-4 w-4" />
          ) : suggestion.type === "gap" ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <Zap className="h-4 w-4" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm">{suggestion.title}</h3>
          <p className="text-xs text-muted-foreground mt-1">{suggestion.description}</p>
          <div className="mt-2 bg-background rounded p-2 text-xs border border-border">
            <span className="font-medium">Example:</span> {suggestion.example}
          </div>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <Button variant="ghost" size="sm" className="h-7 text-xs">
          Apply Suggestion
        </Button>
      </div>
    </div>
  )
}

// Challenge component
function Challenge({ challenge, onComplete }) {
  return (
    <div
      className={`p-4 rounded-lg border ${
        challenge.completed
          ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
          : "bg-card border-border"
      } mb-3`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-2 rounded-full ${
            challenge.completed
              ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
              : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
          }`}
        >
          {challenge.completed ? <CheckCircle className="h-4 w-4" /> : <Star className="h-4 w-4" />}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm">{challenge.title}</h3>
          <p className="text-xs text-muted-foreground mt-1">{challenge.description}</p>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs">
              <Zap className="h-3 w-3 text-amber-500" />
              <span>{challenge.reward} XP</span>
            </div>
            {challenge.completed ? (
              <Badge variant="success" className="text-xs">
                Completed
              </Badge>
            ) : (
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => onComplete(challenge.id)}>
                Mark Complete
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// CV Preview component
function CVPreview({ data, template = "modern" }) {
  const templateStyle = cvTemplates[template]

  return (
    <div className="bg-white text-gray-800 p-6 rounded-lg shadow-sm">
      {/* Header */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold" style={{ color: templateStyle.primary }}>
          {data.personalInfo.name}
        </h1>
        <h2 className="text-lg text-gray-600 mt-1">{data.personalInfo.title}</h2>
        <div className="flex flex-wrap gap-3 mt-3 text-sm">
          <div className="flex items-center gap-1">
            <Mail className="h-4 w-4 text-gray-500" />
            <span>{data.personalInfo.email}</span>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="h-4 w-4 text-gray-500" />
            <span>{data.personalInfo.phone}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>{data.personalInfo.location}</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2" style={{ color: templateStyle.primary }}>
          Professional Summary
        </h3>
        <p className="text-sm text-gray-700">{data.personalInfo.summary}</p>
      </div>

      {/* Work Experience */}
      <div className="mb-6">
        <h3 className="text-md font-semibold mb-3" style={{ color: templateStyle.primary }}>
          Work Experience
        </h3>
        <div className="space-y-4">
          {data.workExperience.map((job) => (
            <div key={job.id} className="pb-3 border-b border-gray-100 last:border-0">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-medium">{job.title}</h4>
                  <p className="text-sm text-gray-600">
                    {job.company}, {job.location}
                  </p>
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(job.startDate).toLocaleDateString("en-ZA", { year: "numeric", month: "short" })} -{" "}
                  {job.current
                    ? "Present"
                    : new Date(job.endDate).toLocaleDateString("en-ZA", { year: "numeric", month: "short" })}
                </p>
              </div>
              <p className="text-xs text-gray-700 mt-2">{job.description}</p>
              {job.achievements && job.achievements.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-medium">Key Achievements:</p>
                  <ul className="text-xs text-gray-700 list-disc list-inside mt-1">
                    {job.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="mb-6">
        <h3 className="text-md font-semibold mb-3" style={{ color: templateStyle.primary }}>
          Education
        </h3>
        <div className="space-y-4">
          {data.education.map((edu) => (
            <div key={edu.id} className="pb-3 border-b border-gray-100 last:border-0">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-medium">{edu.degree}</h4>
                  <p className="text-sm text-gray-600">
                    {edu.institution}, {edu.location}
                  </p>
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(edu.startDate).toLocaleDateString("en-ZA", { year: "numeric", month: "short" })} -{" "}
                  {new Date(edu.endDate).toLocaleDateString("en-ZA", { year: "numeric", month: "short" })}
                </p>
              </div>
              <p className="text-xs text-gray-700 mt-2">{edu.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div>
        <h3 className="text-md font-semibold mb-3" style={{ color: templateStyle.primary }}>
          Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill) => (
            <Badge key={skill.id} variant="outline" className="bg-gray-50">
              {skill.name}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

// Portfolio Preview component
function PortfolioPreview({ data, template = "capeTown" }) {
  const templateStyle = portfolioTemplates[template]

  return (
    <div className="bg-white text-gray-800">
      {/* Header */}
      <div className="p-8 text-white" style={{ backgroundColor: templateStyle.primary }}>
        <h1 className="text-2xl font-bold">{data.about.name}</h1>
        <h2 className="text-lg mt-1 text-white/90">{data.about.title}</h2>
        <p className="mt-4 text-sm text-white/80">{data.about.bio}</p>
      </div>

      {/* Projects */}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4" style={{ color: templateStyle.primary }}>
          Featured Projects
        </h3>
        <div className="space-y-6">
          {data.projects.slice(0, 2).map((project) => (
            <div key={project.id} className="border rounded-lg overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h4 className="text-lg font-medium">{project.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {project.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {project.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.tags.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="px-6 pb-6">
        <h3 className="text-xl font-semibold mb-4" style={{ color: templateStyle.primary }}>
          Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill) => (
            <Badge key={skill.id} variant="outline" className="bg-gray-50">
              {skill.name}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

// Main CareerForge component
export default function CareerForgePage() {
  const {
    activeTab,
    setActiveTab,
    previewMode,
    setPreviewMode,
    cvData,
    portfolioData,
    syncEnabled,
    toggleSync,
    careerXP,
    level,
    challenges,
    completeChallenge,
  } = useCareerForgeStore()

  // Refs for the panels
  const leftPanelRef = useRef(null)
  const centerPanelRef = useRef(null)
  const rightPanelRef = useRef(null)

  // State for panel visibility
  const [leftPanelVisible, setLeftPanelVisible] = useState(true)
  const [rightPanelVisible, setRightPanelVisible] = useState(true)

  // State for AR preview
  const [showARPreview, setShowARPreview] = useState(false)

  // State for LinkedIn import
  const [showLinkedInImport, setShowLinkedInImport] = useState(false)
  const [importLoading, setImportLoading] = useState(false)

  // Handle LinkedIn import
  const handleLinkedInImport = () => {
    setImportLoading(true)
    // Simulate API call
    setTimeout(() => {
      setImportLoading(false)
      setShowLinkedInImport(false)
      // Show success notification
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">CareerForge Studio</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  Level {level}
                </Badge>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center gap-1 text-sm">
                        <Zap className="h-4 w-4 text-amber-500" />
                        <span>{careerXP} XP</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Career XP - Complete challenges to level up!</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Save your progress</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Share your CV and portfolio</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm">
                        <DownloadIcon className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Export as PDF or HTML</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Unified Career Builder</h2>
            <p className="text-muted-foreground">Create, sync, and manage your CV and portfolio in one place</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Label htmlFor="sync-toggle" className="text-sm">
                AI Sync
              </Label>
              <Switch id="sync-toggle" checked={syncEnabled} onCheckedChange={toggleSync} />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLinkedInImport(true)}
              className="flex items-center gap-2"
            >
              <Linkedin className="h-4 w-4" />
              Import from LinkedIn
            </Button>

            <Button variant="default" size="sm" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Enhance
            </Button>
          </div>
        </div>

        {/* Three-panel layout */}
        <div className="flex gap-4 h-[calc(100vh-200px)] min-h-[600px]">
          {/* Left Panel - AI Suggestions */}
          {leftPanelVisible && (
            <motion.div
              ref={leftPanelRef}
              initial={{ width: "25%" }}
              animate={{ width: leftPanelVisible ? "25%" : "0%" }}
              className="bg-card rounded-lg border overflow-hidden"
            >
              <div className="p-4 border-b bg-muted/30">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">AI Career Assistant</h3>
                  <Button variant="ghost" size="icon" onClick={() => setLeftPanelVisible(false)} className="h-8 w-8">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-[calc(100%-56px)] p-4">
                <div className="space-y-6">
                  {/* AI Suggestions */}
                  <div>
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-500" />
                      Smart Suggestions
                    </h4>
                    {aiSuggestions[activeTab].map((suggestion) => (
                      <AISuggestion key={suggestion.id} suggestion={suggestion} />
                    ))}
                  </div>

                  {/* Weekly Challenges */}
                  <div>
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Star className="h-4 w-4 text-amber-500" />
                      Weekly Challenges
                    </h4>
                    {challenges.map((challenge) => (
                      <Challenge key={challenge.id} challenge={challenge} onComplete={completeChallenge} />
                    ))}
                  </div>

                  {/* SA Market Insights */}
                  <div>
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <BarChart className="h-4 w-4 text-green-500" />
                      SA Market Insights
                    </h4>
                    <div className="bg-muted/30 rounded-lg p-4 border border-muted mb-3">
                      <h5 className="text-sm font-medium">Cape Town Frontend Devs</h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        Frontend developers with portfolios earn 35% more than those without.
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Progress value={35} className="h-2 flex-1" />
                        <span className="text-xs font-medium">+35%</span>
                      </div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4 border border-muted mb-3">
                      <h5 className="text-sm font-medium">In-Demand Skills</h5>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                        >
                          React Native
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                        >
                          TypeScript
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                        >
                          AWS
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Tools */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">SA Career Tools</h4>
                    <div className="space-y-4">
                      <RateCalculator />
                      <POPIAComplianceChecker />
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </motion.div>
          )}

          {!leftPanelVisible && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setLeftPanelVisible(true)}
              className="h-8 w-8 self-start mt-4"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}

          {/* Center Panel - Editor */}
          <motion.div
            ref={centerPanelRef}
            animate={{
              width:
                !leftPanelVisible && !rightPanelVisible
                  ? "100%"
                  : !leftPanelVisible || !rightPanelVisible
                    ? "75%"
                    : "50%",
            }}
            className="bg-card rounded-lg border overflow-hidden flex-1"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <div className="p-4 border-b bg-muted/30">
                <div className="flex items-center justify-between">
                  <TabsList>
                    <TabsTrigger value="cv" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      CV
                    </TabsTrigger>
                    <TabsTrigger value="portfolio" className="flex items-center gap-2">
                      <Layout className="h-4 w-4" />
                      Portfolio
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex items-center gap-2">
                    {!leftPanelVisible && (
                      <Button variant="ghost" size="icon" onClick={() => setLeftPanelVisible(true)} className="h-8 w-8">
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    )}
                    {!rightPanelVisible && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setRightPanelVisible(true)}
                        className="h-8 w-8"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <ScrollArea className="flex-1">
                <TabsContent value="cv" className="p-4 h-full">
                  <div className="space-y-6">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" defaultValue={cvData.personalInfo.name} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="title">Professional Title</Label>
                          <Input id="title" defaultValue={cvData.personalInfo.title} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" defaultValue={cvData.personalInfo.email} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input id="phone" defaultValue={cvData.personalInfo.phone} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input id="location" defaultValue={cvData.personalInfo.location} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="linkedin">LinkedIn</Label>
                          <Input id="linkedin" defaultValue={cvData.personalInfo.linkedin} />
                        </div>
                        <div className="col-span-2 space-y-2">
                          <Label htmlFor="summary">Professional Summary</Label>
                          <Textarea id="summary" defaultValue={cvData.personalInfo.summary} rows={3} />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Work Experience */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Work Experience</h3>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <PlusCircle className="h-4 w-4" />
                          Add Experience
                        </Button>
                      </div>

                      <div className="space-y-6">
                        {cvData.workExperience.map((job, index) => (
                          <Card key={job.id}>
                            <CardHeader className="pb-2">
                              <div className="flex items-start justify-between">
                                <CardTitle className="text-base">
                                  {job.title} at {job.company}
                                </CardTitle>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <CardDescription>
                                {job.location} |{" "}
                                {new Date(job.startDate).toLocaleDateString("en-ZA", {
                                  year: "numeric",
                                  month: "short",
                                })}{" "}
                                -{" "}
                                {job.current
                                  ? "Present"
                                  : new Date(job.endDate).toLocaleDateString("en-ZA", {
                                      year: "numeric",
                                      month: "short",
                                    })}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor={`job-description-${job.id}`}>Description</Label>
                                <Textarea id={`job-description-${job.id}`} defaultValue={job.description} rows={3} />
                              </div>

                              <div>
                                <Label className="mb-2 block">Achievements</Label>
                                <div className="space-y-2">
                                  {job.achievements.map((achievement, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                      <Input defaultValue={achievement} className="flex-1" />
                                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                  <Button variant="outline" size="sm" className="w-full mt-2 flex items-center gap-1">
                                    <PlusCircle className="h-4 w-4" />
                                    Add Achievement
                                  </Button>
                                </div>
                              </div>

                              <div>
                                <Label className="mb-2 block">Skills Used</Label>
                                <div className="flex flex-wrap gap-2 p-2 border rounded-md">
                                  {job.skills.map((skill, i) => (
                                    <Badge key={i} variant="secondary" className="flex items-center gap-1">
                                      {skill}
                                      <X className="h-3 w-3 cursor-pointer" />
                                    </Badge>
                                  ))}
                                  <Button variant="ghost" size="sm" className="h-7">
                                    <PlusCircle className="h-3 w-3 mr-1" />
                                    Add
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Skills */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Skills</h3>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <PlusCircle className="h-4 w-4" />
                          Add Skill
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {cvData.skills.map((skill) => (
                          <div key={skill.id} className="flex items-center gap-2">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">{skill.name}</span>
                                <span className="text-xs text-muted-foreground">{skill.level}%</span>
                              </div>
                              <Progress value={skill.level} className="h-2" />
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="portfolio" className="p-4 h-full">
                  <div className="space-y-6">
                    {/* About */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">About Me</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="p-name">Full Name</Label>
                          <Input id="p-name" defaultValue={portfolioData.about.name} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="p-title">Professional Title</Label>
                          <Input id="p-title" defaultValue={portfolioData.about.title} />
                        </div>
                        <div className="col-span-2 space-y-2">
                          <Label htmlFor="p-bio">Bio</Label>
                          <Textarea id="p-bio" defaultValue={portfolioData.about.bio} rows={3} />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Projects */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Projects</h3>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <PlusCircle className="h-4 w-4" />
                          Add Project
                        </Button>
                      </div>

                      <div className="space-y-6">
                        {portfolioData.projects.map((project) => (
                          <Card key={project.id}>
                            <CardHeader className="pb-2">
                              <div className="flex items-start justify-between">
                                <CardTitle className="text-base">{project.title}</CardTitle>
                                <div className="flex items-center gap-1">
                                  {project.featured && (
                                    <Badge variant="secondary" className="mr-2">
                                      Featured
                                    </Badge>
                                  )}
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`project-title-${project.id}`}>Project Title</Label>
                                  <Input id={`project-title-${project.id}`} defaultValue={project.title} />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`project-link-${project.id}`}>Project Link</Label>
                                  <Input id={`project-link-${project.id}`} defaultValue={project.link} />
                                </div>
                                <div className="col-span-2 space-y-2">
                                  <Label htmlFor={`project-desc-${project.id}`}>Short Description</Label>
                                  <Textarea
                                    id={`project-desc-${project.id}`}
                                    defaultValue={project.description}
                                    rows={2}
                                  />
                                </div>
                                <div className="col-span-2 space-y-2">
                                  <Label htmlFor={`project-long-desc-${project.id}`}>Detailed Description</Label>
                                  <Textarea
                                    id={`project-long-desc-${project.id}`}
                                    defaultValue={project.longDescription}
                                    rows={3}
                                  />
                                </div>
                                <div className="col-span-2 space-y-2">
                                  <Label htmlFor={`project-image-${project.id}`}>Image URL</Label>
                                  <div className="flex gap-2">
                                    <Input
                                      id={`project-image-${project.id}`}
                                      defaultValue={project.image}
                                      className="flex-1"
                                    />
                                    <Button variant="outline" size="icon" className="h-10 w-10">
                                      <ImageIcon className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="col-span-2">
                                  <Label className="mb-2 block">Tags</Label>
                                  <div className="flex flex-wrap gap-2 p-2 border rounded-md">
                                    {project.tags.map((tag, i) => (
                                      <Badge key={i} variant="secondary" className="flex items-center gap-1">
                                        {tag}
                                        <X className="h-3 w-3 cursor-pointer" />
                                      </Badge>
                                    ))}
                                    <Button variant="ghost" size="sm" className="h-7">
                                      <PlusCircle className="h-3 w-3 mr-1" />
                                      Add
                                    </Button>
                                  </div>
                                </div>
                                <div className="col-span-2">
                                  <div className="flex items-center space-x-2">
                                    <Switch id={`featured-${project.id}`} defaultChecked={project.featured} />
                                    <Label htmlFor={`featured-${project.id}`}>Featured Project</Label>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Template Selection */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Portfolio Template</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {Object.entries(portfolioTemplates).map(([key, template]) => (
                          <div
                            key={key}
                            className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                              portfolioData.theme === key ? "ring-2 ring-primary" : "hover:border-primary/50"
                            }`}
                            onClick={() => {
                              useCareerForgeStore.setState({
                                portfolioData: { ...portfolioData, theme: key },
                              })
                            }}
                          >
                            <div className="h-4" style={{ backgroundColor: template.primary }}></div>
                            <div className="p-3">
                              <h4 className="text-sm font-medium">{template.name}</h4>
                              <p className="text-xs text-muted-foreground">{template.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </motion.div>

          {/* Right Panel - Preview */}
          {rightPanelVisible && (
            <motion.div
              ref={rightPanelRef}
              initial={{ width: "25%" }}
              animate={{ width: rightPanelVisible ? "25%" : "0%" }}
              className="bg-card rounded-lg border overflow-hidden"
            >
              <div className="p-4 border-b bg-muted/30">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Preview</h3>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setRightPanelVisible(false)} className="h-8 w-8">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1">
                    <Button
                      variant={previewMode === "desktop" ? "secondary" : "ghost"}
                      size="icon"
                      onClick={() => setPreviewMode("desktop")}
                      className="h-8 w-8"
                    >
                      <Monitor className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={previewMode === "tablet" ? "secondary" : "ghost"}
                      size="icon"
                      onClick={() => setPreviewMode("tablet")}
                      className="h-8 w-8"
                    >
                      <Tablet className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={previewMode === "mobile" ? "secondary" : "ghost"}
                      size="icon"
                      onClick={() => setPreviewMode("mobile")}
                      className="h-8 w-8"
                    >
                      <Smartphone className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowARPreview(true)}
                    className="flex items-center gap-1"
                  >
                    <Maximize2 className="h-4 w-4" />
                    AR View
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-[calc(100%-104px)]">
                <div className="p-4">
                  <DeviceModel device={previewMode}>
                    {activeTab === "cv" ? (
                      <CVPreview data={cvData} />
                    ) : (
                      <PortfolioPreview data={portfolioData} template={portfolioData.theme} />
                    )}
                  </DeviceModel>
                </div>
              </ScrollArea>
            </motion.div>
          )}

          {!rightPanelVisible && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setRightPanelVisible(true)}
              className="h-8 w-8 self-start mt-4"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>
      </main>

      {/* LinkedIn Import Modal */}
      {showLinkedInImport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Import from LinkedIn</CardTitle>
              <CardDescription>
                Import your profile data from LinkedIn to quickly build your CV and portfolio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <Linkedin className="h-8 w-8 text-[#0077B5]" />
                  <div>
                    <h4 className="font-medium">LinkedIn Profile</h4>
                    <p className="text-sm text-muted-foreground">Connect to import your professional data</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin-url">LinkedIn Profile URL</Label>
                <Input id="linkedin-url" placeholder="https://www.linkedin.com/in/yourprofile" />
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md p-3 text-sm">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-700 dark:text-blue-300">What will be imported?</p>
                    <ul className="text-xs text-blue-600 dark:text-blue-400 mt-1 space-y-1 list-disc list-inside">
                      <li>Work experience</li>
                      <li>Education</li>
                      <li>Skills</li>
                      <li>Profile information</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setShowLinkedInImport(false)}>
                Cancel
              </Button>
              <Button onClick={handleLinkedInImport} disabled={importLoading}>
                {importLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Importing...
                  </>
                ) : (
                  "Import"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* AR Preview Modal */}
      {showARPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl h-[80vh]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>AR Portfolio Preview</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowARPreview(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                See how your portfolio looks in different environments and on different devices
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-0 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
                <div className="text-center text-white p-6 max-w-md">
                  <Laptop className="h-16 w-16 mx-auto mb-4 text-blue-400" />
                  <h3 className="text-xl font-bold mb-2">AR Preview</h3>
                  <p className="text-gray-300 mb-4">
                    In the full version, this would show a 3D preview of your portfolio on different devices using
                    Three.js and AR technology.
                  </p>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-800 p-3 rounded-lg text-center">
                      <Smartphone className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                      <p className="text-xs text-gray-400">Mobile</p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg text-center">
                      <Tablet className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                      <p className="text-xs text-gray-400">Tablet</p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg text-center">
                      <Monitor className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                      <p className="text-xs text-gray-400">Desktop</p>
                    </div>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">Try Demo View</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
