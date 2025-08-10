# SkillForge Architecture Documentation

## Overview

SkillForge is a comprehensive learning platform designed to help users develop skills through personalized learning paths, practical projects, and career preparation. The application uses a modern full-stack architecture with Next.js, Supabase, and TypeScript.

## Application Purpose

SkillForge serves as an integrated learning ecosystem that:

1. **Assesses User Skills** - Through interactive quizzes and assessments
2. **Provides Personalized Learning Paths** - Based on user interests and skill levels
3. **Tracks Progress** - Comprehensive course and project progress tracking
4. **Offers Practical Projects** - Real-world project briefs for skill application
5. **Prepares for Careers** - Interview preparation and career guidance
6. **Builds Portfolios** - Tools to showcase completed work
7. **Connects Learners** - Community features and mentorship
8. **Equipment Rental** - Physical equipment rental for practical learning

## Technical Architecture

### Frontend Architecture

#### Technology Stack
- **Next.js 15.2.4** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component library
- **Lucide React** - Icon library

#### Key Frontend Components

```
app/
├── dashboard/              # Main user dashboard
├── learning-paths/         # Learning path pages
├── quiz/                   # Skills assessment
├── career-forge/          # Career tools and CV builder
├── community/             # Social features
├── mentors/               # Mentor matching and booking
├── equipment/             # Equipment rental system
├── events/                # Events and workshops
└── settings/              # User preferences

components/
├── ui/                    # Reusable UI components (Radix-based)
├── learning-paths/        # Learning-specific components
├── providers/             # Context providers
└── [feature-components]   # Feature-specific components

hooks/
├── use-learning-path.ts   # Learning path state management
├── use-offline-sync.ts    # Offline/online sync management
└── [other-hooks]          # Feature-specific hooks
```

### Backend Architecture

#### Database Layer (Supabase PostgreSQL)

**Core Tables:**
```sql
-- User Management
profiles                    # Extended user profiles
user_preferences           # User settings and preferences
user_activity             # Activity logging
user_achievements         # Badges and milestones

-- Learning System
user_assessments          # Quiz results and skill assessments
user_course_progress      # Individual course progress
user_learning_path_summary # Overall path progress
skills                    # Available skills catalog
learning_paths           # Learning path metadata

-- Social Features
user_connections         # Following/mentorship relationships
```

#### API Layer (Next.js API Routes)

**Learning Paths APIs:**
- `/api/learning-paths` - CRUD operations for learning paths
- `/api/learning-paths/[pathId]` - Individual path details
- `/api/progress/course` - Course progress tracking
- `/api/progress/path` - Learning path progress
- `/api/progress/sync` - Offline sync endpoint

**Other APIs:**
- `/api/auth/*` - Authentication endpoints
- `/api/profiles/*` - User profile management
- `/api/chat` - AI assistant integration

#### Data Flow Architecture

```
Frontend Components
        ↓
API Layer (lib/api/)
        ↓
Database Layer (lib/database/)
        ↓
Supabase PostgreSQL
```

**Fallback System:**
```
Database (Primary) → Local Storage (Backup) → Static Registry (Fallback)
```

### State Management

#### Learning Paths State
```typescript
// Primary state management through React hooks
const [personalizedPaths, setPersonalizedPaths] = useState<LearningPath[]>([])
const [pathsLoading, setPathsLoading] = useState(true)
const [realCourseProgress, setRealCourseProgress] = useState<Record<string, any>>({})

// Quiz integration
const [userBadge, setUserBadge] = useState<any>(null)
const [userSkillLevels, setUserSkillLevels] = useState<Record<string, number>>({})
const [recommendedPaths, setRecommendedPaths] = useState<string[]>([])
```

#### Data Persistence Strategy
1. **Database First** - All data primarily stored in Supabase
2. **Local Storage Backup** - Offline capability with sync queuing
3. **Static Fallback** - Registry-based data for system resilience

## Core Features

### 1. Skills Assessment System

**Location:** `app/quiz/page.tsx`, `lib/quiz.ts`

**Functionality:**
- Interactive multi-step quiz
- Skill level assessment across multiple domains
- Personality and interest analysis
- Badge assignment based on results
- Personalized learning path recommendations

**Data Flow:**
```
Quiz Questions → User Answers → Analysis Engine → Skill Levels + Badge → Recommendations
```

### 2. Learning Paths System

**Location:** `lib/learning-paths/`, `app/learning-paths/`

**Components:**
- **Learning Path Registry** (`learning-paths-registry.ts`) - Static path definitions
- **Dynamic Path Content** (`generic-path-content.tsx`) - Reusable path display
- **Path-specific Data** (`web-development-data.ts`, etc.) - Course and project data

**Features:**
- 4 main learning paths: Web Development, AI & Data Science, Design & Creativity, Digital Marketing
- Personalized recommendations based on quiz results
- Progress tracking per course and overall path
- Project briefs and deliverables
- Interview preparation materials

### 3. Progress Tracking System

**Location:** `lib/learning-paths/learning-path-progress.ts`

