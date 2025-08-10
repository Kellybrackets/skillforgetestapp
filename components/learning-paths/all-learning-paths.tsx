// components/learning-paths/all-learning-paths.tsx (Updated for simplified approach)
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Brain, 
  Globe, 
  Palette, 
  Target, 
  Search, 
  Filter,
  Clock,
  Users,
  BookOpen,
  TrendingUp,
  Star,
  CheckCircle
} from "lucide-react"
import LearningPathsRegistry, { LearningPathConfig } from "../../lib/learning-paths/learning-paths-registry"
import Link from "next/link"

// Icon mapping
const iconMap = {
  Brain,
  Globe,
  Palette,
  Target,
  BookOpen,
  TrendingUp
}

interface PathProgress {
  [pathId: string]: number
}

export function AllLearningPathsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [filteredPaths, setFilteredPaths] = useState<LearningPathConfig[]>([])
  const [pathProgress, setPathProgress] = useState<PathProgress>({})
  const [mounted, setMounted] = useState(false)

  // Load all paths and apply filters
  useEffect(() => {
    setMounted(true)
    let paths = LearningPathsRegistry.getAllPaths()

    // Apply search filter
    if (searchQuery) {
      paths = LearningPathsRegistry.searchPaths(searchQuery)
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      paths = paths.filter((path: LearningPathConfig) => path.category === selectedCategory)
    }

    // Apply difficulty filter
    if (selectedDifficulty !== "all") {
      paths = paths.filter((path: LearningPathConfig) => path.difficulty === selectedDifficulty)
    }

    setFilteredPaths(paths)
  }, [searchQuery, selectedCategory, selectedDifficulty])

  // Load user progress from localStorage
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      const savedProgress = localStorage.getItem('pathProgress')
      if (savedProgress) {
        try {
          setPathProgress(JSON.parse(savedProgress))
        } catch (error) {
          console.error('Failed to parse path progress:', error)
        }
      }
    }
  }, [mounted])

  const getIcon = (iconName: string) => {
    const IconComponent = (iconMap as any)[iconName] || BookOpen
    return IconComponent
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300'
      case 'intermediate': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300'
      case 'advanced': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical': return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300'
      case 'creative': return 'text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-300'
      case 'business': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300'
      case 'hybrid': return 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-300'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span>Loading learning paths...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">All Learning Paths</h1>
        <p className="text-muted-foreground">
          Discover your perfect learning journey. Choose from our comprehensive collection of skill-building paths.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">850+</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{LearningPathsRegistry.getAllPaths().length}</p>
                <p className="text-sm text-muted-foreground">Total Paths</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">1,200+</p>
                <p className="text-sm text-muted-foreground">Active Learners</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">4.8</p>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="bg-card border rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search learning paths..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex space-x-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Showing {filteredPaths.length} of {LearningPathsRegistry.getAllPaths().length} learning paths
        </p>
      </div>

      {/* Learning Paths Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPaths.map((path) => {
          const IconComponent = getIcon(path.icon)
          const progress = pathProgress[path.id] || 0
          
          return (
            <Card key={path.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
              <div 
                className={`bg-gradient-to-r ${path.color} p-6 text-white relative`}
                onClick={() => router.push(`/learning-paths/${path.slug}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <IconComponent className="h-8 w-8" />
                  <div className="flex space-x-1">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getDifficultyColor(path.difficulty)}`}
                    >
                      {path.difficulty}
                    </Badge>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{path.title}</h3>
                <p className="text-white/90 text-sm">{path.description}</p>
                
                {progress > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-1 bg-white/20" />
                  </div>
                )}
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Path Info */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <BookOpen className="h-4 w-4 mr-1" />
                      <span>{path.courses} courses</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{path.estimatedDuration}</span>
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getCategoryColor(path.category)}`}
                    >
                      {path.category}
                    </Badge>
                  </div>

                  {/* Skills Preview */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Key Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {path.skills.slice(0, 3).map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {path.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{path.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Salary Range */}
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-xs font-medium mb-1">Salary Range (Monthly)</p>
                    <p className="text-sm font-bold text-green-600">
                      {path.salaryRange.junior} → {path.salaryRange.senior}
                    </p>
                  </div>
                </div>
              </CardContent>
              
              <div className="px-6 pb-6">
                <Button 
                  className="w-full group-hover:bg-primary/90 transition-colors"
                  onClick={() => router.push(`/learning-paths/${path.slug}`)}
                >
                  {progress > 0 ? "Continue Path" : "Start Learning"}
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredPaths.length === 0 && (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No paths found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search criteria or filters.
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchQuery("")
              setSelectedCategory("all")
              setSelectedDifficulty("all")
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-12 text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Ready to Start Your Learning Journey?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Take our skills assessment to get personalized path recommendations based on your interests, 
          experience level, and career goals.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/quiz">Take Skills Assessment</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/dashboard">View My Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}