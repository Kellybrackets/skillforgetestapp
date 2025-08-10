// ai-data-science-data.ts
import { Course, InterviewRole, InterviewQuestions, ProjectBrief, LearningPathData } from './learning-paths-utils'

export const aiDataScienceCourses: Course[] = [
  {
    id: "1",
    title: "Python for Data Science",
    description: "Master Python programming for data analysis and machine learning",
    duration: "4 weeks",
    level: "Beginner",
    skills: ["Python", "Pandas", "NumPy", "Data Analysis"],
    instructor: "Dr. Sarah Chen",
    rating: 4.8,
    students: 1200
  },
  {
    id: "2",
    title: "Statistics & Probability",
    description: "Learn essential statistics concepts for data science",
    duration: "3 weeks",
    level: "Beginner",
    skills: ["Statistics", "Probability", "Hypothesis Testing"],
    instructor: "Prof. Mike Johnson",
    rating: 4.6,
    students: 900
  },
  {
    id: "3",
    title: "Machine Learning Fundamentals",
    description: "Introduction to supervised and unsupervised learning algorithms",
    duration: "5 weeks",
    level: "Intermediate",
    skills: ["Machine Learning", "Scikit-learn", "Algorithms"],
    instructor: "Dr. Alex Kim",
    rating: 4.9,
    students: 800
  },
  {
    id: "4",
    title: "Deep Learning & Neural Networks",
    description: "Build neural networks with TensorFlow and Keras",
    duration: "6 weeks",
    level: "Advanced",
    skills: ["Deep Learning", "TensorFlow", "Neural Networks"],
    instructor: "Dr. Emma Rodriguez",
    rating: 4.7,
    students: 600
  },
  {
    id: "5",
    title: "Data Visualization",
    description: "Create compelling visualizations with matplotlib and seaborn",
    duration: "2 weeks",
    level: "Intermediate",
    skills: ["Data Visualization", "Matplotlib", "Seaborn", "Plotly"],
    instructor: "Lisa Wong",
    rating: 4.5,
    students: 700
  },
  {
    id: "6",
    title: "Big Data & Cloud Platforms",
    description: "Work with large datasets using cloud platforms and distributed computing",
    duration: "4 weeks",
    level: "Advanced",
    skills: ["Big Data", "AWS", "Spark", "Cloud Computing"],
    instructor: "David Park",
    rating: 4.6,
    students: 450
  },
]

export const aiDataScienceInterviewRoles: InterviewRole[] = [
  {
    id: "data-scientist",
    role: "Data Scientist",
    company: "Tech Company",
    description: "Analyze data and build predictive models",
    experience: "2-4 years",
    skills: ["Python", "Machine Learning", "Statistics", "SQL"],
    questions: ["How do you approach a new data science problem?", "Explain the bias-variance tradeoff"],
    tips: ["Practice coding problems", "Know statistics fundamentals", "Understand ML algorithms"]
  },
  {
    id: "ml-engineer",
    role: "Machine Learning Engineer",
    company: "AI Startup",
    description: "Build and deploy ML systems in production",
    experience: "3-5 years",
    skills: ["MLOps", "Python", "TensorFlow", "Docker", "Kubernetes"],
    questions: ["How do you deploy ML models to production?", "What are common ML deployment challenges?"],
    tips: ["Understand MLOps practices", "Know cloud platforms", "Practice system design"]
  },
  {
    id: "data-analyst",
    role: "Data Analyst",
    company: "Business Intelligence",
    description: "Analyze business data and create insights",
    experience: "1-3 years",
    skills: ["SQL", "Excel", "Tableau", "Python", "Statistics"],
    questions: ["How do you identify trends in data?", "What visualization techniques do you use?"],
    tips: ["Master SQL queries", "Know visualization tools", "Understand business context"]
  },
]

export const aiDataScienceInterviewQuestions: InterviewQuestions = {
  "data-scientist": [
    "How do you approach a new data science problem from start to finish?",
    "Explain the difference between supervised and unsupervised learning",
    "What is overfitting and how do you prevent it?",
    "How do you evaluate the performance of a machine learning model?",
    "Describe a challenging data science project you worked on"
  ],
  "ml-engineer": [
    "How do you deploy machine learning models to production?",
    "What are the key considerations for ML system scalability?",
    "How do you monitor ML models in production?",
    "Explain your experience with containerization and orchestration",
    "What are common challenges in MLOps?"
  ],
  "data-analyst": [
    "How do you identify and communicate insights from data?",
    "What visualization techniques work best for different data types?",
    "How do you ensure data quality and accuracy?",
    "Describe your SQL optimization experience",
    "How do you present findings to non-technical stakeholders?"
  ]
}

export const aiDataScienceProjectBriefs: ProjectBrief[] = [
  {
    id: "1",
    title: "Customer Churn Prediction Model",
    description: "Build a machine learning model to predict customer churn for a South African telecom company. Include data analysis, feature engineering, model selection, and deployment recommendations.",
    difficulty: "Intermediate",
    technologies: ["Python", "Pandas", "Scikit-learn", "Jupyter", "Flask"],
    estimatedTime: "21 days",
    skills: ["Machine Learning", "Data Analysis", "Feature Engineering"],
    deliverables: ["Data analysis report", "ML model", "API endpoint", "Model documentation"]
  },
  {
    id: "2",
    title: "Retail Sales Forecasting Dashboard",
    description: "Create a comprehensive sales forecasting system for 'Mzansi Retail', including time series analysis, seasonal patterns, and interactive dashboard for business stakeholders.",
    difficulty: "Advanced",
    technologies: ["Python", "Prophet", "Streamlit", "Plotly", "PostgreSQL"],
    estimatedTime: "28 days",
    skills: ["Time Series Analysis", "Data Visualization", "Dashboard Creation"],
    deliverables: ["Forecasting model", "Interactive dashboard", "API service", "Documentation"]
  },
  {
    id: "3",
    title: "Sentiment Analysis for Social Media",
    description: "Develop a sentiment analysis system for a South African brand's social media presence. Process tweets, Facebook posts, and reviews to gauge public sentiment.",
    difficulty: "Intermediate",
    technologies: ["Python", "NLTK", "spaCy", "Twitter API", "Docker"],
    estimatedTime: "14 days",
    skills: ["Natural Language Processing", "API Integration", "Text Analysis"],
    deliverables: ["NLP pipeline", "Sentiment classifier", "Real-time dashboard", "API documentation"]
  },
]

export const aiDataScienceData: LearningPathData = {
  courses: aiDataScienceCourses,
  interviewRoles: aiDataScienceInterviewRoles,
  interviewQuestions: aiDataScienceInterviewQuestions,
  projectBriefs: aiDataScienceProjectBriefs,
}