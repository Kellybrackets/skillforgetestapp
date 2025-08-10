"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { CSS } from "@dnd-kit/utilities"
import {
  Layout,
  ImageIcon,
  FileText,
  Video,
  Plus,
  Trash2,
  MoveVertical,
  AlertCircle,
  Smartphone,
  Tablet,
  Monitor,
  Save,
  Eye,
  Upload,
  MessageSquare,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"

// Mock portfolio data
const initialPortfolioData = {
  about: {
    name: "Thabo Mokoena",
    title: "Frontend Developer & UI/UX Designer",
    bio: "I'm a passionate frontend developer and UI/UX designer based in Cape Town, South Africa. I specialize in creating responsive, user-friendly web applications with modern technologies like React and Next.js.",
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
      title: "E-commerce Website Redesign",
      description:
        "Redesigned the user interface for a local e-commerce store, improving conversion rates by 25% and reducing cart abandonment.",
      tags: ["UI/UX", "React", "Next.js", "Tailwind CSS"],
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pexels-cottonbro-5082578.jpg-jNuNHxSLPMsfEKBnotexPcBDBKmVcv.jpeg",
      link: "https://example.com/project1",
      featured: true,
    },
  ],
  testimonials: [
    {
      id: "test1",
      name: "Lerato Ndlovu",
      company: "Digital Creatives",
      position: "Marketing Director",
      content:
        "Thabo created an exceptional website for our company. His attention to detail and understanding of our brand was impressive.",
      image: "/placeholder.svg?height=100&width=100",
    },
  ],
  skills: [
    { id: "skill1", name: "React", level: 90 },
    { id: "skill2", name: "Next.js", level: 85 },
    { id: "skill3", name: "JavaScript", level: 95 },
    { id: "skill4", name: "TypeScript", level: 80 },
    { id: "skill5", name: "Tailwind CSS", level: 90 },
    { id: "skill6", name: "UI/UX Design", level: 85 },
    { id: "skill7", name: "Figma", level: 80 },
    { id: "skill8", name: "Responsive Design", level: 95 },
  ],
}

// Template styles
const templateStyles = {
  capeTown: {
    primary: "#6E56CF",
    secondary: "#F4F2FF",
    accent: "#FF6B6B",
    fontPrimary: "Inter, sans-serif",
    fontSecondary: "Inter, sans-serif",
  },
  johannesburg: {
    primary: "#FF6B6B",
    secondary: "#FFF2F2",
    accent: "#6E56CF",
    fontPrimary: "Inter, sans-serif",
    fontSecondary: "Inter, sans-serif",
  },
  durban: {
    primary: "#38BDF8",
    secondary: "#F0F9FF",
    accent: "#FB923C",
    fontPrimary: "Inter, sans-serif",
    fontSecondary: "Inter, sans-serif",
  },
}

// Block types for drag and drop
const blockTypes = [
  { id: "heading", name: "Heading", icon: FileText },
  { id: "text", name: "Text Block", icon: FileText },
  { id: "image", name: "Image", icon: ImageIcon },
  { id: "gallery", name: "Image Gallery", icon: ImageIcon },
  { id: "video", name: "Video", icon: Video },
  { id: "skills", name: "Skills Bar", icon: FileText },
  { id: "testimonial", name: "Testimonial", icon: MessageSquare },
  { id: "contact", name: "Contact Form", icon: FileText },
]

// SEO suggestions
const seoSuggestions = [
  "Add 'UI/UX Designer' to your title for better visibility",
  "Include 'Frontend Developer Cape Town' in your bio",
  "Add alt text to all your project images",
  "Use more specific project descriptions with keywords",
  "Include links to your social media profiles",
]

// Sortable item component
function SortableItem({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  )
}

