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
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import {
  User,
  Phone,
  Mail,
  LinkIcon,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Download,
  Plus,
  Trash2,
  MoveVertical,
  AlertCircle,
  FileText,
  Eye,
} from "lucide-react"
import { PDFViewer, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"

// Mock data for skills suggestions based on learning path
const skillSuggestions = [
  { id: "s1", name: "React", category: "Development" },
  { id: "s2", name: "Next.js", category: "Development" },
  { id: "s3", name: "UI/UX Design", category: "Design" },
  { id: "s4", name: "Figma", category: "Design" },
  { id: "s5", name: "Content Writing", category: "Marketing" },
  { id: "s6", name: "SEO", category: "Marketing" },
  { id: "s7", name: "Project Management", category: "Business" },
  { id: "s8", name: "Client Communication", category: "Business" },
  { id: "s9", name: "Adobe Photoshop", category: "Design" },
  { id: "s10", name: "JavaScript", category: "Development" },
  { id: "s11", name: "TypeScript", category: "Development" },
  { id: "s12", name: "Tailwind CSS", category: "Development" },
]

// Template styles
const templateStyles = {
  modern: {
    primary: "#6E56CF",
    secondary: "#F4F2FF",
    fontPrimary: "Inter, sans-serif",
    fontSecondary: "Inter, sans-serif",
  },
  classic: {
    primary: "#2C3E50",
    secondary: "#ECF0F1",
    fontPrimary: "Georgia, serif",
    fontSecondary: "Arial, sans-serif",
  },
  minimalist: {
    primary: "#000000",
    secondary: "#F5F5F5",
    fontPrimary: "Inter, sans-serif",
    fontSecondary: "Inter, sans-serif",
  },
}

// PDF styles for preview
const pdfStyles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Inter",
  },
  header: {
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#6E56CF",
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
    color: "#6E56CF",
  },
  contact: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  contactItem: {
    fontSize: 10,
    marginRight: 15,
    marginBottom: 5,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#6E56CF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 5,
  },
  experienceItem: {
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: "bold",
  },
  company: {
    fontSize: 12,
    marginBottom: 5,
  },
  date: {
    fontSize: 10,
    color: "#6B7280",
    marginBottom: 5,
  },
  description: {
    fontSize: 10,
    marginBottom: 5,
  },
  skills: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skill: {
    fontSize: 10,
    backgroundColor: "#F3F4F6",
    padding: 5,
    borderRadius: 3,
    marginRight: 5,
    marginBottom: 5,
  },
})

// Mock CV data
const initialCVData = {
  personalInfo: {
    fullName: "Thabo Mokoena",
    jobTitle: "Frontend Developer",
    email: "thabo.mokoena@example.com",
    phone: "+27 71 234 5678",
    location: "Cape Town, South Africa",
    website: "thabomokoena.dev",
    linkedin: "linkedin.com/in/thabomokoena",
  },
  workExperience: [
    {
      id: "exp1",
      jobTitle: "Frontend Developer",
      company: "TechSA Solutions",
      location: "Cape Town",
      startDate: "2021-06",
      endDate: "Present",
      current: true,
      description:
        "Developed responsive web applications using React and Next.js. Collaborated with designers to implement UI/UX designs. Improved site performance by 40%.",
    },
    {
      id: "exp2",
      jobTitle: "Web Developer Intern",
      company: "Digital Creatives",
      location: "Johannesburg",
      startDate: "2020-01",
      endDate: "2021-05",
      current: false,
      description: "Assisted in developing websites for clients. Learned modern web development practices and tools.",
    },
  ],
  education: [
    {
      id: "edu1",
      degree: "BSc Computer Science",
      institution: "University of Cape Town",
      location: "Cape Town",
      startDate: "2016-01",
      endDate: "2019-12",
      description: "Focused on web development and software engineering. Graduated with honors.",
    },
  ],
  skills: [
    { id: "skill1", name: "React" },
    { id: "skill2", name: "Next.js" },
    { id: "skill3", name: "JavaScript" },
    { id: "skill4", name: "TypeScript" },
    { id: "skill5", name: "Tailwind CSS" },
  ],
}

