// Optimized dashboard data constants
// Moved from dashboard page to reduce initial bundle size

import type { LucideIcon } from 'lucide-react'
import {
  Globe,
  Brain,
  Palette,
  Target,
  BookOpen,
  TrendingUp,
  FileText,
  Layout,
  Clock
} from 'lucide-react'

export interface Course {
  id: number
  title: string
  category: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string
  instructor: string
  image: string
  progress: number
  price: string
}

export interface ProgressItem {
  id: number
  title: string
  category: string
  status: 'completed' | 'in-progress' | 'not-started'
  progress: number
  unlocks?: string
  completedDate?: string
  dueDate?: string
  startDate?: string
}

export interface Badge {
  id: number
  name: string
  description: string
  icon: LucideIcon
  achieved: boolean
}

// Icon mapping for dynamic paths
export const iconMap: Record<string, LucideIcon> = {
  Globe,
  Brain,
  Palette,
  Target,
  BookOpen,
  TrendingUp
}

// Color mapping for learning paths
export const pathColorMap: Record<string, string> = {
  'web-development': 'from-blue-500 to-cyan-600',
  'ai-data-science': 'from-purple-500 to-violet-600',
  'design-creativity': 'from-pink-500 to-red-600',
  'digital-marketing': 'from-green-500 to-emerald-600',
}

// Lazy-loaded course data - only loaded when needed
export const getCourseData = (): Course[] => [
  {
    id: 1,
    title: "Introduction to Machine Learning",
    category: "AI",
    level: "Beginner",
    duration: "8 weeks",
    instructor: "Sandile Thamie Mhlanga",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/robot-6cOHn645w15yILvVe77ERMNr7gcg12.jpeg",
    progress: 0,
    price: "R1,200",
  },
  {
    id: 2,
    title: "Advanced Portrait Photography",
    category: "Photography",
    level: "Intermediate",
    duration: "6 weeks",
    instructor: "Keletso Ntseno",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/workshop9.jpg-FKG43Gm91PVBVt0FFnfrMSVypOHukL.jpeg",
    progress: 0,
    price: "R950",
  },
  {
    id: 3,
    title: "Digital Marketing Fundamentals",
    category: "Marketing",
    level: "Beginner",
    duration: "4 weeks",
    instructor: "Dichwanyo Makgothi",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/digital_marketing.jpg-KsyMLv6ojesthsA3XqZbVd20ReIKGl.jpeg",
    progress: 0,
    price: "R750",
  },
  {
    id: 4,
    title: "UI/UX Design Principles",
    category: "Design",
    level: "Intermediate",
    duration: "10 weeks",
    instructor: "Matthew Olifant",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pexels-cottonbro-5082578.jpg-jNuNHxSLPMsfEKBnotexPcBDBKmVcv.jpeg",
    progress: 0,
    price: "R1,500",
  },
  {
    id: 5,
    title: "Video Production Masterclass",
    category: "Video",
    level: "Advanced",
    duration: "12 weeks",
    instructor: "Vuyolwethu Mbhele",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/videography1.jpg-Z6krXKkrUyhOxgWUoLi2ERjbDnhKfj.jpeg",
    progress: 0,
    price: "R2,200",
  },
  {
    id: 6,
    title: "Full-Stack Web Development",
    category: "Development",
    level: "Intermediate",
    duration: "16 weeks",
    instructor: "Tsehla Motjolopane",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/webdev.jpg-X9sk18hV2Wy7pFXNGNJcWOfDLsu29E.jpeg",
    progress: 0,
    price: "R3,500",
  },
  {
    id: 7,
    title: "Data Science Fundamentals",
    category: "Data Science",
    level: "Beginner",
    duration: "10 weeks",
    instructor: "Realeboha Nthathakane",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/datasci.jpg-7xyCPyuFPQdPNeLC1O69lLk256v4Yj.jpeg",
    progress: 0,
    price: "R1,800",
  },
  {
    id: 8,
    title: "Blockchain Development",
    category: "Blockchain",
    level: "Advanced",
    duration: "8 weeks",
    instructor: "Tadiwanashe Tuwe",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/blockchain.jpg-CLAPeokOfhPwN3BwjEML4aOKHk1stN.jpeg",
    progress: 0,
    price: "R2,500",
  },
]

// Progress data
export const getProgressData = (): ProgressItem[] => [
  {
    id: 1,
    title: "Personal Branding",
    category: "Freelancer Path",
    status: "completed",
    progress: 100,
    unlocks: "CV Builder",
    completedDate: "2023-04-15",
  },
  {
    id: 2,
    title: "Portfolio Development",
    category: "Freelancer Path",
    status: "in-progress",
    progress: 60,
    unlocks: "Portfolio Builder",
    dueDate: "2023-05-20",
  },
  {
    id: 3,
    title: "Client Communication",
    category: "Freelancer Path",
    status: "not-started",
    progress: 0,
    unlocks: "Client Management Tools",
    startDate: "2023-06-01",
  },
  {
    id: 4,
    title: "AI Fundamentals",
    category: "AI Creator Path",
    status: "in-progress",
    progress: 45,
    unlocks: "AI Project Templates",
    dueDate: "2023-05-25",
  },
]

// Badges data
export const getBadgesData = (): Badge[] => [
  { id: 1, name: "CV Pro", description: "Completed 5 CV sections", icon: FileText, achieved: true },
  { id: 2, name: "Portfolio Master", description: "Published 3 projects", icon: Layout, achieved: false },
  { id: 3, name: "Fast Learner", description: "Completed 3 courses in 30 days", icon: Clock, achieved: true },
]

// Helper function to get path color with fallback
export const getPathColor = (pathId: string, originalColor?: string | null): string => {
  return originalColor || pathColorMap[pathId] || 'from-blue-500 to-cyan-600'
}