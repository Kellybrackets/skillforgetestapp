"use client"

import { useVapi, type ChatMessage } from "@/lib/vapi/hooks"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Settings, Brain, Wand2, CheckCircle, ArrowRight, Loader2 } from "lucide-react"
import { VapiDebugPanel } from "@/components/vapi-debug-panel"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface InterviewConfigurationProps {
  userName: string;
  userImage?: string;
  interviewType: "technical" | "behavioral";
  role: string;
}

export function InterviewConfiguration({
  userName,
  userImage,
  interviewType,
  role
}: InterviewConfigurationProps) {
  const router = useRouter()
  const [isCompleted, setIsCompleted] = useState(false)
  const [generatedData, setGeneratedData] = useState<any>(null)
  
  const {
    callStatus,
    messages,
    isSpeaking,
    isRecording,
    currentTranscript,
    startInterview,
    stopInterview,
    toggleRecording,
    mounted
  } = useVapi({
    workflowId: process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID,
    userData: { userName, role, interviewType }
  });

  // Monitor for completion
  useEffect(() => {
    // Check if the configuration conversation is complete
    const lastMessage = messages[messages.length - 1]
    if (lastMessage && lastMessage.role === "assistant" && 
        (lastMessage.content.toLowerCase().includes("interview generated") ||
         lastMessage.content.toLowerCase().includes("questions ready") ||
         messages.length > 10)) { // Fallback: assume completion after several exchanges
      
      // Extract configuration data from messages
      const configData = extractConfigurationData(messages)
      setGeneratedData(configData)
      setIsCompleted(true)
    }
  }, [messages])

  const extractConfigurationData = (messages: ChatMessage[]) => {
    // Extract collected information from conversation
    return {
      id: `interview_${Date.now()}`,
      title: `${role} Interview`,
      type: interviewType,
      role: role,
      level: "Mid-level", // Would be extracted from conversation
      techStack: "Full Stack", // Would be extracted from conversation
      questionCount: 5, // Would be extracted from conversation
      createdAt: new Date(),
      status: "ready"
    }
  }

  const handleViewDashboard = () => {
    // Store generated interview data
    if (generatedData) {
      const existingInterviews = JSON.parse(localStorage.getItem('generatedInterviews') || '[]')
      existingInterviews.push(generatedData)
      localStorage.setItem('generatedInterviews', JSON.stringify(existingInterviews))
    }
    
    router.push('/career-forge/dashboard')
  }

  if (!mounted) {
    return null;
  }

  // Completion Success State
  if (isCompleted && generatedData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <div className="container mx-auto px-4 py-16">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-green-700 dark:text-green-300 mb-2">
              Interview Generated Successfully!
            </h1>
            <p className="text-lg text-muted-foreground">
              Your personalized {generatedData.role} interview is ready
            </p>
          </div>

          {/* Generated Interview Summary */}
          <Card className="max-w-2xl mx-auto mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                Interview Configuration Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Role</p>
                  <p className="text-lg">{generatedData.role}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  <Badge variant="secondary" className="capitalize">
                    {generatedData.type}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Experience Level</p>
                  <p>{generatedData.level}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Questions</p>
                  <p>{generatedData.questionCount} questions</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Tech Focus</p>
                <Badge variant="outline">{generatedData.techStack}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="text-center">
            <p className="text-muted-foreground mb-6">
              Your interview has been saved to your dashboard. You can start practicing whenever you're ready!
            </p>
            
            <div className="flex justify-center gap-4">
              <Button 
                onClick={handleViewDashboard}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                View in Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                size="lg"
              >
                Create Another Interview
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main Configuration Interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
      <div className="container mx-auto px-4 py-16">
        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center space-x-8 mb-8">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <span className="ml-2 font-medium text-blue-600">Configure Interview</span>
            </div>
            <div className="w-8 h-1 bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 text-gray-500 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <span className="ml-2 text-gray-500">Review & Save</span>
            </div>
            <div className="w-8 h-1 bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 text-gray-500 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <span className="ml-2 text-gray-500">Conduct Interview</span>
            </div>
          </div>
        </div>

        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Create Your Custom Interview</h1>
          <p className="text-xl text-muted-foreground mb-4">
            Step 1 of 3: Configure Your Interview
          </p>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our AI assistant will ask you questions to generate personalized interview content. 
            This process takes 2-3 minutes and creates questions tailored to your role and experience.
          </p>
        </div>

        {/* Configuration Assistant Cards */}
        <div className="flex justify-center gap-16 mb-12">
          {/* AI Configuration Assistant Card */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-purple-300">
                <Brain className="w-8 h-8" />
              </div>
              {/* Speaking indicator */}
              {isSpeaking && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-500 rounded-full animate-pulse ring-4 ring-purple-200">
                  <Wand2 className="w-3 h-3 text-white m-1.5" />
                </div>
              )}
            </div>
            <span className="mt-3 font-medium text-lg">Interview Configuration Assistant</span>
            <span className="text-sm text-muted-foreground">
              {callStatus === "idle" && "Ready to configure"}
              {callStatus === "connecting" && "Initializing..."}
              {callStatus === "active" && isSpeaking && "Asking configuration questions"}
              {callStatus === "active" && !isSpeaking && "Listening for your response"}
              {callStatus === "ended" && "Configuration complete"}
            </span>
          </div>

          {/* User Card */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-blue-300">
                {userName.charAt(0).toUpperCase()}
              </div>
              {/* Recording indicator */}
              {isRecording && callStatus === "active" && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full animate-pulse ring-4 ring-red-200">
                  <Settings className="w-3 h-3 text-white m-1.5" />
                </div>
              )}
            </div>
            <span className="mt-3 font-medium text-lg">{userName}</span>
            <span className="text-sm text-muted-foreground">
              {callStatus === "active" && isRecording ? "Providing details..." : "You"}
            </span>
          </div>
        </div>

        {/* Configuration Controls */}
        <div className="flex justify-center items-center gap-4 mb-8">
          {/* Main Generation Button */}
          <div className="relative">
            <Button
              onClick={callStatus === "active" ? stopInterview : startInterview}
              size="lg"
              disabled={callStatus === "connecting"}
              className={`relative px-8 py-4 text-lg font-medium rounded-full ${
                callStatus === "active" 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {callStatus === "connecting" && (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              )}
              {callStatus === "idle" && (
                <>
                  <Wand2 className="w-5 h-5 mr-2" />
                  Generate Interview Questions
                </>
              )}
              {callStatus === "connecting" && "Initializing..."}
              {callStatus === "active" && (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Complete Configuration
                </>
              )}
            </Button>
            
            {/* Progress animation when active */}
            {callStatus === "connecting" && (
              <span className="absolute inset-0 rounded-full bg-purple-500 animate-ping opacity-30" />
            )}
          </div>
        </div>

        {/* Status and Progress */}
        <div className="text-center mb-8">
          <div className="max-w-md mx-auto">
            {callStatus === "connecting" && (
              <>
                <Progress value={30} className="mb-2" />
                <p className="text-sm text-muted-foreground">Connecting to configuration assistant...</p>
              </>
            )}
            {callStatus === "active" && (
              <>
                <Progress value={60 + (messages.length * 5)} className="mb-2" />
                <p className="text-sm text-muted-foreground">
                  Configuration in progress • {messages.length} responses collected
                </p>
              </>
            )}
            {callStatus === "idle" && (
              <p className="text-muted-foreground">
                Click "Generate Interview Questions" to begin the configuration process
              </p>
            )}
          </div>
        </div>

        {/* Configuration Conversation */}
        <Card className="max-w-4xl mx-auto mb-8">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
            <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
              <Settings className="w-5 h-5" />
              Configuration Conversation
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Answer the assistant's questions to generate your personalized interview
            </p>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <Brain className="w-12 h-12 text-purple-300 mx-auto mb-4" />
                  <p className="text-muted-foreground italic">
                    {callStatus === "idle" 
                      ? "Ready to start your interview configuration..." 
                      : "Waiting for the configuration assistant to begin..."}
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-lg ${
                        message.role === "user"
                          ? "bg-blue-500 text-white ml-4"
                          : "bg-purple-100 dark:bg-purple-900/30 text-foreground mr-4"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <span className="text-xs opacity-70 mt-1 block">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              {/* Show current transcript while user is speaking */}
              {currentTranscript && (
                <div className="flex justify-end">
                  <div className="max-w-[80%] px-4 py-3 rounded-lg bg-blue-300 text-blue-800 ml-4">
                    <p className="text-sm italic">{currentTranscript}...</p>
                    <span className="text-xs opacity-70">Speaking...</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* What Happens Next */}
        {callStatus === "idle" && (
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-blue-700 dark:text-blue-300">
                What to Expect in This Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2 text-purple-600 dark:text-purple-400">
                    Questions You'll Be Asked:
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Your name and role details</li>
                    <li>• Interview type preference (technical/behavioral)</li>
                    <li>• Your experience level</li>
                    <li>• Specific technologies to focus on</li>
                    <li>• Number of questions to generate</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-blue-600 dark:text-blue-400">
                    After Configuration:
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Personalized questions will be generated</li>
                    <li>• Interview saved to your dashboard</li>
                    <li>• Ready for practice whenever you want</li>
                    <li>• Can create multiple interview variations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Debug Panel */}
      <VapiDebugPanel />
    </div>
  );
}