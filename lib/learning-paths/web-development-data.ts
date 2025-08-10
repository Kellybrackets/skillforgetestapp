// web-development-data.ts
import { Course, InterviewRole, InterviewQuestions, ProjectBrief, LearningPathData } from './learning-paths-utils'

export const webDevelopmentCourses: Course[] = [
  {
    id: "1",
    title: "HTML & CSS Fundamentals",
    description: "Master the building blocks of web development",
    duration: "3 weeks",
    level: "Beginner",
    skills: ["HTML", "CSS", "Responsive Design"],
    instructor: "John Smith",
    rating: 4.8,
    students: 1200
  },
  {
    id: "2",
    title: "JavaScript Programming",
    description: "Learn modern JavaScript for interactive web applications",
    duration: "5 weeks",
    level: "Intermediate",
    skills: ["JavaScript", "DOM Manipulation", "ES6+"],
    instructor: "Sarah Johnson",
    rating: 4.9,
    students: 950
  },
  {
    id: "3",
    title: "React Development",
    description: "Build dynamic user interfaces with React",
    duration: "4 weeks",
    level: "Intermediate",
    skills: ["React", "JSX", "Hooks", "State Management"],
    instructor: "Mike Chen",
    rating: 4.7,
    students: 800
  },
  {
    id: "4",
    title: "Node.js & Backend Development",
    description: "Create server-side applications with Node.js",
    duration: "4 weeks",
    level: "Intermediate",
    skills: ["Node.js", "Express", "APIs", "Server-side"],
    instructor: "Lisa Williams",
    rating: 4.6,
    students: 650
  },
  {
    id: "5",
    title: "Database Design & Management",
    description: "Learn SQL and database integration",
    duration: "3 weeks",
    level: "Intermediate",
    skills: ["SQL", "Database Design", "MongoDB", "PostgreSQL"],
    instructor: "David Brown",
    rating: 4.5,
    students: 500
  },
  {
    id: "6",
    title: "Full-Stack Project Development",
    description: "Build complete web applications from start to finish",
    duration: "6 weeks",
    level: "Advanced",
    skills: ["Full-Stack", "MERN Stack", "Deployment", "Testing"],
    instructor: "Emma Davis",
    rating: 4.8,
    students: 350
  },
]

export const webDevelopmentInterviewRoles: InterviewRole[] = [
  {
    id: "frontend-developer",
    role: "Frontend Developer",
    company: "Tech Company",
    description: "Build user interfaces",
    experience: "2-3 years",
    skills: ["React", "JavaScript", "CSS"],
    questions: ["What is React?", "How do you handle state?"],
    tips: ["Practice coding challenges", "Know React fundamentals"]
  },
  {
    id: "backend-developer",
    role: "Backend Developer",
    company: "Tech Company",
    description: "Build server-side applications",
    experience: "2-3 years",
    skills: ["Node.js", "APIs", "Databases"],
    questions: ["What are REST APIs?", "How do you design databases?"],
    tips: ["Understand API design", "Know database concepts"]
  },
  {
    id: "fullstack-developer",
    role: "Full-Stack Developer",
    company: "Tech Company",
    description: "Build complete applications",
    experience: "3-4 years",
    skills: ["React", "Node.js", "Databases", "DevOps"],
    questions: ["How do you architect applications?", "What is your deployment process?"],
    tips: ["Know both frontend and backend", "Understand system design"]
  },
]

export const webDevelopmentInterviewQuestions: InterviewQuestions = {
  "frontend-developer": [
    "How do you ensure cross-browser compatibility in your applications?",
    "What's your approach to responsive web design?",
    "How do you optimize website performance and loading times?",
    "Explain the difference between let, const, and var in JavaScript",
    "How do you handle state management in complex React applications?",
  ],
  "backend-developer": [
    "How do you design RESTful APIs?",
    "What's your approach to database optimization?",
    "How do you handle authentication and authorization?",
    "Explain your experience with different database systems",
    "How do you ensure API security and prevent common vulnerabilities?",
  ],
  "fullstack-developer": [
    "How do you architect a full-stack application from scratch?",
    "What's your approach to connecting frontend and backend systems?",
    "How do you handle deployment and DevOps processes?",
    "Describe your experience with version control and collaboration",
    "How do you balance performance between frontend and backend?",
  ],
}

export const webDevelopmentProjectBriefs: ProjectBrief[] = [
  {
    id: "1",
    title: "E-commerce Website for Local Business",
    description: "Build a complete e-commerce website for 'Mzansi Crafts', a South African artisan marketplace. Include product catalog, shopping cart, payment integration, and admin dashboard.",
    difficulty: "Advanced",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    estimatedTime: "21 days",
    skills: ["React", "Node.js", "Database", "Payment Integration"],
    deliverables: ["Frontend application", "Backend API", "Database design", "Payment integration", "Admin dashboard"]
  },
  {
    id: "2",
    title: "Restaurant Booking System",
    description: "Create a reservation system for 'Cape Town Eateries', featuring table booking, menu display, and customer management for multiple restaurant locations.",
    difficulty: "Intermediate",
    technologies: ["React", "Express", "PostgreSQL"],
    estimatedTime: "14 days",
    skills: ["Frontend Development", "Backend API", "Database Design"],
    deliverables: ["Booking interface", "Restaurant management", "Customer portal", "Analytics dashboard"]
  },
  {
    id: "3",
    title: "Portfolio Website for Creative Agency",
    description: "Develop a stunning portfolio website for 'Joburg Creative', showcasing their design work with smooth animations, contact forms, and content management.",
    difficulty: "Intermediate",
    technologies: ["HTML", "CSS", "JavaScript", "GSAP"],
    estimatedTime: "10 days",
    skills: ["HTML/CSS", "JavaScript", "Responsive Design"],
    deliverables: ["Responsive website", "Portfolio showcase", "Contact system", "CMS integration"]
  },
]

export const webDevelopmentData: LearningPathData = {
  courses: webDevelopmentCourses,
  interviewRoles: webDevelopmentInterviewRoles,
  interviewQuestions: webDevelopmentInterviewQuestions,
  projectBriefs: webDevelopmentProjectBriefs,
}