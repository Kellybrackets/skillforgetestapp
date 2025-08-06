// Complete integrated quiz-logic.ts with all enhancements

// Types for quiz questions and answers
export interface QuizQuestion {
  id: string
  text: string
  type: "multiple-choice" | "scale" | "open-ended"
  options?: QuizOption[]
  followUpQuestions?: {
    [key: string]: string // Maps answer value to follow-up question ID
  }
  skillArea?: string
  difficulty?: "beginner" | "intermediate" | "advanced"
}

export interface QuizOption {
  id: string
  text: string
  value: string
  skillValue?: number // 1-10 rating for this skill if selected
}

export interface QuizAnswer {
  questionId: string
  value: string
  skillValues?: Record<string, number>
}

// Complete quiz questions with all missing paths
export const quizQuestions: Record<string, QuizQuestion> = {
  q1: {
    id: "q1",
    text: "What's your primary learning goal?",
    type: "multiple-choice",
    options: [
      { id: "q1-a", text: "Design and creativity", value: "design", skillValue: 5 },
      { id: "q1-b", text: "AI & data science", value: "ai", skillValue: 5 },
      { id: "q1-c", text: "Digital marketing", value: "marketing", skillValue: 5 },
      { id: "q1-d", text: "Web development", value: "webdev", skillValue: 5 },
    ],
    followUpQuestions: {
      design: "q2-design",
      ai: "q2-ai",
      marketing: "q2-marketing",
      webdev: "q2-webdev",
    },
    skillArea: "interests",
  },

  // Design follow-up questions
  "q2-design": {
    id: "q2-design",
    text: "Which design area interests you most?",
    type: "multiple-choice",
    options: [
      { id: "q2d-a", text: "UI/UX Design", value: "uiux", skillValue: 7 },
      { id: "q2d-b", text: "Graphic Design", value: "graphic", skillValue: 7 },
      { id: "q2d-c", text: "Animation & Motion Graphics", value: "animation", skillValue: 7 },
      { id: "q2d-d", text: "Photography", value: "photo", skillValue: 7 },
    ],
    followUpQuestions: {
      uiux: "q3-uiux",
      graphic: "q3-graphic",
      animation: "q3-animation",
      photo: "q3-photo",
    },
    skillArea: "design",
  },

  // AI follow-up questions
  "q2-ai": {
    id: "q2-ai",
    text: "Which AI & data science area interests you most?",
    type: "multiple-choice",
    options: [
      { id: "q2ai-a", text: "Machine Learning & AI Models", value: "ml-basics", skillValue: 7 },
      { id: "q2ai-b", text: "Natural Language Processing", value: "nlp", skillValue: 7 },
      { id: "q2ai-c", text: "Computer Vision & Image AI", value: "cv", skillValue: 7 },
      { id: "q2ai-d", text: "Data Analytics & Business Intelligence", value: "data-analytics", skillValue: 6 },
    ],
    followUpQuestions: {
      "ml-basics": "q3-ml",
      nlp: "q3-nlp",
      cv: "q3-cv",
      "data-analytics": "q3-data-analytics",
    },
    skillArea: "ai",
  },

  // Marketing follow-up questions
  "q2-marketing": {
    id: "q2-marketing",
    text: "Which marketing area interests you most?",
    type: "multiple-choice",
    options: [
      { id: "q2m-a", text: "Social Media Marketing", value: "social", skillValue: 7 },
      { id: "q2m-b", text: "Content Marketing", value: "content", skillValue: 7 },
      { id: "q2m-c", text: "SEO", value: "seo", skillValue: 7 },
      { id: "q2m-d", text: "Email Marketing", value: "email", skillValue: 7 },
    ],
    followUpQuestions: {
      social: "q3-social",
      content: "q3-content",
      seo: "q3-seo",
      email: "q3-email",
    },
    skillArea: "marketing",
  },

  // Web development follow-up questions
  "q2-webdev": {
    id: "q2-webdev",
    text: "Which web development area interests you most?",
    type: "multiple-choice",
    options: [
      { id: "q2w-a", text: "Frontend Development", value: "frontend", skillValue: 7 },
      { id: "q2w-b", text: "Backend Development", value: "backend", skillValue: 7 },
      { id: "q2w-c", text: "Full Stack Development", value: "fullstack", skillValue: 7 },
      { id: "q2w-d", text: "Mobile App Development", value: "mobile", skillValue: 7 },
    ],
    followUpQuestions: {
      frontend: "q3-frontend",
      backend: "q3-backend",
      fullstack: "q3-fullstack",
      mobile: "q3-mobile",
    },
    skillArea: "webdev",
  },

  // Design specific questions (q3 level)
  "q3-uiux": {
    id: "q3-uiux",
    text: "Rate your experience with UI/UX design tools (like Figma, Sketch)",
    type: "scale",
    options: [
      { id: "q3u-a", text: "Complete beginner", value: "1", skillValue: 3 },
      { id: "q3u-b", text: "Some experience", value: "2", skillValue: 5 },
      { id: "q3u-c", text: "Intermediate", value: "3", skillValue: 7 },
      { id: "q3u-d", text: "Advanced", value: "4", skillValue: 9 },
    ],
    followUpQuestions: {
      "1": "q4-time",
      "2": "q4-time",
      "3": "q4-time",
      "4": "q4-time",
    },
    skillArea: "uiux",
  },

  "q3-graphic": {
    id: "q3-graphic",
    text: "What's your experience with graphic design software (Photoshop, Illustrator)?",
    type: "scale",
    options: [
      { id: "q3g-a", text: "Never used", value: "1", skillValue: 2 },
      { id: "q3g-b", text: "Basic knowledge", value: "2", skillValue: 4 },
      { id: "q3g-c", text: "Intermediate", value: "3", skillValue: 6 },
      { id: "q3g-d", text: "Professional level", value: "4", skillValue: 8 },
    ],
    followUpQuestions: {
      "1": "q4-time",
      "2": "q4-time",
      "3": "q4-time",
      "4": "q4-time",
    },
    skillArea: "graphic",
  },

  "q3-animation": {
    id: "q3-animation",
    text: "Which type of animation interests you most?",
    type: "multiple-choice",
    options: [
      { id: "q3a-a", text: "2D Animation & Motion Graphics", value: "2d", skillValue: 6 },
      { id: "q3a-b", text: "3D Modeling & Animation", value: "3d", skillValue: 7 },
      { id: "q3a-c", text: "Video Editing & Post-Production", value: "video", skillValue: 5 },
      { id: "q3a-d", text: "Character Animation", value: "character", skillValue: 8 },
    ],
    followUpQuestions: {
      "2d": "q4-time",
      "3d": "q4-time",
      video: "q4-time",
      character: "q4-time",
    },
    skillArea: "animation",
  },

  "q3-photo": {
    id: "q3-photo",
    text: "What's your photography experience level?",
    type: "multiple-choice",
    options: [
      { id: "q3p-a", text: "Smartphone photos only", value: "beginner", skillValue: 3 },
      { id: "q3p-b", text: "Basic camera knowledge", value: "amateur", skillValue: 5 },
      { id: "q3p-c", text: "Understand composition & lighting", value: "intermediate", skillValue: 7 },
      { id: "q3p-d", text: "Professional/semi-professional", value: "advanced", skillValue: 9 },
    ],
    followUpQuestions: {
      beginner: "q4-time",
      amateur: "q4-time",
      intermediate: "q4-time",
      advanced: "q4-time",
    },
    skillArea: "photo",
  },

  // AI specific questions (q3 level)
  "q3-ml": {
    id: "q3-ml",
    text: "Have you worked with Python for data analysis before?",
    type: "multiple-choice",
    options: [
      { id: "q3ml-a", text: "Never used Python", value: "never", skillValue: 2 },
      { id: "q3ml-b", text: "Basic Python knowledge", value: "basic", skillValue: 4 },
      { id: "q3ml-c", text: "Used Python but not for data", value: "some", skillValue: 6 },
      { id: "q3ml-d", text: "Experienced with Python data analysis", value: "experienced", skillValue: 8 },
    ],
    followUpQuestions: {
      never: "q4-time",
      basic: "q4-time",
      some: "q4-time",
      experienced: "q4-time",
    },
    skillArea: "python",
  },

  "q3-nlp": {
    id: "q3-nlp",
    text: "How familiar are you with natural language processing concepts?",
    type: "multiple-choice",
    options: [
      { id: "q3nlp-a", text: "Complete beginner", value: "beginner", skillValue: 3 },
      { id: "q3nlp-b", text: "Know basic concepts", value: "basic", skillValue: 5 },
      { id: "q3nlp-c", text: "Built simple NLP projects", value: "intermediate", skillValue: 7 },
      { id: "q3nlp-d", text: "Advanced NLP experience", value: "advanced", skillValue: 9 },
    ],
    followUpQuestions: {
      beginner: "q4-time",
      basic: "q4-time",
      intermediate: "q4-time",
      advanced: "q4-time",
    },
    skillArea: "nlp",
  },

  "q3-cv": {
    id: "q3-cv",
    text: "What's your experience with computer vision?",
    type: "multiple-choice",
    options: [
      { id: "q3cv-a", text: "New to computer vision", value: "beginner", skillValue: 3 },
      { id: "q3cv-b", text: "Understand basic concepts", value: "basic", skillValue: 5 },
      { id: "q3cv-c", text: "Used OpenCV or similar", value: "intermediate", skillValue: 7 },
      { id: "q3cv-d", text: "Built CV applications", value: "advanced", skillValue: 9 },
    ],
    followUpQuestions: {
      beginner: "q4-time",
      basic: "q4-time",
      intermediate: "q4-time",
      advanced: "q4-time",
    },
    skillArea: "cv",
  },

  "q3-data-analytics": {
    id: "q3-data-analytics",
    text: "What's your experience with data analysis and business intelligence?",
    type: "multiple-choice",
    options: [
      { id: "q3da-a", text: "New to data analysis", value: "beginner", skillValue: 3 },
      { id: "q3da-b", text: "Basic Excel/Google Sheets", value: "basic", skillValue: 4 },
      { id: "q3da-c", text: "SQL queries and databases", value: "intermediate", skillValue: 6 },
      { id: "q3da-d", text: "Advanced analytics & visualization", value: "advanced", skillValue: 8 },
    ],
    followUpQuestions: {
      beginner: "q4-time",
      basic: "q4-time",
      intermediate: "q4-time",
      advanced: "q4-time",
    },
    skillArea: "data-analytics",
  },

  // Marketing specific questions (q3 level)
  "q3-social": {
    id: "q3-social",
    text: "What's your experience with social media marketing?",
    type: "multiple-choice",
    options: [
      { id: "q3s-a", text: "Personal use only", value: "personal", skillValue: 3 },
      { id: "q3s-b", text: "Managed small accounts", value: "small", skillValue: 5 },
      { id: "q3s-c", text: "Professional experience", value: "professional", skillValue: 7 },
      { id: "q3s-d", text: "Advanced campaigns & analytics", value: "advanced", skillValue: 9 },
    ],
    followUpQuestions: {
      personal: "q4-time",
      small: "q4-time",
      professional: "q4-time",
      advanced: "q4-time",
    },
    skillArea: "social",
  },

  "q3-content": {
    id: "q3-content",
    text: "How would you rate your content creation skills?",
    type: "multiple-choice",
    options: [
      { id: "q3c-a", text: "Beginner - need guidance", value: "beginner", skillValue: 3 },
      { id: "q3c-b", text: "Can create basic content", value: "basic", skillValue: 5 },
      { id: "q3c-c", text: "Good at engaging content", value: "intermediate", skillValue: 7 },
      { id: "q3c-d", text: "Expert content strategist", value: "expert", skillValue: 9 },
    ],
    followUpQuestions: {
      beginner: "q4-time",
      basic: "q4-time",
      intermediate: "q4-time",
      expert: "q4-time",
    },
    skillArea: "content",
  },

  "q3-seo": {
    id: "q3-seo",
    text: "What's your SEO knowledge level?",
    type: "multiple-choice",
    options: [
      { id: "q3seo-a", text: "Don't know much about SEO", value: "none", skillValue: 2 },
      { id: "q3seo-b", text: "Understand basic concepts", value: "basic", skillValue: 4 },
      { id: "q3seo-c", text: "Can optimize content", value: "intermediate", skillValue: 6 },
      { id: "q3seo-d", text: "Advanced SEO strategies", value: "advanced", skillValue: 8 },
    ],
    followUpQuestions: {
      none: "q4-time",
      basic: "q4-time",
      intermediate: "q4-time",
      advanced: "q4-time",
    },
    skillArea: "seo",
  },

  "q3-email": {
    id: "q3-email",
    text: "Have you created email marketing campaigns?",
    type: "multiple-choice",
    options: [
      { id: "q3em-a", text: "Never done email marketing", value: "never", skillValue: 2 },
      { id: "q3em-b", text: "Basic newsletters", value: "basic", skillValue: 4 },
      { id: "q3em-c", text: "Automated campaigns", value: "intermediate", skillValue: 6 },
      { id: "q3em-d", text: "Advanced segmentation & analytics", value: "advanced", skillValue: 8 },
    ],
    followUpQuestions: {
      never: "q4-time",
      basic: "q4-time",
      intermediate: "q4-time",
      advanced: "q4-time",
    },
    skillArea: "email",
  },

  // Web development specific questions (q3 level)
  "q3-frontend": {
    id: "q3-frontend",
    text: "What's your experience with frontend technologies?",
    type: "multiple-choice",
    options: [
      { id: "q3f-a", text: "HTML/CSS basics only", value: "beginner", skillValue: 3 },
      { id: "q3f-b", text: "JavaScript fundamentals", value: "basic", skillValue: 5 },
      { id: "q3f-c", text: "React/Vue experience", value: "intermediate", skillValue: 7 },
      { id: "q3f-d", text: "Advanced frameworks & tools", value: "advanced", skillValue: 9 },
    ],
    followUpQuestions: {
      beginner: "q4-time",
      basic: "q4-time",
      intermediate: "q4-time",
      advanced: "q4-time",
    },
    skillArea: "frontend",
  },

  "q3-backend": {
    id: "q3-backend",
    text: "How familiar are you with backend development?",
    type: "multiple-choice",
    options: [
      { id: "q3b-a", text: "Complete beginner", value: "beginner", skillValue: 3 },
      { id: "q3b-b", text: "Basic server concepts", value: "basic", skillValue: 5 },
      { id: "q3b-c", text: "Built APIs before", value: "intermediate", skillValue: 7 },
      { id: "q3b-d", text: "Full backend systems", value: "advanced", skillValue: 9 },
    ],
    followUpQuestions: {
      beginner: "q4-time",
      basic: "q4-time",
      intermediate: "q4-time",
      advanced: "q4-time",
    },
    skillArea: "backend",
  },

  "q3-fullstack": {
    id: "q3-fullstack",
    text: "Rate your full-stack development experience",
    type: "multiple-choice",
    options: [
      { id: "q3fs-a", text: "Interested but new", value: "beginner", skillValue: 4 },
      { id: "q3fs-b", text: "Built simple full-stack apps", value: "basic", skillValue: 6 },
      { id: "q3fs-c", text: "Comfortable with both ends", value: "intermediate", skillValue: 8 },
      { id: "q3fs-d", text: "Expert full-stack developer", value: "advanced", skillValue: 9 },
    ],
    followUpQuestions: {
      beginner: "q4-time",
      basic: "q4-time",
      intermediate: "q4-time",
      advanced: "q4-time",
    },
    skillArea: "fullstack",
  },

  "q3-mobile": {
    id: "q3-mobile",
    text: "What's your mobile app development experience?",
    type: "multiple-choice",
    options: [
      { id: "q3m-a", text: "No mobile development", value: "none", skillValue: 2 },
      { id: "q3m-b", text: "Tried React Native/Flutter", value: "basic", skillValue: 4 },
      { id: "q3m-c", text: "Published mobile apps", value: "intermediate", skillValue: 7 },
      { id: "q3m-d", text: "Professional mobile developer", value: "advanced", skillValue: 9 },
    ],
    followUpQuestions: {
      none: "q4-time",
      basic: "q4-time",
      intermediate: "q4-time",
      advanced: "q4-time",
    },
    skillArea: "mobile",
  },

  // Time commitment question (common for all paths)
  "q4-time": {
    id: "q4-time",
    text: "How much time can you dedicate to learning weekly?",
    type: "multiple-choice",
    options: [
      { id: "q4-a", text: "1-3 hours", value: "low" },
      { id: "q4-b", text: "4-7 hours", value: "medium" },
      { id: "q4-c", text: "8-15 hours", value: "high" },
      { id: "q4-d", text: "15+ hours (intensive)", value: "intensive" },
    ],
    followUpQuestions: {
      low: "q5-learning",
      medium: "q5-learning",
      high: "q5-learning",
      intensive: "q5-learning",
    },
  },

  // Learning style question
  "q5-learning": {
    id: "q5-learning",
    text: "What's your preferred learning style?",
    type: "multiple-choice",
    options: [
      { id: "q5-a", text: "Video tutorials & demonstrations", value: "video" },
      { id: "q5-b", text: "Reading & documentation", value: "reading" },
      { id: "q5-c", text: "Hands-on interactive exercises", value: "interactive" },
      { id: "q5-d", text: "Mentor-guided projects", value: "mentor" },
    ],
    followUpQuestions: {
      video: "q6-goals",
      reading: "q6-goals",
      interactive: "q6-goals",
      mentor: "q6-goals",
    },
  },

  // Final question about goals
  "q6-goals": {
    id: "q6-goals",
    text: "What's your main goal after completing your learning path?",
    type: "multiple-choice",
    options: [
      { id: "q6-a", text: "Start freelancing", value: "freelance" },
      { id: "q6-b", text: "Get a full-time job", value: "employment" },
      { id: "q6-c", text: "Start my own business", value: "business" },
      { id: "q6-d", text: "Personal skill development", value: "personal" },
    ],
    // No follow-up questions - this ends the quiz
  },
}