export function CVBuilder() {
  const [activeSection, setActiveSection] = useState("personalInfo")
  const [activeTemplate, setActiveTemplate] = useState("modern")
  const [cvData, setCVData] = useState(initialCVData)
  const [atsScore, setAtsScore] = useState(65)
  const [completionPercentage, setCompletionPercentage] = useState(40)
  const [showPreview, setShowPreview] = useState(false)

  // Calculate completion percentage based on filled sections
  const calculateCompletion = () => {
    let total = 0
    let filled = 0

    // Personal info checks
    const personalInfoFields = Object.values(cvData.personalInfo)
    total += personalInfoFields.length
    filled += personalInfoFields.filter((field) => field && field.trim() !== "").length

    // Work experience
    total += 1 // At least one work experience is expected
    filled += cvData.workExperience.length > 0 ? 1 : 0

    // Education
    total += 1 // At least one education entry is expected
    filled += cvData.education.length > 0 ? 1 : 0

    // Skills
    total += 1 // At least 5 skills are expected
    filled += cvData.skills.length >= 5 ? 1 : 0

    return Math.round((filled / total) * 100)
  }

  // Update personal info
  const handlePersonalInfoChange = (field, value) => {
    setCVData({
      ...cvData,
      personalInfo: {
        ...cvData.personalInfo,
        [field]: value,
      },
    })

    // Update completion percentage
    const newCompletion = calculateCompletion()
    setCompletionPercentage(newCompletion)

    // Mock ATS score update
    if (field === "jobTitle" && value.toLowerCase().includes("developer")) {
      setAtsScore(Math.min(atsScore + 5, 100))
    }
  }

  // Add new work experience
  const addWorkExperience = () => {
    const newExp = {
      id: `exp${Date.now()}`,
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    }

    setCVData({
      ...cvData,
      workExperience: [...cvData.workExperience, newExp],
    })
  }

  // Update work experience
  const updateWorkExperience = (id, field, value) => {
    setCVData({
      ...cvData,
      workExperience: cvData.workExperience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    })

    // Update completion percentage
    const newCompletion = calculateCompletion()
    setCompletionPercentage(newCompletion)
  }

  // Remove work experience
  const removeWorkExperience = (id) => {
    setCVData({
      ...cvData,
      workExperience: cvData.workExperience.filter((exp) => exp.id !== id),
    })

    // Update completion percentage
    const newCompletion = calculateCompletion()
    setCompletionPercentage(newCompletion)
  }

  // Handle work experience drag and drop
  const handleWorkExperienceDragEnd = (result) => {
    if (!result.destination) return

    const items = Array.from(cvData.workExperience)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setCVData({
      ...cvData,
      workExperience: items,
    })
  }

  // Add new education
  const addEducation = () => {
    const newEdu = {
      id: `edu${Date.now()}`,
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    }

    setCVData({
      ...cvData,
      education: [...cvData.education, newEdu],
    })
  }

  // Update education
  const updateEducation = (id, field, value) => {
    setCVData({
      ...cvData,
      education: cvData.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
    })

    // Update completion percentage
    const newCompletion = calculateCompletion()
    setCompletionPercentage(newCompletion)
  }

  // Remove education
  const removeEducation = (id) => {
    setCVData({
      ...cvData,
      education: cvData.education.filter((edu) => edu.id !== id),
    })

    // Update completion percentage
    const newCompletion = calculateCompletion()
    setCompletionPercentage(newCompletion)
  }

  // Handle education drag and drop
  const handleEducationDragEnd = (result) => {
    if (!result.destination) return

    const items = Array.from(cvData.education)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setCVData({
      ...cvData,
      education: items,
    })
  }

  // Add skill
  const addSkill = (skill) => {
    // Check if skill already exists
    if (cvData.skills.some((s) => s.name === skill.name)) return

    setCVData({
      ...cvData,
      skills: [...cvData.skills, { id: `skill${Date.now()}`, name: skill.name }],
    })

    // Update ATS score
    if (cvData.skills.length < 8) {
      setAtsScore(Math.min(atsScore + 5, 100))
    }

    // Update completion percentage
    const newCompletion = calculateCompletion()
    setCompletionPercentage(newCompletion)
  }

  // Remove skill
  const removeSkill = (id) => {
    setCVData({
      ...cvData,
      skills: cvData.skills.filter((skill) => skill.id !== id),
    })

    // Update ATS score
    if (cvData.skills.length <= 8) {
      setAtsScore(Math.max(atsScore - 5, 0))
    }

    // Update completion percentage
    const newCompletion = calculateCompletion()
    setCompletionPercentage(newCompletion)
  }

  // Custom skill input
  const [customSkill, setCustomSkill] = useState("")
  const addCustomSkill = () => {
    if (customSkill.trim() === "") return

    addSkill({ name: customSkill })
    setCustomSkill("")
  }

  // PDF Document component for preview
  const CVDocument = () => (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.header}>
          <Text style={pdfStyles.name}>{cvData.personalInfo.fullName}</Text>
          <Text style={pdfStyles.title}>{cvData.personalInfo.jobTitle}</Text>
          <View style={pdfStyles.contact}>
            <Text style={pdfStyles.contactItem}>{cvData.personalInfo.email}</Text>
            <Text style={pdfStyles.contactItem}>{cvData.personalInfo.phone}</Text>
            <Text style={pdfStyles.contactItem}>{cvData.personalInfo.location}</Text>
            {cvData.personalInfo.website && <Text style={pdfStyles.contactItem}>{cvData.personalInfo.website}</Text>}
          </View>
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>Work Experience</Text>
          {cvData.workExperience.map((exp) => (
            <View key={exp.id} style={pdfStyles.experienceItem}>
              <Text style={pdfStyles.jobTitle}>{exp.jobTitle}</Text>
              <Text style={pdfStyles.company}>
                {exp.company}, {exp.location}
              </Text>
              <Text style={pdfStyles.date}>
                {new Date(exp.startDate).toLocaleDateString("en-ZA", { year: "numeric", month: "short" })} -
                {exp.current
                  ? " Present"
                  : new Date(exp.endDate).toLocaleDateString("en-ZA", { year: "numeric", month: "short" })}
              </Text>
              <Text style={pdfStyles.description}>{exp.description}</Text>
            </View>
          ))}
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>Education</Text>
          {cvData.education.map((edu) => (
            <View key={edu.id} style={pdfStyles.experienceItem}>
              <Text style={pdfStyles.jobTitle}>{edu.degree}</Text>
              <Text style={pdfStyles.company}>
                {edu.institution}, {edu.location}
              </Text>
              <Text style={pdfStyles.date}>
                {new Date(edu.startDate).toLocaleDateString("en-ZA", { year: "numeric", month: "short" })} -
                {new Date(edu.endDate).toLocaleDateString("en-ZA", { year: "numeric", month: "short" })}
              </Text>
              <Text style={pdfStyles.description}>{edu.description}</Text>
            </View>
          ))}
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>Skills</Text>
          <View style={pdfStyles.skills}>
            {cvData.skills.map((skill) => (
              <Text key={skill.id} style={pdfStyles.skill}>
                {skill.name}
              </Text>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - CV Builder */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#6E56CF] flex items-center gap-2">
                <FileText className="h-5 w-5" />
                CV Builder
              </CardTitle>
              <Badge variant="outline" className="font-normal">
                {completionPercentage}% Complete
              </Badge>
            </div>
            <CardDescription>Create a professional CV to showcase your skills and experience</CardDescription>
            <Progress value={completionPercentage} className="h-2 mt-2" indicatorColor="bg-[#6E56CF]" />
          </CardHeader>
          <CardContent>
            <Tabs value={activeSection} onValueChange={setActiveSection}>
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="personalInfo" className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Personal Info</span>
                </TabsTrigger>
                <TabsTrigger value="workExperience" className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  <span className="hidden sm:inline">Experience</span>
                </TabsTrigger>
                <TabsTrigger value="education" className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" />
                  <span className="hidden sm:inline">Education</span>
                </TabsTrigger>
                <TabsTrigger value="skills" className="flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  <span className="hidden sm:inline">Skills</span>
                </TabsTrigger>
              </TabsList>

              {/* Personal Info Section */}
              <TabsContent value="personalInfo" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <Input
                        id="fullName"
                        placeholder="e.g., Thabo Mokoena"
                        value={cvData.personalInfo.fullName}
                        onChange={(e) => handlePersonalInfoChange("fullName", e.target.value)}
                        className="pl-9"
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <div className="relative">
                      <Input
                        id="jobTitle"
                        placeholder="e.g., Frontend Developer"
                        value={cvData.personalInfo.jobTitle}
                        onChange={(e) => handlePersonalInfoChange("jobTitle", e.target.value)}
                        className="pl-9"
                      />
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="e.g., your.name@example.com"
                        value={cvData.personalInfo.email}
                        onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
                        className="pl-9"
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="relative">
                      <Input
                        id="phone"
                        placeholder="e.g., +27 71 234 5678"
                        value={cvData.personalInfo.phone}
                        onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
                        className="pl-9"
                      />
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <Input
                        id="location"
                        placeholder="e.g., Cape Town, South Africa"
                        value={cvData.personalInfo.location}
                        onChange={(e) => handlePersonalInfoChange("location", e.target.value)}
                        className="pl-9"
                      />
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website (Optional)</Label>
                    <div className="relative">
                      <Input
                        id="website"
                        placeholder="e.g., yourwebsite.com"
                        value={cvData.personalInfo.website}
                        onChange={(e) => handlePersonalInfoChange("website", e.target.value)}
                        className="pl-9"
                      />
                      <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn (Optional)</Label>
                    <div className="relative">
                      <Input
                        id="linkedin"
                        placeholder="e.g., linkedin.com/in/yourname"
                        value={cvData.personalInfo.linkedin}
                        onChange={(e) => handlePersonalInfoChange("linkedin", e.target.value)}
                        className="pl-9"
                      />
                      <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 border border-muted">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-[#6E56CF]" />
                    Tips for Personal Information
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                    <li>Use a professional email address</li>
                    <li>Include your LinkedIn profile to enhance credibility</li>
                    <li>For South African phone numbers, use the format +27 XX XXX XXXX</li>
                    <li>Be specific with your job title to match job descriptions</li>
                  </ul>
                </div>
              </TabsContent>

              {/* Work Experience Section */}
              <TabsContent value="workExperience" className="space-y-4">
                <DragDropContext onDragEnd={handleWorkExperienceDragEnd}>
                  <Droppable droppableId="workExperience">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                        {cvData.workExperience.map((exp, index) => (
                          <Draggable key={exp.id} draggableId={exp.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="border rounded-lg p-4 bg-card"
                              >
                                <div className="flex justify-between items-start mb-4">
                                  <h3 className="font-medium">Work Experience {index + 1}</h3>
                                  <div className="flex items-center gap-2">
                                    <div
                                      {...provided.dragHandleProps}
                                      className="cursor-move p-1 hover:bg-muted rounded"
                                    >
                                      <MoveVertical className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeWorkExperience(exp.id)}
                                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`jobTitle-${exp.id}`}>Job Title</Label>
                                    <Input
                                      id={`jobTitle-${exp.id}`}
                                      placeholder="e.g., Frontend Developer"
                                      value={exp.jobTitle}
                                      onChange={(e) => updateWorkExperience(exp.id, "jobTitle", e.target.value)}
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor={`company-${exp.id}`}>Company</Label>
                                    <Input
                                      id={`company-${exp.id}`}
                                      placeholder="e.g., TechSA Solutions"
                                      value={exp.company}
                                      onChange={(e) => updateWorkExperience(exp.id, "company", e.target.value)}
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor={`location-${exp.id}`}>Location</Label>
                                    <Input
                                      id={`location-${exp.id}`}
                                      placeholder="e.g., Cape Town"
                                      value={exp.location}
                                      onChange={(e) => updateWorkExperience(exp.id, "location", e.target.value)}
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-2">
                                      <Label htmlFor={`startDate-${exp.id}`}>Start Date</Label>
                                      <Input
                                        id={`startDate-${exp.id}`}
                                        type="month"
                                        value={exp.startDate}
                                        onChange={(e) => updateWorkExperience(exp.id, "startDate", e.target.value)}
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <Label htmlFor={`endDate-${exp.id}`}>End Date</Label>
                                        <div className="flex items-center gap-1 text-xs">
                                          <input
                                            type="checkbox"
                                            id={`current-${exp.id}`}
                                            checked={exp.current}
                                            onChange={(e) => updateWorkExperience(exp.id, "current", e.target.checked)}
                                            className="mr-1"
                                          />
                                          <label htmlFor={`current-${exp.id}`}>Current</label>
                                        </div>
                                      </div>

                                      <Input
                                        id={`endDate-${exp.id}`}
                                        type="month"
                                        value={exp.current ? "" : exp.endDate}
                                        onChange={(e) => updateWorkExperience(exp.id, "endDate", e.target.value)}
                                        disabled={exp.current}
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-4 space-y-2">
                                  <Label htmlFor={`description-${exp.id}`}>Description</Label>
                                  <Textarea
                                    id={`description-${exp.id}`}
                                    placeholder="Describe your responsibilities and achievements..."
                                    value={exp.description}
                                    onChange={(e) => updateWorkExperience(exp.id, "description", e.target.value)}
                                    rows={3}
                                  />
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

                <Button onClick={addWorkExperience} variant="outline" className="w-full flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Work Experience
                </Button>

                <div className="bg-muted/30 rounded-lg p-4 border border-muted">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-[#6E56CF]" />
                    Tips for Work Experience
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                    <li>Use action verbs to describe your responsibilities</li>
                    <li>Include measurable achievements (e.g., "Improved site performance by 40%")</li>
                    <li>List your experiences in reverse chronological order (most recent first)</li>
                    <li>Tailor your descriptions to match the job you're applying for</li>
                  </ul>
                </div>
              </TabsContent>

              {/* Education Section */}
              <TabsContent value="education" className="space-y-4">
                <DragDropContext onDragEnd={handleEducationDragEnd}>
                  <Droppable droppableId="education">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                        {cvData.education.map((edu, index) => (
                          <Draggable key={edu.id} draggableId={edu.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="border rounded-lg p-4 bg-card"
                              >
                                <div className="flex justify-between items-start mb-4">
                                  <h3 className="font-medium">Education {index + 1}</h3>
                                  <div className="flex items-center gap-2">
                                    <div
                                      {...provided.dragHandleProps}
                                      className="cursor-move p-1 hover:bg-muted rounded"
                                    >
                                      <MoveVertical className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeEducation(edu.id)}
                                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`degree-${edu.id}`}>Degree/Certificate</Label>
                                    <Input
                                      id={`degree-${edu.id}`}
                                      placeholder="e.g., BSc Computer Science"
                                      value={edu.degree}
                                      onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor={`institution-${edu.id}`}>Institution</Label>
                                    <Input
                                      id={`institution-${edu.id}`}
                                      placeholder="e.g., University of Cape Town"
                                      value={edu.institution}
                                      onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor={`location-${edu.id}`}>Location</Label>
                                    <Input
                                      id={`location-${edu.id}`}
                                      placeholder="e.g., Cape Town"
                                      value={edu.location}
                                      onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-2">
                                      <Label htmlFor={`startDate-${edu.id}`}>Start Date</Label>
                                      <Input
                                        id={`startDate-${edu.id}`}
                                        type="month"
                                        value={edu.startDate}
                                        onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor={`endDate-${edu.id}`}>End Date</Label>
                                      <Input
                                        id={`endDate-${edu.id}`}
                                        type="month"
                                        value={edu.endDate}
                                        onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-4 space-y-2">
                                  <Label htmlFor={`description-${edu.id}`}>Description (Optional)</Label>
                                  <Textarea
                                    id={`description-${edu.id}`}
                                    placeholder="Describe your studies, achievements, etc..."
                                    value={edu.description}
                                    onChange={(e) => updateEducation(edu.id, "description", e.target.value)}
                                    rows={3}
                                  />
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

                <Button onClick={addEducation} variant="outline" className="w-full flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Education
                </Button>

                <div className="bg-muted/30 rounded-lg p-4 border border-muted">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-[#6E56CF]" />
                    Tips for Education
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                    <li>Include relevant certifications and courses</li>
                    <li>Mention academic achievements and honors</li>
                    <li>For South African qualifications, include NQF levels if applicable</li>
                    <li>List your education in reverse chronological order</li>
                  </ul>
                </div>
              </TabsContent>

              {/* Skills Section */}
              <TabsContent value="skills" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Your Skills</Label>
                    <div className="flex flex-wrap gap-2 p-4 border rounded-lg min-h-24">
                      {cvData.skills.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Add skills to showcase your expertise</p>
                      ) : (
                        cvData.skills.map((skill) => (
                          <Badge
                            key={skill.id}
                            variant="secondary"
                            className="px-3 py-1 flex items-center gap-1 bg-[#6E56CF]/10"
                          >
                            {skill.name}
                            <button onClick={() => removeSkill(skill.id)} className="ml-1 hover:text-destructive">
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customSkill">Add Custom Skill</Label>
                      <div className="flex gap-2">
                        <Input
                          id="customSkill"
                          placeholder="e.g., Project Management"
                          value={customSkill}
                          onChange={(e) => setCustomSkill(e.target.value)}
                        />
                        <Button onClick={addCustomSkill} variant="outline" className="shrink-0">
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Suggested Skills from Your Learning Path</h3>
                    <div className="flex flex-wrap gap-2">
                      {skillSuggestions.map((skill) => (
                        <Badge
                          key={skill.id}
                          variant="outline"
                          className="px-3 py-1 cursor-pointer hover:bg-primary/10 transition-colors"
                          onClick={() => addSkill(skill)}
                        >
                          + {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4 border border-muted">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-[#6E56CF]" />
                      ATS Optimization Tips
                    </h3>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Your CV is <span className="font-medium text-[#6E56CF]">{atsScore}%</span> ATS-friendly.
                      </p>
                      <Progress value={atsScore} className="h-2" indicatorColor="bg-[#6E56CF]" />
                      <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                        <li>Include skills that match the job description</li>
                        <li>Use both technical skills and soft skills</li>
                        <li>Avoid using graphics or special characters</li>
                        <li>Use standard section headings</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Save Draft</Button>
            <Button className="bg-[#6E56CF] hover:bg-[#5842b5]" onClick={() => setShowPreview(!showPreview)}>
              {showPreview ? "Hide Preview" : "Preview CV"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Right Column - Preview and Templates */}
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>CV Template</CardTitle>
            <CardDescription>Choose a template for your CV</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div
                  className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                    activeTemplate === "modern" ? "ring-2 ring-[#6E56CF]" : "hover:border-[#6E56CF]/50"
                  }`}
                  onClick={() => setActiveTemplate("modern")}
                >
                  <div className="h-4 bg-[#6E56CF]"></div>
                  <div className="p-2">
                    <div className="h-2 w-3/4 bg-gray-200 rounded mb-1"></div>
                    <div className="h-2 w-1/2 bg-gray-200 rounded"></div>
                  </div>
                  <div className="p-1 text-center text-xs font-medium">Modern</div>
                </div>

                <div
                  className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                    activeTemplate === "classic" ? "ring-2 ring-[#6E56CF]" : "hover:border-[#6E56CF]/50"
                  }`}
                  onClick={() => setActiveTemplate("classic")}
                >
                  <div className="h-4 bg-[#2C3E50]"></div>
                  <div className="p-2">
                    <div className="h-2 w-3/4 bg-gray-200 rounded mb-1"></div>
                    <div className="h-2 w-1/2 bg-gray-200 rounded"></div>
                  </div>
                  <div className="p-1 text-center text-xs font-medium">Classic</div>
                </div>

                <div
                  className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                    activeTemplate === "minimalist" ? "ring-2 ring-[#6E56CF]" : "hover:border-[#6E56CF]/50"
                  }`}
                  onClick={() => setActiveTemplate("minimalist")}
                >
                  <div className="h-1 bg-black"></div>
                  <div className="p-2">
                    <div className="h-2 w-3/4 bg-gray-200 rounded mb-1"></div>
                    <div className="h-2 w-1/2 bg-gray-200 rounded"></div>
                  </div>
                  <div className="p-1 text-center text-xs font-medium">Minimalist</div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-2">Export Options</h3>
                <div className="flex gap-2">
                  <Button variant="outline" className="w-full flex items-center gap-2" disabled>
                    <Download className="h-4 w-4" />
                    PDF
                  </Button>
                  <Button variant="outline" className="w-full flex items-center gap-2" disabled>
                    <Download className="h-4 w-4" />
                    Word
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">Download feature coming soon!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {showPreview && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>CV Preview</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowPreview(false)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden h-[600px]">
                <PDFViewer width="100%" height="100%" className="border-0">
                  <CVDocument />
                </PDFViewer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