export function PortfolioBuilder() {
  const [activeSection, setActiveSection] = useState("about")
  const [activeTemplate, setActiveTemplate] = useState("capeTown")
  const [portfolioData, setPortfolioData] = useState(initialPortfolioData)
  const [seoScore, setSeoScore] = useState(45)
  const [completionPercentage, setCompletionPercentage] = useState(25)
  const [previewMode, setPreviewMode] = useState("desktop")
  const [lastSaved, setLastSaved] = useState("2 mins ago")
  const [showPreview, setShowPreview] = useState(false)
  const [feedbackImage, setFeedbackImage] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  
  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )
  
  // Calculate completion percentage
  const calculateCompletion = () => {
    let total = 0
    let filled = 0
    
    // About section
    const aboutFields = Object.values(portfolioData.about)
    total += aboutFields.length
    filled += aboutFields.filter(field => field && field.trim() !== "").length
    
    // Projects
    total += 3 // Expecting at least 3 projects
    filled += Math.min(portfolioData.projects.length, 3)
    
    // Testimonials
    total += 2 // Expecting at least 2 testimonials
    filled += Math.min(portfolioData.testimonials.length, 2)
    
    // Skills
    total += 1 // At least 5 skills are expected
    filled += portfolioData.skills.length >= 5 ? 1 : 0
    
    return Math.round((filled / total) * 100)
  }
  
  // Update about section
  const handleAboutChange = (field, value) => {
    setPortfolioData({
      ...portfolioData,
      about: {
        ...portfolioData.about,
        [field]: value
      }
    })
    
    // Update completion percentage
    const newCompletion = calculateCompletion()
    setCompletionPercentage(newCompletion)
    
    // Mock SEO score update
    if (field === "title" && value.toLowerCase().includes("developer")) {
      setSeoScore(Math.min(seoScore + 5, 100))
    }
    
    // Simulate auto-save
    setLastSaved("Just now")
  }
  
  // Add new project
  const addProject = () => {
    const newProject = {
      id: `proj${Date.now()}`,
      title: "",
      description: "",
      tags: [],
      image: "/placeholder.svg?height=400&width=600",
      link: "",
      featured: false,
    }
    
    setPortfolioData({
      ...portfolioData,
      projects: [...portfolioData.projects, newProject]
    })
    
    // Update completion percentage
    const newCompletion = calculateCompletion()
    setCompletionPercentage(newCompletion)
  }
  
  // Update project
  const updateProject = (id, field, value) => {
    setPortfolioData({
      ...portfolioData,
      projects: portfolioData.projects.map(proj => 
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    })
    
    // Update completion percentage
    const newCompletion = calculateCompletion()
    setCompletionPercentage(newCompletion)
    
    // Simulate auto-save
    setLastSaved("Just now")
  }
  
  // Toggle project featured status
  const toggleProjectFeatured = (id) => {
    setPortfolioData({
      ...portfolioData,
      projects: portfolioData.projects.map(proj => 
        proj.id === id ? { ...proj, featured: !proj.featured } : proj
      )
    })
    
    // Simulate auto-save
    setLastSaved("Just now")
  }
  
  // Remove project
  const removeProject = (id) => {
    setPortfolioData({
      ...portfolioData,
      projects: portfolioData.projects.filter(proj => proj.id !== id)
    })
    
    // Update completion percentage
    const newCompletion = calculateCompletion()
    setCompletionPercentage(newCompletion)
    
    // Simulate auto-save
    setLastSaved("Just now")
  }
  
  // Handle project tags
  const handleProjectTags = (id, tagsString) => {
    const tagsArray = tagsString.split(",").map(tag => tag.trim()).filter(tag => tag !== "")
    
    setPortfolioData({
      ...portfolioData,
      projects: portfolioData.projects.map(proj => 
        proj.id === id ? { ...proj, tags: tagsArray } : proj
      )
    })
    
    // Simulate auto-save
    setLastSaved("Just now")
  }
  
  // Add new testimonial
  const addTestimonial = () => {
    const newTestimonial = {
      id: `test${Date.now()}`,
      name: "",
      company: "",
      position: "",
      content: "",
      image: "/placeholder.svg?height=100&width=100",
    }
    
    setPortfolioData({
      ...portfolioData,
      testimonials: [...portfolioData.testimonials, newTestimonial]
    })
    
    // Update completion percentage
    const newCompletion = calculateCompletion()
    setCompletionPercentage(newCompletion)
  }
  
  // Update testimonial
  const updateTestimonial = (id, field, value) => {
    setPortfolioData({
      ...portfolioData,
      testimonials: portfolioData.testimonials.map(test => 
        test.id === id ? { ...test, [field]: value } : test
      )
    })
    
    // Update completion percentage
    const newCompletion = calculateCompletion()
    setCompletionPercentage(newCompletion)
    
    // Simulate auto-save
    setLastSaved("Just now")
  }
  
  // Remove testimonial
  const removeTestimonial = (id) => {
    setPortfolioData({
      ...portfolioData,
      testimonials: portfolioData.testimonials.filter(test => test.id !== id)
    })
    
    // Update completion percentage
    const newCompletion = calculateCompletion()
    setCompletionPercentage(newCompletion)
    
    // Simulate auto-save
    setLastSaved("Just now")
  }
  
  // Add skill
  const addSkill = () => {
    const newSkill = {
      id: `skill${Date.now()}`,
      name: "",
      level: 50,
    }
    
    setPortfolioData({
      ...portfolioData,
      skills: [...portfolioData.skills, newSkill]
    })
    
    // Update completion percentage
    const newCompletion = calculateCompletion()
    setCompletionPercentage(newCompletion)
  }
  
  // Update skill
  const updateSkill = (id, field, value) => {
    setPortfolioData({
      ...portfolioData,
      skills: portfolioData.skills.map(skill => 
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    })
    
    // Update completion percentage
    const newCompletion = calculateCompletion()
    setCompletionPercentage(newCompletion)
    
    // Simulate auto-save
    setLastSaved("Just now")
  }
  
  // Remove skill
  const removeSkill = (id) => {
    setPortfolioData({
      ...portfolioData,
      skills: portfolioData.skills.filter(skill => skill.id !== id)
    })
    
    // Update completion percentage
    const newCompletion = calculateCompletion()
    setCompletionPercentage(newCompletion)
    
    // Simulate auto-save
    setLastSaved("Just now")
  }
  
  // Handle skills reordering
  const handleSkillsReorder = (event) => {
    const { active, over } = event
    
    if (active.id !== over.id) {
      const oldIndex = portfolioData.skills.findIndex(skill => skill.id === active.id)
      const newIndex = portfolioData.skills.findIndex(skill => skill.id === over.id)
      
      const newSkills = [...portfolioData.skills]
      const [movedSkill] = newSkills.splice(oldIndex, 1)
      newSkills.splice(newIndex, 0, movedSkill)
      
      setPortfolioData({
        ...portfolioData,
        skills: newSkills
      })
      
      // Simulate auto-save
      setLastSaved("Just now")
    }
  }
  
  // Handle image upload for feedback
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setFeedbackImage(reader.result)
        setShowFeedback(true)
      }
      reader.readAsDataURL(file)
    }
  }
  
  // Mock AI feedback for uploaded image
  const getAIFeedback = () => {
    return [
      "The contrast between text and background is too low. Consider using darker text or a lighter background.",
      "The layout appears cluttered. Try increasing white space between elements.",
      "The call-to-action button is not prominent enough. Use a contrasting color to make it stand out.",
      "The font size for body text is too small for mobile viewing. Increase it for better readability.",
    ]
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Portfolio Builder */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#FF6B6B] flex items-center gap-2">
                <Layout className="h-5 w-5" />
                Portfolio Builder
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-normal">
                  {completionPercentage}% Complete
                </Badge>
                <span className="text-xs text-muted-foreground">Last saved: {lastSaved}</span>
              </div>
            </div>
            <CardDescription>Create a professional portfolio to showcase your work</CardDescription>
            <Progress value={completionPercentage} className="h-2 mt-2" indicatorColor="bg-[#FF6B6B]" />
          </CardHeader>
          <CardContent>
            <Tabs value={activeSection} onValueChange={setActiveSection}>
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="about" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">About</span>
                </TabsTrigger>
                <TabsTrigger value="projects" className="flex items-center gap-1">
                  <Layout className="h-4 w-4" />
                  <span className="hidden sm:inline">Projects</span>
                </TabsTrigger>
                <TabsTrigger value="testimonials" className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Testimonials</span>
                </TabsTrigger>
                <TabsTrigger value="skills" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Skills</span>
                </TabsTrigger>
              </TabsList>
              
              {/* About Section */}
              <TabsContent value="about" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      placeholder="e.g., Thabo Mokoena" 
                      value={portfolioData.about.name}
                      onChange={(e) => handleAboutChange("name", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">Professional Title</Label>
                    <Input 
                      id="title" 
                      placeholder="e.g., Frontend Developer & UI/UX Designer" 
                      value={portfolioData.about.title}
                      onChange={(e) => handleAboutChange("title", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      placeholder="Write a brief introduction about yourself..." 
                      value={portfolioData.about.bio}
                      onChange={(e) => handleAboutChange("bio", e.target.value)}
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="e.g., your.name@example.com" 
                      value={portfolioData.about.email}
                      onChange={(e) => handleAboutChange("email", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      placeholder="e.g., +27 71 234 5678" 
                      value={portfolioData.about.phone}
                      onChange={(e) => handleAboutChange("phone", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location" 
                      placeholder="e.g., Cape Town, South Africa" 
                      value={portfolioData.about.location}
                      onChange={(e) => handleAboutChange("location", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">Website (Optional)</Label>
                    <Input 
                      id="website" 
                      placeholder="e.g., yourwebsite.com" 
                      value={portfolioData.about.website}
                      onChange={(e) => handleAboutChange("website", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn (Optional)</Label>
                    <Input 
                      id="linkedin" 
                      placeholder="e.g., linkedin.com/in/yourname" 
                      value={portfolioData.about.linkedin}
                      onChange={(e) => handleAboutChange("linkedin", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub (Optional)</Label>
                    <Input 
                      id="github" 
                      placeholder="e.g., github.com/username" 
                      value={portfolioData.about.github}
                      onChange={(e) => handleAboutChange("github", e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-4 border border-muted">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-[#FF6B6B]" />
                    SEO Optimization Tips
                  </h3>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Your portfolio is <span className="font-medium text-[#FF6B6B]">{seoScore}%</span> SEO-friendly.
                    </p>
                    <Progress value={seoScore} className="h-2" indicatorColor="bg-[#FF6B6B]" />
                    <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                      {seoSuggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              {/* Projects Section */}
              <TabsContent value="projects" className="space-y-4">
                <div className="space-y-4">
                  {portfolioData.projects.map((project, index) => (
                    <Card key={project.id} className="bg-card">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">Project {index + 1}</CardTitle>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeProject(project.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`title-${project.id}`}>Project Title</Label>
                            <Input 
                              id={`title-${project.id}`} 
                              placeholder="e.g., E-commerce Website Redesign" 
                              value={project.title}
                              onChange={(e) => updateProject(project.id, "title", e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`link-${project.id}`}>Project Link</Label>
                            <Input 
                              id={`link-${project.id}`} 
                              placeholder="e.g., https://example.com/project" 
                              value={project.link}
                              onChange={(e) => updateProject(project.id, "link", e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor={`description-${project.id}`}>Description</Label>
                            <Textarea 
                              id={`description-${project.id}`} 
                              placeholder="Describe your project..." 
                              value={project.description}
                              onChange={(e) => updateProject(project.id, "description", e.target.value)}
                              rows={3}
                            />
                          </div>
                          
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor={`tags-${project.id}`}>Tags (comma separated)</Label>
                            <Input 
                              id={`tags-${project.id}`} 
                              placeholder="e.g., React, UI/UX, Tailwind CSS" 
                              value={project.tags.join(", ")}
                              onChange={(e) => handleProjectTags(project.id, e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor={`image-${project.id}`}>Project Image URL</Label>
                            <Input 
                              id={`image-${project.id}`} 
                              placeholder="e.g., https://example.com/image.jpg" 
                              value={project.image}
                              onChange={(e) => updateProject(project.id, "image", e.target.value)}
                            />
                          </div>
                          
                          <div className="md:col-span-2 flex items-center space-x-2">
                            <Switch 
                              id={`featured-${project.id}`}
                              checked={project.featured}
                              onCheckedChange={() => toggleProjectFeatured(project.id)}
                            />
                            <Label htmlFor={`featured-${project.id}`}>Featured Project</Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <Button 
                  onClick={addProject} 
                  variant="outline" 
                  className="w-full flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Project
                </Button>
                
                <div className="bg-muted/30 rounded-lg p-4 border border-muted">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-[#FF6B6B]" />
                    Project Tips
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                    <li>Include 3-5 of your best projects</li>
                    <li>Use high-quality screenshots or mockups</li>
                    <li>Be specific about your role and contributions</li>
                    <li>Include measurable results where possible</li>
                    <li>Mark your best work as "Featured" to highlight it</li>
                  </ul>
                </div>
              </TabsContent>
              
              {/* Testimonials Section */}
              <TabsContent value="testimonials" className="space-y-4">
                <div className="space-y-4">
                  {portfolioData.testimonials.map((testimonial, index) => (
                    <Card key={testimonial.id} className="bg-card">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">Testimonial {index + 1}</CardTitle>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeTestimonial(testimonial.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`name-${testimonial.id}`}>Name</Label>
                            <Input 
                              id={`name-${testimonial.id}`} 
                              placeholder="e.g., Lerato Ndlovu" 
                              value={testimonial.name}
                              onChange={(e) => updateTestimonial(testimonial.id, "name", e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`company-${testimonial.id}`}>Company</Label>
                            <Input 
                              id={`company-${testimonial.id}`} 
                              placeholder="e.g., Digital Creatives" 
                              value={testimonial.company}
                              onChange={(e) => updateTestimonial(testimonial.id, "company", e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`position-${testimonial.id}`}>Position</Label>
                            <Input 
                              id={`position-${testimonial.id}`} 
                              placeholder="e.g., Marketing Director" 
                              value={testimonial.position}
                              onChange={(e) => updateTestimonial(testimonial.id, "position", e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`image-${testimonial.id}`}>Image URL (Optional)</Label>
                            <Input 
                              id={`image-${testimonial.id}`} 
                              placeholder="e.g., https://example.com/image.jpg" 
                              value={testimonial.image}
                              onChange={(e) => updateTestimonial(testimonial.id, "image", e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor={`content-${testimonial.id}`}>Testimonial</Label>
                            <Textarea 
                              id={`content-${testimonial.id}`} 
                              placeholder="What did they say about your work?" 
                              value={testimonial.content}
                              onChange={(e) => updateTestimonial(testimonial.id, "content", e.target.value)}
                              rows={3}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <Button 
                  onClick={addTestimonial} 
                  variant="outline" 
                  className="w-full flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Testimonial
                </Button>
                
                <div className="bg-muted/30 rounded-lg p-4 border border-muted">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-[#FF6B6B]" />
                    Testimonial Tips
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                    <li>Include 2-3 strong testimonials from clients or colleagues</li>
                    <li>Ask for specific feedback about your skills and work ethic</li>
                    <li>Include the person's role and company for credibility</li>
                    <li>Keep testimonials concise and impactful</li>
                  </ul>
                </div>
              </TabsContent>
              
              {/* Skills Section */}
              <TabsContent value="skills" className="space-y-4">
                <DndContext 
                  sensors={sensors} 
                  collisionDetection={closestCenter}
                  modifiers={[restrictToVerticalAxis]}
                  onDragEnd={handleSkillsReorder}
                >
                  <SortableContext 
                    items={portfolioData.skills.map(skill => skill.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-4">
                      {portfolioData.skills.map((skill) => (
                        <SortableItem key={skill.id} id={skill.id}>
                          <div className="border rounded-lg p-4 bg-card flex items-center gap-4">
                            <MoveVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                            
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                              <div className="md:col-span-1">
                                <Input 
                                  placeholder="Skill name" 
                                  value={skill.name}
                                  onChange={(e) => updateSkill(skill.id, "name", e.target.value)}
                                />
                              </div>
                              
                              <div className="md:col-span-2 flex items-center gap-2">
                                <span className="text-xs text-muted-foreground w-8">{skill.level}%</span>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={skill.level}
                                  onChange={(e) => updateSkill(skill.id, "level", Number.parseInt(e.target.value))}
                                  className="flex-1"
                                />
                              </div>
                              
                              <div className="flex justify-end">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeSkill(skill.id)}
                                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </SortableItem>
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
                
                <Button 
                  onClick={addSkill} 
                  variant="outline" 
                  className="w-full flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Skill
                </Button>
                
                <div className="bg-muted/30 rounded-lg p-4 border border-muted">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-[#FF6B6B]" />
                    Skills Tips
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                    <li>Include both technical and soft skills</li>
                    <li>Be honest about your skill levels</li>
                    <li>Focus on skills relevant to your target industry</li>
                    <li>Organize skills by category or proficiency</li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Draft
            </Button>
            <Button 
              className="bg-[#FF6B6B] hover:bg-[#e55a5a] flex items-center gap-2"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="h-4 w-4" />
              {showPreview ? "Hide Preview" : "Preview Portfolio"}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Right Column - Preview and Templates */}
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Portfolio Template</CardTitle>
            <CardDescription>Choose a template for your portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div 
                  className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                    activeTemplate === "capeTown" ? "ring-2 ring-[#6E56CF]" : "hover:border-[#6E56CF]/50"
                  }`}
                  onClick={() => setActiveTemplate("capeTown")}
                >
                  <div className="h-4 bg-[#6E56CF]"></div>
                  <div className="p-2">
                    <div className="h-2 w-3/4 bg-gray-200 rounded mb-1"></div>
                    <div className="h-2 w-1/2 bg-gray-200 rounded"></div>
                  </div>
                  <div className="p-1 text-center text-xs font-medium">Cape Town</div>
                </div>
                
                <div 
                  className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                    activeTemplate === "johannesburg" ? "ring-2 ring-[#FF6B6B]" : "hover:border-[#FF6B6B]/50"
                  }`}
                  onClick={() => setActiveTemplate("johannesburg")}
                >
                  <div className="h-4 bg-[#FF6B6B]"></div>
                  <div className="p-2">
                    <div className="h-2 w-3/4 bg-gray-200 rounded mb-1"></div>
                    <div className="h-2 w-1/2 bg-gray-200 rounded"></div>
                  </div>
                  <div className="p-1 text-center text-xs font-medium">Johannesburg</div>
                </div>
                
                <div 
                  className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                    activeTemplate === "durban" ? "ring-2 ring-[#38BDF8]" : "hover:border-[#38BDF8]/50"
                  }`}
                  onClick={() => setActiveTemplate("durban")}
                >
                  <div className="h-4 bg-[#38BDF8]"></div>
                  <div className="p-2">
                    <div className="h-2 w-3/4 bg-gray-200 rounded mb-1"></div>
                    <div className="h-2 w-1/2 bg-gray-200 rounded"></div>
                  </div>
                  <div className="p-1 text-center text-xs font-medium">Durban</div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-2">Preview Mode</h3>
                <div className="flex gap-2">
                  <Button 
                    variant={previewMode === "desktop" ? "default" : "outline"} 
                    size="sm"
                    className="flex-1 flex items-center justify-center gap-2"
                    onClick={() => setPreviewMode("desktop")}
                  >
                    <Monitor className="h-4 w-4" />
                    Desktop
                  </Button>
                  <Button 
                    variant={previewMode === "tablet" ? "default" : "outline"} 
                    size="sm"
                    className="flex-1 flex items-center justify-center gap-2"
                    onClick={() => setPreviewMode("tablet")}
                  >
                    <Tablet className="h-4 w-4" />
                    Tablet
                  </Button>
                  <Button 
                    variant={previewMode === "mobile" ? "default" : "outline"} 
                    size="sm"
                    className="flex-1 flex items-center justify-center gap-2"
                    onClick={() => setPreviewMode("mobile")}
                  >
                    <Smartphone className="h-4 w-4" />
                    Mobile
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-2">AI Design Feedback</h3>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Upload a screenshot of your design to get AI feedback
                  </p>
                  <div className="flex items-center gap-2">
                    <label 
                      htmlFor="screenshot-upload" 
                      className="cursor-pointer flex-1"
                    >
                      <div className="border border-dashed rounded-lg p-4 text-center hover:bg-muted/50 transition-colors">
                        <Upload className="h-4 w-4 mx-auto mb-2 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Click to upload</span>
                      </div>
                      <input 
                        id="screenshot-upload" 
                        type="file" 
                        accept="image/*" 
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {showFeedback && feedbackImage && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>AI Design Feedback</CardTitle>
              <CardDescription>Analysis of your uploaded design</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <img 
                  src={feedbackImage || "/placeholder.svg"} 
                  alt="Uploaded design" 
                  className="w-full h-auto"
                />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Suggestions for Improvement</h3>
                <ul className="space-y-2">
                  {getAIFeedback().map((feedback, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                      <span>{feedback}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowFeedback(false)}
              >
                Close Feedback
              </Button>
            </CardFooter>
          </Card>
        )}
        
        {showPreview && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Portfolio Preview</CardTitle>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>Preview Mode:</span>
                  <Button 
                    variant={previewMode === "desktop" ? "default" : "outline"} 
                    size="sm"
                    className="flex-1 flex items-center justify-center gap-2"
                    onClick={() => setPreviewMode("desktop")}
                  >
                    <Monitor className="h-4 w-4" />
                    Desktop
                  </Button>
                  <Button 
                    variant={previewMode === "tablet" ? "default" : "outline"} 
                    size="sm"
                    className="flex-1 flex items-center justify-center gap-2"
                    onClick={() => setPreviewMode("tablet")}
                  >
                    <Tablet className="h-4 w-4" />
                    Tablet
                  </Button>
                  <Button 
                    variant={previewMode === "mobile" ? "default" : "outline"} 
                    size="sm"
                    className="flex-1 flex items-center justify-center gap-2"
                    onClick={() => setPreviewMode("mobile")}
                  >
                    <Smartphone className="h-4 w-4" />
                    Mobile
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden bg-white">
                <div className={`${previewMode === "desktop" ? "w-full" : previewMode === "tablet" ? "w-3/4 mx-auto" : "w-1/2 mx-auto"} transition-all duration-300`}>
                  <div className="bg-gray-100 p-4 border-b">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                  <div className="p-4">
                    {/* Portfolio Preview Content */}
                    <div className="text-center">
                      <h1 className="text-2xl font-bold mb-4">{portfolioData.about.name || "Your Name"}</h1>
                      <p className="text-muted-foreground mb-6">{portfolioData.about.title || "Your Title"}</p>
                      
                      {portfolioData.projects.length > 0 && (
                        <div className="mb-6">
                          <h2 className="text-xl font-semibold mb-4">Projects</h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {portfolioData.projects.slice(0, 2).map((project, index) => (
                              <div key={index} className="border rounded-lg p-4">
                                <h3 className="font-semibold">{project.title}</h3>
                                <p className="text-sm text-muted-foreground">{project.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