// Function to get the next question based on the current answer
export function getNextQuestion(currentQuestionId: string, answer: string): string | null {
  const currentQuestion = quizQuestions[currentQuestionId]

  if (!currentQuestion) {
    return null
  }

  if (currentQuestion.followUpQuestions && currentQuestion.followUpQuestions[answer]) {
    return currentQuestion.followUpQuestions[answer]
  }

  // If no specific follow-up, this means we've reached the end
  return null
}

// Enhanced function to analyze quiz results and generate feedback
export function analyzeQuizResults(answers: QuizAnswer[]): {
  summary: string
  skillLevels: Record<string, number>
  recommendedCourses: string[]
  recommendedMentors: string[]
} {
  // Calculate skill levels
  const skillLevels: Record<string, number> = {}

  answers.forEach((answer) => {
    const question = quizQuestions[answer.questionId]

    if (question && question.skillArea) {
      const option = question.options?.find((opt) => opt.value === answer.value)

      if (option && option.skillValue) {
        if (!skillLevels[question.skillArea]) {
          skillLevels[question.skillArea] = 0
        }
        skillLevels[question.skillArea] = Math.max(skillLevels[question.skillArea], option.skillValue)
      }
    }
  })

  // Determine primary interest area and overall skill level
  let primaryInterest = ""
  let highestSkillValue = 0

  Object.entries(skillLevels).forEach(([skill, value]) => {
    if (value > highestSkillValue) {
      highestSkillValue = value
      primaryInterest = skill
    }
  })

  // Get time commitment and learning style
  const timeAnswer = answers.find(a => a.questionId === 'q4-time')?.value || 'medium'
  const learningAnswer = answers.find(a => a.questionId === 'q5-learning')?.value || 'interactive'
  const goalAnswer = answers.find(a => a.questionId === 'q6-goals')?.value || 'personal'

  // Generate enhanced recommendations based on all factors
  const recommendedCourses: string[] = []
  const recommendedMentors: string[] = []

  // Skill-based recommendations
  switch (primaryInterest) {
    case "interests":
    case "design":
    case "uiux":
    case "graphic":
    case "animation":
    case "2d":
    case "3d":
    case "video":
    case "character":
    case "photo":
      if (highestSkillValue <= 4) {
        recommendedCourses.push("Design Fundamentals", "Color Theory Basics", "Adobe Creative Suite Introduction")
      } else if (highestSkillValue <= 7) {
        recommendedCourses.push("UI/UX Design Principles", "Advanced Photoshop", "Portfolio Development")
      } else {
        recommendedCourses.push("Design Systems Workshop", "Advanced Prototyping", "Design Leadership")
      }
      recommendedMentors.push("Matthew Olifant")
      break

    case "ai":
    case "python":
    case "nlp":
    case "cv":
    case "data-analytics":
      if (highestSkillValue <= 4) {
        recommendedCourses.push("Python Fundamentals", "Introduction to Data Science", "Basic Statistics")
      } else if (highestSkillValue <= 7) {
        recommendedCourses.push("Machine Learning Fundamentals", "Data Analysis with Pandas", "Business Intelligence")
      } else {
        recommendedCourses.push("Advanced Machine Learning", "Deep Learning Specialization", "AI Strategy & Implementation")
      }
      recommendedMentors.push("Sandile Thamie Mhlanga", "Realeboha Nthathakane")
      break

    case "marketing":
    case "social":
    case "content":
    case "seo":
    case "email":
      if (highestSkillValue <= 4) {
        recommendedCourses.push("Digital Marketing Basics", "Content Writing", "Social Media Fundamentals")
      } else if (highestSkillValue <= 7) {
        recommendedCourses.push("Advanced Social Media Strategy", "SEO Optimization", "Email Marketing Automation")
      } else {
        recommendedCourses.push("Marketing Analytics", "Growth Hacking", "Digital Marketing Leadership")
      }
      recommendedMentors.push("Dichwanyo Makgothi")
      break

    case "webdev":
    case "frontend":
    case "backend":
    case "fullstack":
    case "mobile":
      if (highestSkillValue <= 4) {
        recommendedCourses.push("HTML/CSS Fundamentals", "JavaScript Basics", "Web Development Introduction")
      } else if (highestSkillValue <= 7) {
        recommendedCourses.push("React Development", "Node.js Backend", "Database Design")
      } else {
        recommendedCourses.push("Advanced Full-Stack", "System Architecture", "DevOps Fundamentals")
      }
      recommendedMentors.push("Tsehla Motjolopane")
      break

    default:
      recommendedCourses.push("Digital Literacy", "Creative Thinking", "Project Management")
      recommendedMentors.push("Keletso Ntseno")
  }

  // Time-based course adjustments
  if (timeAnswer === 'low') {
    recommendedCourses.push("Micro-learning Modules", "Weekend Workshops")
  } else if (timeAnswer === 'intensive') {
    recommendedCourses.push("Bootcamp Programs", "Accelerated Learning Tracks")
  }

  // Goal-based additions
  if (goalAnswer === 'freelance') {
    recommendedCourses.push("Freelancer Business Setup", "Client Communication", "Portfolio Development")
  } else if (goalAnswer === 'employment') {
    recommendedCourses.push("Interview Preparation", "Resume Building", "Industry Networking")
  } else if (goalAnswer === 'business') {
    recommendedCourses.push("Entrepreneurship Basics", "Business Model Canvas", "Startup Fundamentals")
  }

  // Generate personalized summary
  const timeCommitmentText = timeAnswer === 'low' ? 'part-time' : 
                           timeAnswer === 'intensive' ? 'intensive full-time' : 'regular'
  
  const learningStyleText = learningAnswer === 'video' ? 'video-based learning' :
                           learningAnswer === 'reading' ? 'self-paced reading' :
                           learningAnswer === 'interactive' ? 'hands-on practice' : 'mentored guidance'

  let summary = `Based on your assessment, you show strong interest in ${primaryInterest} with a ${highestSkillValue}/10 skill level. `
  
  if (highestSkillValue <= 4) {
    summary += `As a beginner, you'll benefit from foundational courses that build core concepts step by step. `
  } else if (highestSkillValue <= 7) {
    summary += `With your intermediate skills, you're ready for practical projects and advanced techniques. `
  } else {
    summary += `Your advanced skills position you for expert-level courses and leadership opportunities. `
  }

  summary += `Your ${timeCommitmentText} schedule and preference for ${learningStyleText} will shape your personalized learning path. `
  
  if (goalAnswer === 'freelance') {
    summary += `We'll focus on building both technical skills and business acumen for successful freelancing.`
  } else if (goalAnswer === 'employment') {
    summary += `Your path will emphasize job-ready skills and industry standards.`
  } else if (goalAnswer === 'business') {
    summary += `We'll combine technical training with entrepreneurship fundamentals.`
  } else {
    summary += `Your learning journey will focus on personal growth and skill mastery.`
  }

  return {
    summary,
    skillLevels,
    recommendedCourses,
    recommendedMentors,
  }
}

