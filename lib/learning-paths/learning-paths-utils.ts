// learning-path-utils.ts
export interface Course {
  id: string
  title: string
  description: string
  duration: string
  level: string
  skills: string[]
  instructor: string
  rating: number
  students: number
}

export interface InterviewRole {
  id: string
  role: string
  company: string
  description: string
  experience: string
  skills: string[]
  questions: string[]
  tips: string[]
}

export interface InterviewQuestions {
  [key: string]: string[]
}

export interface ProjectBrief {
  id: string
  title: string
  description: string
  difficulty: string
  technologies: string[]
  estimatedTime: string
  skills: string[]
  deliverables: string[]
}

export interface LearningPathData {
  courses: Course[]
  interviewRoles: InterviewRole[]
  interviewQuestions: InterviewQuestions
  projectBriefs: ProjectBrief[]
}

// Calculate overall progress for a learning path
export const calculateOverallProgress = (courses: Course[]): number => {
  // For now, return a default progress since courses don't have progress property
  const courseProgress = 50 // Default progress
  const interviewProgress = 40 // Average completion across paths
  const projectProgress = 33 // Roughly 1/3 of projects completed
  
  return courseProgress * 0.6 + interviewProgress * 0.2 + projectProgress * 0.2
}

// Get course status color - simplified for new structure
export const getCourseStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'default'
    case 'in-progress':
      return 'secondary'
    case 'not-started':
      return 'outline'
    default:
      return 'outline'
  }
}

// Get project status color - simplified for new structure
export const getProjectStatusColor = (status: string) => {
  switch (status) {
    case 'reviewed':
      return 'default'
    case 'in-progress':
      return 'secondary'
    case 'not-started':
      return 'outline'
    default:
      return 'outline'
  }
}

// Common career progression data
export interface CareerLevel {
  title: string
  salaryRange: string
  description: string
  responsibilities: string[]
}

export const getCareerProgression = (field: string): CareerLevel[] => {
  const progressions: { [key: string]: CareerLevel[] } = {
    'web-development': [
      {
        title: 'Junior Developer',
        salaryRange: 'R20,000 - R40,000',
        description: 'Monthly salary range',
        responsibilities: [
          'Frontend development with HTML, CSS, JavaScript',
          'Basic React or Vue.js applications',
          'Learning backend fundamentals'
        ]
      },
      {
        title: 'Full-Stack Developer',
        salaryRange: 'R40,000 - R80,000',
        description: 'Monthly salary range',
        responsibilities: [
          'Complete web application development',
          'API design and database management',
          'DevOps and deployment experience'
        ]
      },
      {
        title: 'Senior/Lead Developer',
        salaryRange: 'R80,000 - R150,000+',
        description: 'Monthly salary range',
        responsibilities: [
          'Architecture and technical leadership',
          'Team mentoring and code reviews',
          'Strategic technology decisions'
        ]
      }
    ],
    'digital-marketing': [
      {
        title: 'Marketing Coordinator',
        salaryRange: 'R15,000 - R30,000',
        description: 'Monthly salary range',
        responsibilities: [
          'Social media management',
          'Content creation and scheduling',
          'Campaign execution support'
        ]
      },
      {
        title: 'Digital Marketing Manager',
        salaryRange: 'R30,000 - R60,000',
        description: 'Monthly salary range',
        responsibilities: [
          'Multi-channel campaign strategy',
          'Budget management and ROI analysis',
          'Team leadership and collaboration'
        ]
      },
      {
        title: 'Marketing Director',
        salaryRange: 'R60,000 - R120,000+',
        description: 'Monthly salary range',
        responsibilities: [
          'Strategic marketing leadership',
          'Brand positioning and growth strategy',
          'Executive-level reporting and planning'
        ]
      }
    ],
    'design-creativity': [
      {
        title: 'Junior Designer',
        salaryRange: 'R18,000 - R35,000',
        description: 'Monthly salary range',
        responsibilities: [
          'UI/UX design for small projects',
          'Brand identity and logo design',
          'Agency or in-house positions'
        ]
      },
      {
        title: 'Senior Designer',
        salaryRange: 'R35,000 - R65,000',
        description: 'Monthly salary range',
        responsibilities: [
          'Lead product design projects',
          'Design system ownership',
          'Mentor junior designers'
        ]
      },
      {
        title: 'Design Director',
        salaryRange: 'R65,000 - R120,000+',
        description: 'Monthly salary range',
        responsibilities: [
          'Strategic design leadership',
          'Cross-functional collaboration',
          'Team and budget management'
        ]
      }
    ],
    'ai-data-science': [
      {
        title: 'Junior Data Analyst',
        salaryRange: 'R25,000 - R45,000',
        description: 'Monthly salary range',
        responsibilities: [
          'Data cleaning and basic analysis',
          'SQL queries and dashboard creation',
          'Entry-level corporate positions'
        ]
      },
      {
        title: 'Data Scientist',
        salaryRange: 'R45,000 - R80,000',
        description: 'Monthly salary range',
        responsibilities: [
          'Machine learning model development',
          'Statistical analysis and insights',
          'Cross-functional team collaboration'
        ]
      },
      {
        title: 'Senior ML Engineer',
        salaryRange: 'R80,000 - R150,000+',
        description: 'Monthly salary range',
        responsibilities: [
          'Production ML systems at scale',
          'AI strategy and architecture',
          'Technical leadership roles'
        ]
      }
    ]
  }

  return progressions[field] || progressions['web-development']
}