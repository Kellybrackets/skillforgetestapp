// components/learning-paths/generic-path-content.tsx
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LearningPathConfig } from '../../lib/learning-paths/learning-paths-registry'
import { Course, ProjectBrief, InterviewRole } from '../../lib/learning-paths/learning-paths-utils'

interface GenericPathContentProps {
  config: LearningPathConfig
  courses: Course[]
  interviews: InterviewRole[]
  projects: ProjectBrief[]
  stats: {
    totalCourses: number
    estimatedHours: number
    skillsCount: number
    careerOpportunities: number
  }
}

// Get theme colors based on path category
const getThemeColors = (category: string) => {
  const themes = {
    technical: {
      border: 'border-blue-200 dark:border-blue-800',
      header: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      button: 'bg-blue-600 hover:bg-blue-700',
      buttonOutline: 'border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-300'
    },
    creative: {
      border: 'border-pink-200 dark:border-pink-800',
      header: 'from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20',
      badge: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      button: 'bg-pink-600 hover:bg-pink-700',
      buttonOutline: 'border-pink-300 text-pink-700 hover:bg-pink-50 dark:border-pink-600 dark:text-pink-300'
    },
    business: {
      border: 'border-green-200 dark:border-green-800',
      header: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      badge: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      button: 'bg-green-600 hover:bg-green-700',
      buttonOutline: 'border-green-300 text-green-700 hover:bg-green-50 dark:border-green-600 dark:text-green-300'
    },
    hybrid: {
      border: 'border-orange-200 dark:border-orange-800',
      header: 'from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20',
      badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      button: 'bg-orange-600 hover:bg-orange-700',
      buttonOutline: 'border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-600 dark:text-orange-300'
    }
  }
  return themes[category as keyof typeof themes] || themes.technical
}

// Get category-specific icons and labels
const getCategorySpecifics = (category: string) => {
  const specifics = {
    technical: { emoji: '💻', courseLabel: 'Technical Courses', projectLabel: 'Coding Projects' },
    creative: { emoji: '🎨', courseLabel: 'Design Courses', projectLabel: 'Creative Projects' },
    business: { emoji: '📈', courseLabel: 'Business Courses', projectLabel: 'Marketing Campaigns' },
    hybrid: { emoji: '🚀', courseLabel: 'Courses', projectLabel: 'Projects' }
  }
  return specifics[category as keyof typeof specifics] || specifics.technical
}

export function GenericPathContent({ 
  config, 
  courses, 
  interviews, 
  projects, 
  stats 
}: GenericPathContentProps) {
  const theme = getThemeColors(config.category)
  const { emoji, courseLabel, projectLabel } = getCategorySpecifics(config.category)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <span className="text-4xl">{emoji}</span>
          {config.title}
        </h1>
        <p className="mt-1 text-muted-foreground">{config.description}</p>
        
        {/* Path metadata */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline" className={theme.badge}>
            {config.category}
          </Badge>
          <Badge variant="outline">
            {config.difficulty}
          </Badge>
          <Badge variant="outline">
            {config.estimatedDuration}
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.totalCourses}</div>
              <div className="text-sm text-muted-foreground">Courses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.estimatedHours}h</div>
              <div className="text-sm text-muted-foreground">Est. Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.skillsCount}</div>
              <div className="text-sm text-muted-foreground">Skills</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.careerOpportunities}</div>
              <div className="text-sm text-muted-foreground">Career Paths</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Courses */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">{courseLabel}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map((course) => (
            <Card key={course.id} className={`overflow-hidden ${theme.border}`}>
              <CardHeader className={`pb-3 bg-gradient-to-r ${theme.header}`}>
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Duration</span>
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Level</span>
                    <span>{course.level}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Students</span>
                    <span>{course.students.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Rating</span>
                    <span>⭐ {course.rating}/5</span>
                  </div>
                  <Button className={`w-full ${theme.button}`}>Start Course</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">{projectLabel}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects?.map((project) => (
            <Card key={project.id} className={theme.border}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {emoji} {project.title}
                </CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies?.map((tech: string, techIndex: number) => (
                      <Badge key={techIndex} variant="secondary" className={theme.badge}>{tech}</Badge>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <strong>Time:</strong> {project.estimatedTime}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <strong>Difficulty:</strong> <Badge variant="outline" className="ml-1">{project.difficulty}</Badge>
                  </div>
                  <div className="text-sm">
                    <strong>Skills you'll learn:</strong>
                    <ul className="mt-1 text-xs text-muted-foreground space-y-1">
                      {project.skills.map((skill: string, index: number) => (
                        <li key={index}>• {skill}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-sm">
                    <strong>Deliverables:</strong>
                    <ul className="mt-1 text-xs text-muted-foreground space-y-1">
                      {project.deliverables?.slice(0, 3).map((deliverable: string, index: number) => (
                        <li key={index}>• {deliverable}</li>
                      ))}
                    </ul>
                  </div>
                  <Button variant="outline" className={`w-full ${theme.buttonOutline}`}>Start Project</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Interview Preparation */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Career Interview Preparation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews?.map((interview) => (
            <Card key={interview.id} className={theme.border}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  💼 {interview.role}
                </CardTitle>
                <CardDescription>
                  {interview.company ? `${interview.company} - ${interview.experience}` : interview.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    Click to start practicing interview questions for this position.
                  </div>
                  <Button variant="outline" className={`w-full ${theme.buttonOutline}`}>Practice Interview</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Skills & Career Outcomes */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className={`bg-gradient-to-r ${theme.header} ${theme.border}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎯 Skills You'll Master
              </CardTitle>
              <CardDescription>
                Core competencies you'll develop in this path
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {config.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className={theme.badge}>
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-gradient-to-r ${theme.header} ${theme.border}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                💰 Career Opportunities
              </CardTitle>
              <CardDescription>
                Roles you can pursue after completing this path
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {config.careerOutcomes.map((outcome, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{outcome}</span>
                  </div>
                ))}
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm">
                    <strong>Salary Range (Monthly):</strong>
                    <div className="text-lg font-bold text-green-600 mt-1">
                      {config.salaryRange.junior} → {config.salaryRange.senior}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}