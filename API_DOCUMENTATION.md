# SkillForge API Documentation

## Overview

This document provides comprehensive documentation for the SkillForge API endpoints, data structures, and integration patterns.

## Base URL
```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

All API endpoints use Supabase JWT authentication. Include the authorization header:

```javascript
headers: {
  'Authorization': `Bearer ${supabaseToken}`,
  'Content-Type': 'application/json'
}
```

## API Endpoints

### Learning Paths API

#### Get All Learning Paths
```http
GET /api/learning-paths
```

**Query Parameters:**
- `userId` (optional): User ID for personalized recommendations
- `category` (optional): Filter by category (technical, creative, business, hybrid)
- `search` (optional): Search term for filtering paths
- `includeProgress` (boolean): Include user progress data

**Response:**
```json
{
  "paths": [
    {
      "id": "web-development",
      "title": "Web Development",
      "slug": "web-development",
      "description": "Master frontend, backend, and full-stack development",
      "icon": "Globe",
      "color": "from-blue-500 to-cyan-600",
      "category": "technical",
      "difficulty": "intermediate",
      "estimated_duration": "6-8 months",
      "skills": ["HTML/CSS", "JavaScript", "React", "Node.js"],
      "career_outcomes": ["Frontend Developer", "Full-Stack Developer"],
      "salary_range": {
        "junior": "R20,000 - R40,000",
        "mid": "R40,000 - R80,000",
        "senior": "R80,000 - R150,000+"
      },
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "recommendations": [
    {
      "path_id": "web-development",
      "path_title": "Web Development",
      "recommendation_score": 95
    }
  ],
  "progress": {
    "web-development": {
      "total_courses": 8,
      "completed_courses": 3,
      "progress_percentage": 37
    }
  }
}
```

#### Get Specific Learning Path
```http
GET /api/learning-paths/{pathId}
```

**Query Parameters:**
- `includeContent` (boolean): Include courses, projects, and interview data

**Response:**
```json
{
  "path": {
    "id": "web-development",
    "title": "Web Development",
    // ... other path properties
  },
  "courses": [
    {
      "id": "html-css-fundamentals",
      "title": "HTML & CSS Fundamentals",
      "description": "Learn the building blocks of web development",
      "level": "Beginner",
      "duration": "3 weeks",
      "skills": ["HTML", "CSS", "Responsive Design"],
      "instructor": "John Doe",
      "rating": 4.8,
      "students": 1250,
      "sort_order": 0
    }
  ],
  "projects": [
    {
      "id": "personal-portfolio",
      "title": "Personal Portfolio Website",
      "description": "Build a responsive portfolio to showcase your work",
      "difficulty": "Beginner",
      "technologies": ["HTML", "CSS", "JavaScript"],
      "estimated_time": "2 weeks",
      "skills": ["Responsive Design", "Git", "Deployment"],
      "deliverables": ["Live website", "GitHub repository", "Project documentation"]
    }
  ],
  "interviewRoles": [
    {
      "id": "frontend-developer",
      "role": "Frontend Developer",
      "company": "Tech Startup",
      "experience": "Entry Level",
      "skills": ["HTML", "CSS", "JavaScript", "React"],
      "questions": ["Explain the box model", "What is closure in JavaScript?"],
      "tips": ["Practice coding challenges", "Build a portfolio"]
    }
  ]
}
```

#### Create/Update Learning Path (Admin Only)
```http
POST /api/learning-paths
```

**Request Body:**
```json
{
  "action": "migrate", // or "create", "update"
  "pathData": {
    // Learning path data
  }
}
```

### Progress Tracking API

#### Get Course Progress
```http
GET /api/progress/course?userId={userId}&pathId={pathId}
```

**Response:**
```json
{
  "progress": [
    {
      "course_id": "html-css-fundamentals",
      "course_title": "HTML & CSS Fundamentals",
      "status": "completed",
      "progress_percentage": 100,
      "started_at": "2024-01-01T00:00:00Z",
      "completed_at": "2024-01-15T00:00:00Z",
      "last_updated": "2024-01-15T00:00:00Z"
    }
  ]
}
```

#### Update Course Progress
```http
POST /api/progress/course
```

**Request Body:**
```json
{
  "action": "update", // "start", "update", "complete"
  "userId": "uuid",
  "pathId": "web-development",
  "courseId": "html-css-fundamentals",
  "courseTitle": "HTML & CSS Fundamentals",
  "status": "in_progress", // "not_started", "in_progress", "completed"
  "progressPercentage": 75
}
```

**Response:**
```json
{
  "success": true,
  "message": "Course update successful"
}
```

#### Get Learning Path Progress
```http
GET /api/progress/path?userId={userId}&pathIds={pathId1,pathId2}
```

**Query Parameters:**
- `userId` (required): User identifier
- `pathId` (optional): Specific path ID
- `pathIds` (optional): Comma-separated list of path IDs
- `dashboard` (boolean): Format for dashboard display

**Response:**
```json
{
  "progress": {
    "web-development": {
      "learning_path_id": "web-development",
      "total_courses": 8,
      "completed_courses": 3,
      "progress_percentage": 37,
      "started_at": "2024-01-01T00:00:00Z",
      "last_updated": "2024-01-15T00:00:00Z"
    }
  }
}
```

#### Sync Offline Progress
```http
POST /api/progress/sync
```

**Request Body:**
```json
{
  "userId": "uuid",
  "pathId": "web-development",
  "progressData": {
    "courses": {
      "html-css-fundamentals": {
        "title": "HTML & CSS Fundamentals",
        "status": "completed",
        "progressPercentage": 100,
        "completedAt": 1704067200000
      }
    },
    "lastUpdated": 1704067200000,
    "needsSync": true
  }
}
```

### User Profile API

#### Get User Profile
```http
GET /api/profiles/{userId}
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "avatar_url": "https://example.com/avatar.jpg",
  "created_at": "2024-01-01T00:00:00Z",
  "preferences": {
    "theme": "system",
    "notifications": true,
    "privacy_settings": {}
  }
}
```

#### Search Users
```http
GET /api/profiles/search?query={searchTerm}
```

### Authentication API

#### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Register
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe"
}
```

#### Logout
```http
POST /api/auth/logout
```

### Chat API

#### Send Message to AI Assistant
```http
POST /api/chat
```

**Request Body:**
```json
{
  "message": "How do I learn React?",
  "context": {
    "currentPath": "web-development",
    "userLevel": "beginner",
    "completedCourses": ["html-css-fundamentals"]
  }
}
```

**Response:**
```json
{
  "response": "Based on your current progress in web development...",
  "suggestions": [
    "Start with JavaScript basics",
    "Complete the React fundamentals course",
    "Build a practice project"
  ]
}
```

## Data Models

### Learning Path
```typescript
interface LearningPath {
  id: string
  title: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
  category: 'technical' | 'creative' | 'business' | 'hybrid'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimated_duration: string | null
  prerequisites: string[] | null
  skills: string[]
  career_outcomes: string[] | null
  salary_range: {
    junior: string
    mid: string
    senior: string
  } | null
  unlocks: string[] | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}
```

### Course Progress
```typescript
interface UserCourseProgress {
  id: string
  user_id: string
  learning_path_id: string
  course_id: string
  course_title: string
  status: 'not_started' | 'in_progress' | 'completed'
  progress_percentage: number
  started_at: string | null
  completed_at: string | null
  last_updated: string
}
```

### Learning Path Summary
```typescript
interface UserLearningPathSummary {
  id: string
  user_id: string
  learning_path_id: string
  total_courses: number
  completed_courses: number
  progress_percentage: number
  started_at: string | null
  last_updated: string
}
```

## Error Handling

### Error Response Format
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Specific field error"
  }
}
```

### Common Error Codes
- `UNAUTHORIZED` (401): Invalid or missing authentication
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (400): Invalid request data
- `INTERNAL_ERROR` (500): Server error

### Error Examples
```json
// Unauthorized
{
  "error": "Authentication required",
  "code": "UNAUTHORIZED"
}

