// design-creativity-data.ts
import { Course, InterviewRole, InterviewQuestions, ProjectBrief, LearningPathData } from './learning-paths-utils'

// Update designCreativityData in learning-paths-utils.ts to include all creative disciplines

export const designCreativityData: LearningPathData = {
  courses: [
    // Visual Design Courses
    {
      id: 'design-fundamentals',
      title: 'Design Fundamentals',
      description: 'Learn core design principles, color theory, and typography',
      duration: '4 weeks',
      level: 'beginner',
      skills: ['Design Theory', 'Color Theory', 'Typography'],
      instructor: 'Lisa Park',
      rating: 4.7,
      students: 950
    },
    {
      id: 'figma-mastery',
      title: 'Figma for UI/UX Design',
      description: 'Master the industry-standard design tool',
      duration: '6 weeks',
      level: 'intermediate',
      skills: ['Figma', 'UI Design', 'Prototyping'],
      instructor: 'James Wilson',
      rating: 4.8,
      students: 1200
    },
    {
      id: 'brand-design',
      title: 'Brand Identity Design',
      description: 'Create compelling brand identities and visual systems',
      duration: '5 weeks',
      level: 'intermediate',
      skills: ['Brand Design', 'Logo Design', 'Visual Identity'],
      instructor: 'Sarah Chen',
      rating: 4.6,
      students: 800
    },

    // Photography Courses
    {
      id: 'photography-basics',
      title: 'Photography Fundamentals',
      description: 'Master camera settings, composition, and lighting',
      duration: '6 weeks',
      level: 'beginner',
      skills: ['Photography', 'Composition', 'Lighting', 'Camera Techniques'],
      instructor: 'Mike Rodriguez',
      rating: 4.9,
      students: 1500
    },
    {
      id: 'portrait-photography',
      title: 'Portrait Photography Mastery',
      description: 'Professional portrait techniques and people photography',
      duration: '4 weeks',
      level: 'intermediate',
      skills: ['Portrait Photography', 'Studio Lighting', 'Posing'],
      instructor: 'Keletso Ntseno',
      rating: 4.8,
      students: 650
    },
    {
      id: 'photo-editing',
      title: 'Photo Editing with Lightroom & Photoshop',
      description: 'Professional photo editing and retouching techniques',
      duration: '5 weeks',
      level: 'intermediate',
      skills: ['Photo Editing', 'Lightroom', 'Photoshop', 'Color Grading'],
      instructor: 'Emma Davis',
      rating: 4.7,
      students: 900
    },

    // Video Production Courses
    {
      id: 'video-editing-basics',
      title: 'Video Editing Fundamentals',
      description: 'Learn video editing with industry-standard software',
      duration: '6 weeks',
      level: 'beginner',
      skills: ['Video Editing', 'Premiere Pro', 'Storytelling'],
      instructor: 'Vuyolwethu Mbhele',
      rating: 4.8,
      students: 1100
    },
    {
      id: 'motion-graphics',
      title: 'Motion Graphics & Animation',
      description: 'Create engaging motion graphics and animations',
      duration: '8 weeks',
      level: 'intermediate',
      skills: ['Motion Graphics', 'After Effects', 'Animation'],
      instructor: 'David Kim',
      rating: 4.6,
      students: 750
    },
    {
      id: 'cinematography',
      title: 'Cinematography & Visual Storytelling',
      description: 'Master camera work and visual narrative techniques',
      duration: '7 weeks',
      level: 'advanced',
      skills: ['Cinematography', 'Visual Storytelling', 'Camera Operation'],
      instructor: 'Rachel Thompson',
      rating: 4.9,
      students: 500
    },

    // Audio & Sound Design Courses
    {
      id: 'sound-design-basics',
      title: 'Sound Design Fundamentals',
      description: 'Create professional sound effects and audio landscapes',
      duration: '5 weeks',
      level: 'beginner',
      skills: ['Sound Design', 'Audio Editing', 'Foley'],
      instructor: 'Alex Martinez',
      rating: 4.7,
      students: 600
    },
    {
      id: 'music-production',
      title: 'Music Production & Beat Making',
      description: 'Produce music tracks and beats using digital tools',
      duration: '8 weeks',
      level: 'intermediate',
      skills: ['Music Production', 'Beat Making', 'Mixing', 'Audio Software'],
      instructor: 'Jordan Brooks',
      rating: 4.8,
      students: 850
    },
    {
      id: 'podcast-production',
      title: 'Podcast Production & Audio Storytelling',
      description: 'Create professional podcasts and audio content',
      duration: '4 weeks',
      level: 'beginner',
      skills: ['Podcasting', 'Audio Editing', 'Voice Recording', 'Storytelling'],
      instructor: 'Priya Patel',
      rating: 4.6,
      students: 700
    }
  ],

  projectBriefs: [
    // Visual Design Projects
    {
      id: 'brand-identity-project',
      title: 'Complete Brand Identity Design',
      description: 'Design a full brand identity including logo, colors, typography, and guidelines',
      difficulty: 'intermediate',
      technologies: ['Figma', 'Adobe Illustrator', 'Photoshop'],
      estimatedTime: '4-5 weeks',
      skills: ['Brand Design', 'Logo Design', 'Visual Systems', 'Design Guidelines'],
      deliverables: ['Logo design', 'Brand guidelines', 'Business card design', 'Social media templates']
    },

    // Photography Projects  
    {
      id: 'photography-portfolio',
      title: 'Professional Photography Portfolio',
      description: 'Create a diverse portfolio showcasing different photography styles',
      difficulty: 'intermediate',
      technologies: ['DSLR Camera', 'Lightroom', 'Photoshop'],
      estimatedTime: '6-8 weeks',
      skills: ['Photography', 'Photo Editing', 'Portfolio Curation', 'Visual Storytelling'],
      deliverables: ['20-image portfolio', 'Website gallery', 'Print-ready images', 'Artist statement']
    },

    // Video Production Projects
    {
      id: 'short-film-project',
      title: 'Short Film Production',
      description: 'Write, shoot, and edit a complete short film or documentary',
      difficulty: 'advanced',
      technologies: ['Video Camera', 'Premiere Pro', 'After Effects', 'Audio Equipment'],
      estimatedTime: '8-10 weeks',
      skills: ['Cinematography', 'Video Editing', 'Storytelling', 'Sound Design'],
      deliverables: ['5-10 minute film', 'Behind-the-scenes video', 'Film festival submission', 'Director\'s statement']
    },

    // Audio Projects
    {
      id: 'podcast-series',
      title: 'Podcast Series Launch',
      description: 'Create and launch a complete podcast series with multiple episodes',
      difficulty: 'intermediate',
      technologies: ['Audio Recording Equipment', 'Audacity', 'Podcast Hosting'],
      estimatedTime: '6-8 weeks',
      skills: ['Podcasting', 'Audio Editing', 'Content Creation', 'Interviewing'],
      deliverables: ['5-episode series', 'Podcast artwork', 'Show notes', 'Distribution strategy']
    }
  ],

  interviewRoles: [
    // Visual Design Roles
    {
      id: 'ui-designer',
      role: 'UI Designer',
      company: 'Design Studio',
      description: 'Create beautiful and functional user interfaces for digital products',
      experience: 'junior',
      skills: ['UI Design', 'Figma', 'Design Systems', 'Visual Design'],
      questions: [
        'Walk me through your design process',
        'How do you approach responsive design?',
        'What makes a good user interface?',
        'How do you handle design feedback and revisions?'
      ],
      tips: [
        'Build a strong design portfolio with case studies',
        'Stay updated with current design trends',
        'Practice explaining your design decisions',
        'Show before/after examples in your work'
      ]
    },

    // Photography Roles
    {
      id: 'photographer',
      role: 'Commercial Photographer',
      company: 'Creative Agency',
      description: 'Capture high-quality images for brands and marketing campaigns',
      experience: 'mid',
      skills: ['Photography', 'Photo Editing', 'Client Communication', 'Studio Lighting'],
      questions: [
        'How do you approach a new photography brief?',
        'What\'s your post-processing workflow?',
        'How do you handle difficult lighting situations?',
        'Tell me about a challenging shoot and how you solved it'
      ],
      tips: [
        'Showcase diverse photography styles in portfolio',
        'Demonstrate technical proficiency with lighting',
        'Show client work and commercial projects',
        'Highlight problem-solving abilities'
      ]
    },

    // Video Production Roles
    {
      id: 'video-editor',
      role: 'Video Editor',
      company: 'Media Production Company',
      description: 'Edit and produce engaging video content for various platforms',
      experience: 'junior',
      skills: ['Video Editing', 'Premiere Pro', 'After Effects', 'Color Grading'],
      questions: [
        'What\'s your video editing workflow?',
        'How do you approach storytelling in video?',
        'What codecs and formats do you work with?',
        'How do you handle tight deadlines?'
      ],
      tips: [
        'Create a demo reel showcasing different styles',
        'Show understanding of various video formats',
        'Demonstrate efficiency in workflow',
        'Highlight collaborative project experience'
      ]
    },

    // Audio/Sound Roles
    {
      id: 'sound-designer',
      role: 'Sound Designer',
      company: 'Gaming Studio',
      description: 'Create immersive audio experiences and sound effects for games',
      experience: 'mid',
      skills: ['Sound Design', 'Audio Software', 'Game Audio', 'Creative Problem Solving'],
      questions: [
        'How do you approach creating sounds for different environments?',
        'What audio software and tools do you use?',
        'How do you work with game engines for audio implementation?',
        'Describe your creative process for sound design'
      ],
      tips: [
        'Build a portfolio of diverse sound samples',
        'Show understanding of interactive audio',
        'Demonstrate technical audio skills',
        'Highlight creative and unique sound solutions'
      ]
    }
  ],

  interviewQuestions: {
    "ui-designer": [
      "Walk me through your design process",
      "How do you approach responsive design?",
      "What makes a good user interface?",
      "How do you handle design feedback and revisions?"
    ],
    "photographer": [
      "How do you approach a new photography brief?",
      "What's your post-processing workflow?",
      "How do you handle difficult lighting situations?",
      "Tell me about a challenging shoot and how you solved it"
    ],
    "video-editor": [
      "What's your video editing workflow?",
      "How do you approach storytelling in video?",
      "What codecs and formats do you work with?",
      "How do you handle tight deadlines?"
    ],
    "sound-designer": [
      "How do you approach creating sounds for different environments?",
      "What audio software and tools do you use?",
      "How do you work with game engines for audio implementation?",
      "Describe your creative process for sound design"
    ]
  }
}