// Enhanced function to get badge based on quiz results
export function getBadge(answers: QuizAnswer[]): {
  name: string
  description: string
  icon: string
} {
  // Calculate skill levels
  const skillLevels: Record<string, number> = {}

  answers.forEach((answer) => {
    const question = quizQuestions[answer.questionId]

    if (question && question.skillArea) {
      const option = question.options?.find((opt) => opt.value === answer.value)

      if (option && option.skillValue) {
        if (!skillLevels[question.skillArea]) {
          skillLevels[question.skillArea] = 0
        }
        skillLevels[question.skillArea] = Math.max(skillLevels[question.skillArea], option.skillValue)
      }
    }
  })

  // Determine primary interest area and overall skill level
  let primaryInterest = ""
  let highestSkillValue = 0

  Object.entries(skillLevels).forEach(([skill, value]) => {
    if (value > highestSkillValue) {
      highestSkillValue = value
      primaryInterest = skill
    }
  })

  // Get additional context
  const timeAnswer = answers.find(a => a.questionId === 'q4-time')?.value || 'medium'
  const goalAnswer = answers.find(a => a.questionId === 'q6-goals')?.value || 'personal'

  // Assign badges based on primary interest, skill level, and goals
  if (primaryInterest === "design" || primaryInterest === "uiux" || primaryInterest === "graphic" || primaryInterest === "animation" || primaryInterest === "2d" || primaryInterest === "3d" || primaryInterest === "video" || primaryInterest === "character" || primaryInterest === "photo") {
    if (highestSkillValue >= 8) {
      return {
        name: "Design Master",
        description: "You have exceptional design skills and creative vision",
        icon: "palette",
      }
    } else if (highestSkillValue >= 6) {
      return {
        name: "Creative Professional",
        description: "You have solid design foundations and growing expertise",
        icon: "palette",
      }
    } else {
      return {
        name: "Design Explorer",
        description: "You're beginning your creative journey with great potential",
        icon: "lightbulb",
      }
    }
  } else if (primaryInterest === "ai" || primaryInterest === "python" || primaryInterest === "nlp" || primaryInterest === "cv" || primaryInterest === "data-analytics") {
    if (highestSkillValue >= 8) {
      return {
        name: "Data Science Expert",
        description: "You have advanced knowledge in AI, data science and analytics",
        icon: "brain",
      }
    } else if (highestSkillValue >= 6) {
      return {
        name: "Data Analyst",
        description: "You have solid technical skills in data analysis and AI",
        icon: "brain",
      }
    } else {
      return {
        name: "Data Explorer",
        description: "You're starting your journey into the world of data and AI",
        icon: "cpu",
      }
    }
  } else if (primaryInterest === "marketing" || primaryInterest === "social" || primaryInterest === "content" || primaryInterest === "seo" || primaryInterest === "email") {
    if (highestSkillValue >= 8) {
      return {
        name: "Marketing Strategist",
        description: "You have advanced expertise in digital marketing and strategy",
        icon: "trending-up",
      }
    } else if (highestSkillValue >= 6) {
      return {
        name: "Digital Marketer",
        description: "You understand digital marketing principles and tactics",
        icon: "trending-up",
      }
    } else {
      return {
        name: "Brand Ambassador",
        description: "You're developing your marketing and communication skills",
        icon: "megaphone",
      }
    }
  } else if (primaryInterest === "webdev" || primaryInterest === "frontend" || primaryInterest === "backend" || primaryInterest === "fullstack" || primaryInterest === "mobile") {
    if (highestSkillValue >= 8) {
      return {
        name: "Full-Stack Master",
        description: "You have comprehensive web development expertise",
        icon: "code",
      }
    } else if (highestSkillValue >= 6) {
      return {
        name: "Web Developer",
        description: "You have solid programming skills and technical knowledge",
        icon: "code",
      }
    } else {
      return {
        name: "Code Explorer",
        description: "You're building your foundation in web technologies",
        icon: "globe",
      }
    }
  } else {
    // Special badges based on goals and time commitment
    if (goalAnswer === 'business' && timeAnswer === 'intensive') {
      return {
        name: "Future Entrepreneur",
        description: "You're committed to building business and technical skills",
        icon: "star",
      }
    } else if (goalAnswer === 'freelance') {
      return {
        name: "Independent Creator",
        description: "You're building skills for a successful freelance career",
        icon: "star",
      }
    } else if (timeAnswer === 'intensive') {
      return {
        name: "Dedicated Learner",
        description: "Your commitment to intensive learning shows great potential",
        icon: "star",
      }
    } else {
      return {
        name: "Versatile Explorer",
        description: "You have diverse interests and a growth mindset",
        icon: "star",
      }
    }
  }
}

