// components/learning-paths/DynamicPathPage.tsx - Generic path page component
import React from 'react'
import { useRouter } from 'next/navigation'
import { useLearningPath, UseLearningPathReturn } from '@/hooks/use-learning-path'
import { Spinner } from '@/components/ui/spinner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { LearningPathConfig } from '@/lib/learning-paths/learning-paths-registry'
import { LearningPathData } from '@/lib/learning-paths/learning-paths-utils'

interface DynamicPathPageProps {
  pathId: string
  children?: (data: {
    config: LearningPathConfig
    data: LearningPathData
    stats: NonNullable<UseLearningPathReturn['stats']>
  }) => React.ReactNode
}

export function DynamicPathPage({ pathId, children }: DynamicPathPageProps) {
  const router = useRouter()
  const { config, data, loading, error, stats } = useLearningPath(pathId)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Spinner size="lg" />
          <span>Loading learning path...</span>
        </div>
      </div>
    )
  }

  if (error || !config || !data || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle>Learning Path Not Found</CardTitle>
            <CardDescription>
              {error || `The learning path "${pathId}" could not be loaded.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Button onClick={() => router.push('/learning-paths')}>
              View All Learning Paths
            </Button>
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (children) {
    return <>{children({ config, data, stats })}</>
  }

  // Default fallback rendering
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">{config.title}</h1>
        <p className="mt-1 text-muted-foreground">{config.description}</p>
      </div>
      
      <Card>
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
    </div>
  )
}