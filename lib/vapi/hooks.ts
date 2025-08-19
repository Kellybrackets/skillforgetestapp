import { useState, useEffect, useCallback } from "react";
import { vapi } from "./sdk";

export type CallStatus = "idle" | "connecting" | "active" | "ended";

// Audio diagnostics helper
const logAudioDiagnostics = () => {
  if (typeof window === "undefined") return;
  
  console.log("🔊 Audio Diagnostics:");
  console.log("- User Agent:", navigator.userAgent);
  console.log("- Audio Context supported:", typeof window.AudioContext !== "undefined" || typeof window.webkitAudioContext !== "undefined");
  console.log("- Media Devices supported:", !!navigator.mediaDevices);
  console.log("- WebSocket supported:", typeof WebSocket !== "undefined");
  
  // Check Vapi instance
  console.log("- Vapi instance:", !!vapi);
  console.log("- Vapi methods:", vapi ? Object.keys(vapi) : "No vapi instance");
  
  // Environment variables
  console.log("- Vapi Public Key:", process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY ? "Set" : "Missing");
  console.log("- Workflow ID:", process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID || "Not set");
};

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
    // Run audio diagnostics on mount
    setTimeout(() => logAudioDiagnostics(), 1000);
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
      // Don't add a manual message - let the workflow handle the initial greeting
      // Your workflow starts with: "Hey there! How are you? Could I get your name, please?"
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
      console.log("💬 Message type:", message.type);
      console.log("💬 Full message object:", JSON.stringify(message, null, 2));
      
      if (message.type === "assistant-message") {
        addMessage("assistant", message.content);
      }
    };

    const handleError = (error: any) => {
      console.error("❌ Vapi error:", error);
      console.error("❌ Error details:", JSON.stringify(error, null, 2));
      setCallStatus("idle");
      addMessage("assistant", "Sorry, there was an error with the interview. Please try again.");
    };

    // Add additional event handlers for debugging
    const handleVolumeLevel = (volume: any) => {
      console.log("🔊 Volume level:", volume);
    };

    const handleAudioStart = () => {
      console.log("🎵 Audio playback started");
    };

    const handleAudioEnd = () => {
      console.log("🎵 Audio playback ended");
    };

    // Add event listeners
    vapi.on("call-start", handleCallStart);
    vapi.on("call-end", handleCallEnd);
    vapi.on("speech-start", handleSpeechStart);
    vapi.on("speech-end", handleSpeechEnd);
    // Note: transcript event may vary by Vapi SDK version
    try {
      vapi.on("transcript", handleTranscriptUpdate);
    } catch (e) {
      console.log("🔧 Transcript event not available in this SDK version");
    }
    vapi.on("message", handleMessage);
    vapi.on("error", handleError);
    
    // Additional debugging events
    if (vapi.on) {
      try {
        vapi.on("volume-level", handleVolumeLevel);
        vapi.on("audio-start", handleAudioStart);
        vapi.on("audio-end", handleAudioEnd);
        console.log("🔧 Additional debug event listeners added");
      } catch (e) {
        console.log("🔧 Some debug events not available:", e);
      }
    }

    // Cleanup
    return () => {
      vapi.off("call-start", handleCallStart);
      vapi.off("call-end", handleCallEnd);
      vapi.off("speech-start", handleSpeechStart);
      vapi.off("speech-end", handleSpeechEnd);
      vapi.off("transcript", handleTranscriptUpdate);
      vapi.off("message", handleMessage);
      vapi.off("error", handleError);
      
      // Cleanup debug listeners
      try {
        vapi.off("volume-level", handleVolumeLevel);
        vapi.off("audio-start", handleAudioStart);
        vapi.off("audio-end", handleAudioEnd);
      } catch (e) {
        console.log("🔧 Debug cleanup error:", e);
      }
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
      console.log("🔧 Environment check:", {
        publicKey: process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY ? "Set" : "Missing",
        workflowId: workflowId || "Not provided",
        vapiInstance: !!vapi,
        vapiMethods: vapi ? Object.keys(vapi).slice(0, 5) : "None"
      });
      
      // Test microphone permissions
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("🎤 Microphone access granted");
        stream.getTracks().forEach(track => track.stop());
      } catch (micError) {
        console.error("🎤 Microphone access denied:", micError);
        addMessage("assistant", "Microphone access is required for voice interviews. Please grant permission and try again.");
        setCallStatus("idle");
        return;
      }
      
      // Use your custom workflow that collects user info and conducts personalized interviews
      if (workflowId && workflowId !== "your_vapi_workflow_id_here") {
        console.log("🔧 Using your custom workflow:", workflowId);
        console.log("🔧 Starting workflow that will collect: name, role, interview type, experience level, tech stack, question count");
        
        // Start workflow using correct parameter position
        // Method signature: start(assistant?, assistantOverrides?, squad?, workflow?, workflowOverrides?)
        console.log("🔧 Starting workflow with correct parameter position...");
        await vapi.start(
          undefined, // assistant
          undefined, // assistantOverrides  
          undefined, // squad
          workflowId, // workflow (4th parameter!)
          undefined  // workflowOverrides
        );
      } else {
        console.log("🔧 Using basic assistant configuration");
        // Start with a basic assistant configuration
        const assistantConfig = {
          model: {
            provider: "openai" as const,
            model: "gpt-4" as const,
            messages: [
              {
                role: "system" as const,
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
            provider: "11labs" as const,
            voiceId: "21m00Tcm4TlvDq8ikWAM", // Rachel voice
            model: "eleven_turbo_v2" as const
          }
        };
        console.log("🔧 Assistant config:", JSON.stringify(assistantConfig, null, 2));
        await vapi.start(assistantConfig);
      }
      console.log("✅ Vapi.start() completed successfully");
    } catch (error) {
      console.error("❌ Failed to start interview:", error);
      const errorObj = error as Error;
      console.error("❌ Error name:", errorObj.name);
      console.error("❌ Error message:", errorObj.message);
      console.error("❌ Error stack:", errorObj.stack);
      setCallStatus("idle");
      addMessage("assistant", `Failed to start the interview: ${errorObj.message}. Please check your environment variables and try again.`);
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