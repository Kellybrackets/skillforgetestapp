# Vapi.ai Integration for SkillForge

This document describes the optimized Vapi.ai integration for AI-powered interview generation in SkillForge.

## 🔧 Architecture Overview

The integration consists of several key components:

- **API Route**: `/api/vapi/generate` - Generates interview questions using Gemini AI
- **Database**: Supabase PostgreSQL with `interviews` table
- **AI Provider**: Google Gemini 1.5 Flash via AI SDK
- **Frontend**: React components for interview setup and management

## 📋 Required Environment Variables

Add these to your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google AI Configuration
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

# Vapi.ai Configuration (for voice integration)
VAPI_PUBLIC_KEY=your_vapi_public_key
VAPI_PRIVATE_KEY=your_vapi_private_key
```

## 🗄️ Database Setup

1. Run the SQL schema in your Supabase dashboard:

```sql
-- See supabase-schema.sql for complete schema
CREATE TABLE interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  interview_type TEXT NOT NULL CHECK (interview_type IN ('technical', 'behavioral')),
  experience_level TEXT NOT NULL CHECK (experience_level IN ('junior', 'mid', 'senior')),
  tech_stack TEXT[] NOT NULL,
  questions TEXT[] NOT NULL,
  cover_image TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

2. Enable Row Level Security (RLS) policies for data protection

## 🚀 API Usage

### Generate Interview Questions

**POST** `/api/vapi/generate`

```typescript
interface GenerateInterviewRequest {
  type: 'technical' | 'behavioral';
  role: string;
  level: 'junior' | 'mid' | 'senior';
  techstack: string; // Comma-separated technologies
  amount: number; // 1-20 questions
  userid: string;
}
```

**Response:**
```typescript
interface GenerateInterviewResponse {
  success: boolean;
  questions?: string[];
  error?: string;
  interviewId?: string;
}
```

### Health Check

**GET** `/api/vapi/generate`

Returns service status and database connectivity.

## 💻 Frontend Integration

### Basic Usage

```typescript
import { GenerateInterviewRequest, GenerateInterviewResponse } from '@/types/vapi';

async function generateInterview(request: GenerateInterviewRequest): Promise<GenerateInterviewResponse> {
  const response = await fetch('/api/vapi/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });
  
  return response.json();
}

// Usage example
const questions = await generateInterview({
  type: 'technical',
  role: 'Frontend Developer',
  level: 'mid',
  techstack: 'React, TypeScript, Next.js',
  amount: 5,
  userid: user.id
});
```

### React Hook Example

```typescript
import { useState } from 'react';

function useInterviewGeneration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuestions = async (request: GenerateInterviewRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/vapi/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { generateQuestions, loading, error };
}
```

## 🎯 Key Optimizations

### 1. Enhanced Prompt Engineering
- Voice-assistant friendly question formatting
- Strict output format validation
- Technology-specific question generation
- Experience level appropriate complexity

### 2. Robust Error Handling
- Input validation with TypeScript types
- Graceful error recovery
- Detailed error messaging
- Health check monitoring

### 3. Database Optimization
- Efficient schema with proper indexes
- Row Level Security (RLS) for data protection
- Automatic timestamp management
- User-specific data isolation

### 4. Type Safety
- Comprehensive TypeScript interfaces
- Request/response validation
- Database model definitions
- Frontend integration types

## 🔍 Testing

### Manual Testing
```bash
# Test health check
curl http://localhost:3003/api/vapi/generate

# Test question generation
curl -X POST http://localhost:3003/api/vapi/generate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "technical",
    "role": "Frontend Developer", 
    "level": "mid",
    "techstack": "React, TypeScript",
    "amount": 3,
    "userid": "test-user"
  }'
```

### Automated Testing
```bash
node scripts/test-vapi-api.js
```

## 📊 Monitoring & Analytics

### Key Metrics to Track
- Question generation success rate
- Average response time
- Popular technology combinations
- User engagement with generated questions
- Gemini API usage and costs

### Error Monitoring
- Gemini API failures
- Supabase connection issues
- Invalid input patterns
- User authentication problems

## 🛠️ Troubleshooting

### Common Issues

1. **"Database connection failed"**
   - Verify Supabase environment variables
   - Check database schema exists
   - Ensure RLS policies are configured

2. **"Failed to generate valid questions"**
   - Check Google AI API key
   - Verify Gemini model availability
   - Review prompt formatting

3. **"Missing required fields"**
   - Validate request payload structure
   - Check TypeScript interfaces match
   - Ensure all required fields are provided

### Debug Mode
Set `NODE_ENV=development` to enable detailed logging.

## 📈 Performance Considerations

- **Caching**: Consider implementing Redis for frequently requested question types
- **Rate Limiting**: Add rate limiting to prevent API abuse
- **Batch Processing**: Support bulk question generation for efficiency
- **CDN**: Cache static assets like interview cover images

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit API keys to version control
2. **Input Validation**: Always validate and sanitize user inputs
3. **Rate Limiting**: Implement proper rate limiting
4. **Authentication**: Verify user authentication before generation
5. **RLS Policies**: Use Supabase RLS for data access control

## 🚦 Next Steps

1. Integrate with Vapi.ai voice assistant
2. Add question difficulty scoring
3. Implement user feedback collection
4. Add analytics dashboard
5. Create question bank management UI

## 📚 References

- [Vapi.ai Documentation](https://docs.vapi.ai/)
- [Google AI SDK](https://sdk.vercel.ai/providers/ai-sdk-providers/google)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)