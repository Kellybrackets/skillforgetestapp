import { InterviewConfiguration } from "@/components/interview-configuration"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create Interview - SkillForge",
  description: "Configure and generate personalized interview questions tailored to your role and experience level.",
}

export default function AIInterviewPrep() {
  // In a real app, you might get these from:
  // - URL parameters
  // - User session/profile
  // - Form submission from previous page
  
  const defaultUserName = "Candidate"
  const defaultRole = "Frontend Developer"
  const defaultInterviewType = "technical" as const

  return (
    <InterviewConfiguration
      userName={defaultUserName}
      role={defaultRole}
      interviewType={defaultInterviewType}
    />
  )
}