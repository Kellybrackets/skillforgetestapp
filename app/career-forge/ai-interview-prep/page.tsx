"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Phone, PhoneOff, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

enum CallStatus {
  IDLE = 'idle',
  CONNECTING = 'connecting',
  ACTIVE = 'active',
  ENDED = 'ended'
}

export default function AIInterviewPrep() {
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.IDLE)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [lastMessage, setLastMessage] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCall = () => {
    if (callStatus === CallStatus.IDLE) {
      setCallStatus(CallStatus.CONNECTING)
      // Simulate connection delay
      setTimeout(() => {
        setCallStatus(CallStatus.ACTIVE)
        setLastMessage("Hello! I'm your AI interviewer. Let's start with a simple question: Can you tell me about yourself and your experience with frontend development?")
        // Simulate AI speaking
        setTimeout(() => setIsSpeaking(true), 500)
        setTimeout(() => setIsSpeaking(false), 3000)
      }, 1500)
    } else if (callStatus === CallStatus.ACTIVE) {
      setCallStatus(CallStatus.ENDED)
      setLastMessage("")
      setTimeout(() => setCallStatus(CallStatus.IDLE), 1000)
    }
  }

  const handleRepeat = () => {
    if (lastMessage && callStatus === CallStatus.ACTIVE) {
      setIsSpeaking(true)
      setTimeout(() => setIsSpeaking(false), 2000)
    }
  }

  const handleLeave = () => {
    setCallStatus(CallStatus.ENDED)
    setLastMessage("")
    setTimeout(() => setCallStatus(CallStatus.IDLE), 1000)
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold">PrepWise</h1>
          <h2 className="text-xl mt-2">Frontend Developer Interview</h2>
          <p className="text-muted-foreground">Technical Interview</p>
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
          </div>

          {/* User Card */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-2xl font-bold border-2 border-gray-300">
              U
            </div>
            <span className="mt-2 font-medium">You</span>
          </div>
        </div>

        {/* Call Controls */}
        <div className="flex justify-center items-center gap-4 mb-8">
          {/* Repeat Button */}
          <Button
            variant="secondary" 
            onClick={handleRepeat}
            disabled={!lastMessage || callStatus !== CallStatus.ACTIVE}
            className="flex items-center gap-2 px-4 py-2 rounded-full"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Repeat</span>
          </Button>

          {/* Main Call Button */}
          <div className="relative">
            <Button
              onClick={handleCall}
              size="lg"
              className={`relative w-14 h-14 rounded-full p-0 ${
                callStatus === CallStatus.ACTIVE 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-green-500 hover:bg-green-600'
              }`}
              disabled={callStatus === CallStatus.CONNECTING || callStatus === CallStatus.ENDED}
            >
              {callStatus === CallStatus.ACTIVE ? (
                <PhoneOff className="text-white w-6 h-6" />
              ) : (
                <Phone className="text-white w-6 h-6" />
              )}
            </Button>
            
            {/* Ripple effect when connecting */}
            {callStatus === CallStatus.CONNECTING && (
              <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
            )}
          </div>

          {/* Leave Button */}
          <Button 
            variant="destructive" 
            onClick={handleLeave}
            disabled={callStatus !== CallStatus.ACTIVE}
            className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-full border border-red-200"
          >
            Leave
          </Button>
        </div>

        {/* Status Indicator */}
        <div className="text-center mb-6">
          <span className={`text-sm font-medium ${
            callStatus === CallStatus.IDLE ? 'text-gray-500' :
            callStatus === CallStatus.CONNECTING ? 'text-yellow-600' :
            callStatus === CallStatus.ACTIVE ? 'text-green-600' :
            'text-gray-500'
          }`}>
            {callStatus === CallStatus.IDLE && 'Ready to start'}
            {callStatus === CallStatus.CONNECTING && 'Connecting...'}
            {callStatus === CallStatus.ACTIVE && 'Interview in progress'}
            {callStatus === CallStatus.ENDED && 'Interview ended'}
          </span>
        </div>

        {/* Real-Time Transcript */}
        <div className="bg-card border rounded-lg p-6 min-h-24 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Live Transcript</h3>
          {lastMessage ? (
            <p className="text-foreground leading-relaxed animate-in fade-in duration-300">
              {lastMessage}
            </p>
          ) : (
            <p className="text-muted-foreground italic">
              {callStatus === CallStatus.IDLE 
                ? "Click the call button to start your interview..." 
                : "Waiting for first question..."}
            </p>
          )}
        </div>

        {/* Instructions */}
        {callStatus === CallStatus.IDLE && (
          <div className="mt-8 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium mb-2">Interview Instructions</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Ensure you're in a quiet environment</li>
              <li>• Speak clearly and at a normal pace</li>
              <li>• Use the "Repeat" button if you need to hear a question again</li>
              <li>• Click "Leave" to end the interview at any time</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}