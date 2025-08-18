// Simple test script for the Vapi.ai API route
// Run with: node scripts/test-vapi-api.js

const API_BASE = 'http://localhost:3003';

async function testHealthCheck() {
  console.log('🔍 Testing health check endpoint...');
  
  try {
    const response = await fetch(`${API_BASE}/api/vapi/generate`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Health check passed:', data);
    } else {
      console.log('❌ Health check failed:', data);
    }
  } catch (error) {
    console.error('❌ Health check error:', error.message);
  }
}

async function testGenerateInterview() {
  console.log('🔍 Testing interview generation...');
  
  const testPayload = {
    type: 'technical',
    role: 'Frontend Developer',
    level: 'mid',
    techstack: 'React, TypeScript, Next.js',
    amount: 3,
    userid: 'test-user-123'
  };

  try {
    const response = await fetch(`${API_BASE}/api/vapi/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testPayload)
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Interview generation successful:');
      console.log('  - Questions generated:', data.questions?.length || 0);
      console.log('  - Interview ID:', data.interviewId);
      console.log('  - Sample question:', data.questions?.[0]);
    } else {
      console.log('❌ Interview generation failed:', data);
    }
  } catch (error) {
    console.error('❌ Interview generation error:', error.message);
  }
}

async function testInvalidInput() {
  console.log('🔍 Testing input validation...');
  
  const invalidPayload = {
    type: 'invalid-type',
    role: 'Frontend Developer',
    level: 'expert', // Invalid level
    techstack: 'React',
    amount: 25, // Too many questions
    userid: '' // Empty userid
  };

  try {
    const response = await fetch(`${API_BASE}/api/vapi/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(invalidPayload)
    });

    const data = await response.json();
    
    if (!response.ok && data.error) {
      console.log('✅ Input validation working:', data.error);
    } else {
      console.log('❌ Input validation failed - should have rejected invalid input');
    }
  } catch (error) {
    console.error('❌ Validation test error:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting Vapi.ai API Tests\n');
  
  await testHealthCheck();
  console.log('');
  
  await testInvalidInput();
  console.log('');
  
  // Only test generation if health check and validation work
  // Note: This will fail if Supabase/Gemini aren't configured
  console.log('ℹ️  Skipping actual generation test - requires valid API keys and database');
  console.log('   To test generation, ensure GOOGLE_GENERATIVE_AI_API_KEY and SUPABASE keys are set');
  
  console.log('\n✨ Tests completed!');
}

runTests();