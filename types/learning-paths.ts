export interface Course {
  id: string
  title: string
  description: string
  duration: string | number
  level: string
  skills: string[]
  instructor: string
  rating: number
  students: number | string
}

export interface ProjectBrief {
  id: string
  title: string
  description: string
  difficulty: string
  duration: string
  skills: string[]
  deliverables: string[]
}

export interface InterviewRole {
  id: string
  title: string
  name?: string // Optional name property
  company: string
  level: string
  questions: string[]
}

export interface InterviewQuestion {
  id: string
  question: string
  category: string
  difficulty: string
  expectedAnswer?: string
}

export interface LearningPathData {
  courses: Course[]
  projectBriefs: ProjectBrief[]
  interviewRoles: InterviewRole[]
  interviewQuestions?: InterviewQuestion[] // Made optional since some paths don't have it
}

export interface LearningPath {
  id: string
  title: string
  description: string
  data: LearningPathData
}