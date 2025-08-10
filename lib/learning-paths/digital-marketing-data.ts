// digital-marketing-data.ts
import { Course, InterviewRole, InterviewQuestions, ProjectBrief, LearningPathData } from './learning-paths-utils'

export const digitalMarketingCourses: Course[] = [
  {
    id: "1",
    title: "Digital Marketing Fundamentals",
    description: "Master the basics of digital marketing strategy and channels",
    duration: "3 weeks",
    level: "Beginner",
    skills: ["Digital Marketing", "Analytics", "Strategy"],
    instructor: "Marketing Expert",
    rating: 4.7,
    students: 800
  },
  {
    id: "2",
    title: "Social Media Marketing Mastery",
    description: "Learn to create engaging content and grow social media presence",
    duration: "4 weeks",
    level: "Intermediate",
    skills: ["Social Media", "Content Creation", "Community Management"],
    instructor: "Social Media Pro",
    rating: 4.8,
    students: 650
  },
  {
    id: "3",
    title: "Google Ads & PPC Campaigns",
    description: "Master paid advertising on Google and other platforms",
    duration: "3 weeks",
    level: "Intermediate",
    skills: ["PPC", "Google Ads", "Campaign Management"],
    instructor: "PPC Specialist",
    rating: 4.6,
    students: 500
  },
  {
    id: "4",
    title: "Content Marketing Strategy",
    description: "Create compelling content that drives engagement and conversions",
    duration: "4 weeks",
    level: "Intermediate",
    skills: ["Content Strategy", "Copywriting", "SEO"],
    instructor: "Content Strategist",
    rating: 4.5,
    students: 450
  },
  {
    id: "5",
    title: "Email Marketing Automation",
    description: "Build automated email sequences that nurture leads and customers",
    duration: "2 weeks",
    level: "Intermediate",
    skills: ["Email Marketing", "Automation", "Lead Nurturing"],
    instructor: "Email Expert",
    rating: 4.4,
    students: 400
  },
  {
    id: "6",
    title: "Analytics & Performance Tracking",
    description: "Learn to measure and optimize your marketing campaigns",
    duration: "3 weeks",
    level: "Advanced",
    skills: ["Analytics", "Data Analysis", "Optimization"],
    instructor: "Analytics Guru",
    rating: 4.7,
    students: 300
  },
]

export const digitalMarketingInterviewRoles: InterviewRole[] = [
  {
    id: "digital-marketer",
    role: "Digital Marketing Specialist",
    company: "Marketing Agency",
    description: "Develop and execute digital marketing strategies",
    experience: "2-3 years",
    skills: ["Digital Marketing", "Analytics", "Campaign Management"],
    questions: ["How do you develop a digital marketing strategy?", "What metrics do you track?"],
    tips: ["Know various marketing channels", "Understand analytics tools"]
  },
  {
    id: "social-media-manager",
    role: "Social Media Manager",
    company: "Brand Agency",
    description: "Manage social media presence and campaigns",
    experience: "1-2 years",
    skills: ["Social Media", "Content Creation", "Community Management"],
    questions: ["How do you create a content calendar?", "How do you handle negative feedback?"],
    tips: ["Stay updated with platform changes", "Know content creation tools"]
  },
  {
    id: "content-marketer",
    role: "Content Marketing Manager",
    company: "Content Agency",
    description: "Create and manage content marketing strategies",
    experience: "2-4 years",
    skills: ["Content Strategy", "SEO", "Copywriting"],
    questions: ["How do you develop content strategy?", "What is your SEO process?"],
    tips: ["Understand SEO fundamentals", "Know content distribution channels"]
  },
]

export const digitalMarketingInterviewQuestions: InterviewQuestions = {
  "digital-marketer": [
    "How do you develop a comprehensive digital marketing strategy?",
    "What metrics do you use to measure campaign success?",
    "How do you allocate budget across different marketing channels?",
    "Describe a successful campaign you've run and what made it work",
    "How do you stay updated with digital marketing trends and platform changes?",
  ],
  "social-media-manager": [
    "How do you create a content calendar for multiple social platforms?",
    "What's your approach to handling negative comments or a social media crisis?",
    "How do you measure ROI on social media marketing efforts?",
    "Describe your process for creating engaging visual content",
    "How do you tailor content for different South African audience segments?",
  ],
  "content-marketer": [
    "How do you develop a content strategy aligned with business goals?",
    "What's your process for keyword research and SEO optimization?",
    "How do you repurpose content across different channels and formats?",
    "Describe how you measure content performance and engagement",
    "How do you ensure content resonates with diverse South African audiences?",
  ],
}

export const digitalMarketingProjectBriefs: ProjectBrief[] = [
  {
    id: "1",
    title: "Social Media Campaign for Local Restaurant Chain",
    description: "Create a comprehensive social media marketing campaign for 'Braai Bros', a South African restaurant chain launching in 3 new cities. Include content strategy, posting schedule, and paid ad campaigns.",
    difficulty: "Intermediate",
    technologies: ["Facebook Ads", "Instagram", "Canva", "Hootsuite"],
    estimatedTime: "14 days",
    skills: ["Social Media Marketing", "Content Creation", "Paid Advertising"],
    deliverables: ["Content calendar", "Social media posts", "Ad campaigns", "Performance metrics"]
  },
  {
    id: "2",
    title: "SEO Content Strategy for E-commerce Site",
    description: "Develop an SEO content strategy for 'ShopMzansi', an online marketplace for South African products. Create content pillars, keyword strategy, and blog content calendar.",
    difficulty: "Advanced",
    technologies: ["Google Analytics", "SEMrush", "WordPress", "Google Search Console"],
    estimatedTime: "21 days",
    skills: ["SEO", "Content Marketing", "Analytics"],
    deliverables: ["Keyword research", "Content strategy", "Blog calendar", "SEO audit"]
  },
  {
    id: "3",
    title: "Email Marketing Campaign for Tech Startup",
    description: "Design and implement an email marketing campaign for 'TechConnect', a B2B SaaS startup in Cape Town. Include welcome series, nurture sequences, and conversion campaigns.",
    difficulty: "Intermediate",
    technologies: ["Mailchimp", "ConvertKit", "Zapier", "Canva"],
    estimatedTime: "10 days",
    skills: ["Email Marketing", "Automation", "Copywriting"],
    deliverables: ["Email sequences", "Templates", "Automation workflows", "Performance tracking"]
  },
]

export const digitalMarketingData: LearningPathData = {
  courses: digitalMarketingCourses,
  interviewRoles: digitalMarketingInterviewRoles,
  interviewQuestions: digitalMarketingInterviewQuestions,
  projectBriefs: digitalMarketingProjectBriefs,
}