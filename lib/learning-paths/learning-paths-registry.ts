// lib/learning-paths-registry.ts - Central registry for all learning paths
import { LearningPathData } from './learning-paths-utils'

// Learning path configurations
export interface LearningPathConfig {
  id: string
  title: string
  slug: string
  description: string
  icon: string // Lucide icon name
  color: string // Tailwind gradient classes
  courses: number
  defaultProgress?: number
  isRecommended?: boolean
  category: 'technical' | 'creative' | 'business' | 'hybrid'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedDuration: string
  prerequisites?: string[]
  unlocks: string[]
  skills: string[]
  careerOutcomes: string[]
  salaryRange: {
    junior: string
    mid: string
    senior: string
  }
}

// Registry of all learning paths
export const LEARNING_PATHS_CONFIG: Record<string, LearningPathConfig> = {
  'web-development': {
    id: 'web-development',
    title: 'Web Development',
    slug: 'web-development',
    description: 'Master frontend, backend, and full-stack development',
    icon: 'Globe',
    color: 'from-blue-500 to-cyan-600',
    courses: 18,
    category: 'technical',
    difficulty: 'intermediate',
    estimatedDuration: '6-8 months',
    prerequisites: [],
    unlocks: ['Portfolio Builder', 'Technical Interviews', 'Freelance Skills'],
    skills: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'Databases'],
    careerOutcomes: ['Frontend Developer', 'Backend Developer', 'Full-Stack Developer'],
    salaryRange: {
      junior: 'R20,000 - R40,000',
      mid: 'R40,000 - R80,000',
      senior: 'R80,000 - R150,000+'
    }
  },
  
  'ai-data-science': {
    id: 'ai-data-science',
    title: 'AI & Data Science',
    slug: 'ai-data-science',
    description: 'Learn machine learning, data analysis, and AI technologies',
    icon: 'Brain',
    color: 'from-purple-500 to-violet-600',
    courses: 15,
    category: 'technical',
    difficulty: 'advanced',
    estimatedDuration: '8-10 months',
    prerequisites: ['Basic Python', 'Statistics'],
    unlocks: ['Data Projects', 'ML Models', 'Technical Analysis'],
    skills: ['Python', 'Machine Learning', 'Statistics', 'Data Analysis', 'Deep Learning'],
    careerOutcomes: ['Data Analyst', 'Data Scientist', 'ML Engineer'],
    salaryRange: {
      junior: 'R25,000 - R45,000',
      mid: 'R45,000 - R80,000',
      senior: 'R80,000 - R150,000+'
    }
  },

  'design-creativity': {
    id: 'design-creativity',
    title: 'Design & Creativity',
    slug: 'design-creativity',
    description: 'Master UI/UX design, branding, and visual communication',
    icon: 'Palette',
    color: 'from-pink-500 to-red-600',
    courses: 12,
    category: 'creative',
    difficulty: 'intermediate',
    estimatedDuration: '4-6 months',
    prerequisites: [],
    unlocks: ['Design Portfolio', 'Creative Projects', 'Client Work'],
    skills: ['UI/UX Design', 'Figma', 'Brand Design', 'Typography', 'Color Theory'],
    careerOutcomes: ['UI Designer', 'UX Designer', 'Brand Designer'],
    salaryRange: {
      junior: 'R18,000 - R35,000',
      mid: 'R35,000 - R65,000',
      senior: 'R65,000 - R120,000+'
    }
  },

  'digital-marketing': {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    slug: 'digital-marketing',
    description: 'Learn marketing strategies, campaigns, and analytics',
    icon: 'Target',
    color: 'from-green-500 to-emerald-600',
    courses: 10,
    category: 'business',
    difficulty: 'beginner',
    estimatedDuration: '3-4 months',
    prerequisites: [],
    unlocks: ['Campaign Management', 'Analytics Tools', 'Social Media'],
    skills: ['Social Media', 'Google Ads', 'Content Marketing', 'SEO', 'Analytics'],
    careerOutcomes: ['Digital Marketer', 'Social Media Manager', 'Marketing Analyst'],
    salaryRange: {
      junior: 'R15,000 - R30,000',
      mid: 'R30,000 - R60,000',
      senior: 'R60,000 - R120,000+'
    }
  }
}

// Dynamic data loader interface
interface DataLoader {
  loadData(): Promise<LearningPathData>
}

