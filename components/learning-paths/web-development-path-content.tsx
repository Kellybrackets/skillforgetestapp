import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { LearningPathConfig } from '@/lib/learning-paths/learning-paths-registry'
import { LearningPathData } from '@/lib/learning-paths/learning-paths-utils'

interface WebDevelopmentPathContentProps {
  config: LearningPathConfig
  courses: any[]
  interviews: any[]
  projects: any[]
  stats: {
    totalCourses: number
    estimatedHours: number
    skillsCount: number
    careerOpportunities: number
  }
}

export function WebDevelopmentPathContent({ 
  config, 
  courses, 
  interviews, 
  projects, 
  stats 
}: WebDevelopmentPathContentProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">{config.title}</h1>
        <p className="mt-1 text-muted-foreground">{config.description}</p>
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
        <h2 className="text-2xl font-bold mb-4">Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map((course, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-3">
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
                    <Badge variant="outline">{course.level}</Badge>
                  </div>
                  <Button className="w-full">Start Course</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects?.map((project, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies?.map((tech: string, techIndex: number) => (
                      <Badge key={techIndex} variant="secondary">{tech}</Badge>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full">View Project</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Interview Preparation */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Interview Preparation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews?.map((interview, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{interview.role}</CardTitle>
                <CardDescription>{interview.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Experience</span>
                    <Badge variant="outline">{interview.experience}</Badge>
                  </div>
                  <Button variant="outline" className="w-full">Practice Interview</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