**Database Tables:**
```sql
user_course_progress      # Individual course tracking
user_learning_path_summary # Overall path progress (auto-calculated)
```

**Features:**
- Real-time progress updates
- Automatic summary calculations via database triggers
- Offline progress storage with sync capabilities
- Visual progress indicators

### 4. Dashboard System

**Location:** `app/dashboard/page.tsx`

**Functionality:**
- Personalized learning path recommendations
- Progress visualization
- Achievement badges
- Course recommendations
- AI assistant integration
- Portfolio builder access

### 5. Career Development Tools

**Location:** `app/career-forge/page.tsx`

**Features:**
- CV/Resume builder
- Career path guidance
- Salary information
- Interview preparation
- Portfolio showcase

### 6. Community & Social Features

**Location:** `app/community/page.tsx`, `app/mentors/`

**Features:**
- User connections and following
- Mentor matching and booking
- Event discovery and registration
- Community discussions

### 7. Equipment Rental System

**Location:** `app/equipment/page.tsx`

**Features:**
- Equipment catalog (cameras, microphones, etc.)
- Availability calendar
- Rental booking system
- Equipment status tracking

## Data Architecture

### Learning Path Data Structure

```typescript
interface LearningPathConfig {
  id: string                    # Unique identifier
  title: string                 # Display name
  slug: string                  # URL-friendly identifier
  description: string           # Path description
  icon: string                  # Lucide icon name
  color: string                 # Tailwind gradient classes
  category: string              # technical/creative/business/hybrid
  difficulty: string            # beginner/intermediate/advanced
  estimatedDuration: string     # Time commitment
  prerequisites: string[]       # Required prior knowledge
  skills: string[]              # Skills taught
  careerOutcomes: string[]      # Potential career paths
  salaryRange: object           # Salary expectations
  unlocks: string[]             # Features unlocked
}
```

### Course Data Structure

```typescript
interface Course {
  id: string                    # Unique course identifier
  title: string                 # Course name
  description: string           # Course description
  duration: string              # Course length
  level: string                 # Difficulty level
  skills: string[]              # Skills covered
  instructor: string            # Instructor name
  rating: number                # Course rating (1-5)
  students: number              # Enrollment count
}
```

### Progress Tracking Structure

```typescript
interface UserCourseProgress {
  user_id: UUID                 # User identifier
  learning_path_id: string      # Path identifier
  course_id: string             # Course identifier
  course_title: string          # Course name
  status: string                # not_started/in_progress/completed
  progress_percentage: number   # 0-100
  started_at: timestamp         # When started
  completed_at: timestamp       # When completed
  last_updated: timestamp       # Last activity
}
```

## Security Architecture

### Authentication & Authorization
- **Supabase Auth** - JWT-based authentication
- **Row Level Security (RLS)** - Database-level access control
- **Route Protection** - Middleware-based route guarding

### Data Protection
```sql
-- Example RLS Policies
CREATE POLICY "Users can view own progress" ON user_course_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_course_progress
  FOR UPDATE USING (auth.uid() = user_id);
```

## Performance Architecture

### Optimization Strategies
1. **Database Indexing** - Strategic indexes on frequently queried fields
2. **Caching** - Local storage caching with TTL
3. **Lazy Loading** - Component and route-level code splitting
4. **Progressive Enhancement** - Offline-first approach

### Offline Capabilities
```typescript
// Sync queue for offline actions
interface SyncQueueItem {
  type: 'progress'              # Action type
  userId: string                # User identifier
  pathId: string                # Path identifier
  timestamp: number             # When queued
}
```

## Error Handling & Resilience

### Fallback System
1. **Primary**: Database operations via Supabase
2. **Secondary**: Local storage cache
3. **Tertiary**: Static registry data

### Error Recovery
```typescript
// Example fallback pattern
try {
  // Try database first
  const data = await fetchFromDatabase()
  return data
} catch (error) {
  console.warn('Database failed, using local storage')
  return getFromLocalStorage()
} finally {
  // Static fallback if all else fails
  return getStaticData()
}
```

## Development Workflow

### File Organization
```
lib/
├── api/                   # Frontend API client functions
├── database/              # Database interaction layer
├── learning-paths/        # Learning path static data and logic
├── utils/                 # Utility functions
└── [feature-libs]         # Feature-specific logic

types/
├── learning-paths.ts      # Learning path type definitions
├── user.ts                # User-related types
└── [other-types]          # Feature-specific types
```

### Key Architectural Patterns
1. **Separation of Concerns** - Clear boundaries between UI, API, and database layers
2. **Type Safety** - Comprehensive TypeScript usage
3. **Component Composition** - Reusable, composable UI components
4. **Progressive Enhancement** - Works offline, enhanced when online
5. **User-Centric Design** - Personalization at the core

## Deployment Architecture

### Environment Configuration
- **Development** - Local Next.js with Supabase connection
- **Production** - Vercel deployment with Supabase backend

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

This architecture provides a scalable, maintainable, and user-focused learning platform that can grow with user needs while maintaining performance and reliability.