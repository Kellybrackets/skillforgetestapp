"use client"

import { useVapi, type ChatMessage } from "@/lib/vapi/hooks"
import { Button } from "@/components/ui/button"
import { Phone, PhoneOff, RotateCcw, Mic, MicOff } from "lucide-react"

interface InterviewInterfaceProps {
  userName: string;
  userImage?: string;
  interviewType: "technical" | "behavioral";
  role: string;
}

export function InterviewInterface({
  userName,
  userImage,
  interviewType,
  role
}: InterviewInterfaceProps) {
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

  if (!mounted) {
    return null;
  }

  const handleRepeat = () => {
    if (messages.length > 0 && callStatus === "active") {
      // Get the last AI message and speak it again
      const lastAIMessage = messages.filter(msg => msg.role === "assistant").pop();
      if (lastAIMessage) {
        // Note: In a real implementation, you might want to use Vapi's repeat functionality
        console.log("Repeating last message:", lastAIMessage.content);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold">PrepWise</h1>
          <h2 className="text-xl mt-2">{role} Interview</h2>
          <p className="text-muted-foreground capitalize">{interviewType} Interview</p>
        </div>

        {/* Participant Cards */}
        <div className="flex justify-center gap-16 mb-12">
          {/* AI Interviewer Card */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold border-2 border-blue-500">
                AI
              </div>
              {/* Pulsating dot when AI speaks */}
              {isSpeaking && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse ring-2 ring-green-200" />
              )}
            </div>
            <span className="mt-2 font-medium">AI Interviewer</span>
            <span className="text-xs text-muted-foreground">
              {isSpeaking ? "Speaking..." : "Listening"}
            </span>
          </div>

          {/* User Card */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-2xl font-bold border-2 border-gray-300">
                {userName.charAt(0).toUpperCase()}
              </div>
              {/* Recording indicator */}
              {isRecording && callStatus === "active" && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse ring-2 ring-red-200" />
              )}
            </div>
            <span className="mt-2 font-medium">{userName}</span>
            <span className="text-xs text-muted-foreground">
              {callStatus === "active" && isRecording ? "Speaking..." : "You"}
            </span>
          </div>
        </div>

        {/* Call Controls */}
        <div className="flex justify-center items-center gap-4 mb-8">
          {/* Repeat Button */}
          <Button
            variant="secondary" 
            onClick={handleRepeat}
            disabled={messages.filter(m => m.role === "assistant").length === 0 || callStatus !== "active"}
            className="flex items-center gap-2 px-4 py-2 rounded-full"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Repeat</span>
          </Button>

          {/* Main Call Button */}
          <div className="relative">
            <Button
              onClick={callStatus === "active" ? stopInterview : startInterview}
              size="lg"
              className={`relative w-14 h-14 rounded-full p-0 ${
                callStatus === "active" 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-green-500 hover:bg-green-600'
              }`}
              disabled={callStatus === "connecting"}
            >
              {callStatus === "active" ? (
                <PhoneOff className="text-white w-6 h-6" />
              ) : (
                <Phone className="text-white w-6 h-6" />
              )}
            </Button>
            
            {/* Ripple effect when connecting */}
            {callStatus === "connecting" && (
              <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
            )}
          </div>

          {/* Microphone Toggle */}
          <Button 
            variant="outline" 
            onClick={toggleRecording}
            disabled={callStatus !== "active"}
            className={`px-4 py-2 rounded-full border-2 ${
              isRecording && callStatus === "active"
                ? 'border-red-500 text-red-600 bg-red-50' 
                : 'border-gray-200'
            }`}
          >
            {isRecording && callStatus === "active" ? (
              <MicOff className="w-4 h-4 mr-2" />
            ) : (
              <Mic className="w-4 h-4 mr-2" />
            )}
            {isRecording && callStatus === "active" ? 'Mute' : 'Mic'}
          </Button>
        </div>

        {/* Status Indicator */}
        <div className="text-center mb-6">
          <span className={`text-sm font-medium ${
            callStatus === "idle" ? 'text-gray-500' :
            callStatus === "connecting" ? 'text-yellow-600' :
            callStatus === "active" ? 'text-green-600' :
            'text-gray-500'
          }`}>
            {callStatus === "idle" && 'Ready to start'}
            {callStatus === "connecting" && 'Connecting to AI interviewer...'}
            {callStatus === "active" && 'Interview in progress'}
            {callStatus === "ended" && 'Interview ended'}
          </span>
        </div>

        {/* Chat Messages */}
        <div className="bg-card border rounded-lg shadow-sm max-w-4xl mx-auto">
          <div className="p-4 border-b bg-muted/30">
            <h3 className="text-sm font-medium text-muted-foreground">Interview Conversation</h3>
          </div>
          
          <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-muted-foreground italic text-center">
                {callStatus === "idle" 
                  ? "Click the call button to start your interview..." 
                  : "Waiting for the conversation to begin..."}
              </p>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-lg ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground ml-4"
                        : "bg-muted text-foreground mr-4"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <p className="text-sm">{message.content}</p>
                        <span className="text-xs opacity-70">
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
                <div className="max-w-[80%] px-4 py-2 rounded-lg bg-primary/50 text-primary-foreground ml-4">
                  <p className="text-sm italic">{currentTranscript}...</p>
                  <span className="text-xs opacity-70">Speaking...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        {callStatus === "idle" && (
          <div className="mt-8 p-4 bg-muted/30 rounded-lg max-w-4xl mx-auto">
            <h4 className="font-medium mb-2">Interview Instructions</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Ensure you're in a quiet environment with a good microphone</li>
              <li>• Speak clearly and at a normal pace</li>
              <li>• Use the "Repeat" button if you need to hear a question again</li>
              <li>• The AI will ask follow-up questions based on your responses</li>
              <li>• Click the red phone button to end the interview at any time</li>
            </ul>
          </div>
        )}

        {/* Technical Requirements */}
        {callStatus === "idle" && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg max-w-4xl mx-auto">
            <h4 className="font-medium mb-2 text-blue-700 dark:text-blue-300">Before You Start</h4>
            <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
              <li>• Make sure your browser has microphone permissions</li>
              <li>• Use Chrome or Firefox for the best experience</li>
              <li>• Test your microphone before starting the interview</li>
              <li>• The AI will introduce itself and guide you through the process</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}