// Validation and helper functions
export function validateQuizCompletion(answers: QuizAnswer[]): boolean {
  if (answers.length < 3) return false // Minimum questions required
  
  // Check for required question types
  const hasInterestQuestion = answers.some(a => a.questionId === 'q1')
  const hasTimeQuestion = answers.some(a => a.questionId === 'q4-time')
  const hasLearningStyleQuestion = answers.some(a => a.questionId === 'q5-learning')
  
  return hasInterestQuestion && hasTimeQuestion && hasLearningStyleQuestion
}

// Get quiz progress percentage
export function getQuizProgress(answers: QuizAnswer[]): number {
  const totalExpectedQuestions = 6 // q1 -> q2-x -> q3-x -> q4-time -> q5-learning -> q6-goals
  return Math.min((answers.length / totalExpectedQuestions) * 100, 100)
}

// Get the expected question sequence for a user's path
export function getExpectedQuestionSequence(primaryInterest: string): string[] {
  const baseSequence = ['q1']
  
  switch (primaryInterest) {
    case 'design':
      return [...baseSequence, 'q2-design', 'q3-uiux', 'q4-time', 'q5-learning', 'q6-goals']
    case 'ai':
      return [...baseSequence, 'q2-ai', 'q3-ml', 'q4-time', 'q5-learning', 'q6-goals']
    case 'marketing':
      return [...baseSequence, 'q2-marketing', 'q3-social', 'q4-time', 'q5-learning', 'q6-goals']
    case 'webdev':
      return [...baseSequence, 'q2-webdev', 'q3-frontend', 'q4-time', 'q5-learning', 'q6-goals']
    default:
      return [...baseSequence, 'q4-time', 'q5-learning', 'q6-goals']
  }
}