// Registry of data loaders for each learning path
const DATA_LOADERS: Record<string, () => Promise<LearningPathData>> = {
  'web-development': async () => {
    const { webDevelopmentData } = await import('./web-development-data')
    return webDevelopmentData
  },
  'ai-data-science': async () => {
    const { aiDataScienceData } = await import('./ai-data-science-data')
    return aiDataScienceData
  },
  'design-creativity': async () => {
    const { designCreativityData } = await import('./design-creativity-data')
    return designCreativityData
  },
  'digital-marketing': async () => {
    const { digitalMarketingData } = await import('./digital-marketing-data')
    return digitalMarketingData
  }
}

// API functions for working with learning paths
export class LearningPathsRegistry {
  /**
   * Get all available learning path configurations
   */
  static getAllPaths(): LearningPathConfig[] {
    return Object.values(LEARNING_PATHS_CONFIG)
  }

  /**
   * Get a specific learning path configuration
   */
  static getPath(pathId: string): LearningPathConfig | null {
    return LEARNING_PATHS_CONFIG[pathId] || null
  }

  /**
   * Get paths filtered by category
   */
  static getPathsByCategory(category: LearningPathConfig['category']): LearningPathConfig[] {
    return Object.values(LEARNING_PATHS_CONFIG).filter(path => path.category === category)
  }

  /**
   * Get paths filtered by difficulty
   */
  static getPathsByDifficulty(difficulty: LearningPathConfig['difficulty']): LearningPathConfig[] {
    return Object.values(LEARNING_PATHS_CONFIG).filter(path => path.difficulty === difficulty)
  }

  /**
   * Dynamically load course data for a specific path
   */
  static async loadPathData(pathId: string): Promise<LearningPathData | null> {
    const loader = DATA_LOADERS[pathId]
    if (!loader) {
      console.warn(`No data loader found for path: ${pathId}`)
      return null
    }

    try {
      return await loader()
    } catch (error) {
      console.error(`Failed to load data for path ${pathId}:`, error)
      return null
    }
  }

  /**
   * Get recommended paths based on user preferences or quiz results
   */
  static getRecommendedPaths(userInterests?: string[], userSkillLevel?: string): LearningPathConfig[] {
    let paths = this.getAllPaths()

    // Filter by interests if provided
    if (userInterests && userInterests.length > 0) {
      paths = paths.filter(path => 
        userInterests.some(interest => 
          path.skills.some(skill => skill.toLowerCase().includes(interest.toLowerCase())) ||
          path.title.toLowerCase().includes(interest.toLowerCase())
        )
      )
    }

    // Filter by skill level if provided
    if (userSkillLevel) {
      paths = paths.filter(path => path.difficulty === userSkillLevel)
    }

    // Sort by category and difficulty
    return paths.sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category)
      }
      const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 }
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
    })
  }

  /**
   * Search paths by title, description, or skills
   */
  static searchPaths(query: string): LearningPathConfig[] {
    const lowerQuery = query.toLowerCase()
    return Object.values(LEARNING_PATHS_CONFIG).filter(path =>
      path.title.toLowerCase().includes(lowerQuery) ||
      path.description.toLowerCase().includes(lowerQuery) ||
      path.skills.some(skill => skill.toLowerCase().includes(lowerQuery)) ||
      path.careerOutcomes.some(outcome => outcome.toLowerCase().includes(lowerQuery))
    )
  }

  /**
   * Check if a path exists
   */
  static pathExists(pathId: string): boolean {
    return pathId in LEARNING_PATHS_CONFIG
  }

  /**
   * Get path statistics
   */
  static getPathStats(pathId: string): {
    totalCourses: number
    estimatedHours: number
    skillsCount: number
    careerOpportunities: number
  } | null {
    const path = this.getPath(pathId)
    if (!path) return null

    return {
      totalCourses: path.courses,
      estimatedHours: this.estimateHours(path.estimatedDuration),
      skillsCount: path.skills.length,
      careerOpportunities: path.careerOutcomes.length
    }
  }

  /**
   * Helper to estimate hours from duration string
   */
  private static estimateHours(duration: string): number {
    const months = duration.match(/(\d+)-?(\d+)?\s*months?/i)
    if (months) {
      const minMonths = parseInt(months[1])
      const maxMonths = months[2] ? parseInt(months[2]) : minMonths
      const avgMonths = (minMonths + maxMonths) / 2
      return avgMonths * 40 // Assume 40 hours per month
    }
    return 0
  }
}

// Utility function to get icon component
export const getPathIcon = async (iconName: string) => {
  try {
    const icons = await import('lucide-react')
    return (icons as any)[iconName] || icons.BookOpen
  } catch (error) {
    console.warn(`Failed to load icon: ${iconName}`)
    const { BookOpen } = await import('lucide-react')
    return BookOpen
  }
}

// Export the registry class and configs
export default LearningPathsRegistry