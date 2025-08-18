// Database setup script for creating the interviews table
// Run with: node scripts/setup-database.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupDatabase() {
  console.log('🔧 Setting up Supabase database...');
  
  try {
    // Create the interviews table
    console.log('📋 Creating interviews table...');
    
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    });

    if (error) {
      console.error('❌ Failed to create table:', error.message);
      throw error;
    }

    console.log('✅ Interviews table created successfully');
    
    // Test the table
    const { data: testData, error: testError } = await supabase
      .from('interviews')
      .select('id')
      .limit(1);

    if (testError) {
      console.error('❌ Table test failed:', testError.message);
      throw testError;
    }

    console.log('✅ Table test successful');
    console.log('🎉 Database setup completed!');
    
  } catch (error) {
    console.error('💥 Database setup failed:', error.message);
    process.exit(1);
  }
}

// Alternative manual setup instructions
console.log('🔧 Supabase Database Setup');
console.log('=========================');
console.log('');
console.log('Option 1: Automated setup (if RPC is enabled):');
console.log('  node scripts/setup-database.js');
console.log('');
console.log('Option 2: Manual setup via Supabase Dashboard:');
console.log('  1. Go to your Supabase project dashboard');
console.log('  2. Navigate to the SQL Editor');
console.log('  3. Copy and paste the SQL from supabase-schema.sql');
console.log('  4. Run the SQL query');
console.log('');
console.log('Attempting automated setup...');

setupDatabase();