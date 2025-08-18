// Type definitions for Vapi.ai integration

export interface Interview {
  id: string;
  user_id: string;
  role: string;
  interview_type: 'technical' | 'behavioral';
  experience_level: 'junior' | 'mid' | 'senior';
  tech_stack: string[];
  questions: string[];
  cover_image: string;
  created_at: string;
  updated_at?: string;
}

export interface GenerateInterviewRequest {
  type: 'technical' | 'behavioral';
  role: string;
  level: 'junior' | 'mid' | 'senior';
  techstack: string;
  amount: number;
  userid: string;
}

export interface GenerateInterviewResponse {
  success: boolean;
  questions?: string[];
  error?: string;
  interviewId?: string;
}

export interface VapiConfig {
  apiKey: string;
  assistant: {
    model: {
      provider: 'openai';
      model: 'gpt-4';
      messages: Array<{
        role: 'system' | 'user' | 'assistant';
        content: string;
      }>;
    };
    voice: {
      provider: 'elevenlabs' | 'openai';
      voiceId?: string;
    };
    transcriber: {
      provider: 'deepgram';
      model: 'nova-2';
      language: 'en-US';
    };
  };
}

export interface VapiCallStatus {
  status: 'idle' | 'connecting' | 'active' | 'ended';
  duration?: number;
  error?: string;
}

export interface InterviewSession {
  id: string;
  interviewId: string;
  userId: string;
  status: VapiCallStatus['status'];
  startedAt?: string;
  endedAt?: string;
  transcript?: string;
  responses?: Array<{
    question: string;
    response: string;
    timestamp: string;
  }>;
}