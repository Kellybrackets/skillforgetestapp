# Database Setup Guide for Vapi.ai Integration

## Current Status
Your health check endpoint is working properly and returns:
- ✅ **Database Connection**: Successfully connected to Supabase
- ⚠️  **Table Status**: `interviews` table needs to be created
- ✅ **Environment Variables**: Properly configured

## Quick Setup Instructions

### Step 1: Access Supabase Dashboard
1. Go to [your Supabase project dashboard](https://supabase.com/dashboard)
2. Navigate to **SQL Editor**
3. Click **New Query**

### Step 2: Create the Interviews Table
Copy and paste this SQL query:

```sql
-- Create interviews table for Vapi.ai integration
CREATE TABLE IF NOT EXISTS interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  role TEXT NOT NULL,
  interview_type TEXT NOT NULL CHECK (interview_type IN ('technical', 'behavioral')),
  experience_level TEXT NOT NULL CHECK (experience_level IN ('junior', 'mid', 'senior')),
  tech_stack TEXT[] NOT NULL,
  questions TEXT[] NOT NULL,
  cover_image TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_interviews_user_id ON interviews(user_id);
CREATE INDEX IF NOT EXISTS idx_interviews_type ON interviews(interview_type);
CREATE INDEX IF NOT EXISTS idx_interviews_created_at ON interviews(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Optional - for user data isolation)
CREATE POLICY "Users can view their own interviews" ON interviews
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own interviews" ON interviews
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own interviews" ON interviews
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own interviews" ON interviews
  FOR DELETE USING (auth.uid()::text = user_id);
```

### Step 3: Run the Query
1. Click **Run** to execute the SQL
2. You should see "Success. No rows returned" message

### Step 4: Test the Health Check
Run the health check again:
```bash
curl -X GET http://localhost:3003/api/vapi/generate
```

Expected response after setup:
```json
{
  "status": "healthy",
  "timestamp": "2025-08-18T17:57:26.257Z",
  "database": {
    "connected": true,
    "recordCount": 0,
    "interviewsTableExists": true
  },
  "environment": {
    "supabaseUrl": "configured",
    "serviceKey": "configured"
  },
  "responseTime": "500ms"
}
```

## Health Check Features

The improved health check endpoint now provides:

### ✅ **Working Features**
- **Environment Validation**: Checks if Supabase credentials are configured
- **Connection Testing**: Verifies database connectivity
- **Table Verification**: Confirms interviews table exists
- **Error Logging**: Detailed console logs for debugging
- **Response Time Monitoring**: Tracks endpoint performance
- **Graceful Error Handling**: Proper HTTP status codes

### 📊 **Response Types**
- `200 + "healthy"`: Everything working perfectly
- `200 + "partially_healthy"`: Connected but table missing
- `503 + "unhealthy"`: Connection or configuration issues

### 🔍 **Debugging Information**
Check your development server console for detailed logs:
- Environment variable validation
- Database connection attempts
- Table existence checks
- Error details with codes

## Troubleshooting

### Issue: "Database connection failed"
- **Cause**: Invalid Supabase credentials or network issues
- **Solution**: Check `.env.local` file credentials

### Issue: "Table does not exist"
- **Cause**: Interviews table not created
- **Solution**: Run the SQL setup above

### Issue: Slow response times
- **Cause**: Network latency or database performance
- **Solution**: Check Supabase project region and plan

## Testing the API

After setup, you can test the full Vapi.ai generation:

```bash
curl -X POST http://localhost:3003/api/vapi/generate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "technical",
    "role": "Frontend Developer",
    "level": "mid",
    "techstack": "React, TypeScript, Next.js",
    "amount": 3,
    "userid": "test-user-123"
  }'
```

## Next Steps

1. ✅ Complete database setup
2. ✅ Test health check endpoint
3. 🔄 Add Google AI API key for question generation
4. 🔄 Test full interview generation workflow
5. 🔄 Deploy to production

---

**Your health check endpoint is now production-ready!** 🚀