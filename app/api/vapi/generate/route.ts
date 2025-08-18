import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { createClient } from '@supabase/supabase-js';
import { getRandomInterviewCover } from "@/lib/utils";
import { NextRequest } from "next/server";

// Initialize Supabase with service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// TypeScript interfaces for type safety
interface GenerateInterviewRequest {
  type: 'technical' | 'behavioral';
  role: string;
  level: 'junior' | 'mid' | 'senior';
  techstack: string;
  amount: number;
  userid: string;
}

interface GenerateInterviewResponse {
  success: boolean;
  questions?: string[];
  error?: string;
  interviewId?: string;
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    // Parse and validate request body
    const body = await request.json() as GenerateInterviewRequest;
    const { type, role, level, techstack, amount, userid } = body;

    // Input validation
    if (!type || !role || !level || !techstack || !amount || !userid) {
      return Response.json({ 
        success: false,
        error: "Missing required fields: type, role, level, techstack, amount, userid"
      } as GenerateInterviewResponse, { status: 400 });
    }

    if (!['technical', 'behavioral'].includes(type)) {
      return Response.json({ 
        success: false,
        error: "Invalid type. Must be 'technical' or 'behavioral'"
      } as GenerateInterviewResponse, { status: 400 });
    }

    if (!['junior', 'mid', 'senior'].includes(level)) {
      return Response.json({ 
        success: false,
        error: "Invalid level. Must be 'junior', 'mid', or 'senior'"
      } as GenerateInterviewResponse, { status: 400 });
    }

    if (amount < 1 || amount > 20) {
      return Response.json({ 
        success: false,
        error: "Amount must be between 1 and 20"
      } as GenerateInterviewResponse, { status: 400 });
    }

    console.log(`Generating ${amount} ${type} questions for ${level} ${role} - Tech: ${techstack}`);

    // Generate interview questions using Gemini
    const { text: questionsText } = await generateText({
      model: google("gemini-1.5-flash"),
      system: `You are an expert interview question generator specifically optimized for voice assistants like Vapi.ai. 
        Generate high-quality, realistic interview questions that:
        - Sound natural when spoken aloud
        - Avoid complex special characters or formatting
        - Are appropriate for voice-based interviews
        - Test relevant skills for the specified role and level`,
      prompt: `Generate exactly ${amount} ${type} interview questions for a ${level}-level ${role} position.

        Technical requirements:
        - Technology stack: ${techstack}
        - Experience level: ${level}
        - Interview type: ${type}

        Output requirements:
        - Return ONLY a valid JSON array of strings
        - Each question should be clear and conversational for voice interaction
        - No special characters like /, *, #, or markdown formatting
        - Questions should be 10-25 words long for optimal voice delivery
        - For technical questions, focus on practical scenarios and problem-solving
        - For behavioral questions, focus on real workplace situations

        Example format: ["How would you optimize React rendering performance?", "Explain your approach to debugging complex issues"]`
    });

    // Parse and validate generated questions
    let parsedQuestions: string[];
    try {
      parsedQuestions = JSON.parse(questionsText) as string[];
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", questionsText);
      return Response.json({ 
        success: false,
        error: "Failed to generate valid questions. Please try again."
      } as GenerateInterviewResponse, { status: 500 });
    }

    // Validate question format
    if (!Array.isArray(parsedQuestions) || parsedQuestions.length !== amount) {
      console.error("Invalid questions format:", parsedQuestions);
      return Response.json({ 
        success: false,
        error: `Expected ${amount} questions, got ${parsedQuestions?.length || 0}`
      } as GenerateInterviewResponse, { status: 500 });
    }

    // Additional validation for question content
    const validQuestions = parsedQuestions.filter(q => 
      typeof q === 'string' && 
      q.trim().length > 0 && 
      q.length <= 200
    );

    if (validQuestions.length !== amount) {
      console.error("Some questions failed validation:", parsedQuestions);
      return Response.json({ 
        success: false,
        error: "Generated questions failed quality validation"
      } as GenerateInterviewResponse, { status: 500 });
    }

    // Process tech stack into array
    const techStackArray = techstack
      .split(',')
      .map(tech => tech.trim())
      .filter(tech => tech.length > 0);

    // Store interview in Supabase
    const { data: interviewData, error: supabaseError } = await supabase
      .from('interviews')
      .insert({
        user_id: userid,
        role: role.trim(),
        interview_type: type,
        experience_level: level,
        tech_stack: techStackArray,
        questions: validQuestions,
        cover_image: getRandomInterviewCover(),
        created_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (supabaseError) {
      console.error("Supabase error:", supabaseError);
      return Response.json({ 
        success: false,
        error: "Failed to save interview to database"
      } as GenerateInterviewResponse, { status: 500 });
    }

    console.log(`Successfully generated and saved interview ${interviewData.id}`);

    return Response.json({ 
      success: true,
      questions: validQuestions,
      interviewId: interviewData.id
    } as GenerateInterviewResponse, { status: 200 });

  } catch (error) {
    console.error("Vapi Generation Error:", error);
    
    // Differentiate between different types of errors
    if (error instanceof SyntaxError) {
      return Response.json({ 
        success: false,
        error: "Invalid request format"
      } as GenerateInterviewResponse, { status: 400 });
    }

    return Response.json({ 
      success: false,
      error: error instanceof Error ? error.message : "Internal server error"
    } as GenerateInterviewResponse, { status: 500 });
  }
}

// Health check endpoint
export async function GET(): Promise<Response> {
  try {
    // Test Supabase connection
    const { error } = await supabase
      .from('interviews')
      .select('count')
      .limit(1);

    if (error) {
      return Response.json({ 
        status: "unhealthy",
        error: "Database connection failed",
        timestamp: new Date().toISOString() 
      }, { status: 503 });
    }

    return Response.json({ 
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    return Response.json({ 
      status: "unhealthy",
      error: "Service unavailable",
      timestamp: new Date().toISOString() 
    }, { status: 503 });
  }
}