// Validate answer for a specific question
export function validateAnswer(questionId: string, answer: string): boolean {
  const question = quizQuestions[questionId]
  if (!question || !question.options) return false
  
  return question.options.some(option => option.value === answer)
}

// Get all possible question IDs (useful for validation)
export function getAllQuestionIds(): string[] {
  return Object.keys(quizQuestions)
}

// Check if a question exists
export function questionExists(questionId: string): boolean {
  return questionId in quizQuestions
}

// Get question by ID with error handling
export function getQuestionById(questionId: string): QuizQuestion | null {
  return quizQuestions[questionId] || null
}

// Predict next questions in the flow (useful for UI progress indicators)
export function predictQuestionFlow(currentQuestionId: string, answer: string): string[] {
  const flow: string[] = []
  let nextQuestionId = getNextQuestion(currentQuestionId, answer)
  
  while (nextQuestionId && flow.length < 10) { // Prevent infinite loops
    flow.push(nextQuestionId)
    const question = quizQuestions[nextQuestionId]
    
    // For prediction, use the first available option
    if (question?.options && question.options.length > 0) {
      const firstOption = question.options[0].value
      nextQuestionId = getNextQuestion(nextQuestionId, firstOption)
    } else {
      break
    }
  }
  
  return flow
}

// Generate a summary of user's path through the quiz
export function generateQuizSummary(answers: QuizAnswer[]): {
  questionsAnswered: number
  primaryPath: string
  skillAreasAssessed: string[]
  completionStatus: 'complete' | 'incomplete' | 'partial'
} {
  const questionsAnswered = answers.length
  const primaryInterestAnswer = answers.find(a => a.questionId === 'q1')
  const primaryPath = primaryInterestAnswer?.value || 'unknown'
  
  const skillAreasAssessed = answers
    .map(answer => {
      const question = quizQuestions[answer.questionId]
      return question?.skillArea
    })
    .filter((area): area is string => area !== undefined)
    .filter((area, index, arr) => arr.indexOf(area) === index) // Remove duplicates
  
  let completionStatus: 'complete' | 'incomplete' | 'partial'
  if (validateQuizCompletion(answers)) {
    completionStatus = 'complete'
  } else if (questionsAnswered >= 3) {
    completionStatus = 'partial'
  } else {
    completionStatus = 'incomplete'
  }
  
  return {
    questionsAnswered,
    primaryPath,
    skillAreasAssessed,
    completionStatus
  }
}

