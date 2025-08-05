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

// Mock quiz questions
export const quizQuestions: Record<string, QuizQuestion> = {
  q1: {
    id: "q1",
    text: "What's your primary learning goal?",
    type: "multiple-choice",
    options: [
      { id: "q1-a", text: "Design and creativity", value: "design", skillValue: 5 },
      { id: "q1-b", text: "AI and machine learning", value: "ai", skillValue: 5 },
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
      { id: "q2d-c", text: "3D Modeling", value: "3d", skillValue: 7 },
      { id: "q2d-d", text: "Photography", value: "photo", skillValue: 7 },
    ],
    followUpQuestions: {
      uiux: "q3-uiux",
      graphic: "q3-graphic",
      "3d": "q3-3d",
      photo: "q3-photo",
    },
    skillArea: "design",
  },

  // AI follow-up questions
  "q2-ai": {
    id: "q2-ai",
    text: "Which AI topic are you most interested in?",
    type: "multiple-choice",
    options: [
      { id: "q2ai-a", text: "Machine Learning Fundamentals", value: "ml-basics", skillValue: 7 },
      { id: "q2ai-b", text: "Natural Language Processing", value: "nlp", skillValue: 7 },
      { id: "q2ai-c", text: "Computer Vision", value: "cv", skillValue: 7 },
      { id: "q2ai-d", text: "AI Ethics", value: "ethics", skillValue: 7 },
    ],
    followUpQuestions: {
      "ml-basics": "q3-ml",
      nlp: "q3-nlp",
      cv: "q3-cv",
      ethics: "q3-ethics",
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

  // UI/UX specific questions
  "q3-uiux": {
    id: "q3-uiux",
    text: "Rate your experience with UI/UX design tools (like Figma, Sketch)",
    type: "scale",
    options: [
      { id: "q3u-a", text: "Beginner", value: "1", skillValue: 3 },
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

  // Machine Learning specific questions
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

  // Time commitment question (common for all paths)
  "q4-time": {
    id: "q4-time",
    text: "How much time can you dedicate to learning weekly?",
    type: "multiple-choice",
    options: [
      { id: "q4-a", text: "1-3 hours", value: "low" },
      { id: "q4-b", text: "4-7 hours", value: "medium" },
      { id: "q4-c", text: "8+ hours", value: "high" },
    ],
    followUpQuestions: {
      low: "q5-learning",
      medium: "q5-learning",
      high: "q5-learning",
    },
  },

  // Learning style question
  "q5-learning": {
    id: "q5-learning",
    text: "What's your preferred learning style?",
    type: "multiple-choice",
    options: [
      { id: "q5-a", text: "Video tutorials", value: "video" },
      { id: "q5-b", text: "Reading documentation", value: "reading" },
      { id: "q5-c", text: "Interactive exercises", value: "interactive" },
      { id: "q5-d", text: "Mentor-guided projects", value: "mentor" },
    ],
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

  // If no specific follow-up, get the next question in sequence
  const questionIds = Object.keys(quizQuestions)
  const currentIndex = questionIds.indexOf(currentQuestionId)

  if (currentIndex < questionIds.length - 1) {
    return questionIds[currentIndex + 1]
  }

  return null // No more questions
}

// Function to analyze quiz results and generate feedback
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

  // Determine primary interest area
  let primaryInterest = ""
  let highestSkillValue = 0

  Object.entries(skillLevels).forEach(([skill, value]) => {
    if (value > highestSkillValue) {
      highestSkillValue = value
      primaryInterest = skill
    }
  })

  // Generate recommendations based on primary interest
  const recommendedCourses: string[] = []
  const recommendedMentors: string[] = []

  switch (primaryInterest) {
    case "design":
    case "uiux":
      recommendedCourses.push("UI/UX Fundamentals", "Design Systems Workshop", "Figma Masterclass")
      recommendedMentors.push("Matthew Olifant")
      break
    case "ai":
    case "python":
      recommendedCourses.push("Python for Data Science", "Machine Learning Fundamentals", "AI Ethics")
      recommendedMentors.push("Sandile Thamie Mhlanga", "Realeboha Nthathakane")
      break
    case "marketing":
    case "social":
      recommendedCourses.push("Digital Marketing Strategy", "Social Media Growth Hacking", "Content Creation")
      recommendedMentors.push("Dichwanyo Makgothi")
      break
    case "webdev":
    case "frontend":
    case "backend":
      recommendedCourses.push("Web Development Bootcamp", "React Fundamentals", "Backend with Node.js")
      recommendedMentors.push("Tsehla Motjolopane")
      break
    default:
      recommendedCourses.push("Introduction to Digital Skills", "Creative Thinking", "Project Management")
      recommendedMentors.push("Keletso Ntseno")
  }

  // Generate summary
  let summary = ""

  if (primaryInterest === "design" || primaryInterest === "uiux") {
    summary =
      "You show a strong interest in design and creativity. Your assessment indicates you have a good foundation in visual thinking, but could benefit from more structured UI/UX methodologies."
  } else if (primaryInterest === "ai" || primaryInterest === "python") {
    summary =
      "You're drawn to AI and data science. Your results show you have some technical aptitude, but would benefit from strengthening your Python programming skills before diving deeper into machine learning algorithms."
  } else if (primaryInterest === "marketing" || primaryInterest === "social") {
    summary =
      "Digital marketing is your primary interest area. You demonstrate good understanding of communication principles, but could enhance your skills in analytics and data-driven marketing strategies."
  } else if (primaryInterest === "webdev" || primaryInterest === "frontend" || primaryInterest === "backend") {
    summary =
      "Web development is your focus area. You show aptitude for technical problem-solving, but would benefit from more hands-on project experience to solidify your coding skills."
  } else {
    summary =
      "Your interests span multiple areas, showing you have a versatile mindset. Consider starting with foundational courses before specializing in a specific direction."
  }

  return {
    summary,
    skillLevels,
    recommendedCourses,
    recommendedMentors,
  }
}

// Function to get badge based on quiz results
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

  // Determine primary interest area
  let primaryInterest = ""
  let highestSkillValue = 0

  Object.entries(skillLevels).forEach(([skill, value]) => {
    if (value > highestSkillValue) {
      highestSkillValue = value
      primaryInterest = skill
    }
  })

  // Assign badge based on primary interest and skill level
  if (primaryInterest === "design" || primaryInterest === "uiux") {
    if (highestSkillValue >= 7) {
      return {
        name: "Design Enthusiast",
        description: "You have a strong foundation in design principles and tools",
        icon: "palette",
      }
    } else {
      return {
        name: "Creative Explorer",
        description: "You're beginning your journey into the world of design",
        icon: "lightbulb",
      }
    }
  } else if (primaryInterest === "ai" || primaryInterest === "python") {
    if (highestSkillValue >= 7) {
      return {
        name: "Data Scientist",
        description: "You have solid technical skills in AI and data analysis",
        icon: "brain",
      }
    } else {
      return {
        name: "AI Novice",
        description: "You're taking your first steps into the world of AI",
        icon: "cpu",
      }
    }
  } else if (primaryInterest === "marketing" || primaryInterest === "social") {
    if (highestSkillValue >= 7) {
      return {
        name: "Marketing Strategist",
        description: "You understand the principles of effective digital marketing",
        icon: "trending-up",
      }
    } else {
      return {
        name: "Brand Ambassador",
        description: "You're developing your marketing and communication skills",
        icon: "megaphone",
      }
    }
  } else if (primaryInterest === "webdev" || primaryInterest === "frontend" || primaryInterest === "backend") {
    if (highestSkillValue >= 7) {
      return {
        name: "Code Craftsman",
        description: "You have strong technical skills in web development",
        icon: "code",
      }
    } else {
      return {
        name: "Web Pioneer",
        description: "You're building your foundation in web technologies",
        icon: "globe",
      }
    }
  } else {
    return {
      name: "Versatile Learner",
      description: "You have diverse interests across multiple domains",
      icon: "star",
    }
  }
}
