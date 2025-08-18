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
  const startTime = Date.now();
  
  try {
    console.log('🔍 Health check started:', new Date().toISOString());
    
    // Validate environment variables first
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ Missing required environment variables');
      return Response.json({
        status: "unhealthy",
        error: "Missing Supabase configuration",
        timestamp: new Date().toISOString(),
        responseTime: `${Date.now() - startTime}ms`
      }, { status: 503 });
    }

    console.log('✅ Environment variables validated');

    // Test basic Supabase connection with a simple query
    console.log('🔌 Testing Supabase connection...');
    
    // First, try a basic connection test with a system table that always exists
    let interviewsTableExists = false;
    let recordCount = 0;
    
    // Try to query the interviews table directly and handle the error gracefully
    const { data: interviewData, error: interviewError } = await supabase
      .from('interviews')
      .select('id')
      .limit(1);

    if (interviewError) {
      console.error('⚠️ Interviews table error:', interviewError.message);
      console.error('   Details:', interviewError.details);
      console.error('   Hint:', interviewError.hint);
      console.error('   Code:', interviewError.code);
      
      // Check if it's a table not found error - this means DB is connected but table doesn't exist
      if (interviewError.code === '42P01') {
        console.log('⚠️  Interviews table does not exist, but database connection is healthy');
        interviewsTableExists = false;
        
        // Since we got a proper "table not found" error, the connection is working
        // This is actually a good sign - it means we can connect but the table needs to be created
        console.log('✅ Database connection confirmed (table not found error indicates working connection)');
      } else {
        // Other database errors indicate connection issues
        return Response.json({
          status: "unhealthy",
          error: "Database connection failed",
          details: interviewError.message,
          code: interviewError.code,
          timestamp: new Date().toISOString(),
          responseTime: `${Date.now() - startTime}ms`
        }, { status: 503 });
      }
    } else {
      // Table exists and query succeeded
      interviewsTableExists = true;
      recordCount = interviewData ? interviewData.length : 0;
      console.log('✅ Interviews table exists');
      console.log(`📊 Found ${recordCount} records in interviews table`);
    }

    console.log('✅ Database connection successful');

    // Optional: Test database write permissions (commented out to avoid side effects)
    // This would test if we can actually write to the database
    /*
    const { error: writeTest } = await supabase
      .from('interviews')
      .insert({ 
        user_id: 'health-check-test',
        role: 'test',
        interview_type: 'technical',
        experience_level: 'mid',
        tech_stack: ['test'],
        questions: ['test question'],
        cover_image: '/default.jpg'
      });
    */

    const responseTime = Date.now() - startTime;
    console.log(`✅ Health check completed in ${responseTime}ms`);

    const status = interviewsTableExists ? "healthy" : "partially_healthy";
    const statusCode = interviewsTableExists ? 200 : 200; // Both should return 200 for basic health

    return Response.json({
      status: status,
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        recordCount: recordCount,
        interviewsTableExists: interviewsTableExists
      },
      environment: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "configured" : "missing",
        serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? "configured" : "missing"
      },
      responseTime: `${responseTime}ms`,
      recommendations: interviewsTableExists 
        ? [] 
        : ["Run the database schema setup to create the 'interviews' table"]
    }, { status: statusCode });

  } catch (error) {
    const responseTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    console.error('❌ Health check failed:', errorMessage);
    console.error('   Stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return Response.json({
      status: "unhealthy",
      error: "Service unavailable",
      details: errorMessage,
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`
    }, { status: 503 });
  }
}