// Error recovery: get a safe next question if flow breaks
export function getSafeNextQuestion(currentQuestionId: string, answers: QuizAnswer[]): string | null {
  // If we don't have time commitment question yet, go there
  if (!answers.some(a => a.questionId === 'q4-time')) {
    return 'q4-time'
  }
  
  // If we don't have learning style question yet, go there
  if (!answers.some(a => a.questionId === 'q5-learning')) {
    return 'q5-learning'
  }
  
  // If we don't have goals question yet, go there
  if (!answers.some(a => a.questionId === 'q6-goals')) {
    return 'q6-goals'
  }
  
  // Quiz should be complete
  return null
}

// Enhanced function for debugging quiz flow
export function debugQuizFlow(answers: QuizAnswer[]): {
  isValid: boolean
  issues: string[]
  suggestions: string[]
} {
  const issues: string[] = []
  const suggestions: string[] = []
  
  // Check if we have required questions
  if (!answers.some(a => a.questionId === 'q1')) {
    issues.push('Missing primary interest question (q1)')
    suggestions.push('Start quiz from the beginning')
  }
  
  // Check for broken flow
  for (let i = 0; i < answers.length - 1; i++) {
    const currentAnswer = answers[i]
    const nextAnswer = answers[i + 1]
    const expectedNext = getNextQuestion(currentAnswer.questionId, currentAnswer.value)
    
    if (expectedNext && expectedNext !== nextAnswer.questionId) {
      issues.push(`Flow break: ${currentAnswer.questionId} -> ${nextAnswer.questionId} (expected ${expectedNext})`)
      suggestions.push('Validate question flow logic')
    }
  }
  
  // Check for invalid answers
  answers.forEach((answer, index) => {
    if (!validateAnswer(answer.questionId, answer.value)) {
      issues.push(`Invalid answer at position ${index}: ${answer.questionId} = ${answer.value}`)
      suggestions.push('Validate answer options')
    }
  })
  
  return {
    isValid: issues.length === 0,
    issues,
    suggestions
  }
}