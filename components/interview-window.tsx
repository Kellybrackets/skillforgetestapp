"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Mic, MicOff, Send } from "lucide-react"

interface Message {
  role: "user" | "interviewer"
  content: string
  timestamp: Date
}

interface InterviewWindowProps {
  role: string
  mode: "text" | "voice"
  onComplete: () => void
}

// Mock interview questions for different roles
const mockInterviewFlow = {
  "Graphic Designer": [
    "Tell me about your experience as a graphic designer.",
    "How would you approach designing a logo for a South African tourism company?",
    "Can you walk me through your design process from brief to final delivery?",
    "How do you handle client feedback that contradicts best design practices?",
    "What's your approach to pricing design projects of varying complexity?",
  ],
  "Web Developer": [
    "Tell me about your experience as a web developer.",
    "How would you optimize a website for South African internet conditions?",
    "What's your approach to making websites accessible to diverse South African users?",
    "How do you handle projects with tight deadlines?",
    "What's your experience with e-commerce solutions for the South African market?",
  ],
  "Content Writer": [
    "Tell me about your experience as a content writer.",
    "How do you adapt your writing style for different South African audiences?",
    "What's your research process for writing about unfamiliar topics?",
    "How do you handle clients who request multiple revisions?",
    "What's your approach to SEO writing for local South African businesses?",
  ],
  "Digital Marketer": [
    "Tell me about your experience as a digital marketer.",
    "How would you approach marketing to South African audiences?",
    "What social media platforms do you think work best for the South African market?",
    "How do you measure the success of a digital marketing campaign?",
    "How do you stay updated with the latest digital marketing trends?",
  ],
  "UI/UX Designer": [
    "Tell me about your experience as a UI/UX designer.",
    "How do you ensure your designs are accessible to all users?",
    "Walk me through your process for user research and testing.",
    "How do you balance aesthetic design with usability?",
    "How do you handle stakeholder feedback that contradicts user research?",
  ],
  "AI Consultant": [
    "Tell me about your experience as an AI consultant.",
    "How would you explain complex AI concepts to non-technical clients?",
    "What AI solutions do you think are most relevant for South African businesses?",
    "How do you approach AI ethics and responsible implementation?",
    "How do you stay updated with the rapidly evolving AI landscape?",
  ],
}

export function InterviewWindow({ role, mode, onComplete }: InterviewWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [isInterviewComplete, setIsInterviewComplete] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Get questions for the selected role, defaulting to Graphic Designer if not found
  const questions = mockInterviewFlow[role as keyof typeof mockInterviewFlow] || mockInterviewFlow["Graphic Designer"]

  // Initialize interview with introduction
  useEffect(() => {
    const initialMessage: Message = {
      role: "interviewer",
      content: `Hello! I'm your AI interviewer for the ${role} position. I'll be asking you a series of questions to help you practice for real client interviews. Let's begin with the first question: ${questions[0]}`,
      timestamp: new Date(),
    }

    setMessages([initialMessage])
    setCurrentQuestion(1) // Set to 1 since we've already asked the first question
  }, [role, questions])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle sending a message
  const handleSendMessage = () => {
    if (input.trim() === "") return

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate AI response after a delay
    setTimeout(() => {
      if (currentQuestion < questions.length) {
        const interviewerMessage: Message = {
          role: "interviewer",
          content: questions[currentQuestion],
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, interviewerMessage])
        setCurrentQuestion((prev) => prev + 1)
      } else {
        // Interview is complete
        const finalMessage: Message = {
          role: "interviewer",
          content:
            "Thank you for completing this mock interview! I'll now analyze your responses and provide you with feedback.",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, finalMessage])
        setIsInterviewComplete(true)

        // Notify parent component after a delay
        setTimeout(() => {
          onComplete()
        }, 2000)
      }
    }, 1000)
  }

  // Handle voice recording (mock implementation)
  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording and simulate a response
      setIsRecording(false)
      setInput(
        "This is a simulated voice response for demonstration purposes. In a real implementation, this would be the transcribed text from your voice recording.",
      )
    } else {
      // Start recording
      setIsRecording(true)
    }
  }

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden">
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="AI Interviewer" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">AI Interviewer</h3>
            <p className="text-xs text-muted-foreground">Simulating a {role} interview</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <p>{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        {!isInterviewComplete && (
          <div className="flex items-end gap-2">
            {mode === "voice" ? (
              <Button
                variant={isRecording ? "destructive" : "outline"}
                size="icon"
                className="rounded-full"
                onClick={toggleRecording}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            ) : null}

            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === "text" ? "Type your response..." : "Voice transcription will appear here..."}
              className="flex-1 min-h-[80px]"
              disabled={mode === "voice" && isRecording}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
            />

            <Button onClick={handleSendMessage} disabled={input.trim() === ""} className="rounded-full h-10 w-10 p-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
