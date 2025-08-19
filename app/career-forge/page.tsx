import { Mic, FileText, Scan } from "lucide-react"
import FeatureCard from "@/components/FeatureCard"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "CareerForge Studio - Your Unified Career Toolkit",
  description: "Access AI-powered career tools including interview prep, CV builder, and ATS scanner to advance your professional journey.",
}

export default function CareerForgeStudio() {
  const features = [
    {
      title: "AI Interview Creator",
      description: "Generate personalized interview questions tailored to your role, then practice with AI-powered mock interviews.",
      icon: <Mic className="w-8 h-8" />,
      comingSoon: false,
      href: "/career-forge/ai-interview-prep",
    },
    {
      title: "CV Builder",
      description: "Create and optimize your resume with professional templates and AI-powered suggestions.",
      icon: <FileText className="w-8 h-8" />,
      comingSoon: true,
    },
    {
      title: "ATS Scanner",
      description: "Check resume compatibility with Applicant Tracking Systems and optimize for better visibility.",
      icon: <Scan className="w-8 h-8" />,
      comingSoon: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            CareerForge Studio
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your Unified Career Toolkit
          </p>
          <div className="w-24 h-1 bg-primary rounded-full mx-auto mt-8"></div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="text-center mt-16">
          <div className="bg-card border rounded-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
            <p className="text-muted-foreground leading-relaxed">
              We're building powerful AI-driven tools to help you excel in your career journey. 
              Each feature will be designed to provide personalized insights and actionable recommendations 
              to help you land your dream job.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}