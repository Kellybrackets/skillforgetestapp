// freelancer-data.ts
export interface FreelanceModule {
    title: string
    description: string
    lessons: {
      id: string
      title: string
      duration: string
      topics: string[]
    }[]
  }
  
  export const freelanceModules: { [key: string]: FreelanceModule[] } = {
    'Web Development': [
      {
        title: 'Finding Web Development Clients',
        description: 'Learn how to identify and attract potential clients for web development projects',
        lessons: [
          {
            id: 'web-clients-1',
            title: 'Identifying Your Target Market',
            duration: '45 min',
            topics: [
              'Small business websites',
              'E-commerce solutions',
              'Corporate web applications',
              'Non-profit organizations'
            ]
          },
          {
            id: 'web-clients-2',
            title: 'Building Your Portfolio',
            duration: '60 min',
            topics: [
              'Showcase diverse projects',
              'Case study development',
              'Before/after comparisons',
              'Client testimonials'
            ]
          }
        ]
      },
      {
        title: 'Pricing Web Development Projects',
        description: 'Master the art of pricing your web development services competitively',
        lessons: [
          {
            id: 'web-pricing-1',
            title: 'Project-Based vs Hourly Pricing',
            duration: '40 min',
            topics: [
              'When to use each model',
              'South African market rates',
              'Value-based pricing',
              'Avoiding scope creep'
            ]
          }
        ]
      }
    ],
    'Digital Marketing': [
      {
        title: 'Finding Marketing Clients',
        description: 'Strategies for attracting businesses that need digital marketing services',
        lessons: [
          {
            id: 'marketing-clients-1',
            title: 'Local Business Outreach',
            duration: '50 min',
            topics: [
              'Restaurant and retail chains',
              'Professional services',
              'Tourism businesses',
              'Local e-commerce stores'
            ]
          }
        ]
      }
    ],
    'Design & Creativity': [
      {
        title: 'Building a Design Freelance Business',
        description: 'From portfolio to client management for creative professionals',
        lessons: [
          {
            id: 'design-business-1',
            title: 'Portfolio Presentation',
            duration: '55 min',
            topics: [
              'Digital portfolio platforms',
              'Print portfolio creation',
              'Client presentation skills',
              'Design process documentation'
            ]
          }
        ]
      }
    ],
    'AI & Data Science': [
      {
        title: 'Data Science Consulting',
        description: 'How to offer data science services as a freelancer',
        lessons: [
          {
            id: 'data-consulting-1',
            title: 'Identifying Data Opportunities',
            duration: '60 min',
            topics: [
              'Business intelligence needs',
              'Automation opportunities',
              'Predictive analytics projects',
              'Data visualization services'
            ]
          }
        ]
      }
    ]
  }
  
  export interface FreelanceSkill {
    title: string
    description: string
    icon: string
    examples: string[]
  }
  
  export const commonFreelanceSkills: FreelanceSkill[] = [
    {
      title: "Client Communication",
      description: "Master professional communication with clients",
      icon: "MessageSquare",
      examples: [
        "Writing professional proposals",
        "Managing client expectations",
        "Handling difficult conversations",
        "Regular progress updates"
      ]
    },
    {
      title: "Project Management",
      description: "Deliver projects on time and within budget",
      icon: "Calendar",
      examples: [
        "Breaking down complex projects",
        "Setting realistic timelines",
        "Managing multiple clients",
        "Quality assurance processes"
      ]
    },
    {
      title: "Pricing & Contracts",
      description: "Price your services competitively and protect your business",
      icon: "FileText",
      examples: [
        "Value-based pricing strategies",
        "Contract templates and terms",
        "Payment schedules and policies",
        "Scope management"
      ]
    },
    {
      title: "Business Development",
      description: "Grow your freelance business sustainably",
      icon: "TrendingUp",
      examples: [
        "Building a strong portfolio",
        "Networking and referrals",
        "Online presence optimization",
        "Client retention strategies"
      ]
    }
  ]