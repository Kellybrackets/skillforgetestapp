import { InterviewInterface } from "@/components/interview-interface"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Interview Prep - PrepWise",
  description: "Practice your interview skills with AI-powered mock interviews tailored to your role and experience level.",
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
    <InterviewInterface
      userName={defaultUserName}
      role={defaultRole}
      interviewType={defaultInterviewType}
    />
  )
}