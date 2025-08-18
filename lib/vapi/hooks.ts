import { useState, useEffect, useCallback } from "react";
import { vapi } from "./sdk";

export type CallStatus = "idle" | "connecting" | "active" | "ended";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface UseVapiParams {
  workflowId?: string;
  userData: {
    userName: string;
    role: string;
    interviewType?: 'technical' | 'behavioral';
  };
}

export function useVapi({ workflowId, userData }: UseVapiParams) {
  const [callStatus, setCallStatus] = useState<CallStatus>("idle");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Add message to chat
  const addMessage = useCallback((role: "user" | "assistant", content: string) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, message]);
  }, []);

  // Vapi event handlers
  useEffect(() => {
    if (!mounted) return;
    
    // Check if vapi is properly initialized (not a mock object)
    if (typeof window === "undefined" || !vapi.on) {
      return;
    }

    const handleCallStart = () => {
      console.log("📞 Call started");
      setCallStatus("active");
      addMessage("assistant", "Hello! I'm your AI interviewer. Let's begin with a simple question: Can you tell me about yourself and your experience?");
    };

    const handleCallEnd = () => {
      console.log("📞 Call ended");
      setCallStatus("ended");
      setIsSpeaking(false);
      setIsRecording(false);
      setTimeout(() => setCallStatus("idle"), 1000);
    };

    const handleSpeechStart = () => {
      console.log("🗣️ AI started speaking");
      setIsSpeaking(true);
    };

    const handleSpeechEnd = () => {
      console.log("🤐 AI stopped speaking");
      setIsSpeaking(false);
    };

    const handleTranscriptUpdate = (transcript: any) => {
      console.log("📝 Transcript update:", transcript);
      
      if (transcript.transcriptType === "final") {
        if (transcript.role === "user") {
          addMessage("user", transcript.transcript);
        }
        setCurrentTranscript("");
      } else {
        // Partial transcript
        setCurrentTranscript(transcript.transcript || "");
      }
    };

    const handleMessage = (message: any) => {
      console.log("💬 Vapi message:", message);
      
      if (message.type === "assistant-message") {
        addMessage("assistant", message.content);
      }
    };

    const handleError = (error: any) => {
      console.error("❌ Vapi error:", error);
      setCallStatus("idle");
      addMessage("assistant", "Sorry, there was an error with the interview. Please try again.");
    };

    // Add event listeners
    vapi.on("call-start", handleCallStart);
    vapi.on("call-end", handleCallEnd);
    vapi.on("speech-start", handleSpeechStart);
    vapi.on("speech-end", handleSpeechEnd);
    vapi.on("transcript", handleTranscriptUpdate);
    vapi.on("message", handleMessage);
    vapi.on("error", handleError);

    // Cleanup
    return () => {
      vapi.off("call-start", handleCallStart);
      vapi.off("call-end", handleCallEnd);
      vapi.off("speech-start", handleSpeechStart);
      vapi.off("speech-end", handleSpeechEnd);
      vapi.off("transcript", handleTranscriptUpdate);
      vapi.off("message", handleMessage);
      vapi.off("error", handleError);
    };
  }, [mounted, addMessage]);

  const startInterview = useCallback(async () => {
    if (callStatus !== "idle") return;

    // Check if vapi is properly initialized
    if (typeof window === "undefined" || !vapi.start) {
      console.error("Vapi not properly initialized");
      addMessage("assistant", "Voice service not available. Please refresh the page and try again.");
      return;
    }

    setCallStatus("connecting");
    setMessages([]); // Clear previous messages
    
    try {
      console.log("🚀 Starting interview with Vapi...");
      
      // Use the workflow ID or create a basic call
      if (workflowId && workflowId !== "your_vapi_workflow_id_here") {
        await vapi.start(workflowId, {
          variableValues: {
            username: userData.userName,
            role: userData.role,
            interview_type: userData.interviewType || 'technical'
          }
        });
      } else {
        // Start with a basic assistant configuration
        await vapi.start({
          model: {
            provider: "openai",
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: `You are an AI interviewer conducting a ${userData.interviewType || 'technical'} interview for a ${userData.role} position. 
                
                Interview Guidelines:
                - Start with a warm greeting and ask the candidate to introduce themselves
                - Ask relevant ${userData.interviewType || 'technical'} questions appropriate for a ${userData.role}
                - Keep questions conversational and engaging
                - Provide brief follow-up questions based on their responses
                - Be encouraging and professional
                - Keep responses concise since this is a voice conversation
                
                The candidate's name is ${userData.userName}. Begin the interview now.`
              }
            ]
          },
          voice: {
            provider: "elevenlabs",
            voiceId: "21m00Tcm4TlvDq8ikWAM" // Rachel voice
          }
        });
      }
    } catch (error) {
      console.error("Failed to start interview:", error);
      setCallStatus("idle");
      addMessage("assistant", "Failed to start the interview. Please check your internet connection and try again.");
    }
  }, [callStatus, workflowId, userData, addMessage]);

  const stopInterview = useCallback(() => {
    console.log("⏹️ Stopping interview");
    
    // Check if vapi is properly initialized
    if (typeof window !== "undefined" && vapi.stop) {
      vapi.stop();
    }
  }, []);

  const toggleRecording = useCallback(() => {
    if (callStatus === "active") {
      setIsRecording(prev => !prev);
      // Note: Vapi handles recording automatically, this is just for UI state
    }
  }, [callStatus]);

  return {
    callStatus,
    messages,
    isSpeaking,
    isRecording,
    currentTranscript,
    startInterview,
    stopInterview,
    toggleRecording,
    mounted
  };
}