// Validation Error
{
  "error": "Invalid request data",
  "code": "VALIDATION_ERROR",
  "details": {
    "userId": "User ID is required",
    "progressPercentage": "Must be between 0 and 100"
  }
}
```

## Rate Limiting

- **General API**: 100 requests per minute per user
- **Authentication**: 5 requests per minute per IP
- **Progress Updates**: 50 requests per minute per user

## Webhooks

### Progress Update Webhook
```http
POST /api/webhooks/progress
```

Triggered when significant progress milestones are reached.

**Payload:**
```json
{
  "event": "course_completed",
  "user_id": "uuid",
  "learning_path_id": "web-development",
  "course_id": "html-css-fundamentals",
  "timestamp": "2024-01-15T00:00:00Z",
  "data": {
    "progress_percentage": 100,
    "new_unlocks": ["Portfolio Builder", "Advanced CSS"]
  }
}
```

## SDK Usage Examples

### JavaScript/TypeScript
```typescript
// Initialize the SDK
import { SkillForgeAPI } from '@skillforge/sdk'

const api = new SkillForgeAPI({
  baseURL: 'https://your-domain.com/api',
  token: 'your-auth-token'
})

// Fetch learning paths
const paths = await api.learningPaths.getAll({
  userId: 'user-id',
  includeProgress: true
})

// Update course progress
await api.progress.updateCourse({
  userId: 'user-id',
  pathId: 'web-development',
  courseId: 'html-css-fundamentals',
  status: 'completed',
  progressPercentage: 100
})
```

### Frontend Integration
```typescript
// React Hook Example
import { fetchLearningPathsWithProgress } from '@/lib/api/learning-paths-api'

function useLearningPaths(userId: string) {
  const [paths, setPaths] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function loadPaths() {
      try {
        const data = await fetchLearningPathsWithProgress(userId)
        setPaths(data.paths)
      } catch (error) {
        console.error('Failed to load paths:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadPaths()
  }, [userId])
  
  return { paths, loading }
}
```

## Testing

### API Testing
```bash
# Install testing dependencies
npm install --save-dev jest supertest

# Run API tests
npm run test:api
```

### Example Test
```typescript
describe('Learning Paths API', () => {
  test('should fetch all learning paths', async () => {
    const response = await request(app)
      .get('/api/learning-paths')
      .set('Authorization', `Bearer ${testToken}`)
      .expect(200)
    
    expect(response.body.paths).toHaveLength(4)
    expect(response.body.paths[0]).toHaveProperty('id')
    expect(response.body.paths[0]).toHaveProperty('title')
  })
})
```

## Monitoring & Analytics

### Performance Metrics
- Response time per endpoint
- Error rates by endpoint
- User engagement metrics
- Progress completion rates

### Logging
```typescript
// Example log entry
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "info",
  "endpoint": "/api/learning-paths",
  "method": "GET",
  "user_id": "uuid",
  "response_time": 150,
  "status": 200
}
```

This API documentation provides comprehensive coverage of the SkillForge platform's backend capabilities, enabling developers to integrate with the learning management system effectively.