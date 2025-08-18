-- Supabase Schema for Vapi.ai Interview Generation
-- This schema supports the optimized /api/vapi/generate route

CREATE TABLE interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES auth.users(id) ON DELETE CASCADE,
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
CREATE INDEX idx_interviews_user_id ON interviews(user_id);
CREATE INDEX idx_interviews_type ON interviews(interview_type);
CREATE INDEX idx_interviews_created_at ON interviews(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only access their own interviews
CREATE POLICY "Users can view their own interviews" ON interviews
  FOR SELECT USING (auth.uid() = user_id::uuid);

CREATE POLICY "Users can insert their own interviews" ON interviews
  FOR INSERT WITH CHECK (auth.uid() = user_id::uuid);

CREATE POLICY "Users can update their own interviews" ON interviews
  FOR UPDATE USING (auth.uid() = user_id::uuid);

CREATE POLICY "Users can delete their own interviews" ON interviews
  FOR DELETE USING (auth.uid() = user_id::uuid);

-- Optional: Add a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_interviews_updated_at
  BEFORE UPDATE ON interviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();