"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  MessageCircle,
  Users,
  ThumbsUp,
  MessageSquare,
  Search,
  Clock,
  Plus,
  PenTool,
  Bot,
  FileText,
  Award,
  Flag,
  Pin,
  Send,
  Sparkles,
  Hash,
  Bookmark,
  Pencil,
  Upload,
  CheckCircle2,
  Paperclip,
  Trash2,
} from "lucide-react"
import confetti from "canvas-confetti"

// Mock data for forums
const forums = [
  {
    id: 1,
    name: "Design Dojo",
    description: "Discuss Figma, UI/UX principles, and design systems",
    tags: ["Design", "UI/UX", "Figma"],
    memberCount: 128,
    createdBy: {
      id: 1,
      name: "Sandile M.",
      role: "Senior UX Designer",
      avatar: "/canon.jpeg?height=40&width=40",
      bio: "10+ years designing digital products. Previously at Airbnb and Spotify.",
    },
    joined: true,
    posts: 42,
  },
  {
    id: 2,
    name: "AI Builders",
    description: "Explore ChatGPT, ML projects, and AI integration in products",
    tags: ["AI", "Machine Learning", "ChatGPT"],
    memberCount: 96,
    createdBy: {
      id: 2,
      name: "Dichwanyo M.",
      role: "AI Researcher",
      avatar: "/placeholder.svg?height=40&width=40",
      bio: "PhD in Machine Learning. Passionate about making AI accessible to everyone.",
    },
    joined: false,
    posts: 37,
  },
  {
    id: 3,
    name: "Freelance Hub",
    description: "Client tips, contract templates, and pricing strategies",
    tags: ["Freelance", "Business", "Clients"],
    memberCount: 84,
    createdBy: {
      id: 3,
      name: "Vuyolwethu M.",
      role: "Independent Consultant",
      avatar: "/placeholder.svg?height=40&width=40",
      bio: "Freelancing for 7 years. Specializes in helping creatives build sustainable businesses.",
    },
    joined: true,
    posts: 29,
  },
  {
    id: 4,
    name: "Video Production",
    description: "Filmmaking, editing techniques, and storytelling",
    tags: ["Video", "Editing", "Storytelling"],
    memberCount: 62,
    createdBy: {
      id: 4,
      name: "Tsehla M.",
      role: "Documentary Filmmaker",
      avatar: "/placeholder.svg?height=40&width=40",
      bio: "Award-winning filmmaker with a passion for teaching visual storytelling.",
    },
    joined: false,
    posts: 18,
  },
  {
    id: 5,
    name: "Web Development",
    description: "Frontend, backend, and full-stack development discussions",
    tags: ["Coding", "Web", "JavaScript"],
    memberCount: 115,
    createdBy: {
      id: 5,
      name: "Realeboha N.",
      role: "Senior Developer",
      avatar: "/placeholder.svg?height=40&width=40",
      bio: "Full-stack developer with expertise in React, Node.js, and cloud architecture.",
    },
    joined: false,
    posts: 53,
  },
]

// Mock data for forum posts
const forumPosts = [
  {
    id: 1,
    forumId: 1,
    title: "How to create consistent design systems?",
    author: {
      name: "Keletso N.",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Student",
    },
    date: "2 days ago",
    content:
      "I'm working on a large project and struggling to maintain consistency across different components. Any tips for creating a robust design system that scales well?",
    replies: 8,
    likes: 12,
    tags: ["Question", "Design Systems"],
    isPinned: true,
  },
  {
    id: 2,
    forumId: 1,
    title: "Feedback on my portfolio redesign",
    author: {
      name: "Matthew O.",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Student",
    },
    date: "1 day ago",
    content:
      "I've been working on redesigning my UX portfolio. Would love some constructive feedback before I publish it. Here's the Figma link: [figma.com/file/portfolio]",
    replies: 15,
    likes: 24,
    tags: ["Feedback", "Portfolio"],
    isPinned: false,
  },
  {
    id: 3,
    forumId: 1,
    title: "Weekly Challenge: Design a mobile banking app homepage",
    author: {
      name: "Sandile M.",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Mentor",
    },
    date: "3 days ago",
    content:
      "This week's challenge: Design a homepage for a mobile banking app that focuses on financial wellness. Submit your designs by Friday for feedback and a chance to earn the 'Financial UX' badge!",
    replies: 10,
    likes: 32,
    tags: ["Challenge", "UI Design"],
    isPinned: true,
    isMentorChallenge: true,
  },
  {
    id: 4,
    forumId: 3,
    title: "How to handle difficult client revisions?",
    author: {
      name: "Tadiwanashe T.",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Student",
    },
    date: "5 hours ago",
    content:
      "I'm on the 7th round of revisions with a client who keeps changing their mind. How do you professionally set boundaries while still providing good service?",
    replies: 6,
    likes: 9,
    tags: ["Question", "Client Management"],
    isPinned: false,
  },
  {
    id: 5,
    forumId: 3,
    title: "Contract template for design projects",
    author: {
      name: "Vuyolwethu M.",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Mentor",
    },
    date: "1 week ago",
    content:
      "I've created a contract template specifically for design projects that protects both you and your clients. Feel free to customize it for your needs. [Download PDF]",
    replies: 22,
    likes: 47,
    tags: ["Resource", "Contracts"],
    isPinned: true,
  },
]

// Mock data for trending resources
const trendingResources = [
  {
    id: 1,
    title: "Ultimate Figma Component Guide",
    type: "PDF",
    upvotes: 87,
    author: "Sandile M.",
    forumId: 1,
  },
  {
    id: 2,
    title: "Client Onboarding Checklist",
    type: "Template",
    upvotes: 64,
    author: "Vuyolwethu M.",
    forumId: 3,
  },
  {
    id: 3,
    title: "Color Theory Masterclass",
    type: "Video",
    upvotes: 52,
    author: "Keletso N.",
    forumId: 1,
  },
]

// Mock data for chat messages
const chatMessages = [
  {
    id: 1,
    author: {
      name: "Sandile M.",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Mentor",
    },
    content: "Welcome to Design Dojo! Please introduce yourself and share what you're working on.",
    timestamp: "10:15 AM",
    isPinned: true,
  },
  {
    id: 2,
    author: {
      name: "Keletso N.",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Student",
    },
    content: "Hi everyone! I'm Keletso, currently working on a mobile app for a local restaurant.",
    timestamp: "10:23 AM",
    isPinned: false,
  },
  {
    id: 3,
    author: {
      name: "Matthew O.",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Student",
    },
    content: "Does anyone have recommendations for icon libraries that work well with dark mode interfaces?",
    timestamp: "10:45 AM",
    isPinned: false,
  },
  {
    id: 4,
    author: {
      name: "AI Assistant",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Bot",
    },
    content:
      "For dark mode icons, you might want to check out Phosphor Icons or Lucide. Both have excellent dark mode support and are free to use.",
    timestamp: "10:46 AM",
    isPinned: false,
    isAI: true,
  },
  {
    id: 5,
    author: {
      name: "Sandile M.",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Mentor",
    },
    content: "Great suggestion! I'd also recommend Iconoir for minimalist icons that work well in dark mode.",
    timestamp: "10:50 AM",
    isPinned: false,
  },
]

// Mock data for weekly AI discussion topics
const weeklyTopics = [
  {
    id: 1,
    forumId: 1,
    title: "How are you incorporating accessibility into your design process?",
    responses: 14,
  },
  {
    id: 2,
    forumId: 3,
    title: "What's your approach to pricing design work in 2025?",
    responses: 23,
  },
  {
    id: 3,
    forumId: 2,
    title: "How are you using AI to enhance your creative workflow?",
    responses: 19,
  },
]

// Mock user data (for role-based UI)
const currentUser = {
  id: 101,
  name: "You",
  role: "Student", // Change to "Mentor" to see mentor-specific UI
  avatar: "/placeholder.svg?height=40&width=40",
}

export default function CommunityPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("forums")
  const [selectedForum, setSelectedForum] = useState(forums[0])
  const [activeFeed, setActiveFeed] = useState("posts")
  const [likedPosts, setLikedPosts] = useState<number[]>([])
  const [chatMessage, setChatMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateForumOpen, setIsCreateForumOpen] = useState(false)
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
  const [newForumName, setNewForumName] = useState("")
  const [newForumDescription, setNewForumDescription] = useState("")
  const [newForumTags, setNewForumTags] = useState("")
  const [newPostTitle, setNewPostTitle] = useState("")
  const [newPostContent, setNewPostContent] = useState("")
  const [newPostTag, setNewPostTag] = useState("Question")
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false)
  const [isPeerReviewOpen, setIsPeerReviewOpen] = useState(false)
  const [isSubmitChallengeOpen, setIsSubmitChallengeOpen] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const confettiRef = useRef<HTMLDivElement>(null)

  // Filter posts based on selected forum
  const filteredPosts = forumPosts.filter((post) => post.forumId === selectedForum.id)

  // Sort posts with pinned posts first
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return 0
  })

  const handleLikePost = (postId: number) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter((id) => id !== postId))
    } else {
      setLikedPosts([...likedPosts, postId])
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send the message to a backend
    setChatMessage("")
  }

  const handleCreateForum = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would create a new forum in the backend
    setIsCreateForumOpen(false)
    setNewForumName("")
    setNewForumDescription("")
    setNewForumTags("")
  }

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would create a new post in the backend
    setIsCreatePostOpen(false)
    setNewPostTitle("")
    setNewPostContent("")
  }

  const handleJoinForum = (forumId: number) => {
    // In a real app, this would join the forum in the backend
    const updatedForums = forums.map((forum) => (forum.id === forumId ? { ...forum, joined: true } : forum))
    // This is just for the mock UI
    setSelectedForum({ ...selectedForum, joined: true })
  }

  const handleSubmitChallenge = () => {
    setIsSubmitChallengeOpen(false)
    setShowConfetti(true)

    // Trigger confetti effect
    if (confettiRef.current) {
      const rect = confettiRef.current.getBoundingClientRect()
      confetti({
        particleCount: 100,
        spread: 70,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        },
      })
    }

    // Hide confetti after animation
    setTimeout(() => {
      setShowConfetti(false)
    }, 3000)
  }

  // Weekly topic for the selected forum
  const currentWeeklyTopic = weeklyTopics.find((topic) => topic.forumId === selectedForum.id)

  return (
    <div className="min-h-screen bg-background" ref={confettiRef}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Community</h1>
          <p className="mt-2 text-lg text-muted-foreground">Connect, collaborate, and grow with peers and mentors</p>
        </div>

        <Tabs defaultValue="forums" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
            <TabsTrigger value="forums">
              <MessageCircle className="mr-2 h-4 w-4" />
              Forums
            </TabsTrigger>
            <TabsTrigger value="explore">
              <Users className="mr-2 h-4 w-4" />
              Explore
            </TabsTrigger>
          </TabsList>

          <TabsContent value="forums" className="mt-6">
            {/* Mobile sidebar toggle */}
            <div className="lg:hidden flex justify-between items-center mb-4">
              <Button variant="outline" onClick={() => setIsMobileSidebarOpen(true)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                My Forums
              </Button>

              {currentUser.role === "Mentor" && (
                <Button onClick={() => setIsCreateForumOpen(true)} className="bg-[#6E56CF] hover:bg-[#5D47B2]">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Forum
                </Button>
              )}
            </div>

            {/* Mobile sidebar */}
            <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>My Forums</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <ForumSidebar
                    forums={forums}
                    selectedForum={selectedForum}
                    setSelectedForum={(forum) => {
                      setSelectedForum(forum)
                      setIsMobileSidebarOpen(false)
                    }}
                  />
                </div>
              </SheetContent>
            </Sheet>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Sidebar - Forums */}
              <div className="hidden lg:block lg:col-span-3">
                <Card className="h-full">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xl">My Forums</CardTitle>
                    {currentUser.role === "Mentor" && (
                      <Button
                        onClick={() => setIsCreateForumOpen(true)}
                        size="sm"
                        className="bg-[#6E56CF] hover:bg-[#5D47B2]"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="pb-0">
                    <ForumSidebar forums={forums} selectedForum={selectedForum} setSelectedForum={setSelectedForum} />
                  </CardContent>
                </Card>
              </div>

              {/* Main Content - Forum Feed */}
              <div className="lg:col-span-6">
                <Card className="h-full flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl flex items-center">
                          {selectedForum.name}
                          {selectedForum.joined ? (
                            <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-200">
                              Joined
                            </Badge>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="ml-2"
                              onClick={() => handleJoinForum(selectedForum.id)}
                            >
                              Join Forum
                            </Button>
                          )}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{selectedForum.description}</p>
                      </div>
                      {selectedForum.joined && (
                        <Button onClick={() => setIsCreatePostOpen(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          New Post
                        </Button>
                      )}
                    </div>
                  </CardHeader>

                  <div className="px-6 pb-2">
                    <Tabs defaultValue="posts" onValueChange={setActiveFeed}>
                      <TabsList className="w-full">
                        <TabsTrigger value="posts" className="flex-1">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Posts
                        </TabsTrigger>
                        <TabsTrigger value="chat" className="flex-1">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Live Chat
                        </TabsTrigger>
                        <TabsTrigger value="tools" className="flex-1">
                          <PenTool className="h-4 w-4 mr-2" />
                          Tools
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  <CardContent className="flex-1 overflow-y-auto">
                    {activeFeed === "posts" && (
                      <div className="space-y-6">
                        {/* Weekly AI Discussion Topic */}
                        {currentWeeklyTopic && (
                          <Card className="bg-[#6E56CF]/10 border-[#6E56CF]/20">
                            <CardHeader className="pb-2">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center">
                                    <Sparkles className="h-5 w-5 text-[#6E56CF] mr-2" />
                                    <span className="text-sm font-medium text-[#6E56CF]">Weekly Discussion Topic</span>
                                  </div>
                                  <CardTitle className="text-lg mt-1">{currentWeeklyTopic.title}</CardTitle>
                                </div>
                                <Badge variant="outline" className="bg-[#6E56CF]/20 text-[#6E56CF] border-[#6E56CF]/30">
                                  {currentWeeklyTopic.responses} responses
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardFooter className="pt-2">
                              <Button variant="outline" className="w-full">
                                Join Discussion
                              </Button>
                            </CardFooter>
                          </Card>
                        )}

                        {/* Forum Posts */}
                        {sortedPosts.length > 0 ? (
                          sortedPosts.map((post) => (
                            <Card key={post.id} className={post.isPinned ? "border-[#6E56CF]/30" : ""}>
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center">
                                    <Avatar className="h-10 w-10 mr-3">
                                      <AvatarImage
                                        src={post.author.avatar || "/placeholder.svg"}
                                        alt={post.author.name}
                                      />
                                      <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <CardTitle className="text-lg">{post.title}</CardTitle>
                                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                                        <span className="flex items-center">
                                          {post.author.name}
                                          {post.author.role === "Mentor" && (
                                            <Badge
                                              variant="outline"
                                              className="ml-1 text-xs bg-[#6E56CF]/10 text-[#6E56CF] border-[#6E56CF]/20"
                                            >
                                              Mentor
                                            </Badge>
                                          )}
                                        </span>
                                        <span className="mx-2">•</span>
                                        <span className="flex items-center">
                                          <Clock className="h-3 w-3 mr-1" />
                                          {post.date}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {post.isPinned && (
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Pin className="h-4 w-4 text-[#6E56CF]" />
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Pinned by mentor</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    )}
                                    <div className="flex space-x-1">
                                      {post.tags.map((tag, index) => (
                                        <Badge
                                          key={index}
                                          variant="outline"
                                          className="bg-primary/10 text-primary border-primary/20"
                                        >
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="text-foreground">{post.content}</p>

                                {post.isMentorChallenge && (
                                  <div className="mt-4 p-4 bg-[#6E56CF]/5 rounded-lg border border-[#6E56CF]/20">
                                    <div className="flex items-center mb-2">
                                      <Award className="h-5 w-5 text-[#6E56CF] mr-2" />
                                      <h4 className="font-medium text-[#6E56CF]">Mentor Challenge</h4>
                                    </div>
                                    <p className="text-sm mb-3">
                                      Complete this challenge to earn the 'Financial UX' badge!
                                    </p>
                                    <Button
                                      onClick={() => setIsSubmitChallengeOpen(true)}
                                      className="w-full bg-[#6E56CF] hover:bg-[#5D47B2]"
                                    >
                                      Submit Your Work
                                    </Button>
                                  </div>
                                )}
                              </CardContent>
                              <CardFooter className="flex justify-between border-t border-border pt-4">
                                <div className="flex items-center space-x-4">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex items-center"
                                    onClick={() => handleLikePost(post.id)}
                                  >
                                    <ThumbsUp
                                      className={`mr-1 h-4 w-4 ${likedPosts.includes(post.id) ? "fill-primary text-primary" : ""}`}
                                    />
                                    <span>{likedPosts.includes(post.id) ? post.likes + 1 : post.likes}</span>
                                  </Button>
                                  <div className="flex items-center text-muted-foreground">
                                    <MessageSquare className="mr-1 h-4 w-4" />
                                    <span>{post.replies} replies</span>
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <Button size="sm" variant="outline">
                                    Reply
                                  </Button>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button size="sm" variant="outline">
                                          <Flag className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Flag inappropriate content</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </CardFooter>
                            </Card>
                          ))
                        ) : (
                          <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                              <MessageCircle className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                              Be the first to start a discussion in this forum!
                            </p>
                            <Button onClick={() => setIsCreatePostOpen(true)}>Create First Post</Button>
                          </div>
                        )}
                      </div>
                    )}

                    {activeFeed === "chat" && (
                      <div className="flex flex-col h-full">
                        <ScrollArea className="flex-1 pr-4 -mr-4">
                          <div className="space-y-4 mb-4">
                            {chatMessages.map((message) => (
                              <div
                                key={message.id}
                                className={`flex ${message.isPinned ? "bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800/30" : ""}`}
                              >
                                <Avatar className="h-8 w-8 mr-2">
                                  <AvatarImage
                                    src={message.author.avatar || "/placeholder.svg"}
                                    alt={message.author.name}
                                  />
                                  <AvatarFallback>{message.author.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center">
                                    <span className="font-medium text-sm">{message.author.name}</span>
                                    {message.author.role === "Mentor" && (
                                      <Badge
                                        variant="outline"
                                        className="ml-1 text-xs bg-[#6E56CF]/10 text-[#6E56CF] border-[#6E56CF]/20"
                                      >
                                        Mentor
                                      </Badge>
                                    )}
                                    {message.author.role === "Bot" && (
                                      <Badge
                                        variant="outline"
                                        className="ml-1 text-xs bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/30"
                                      >
                                        AI
                                      </Badge>
                                    )}
                                    <span className="ml-2 text-xs text-muted-foreground">{message.timestamp}</span>
                                    {message.isPinned && <Pin className="h-3 w-3 ml-2 text-amber-500" />}
                                  </div>
                                  <p className="text-sm mt-1">{message.content}</p>
                                </div>
                                {currentUser.role === "Mentor" && !message.isPinned && (
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-2">
                                    <Pin className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </ScrollArea>

                        <div className="mt-4 pt-4 border-t border-border">
                          <form onSubmit={handleSendMessage} className="flex space-x-2">
                            <Input
                              placeholder="Type your message..."
                              value={chatMessage}
                              onChange={(e) => setChatMessage(e.target.value)}
                              className="flex-1"
                            />
                            <Button type="submit" disabled={!chatMessage.trim()}>
                              <Send className="h-4 w-4" />
                            </Button>
                          </form>
                          {chatMessage.trim().length > 0 && (
                            <div className="mt-2 p-2 bg-emerald-50 dark:bg-emerald-950/20 rounded text-sm flex items-start border border-emerald-100 dark:border-emerald-800/30">
                              <Bot className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mr-2 mt-0.5" />
                              <div>
                                <p className="font-medium text-emerald-700 dark:text-emerald-400">AI Suggestion</p>
                                <p className="text-emerald-800 dark:text-emerald-300">
                                  Consider checking out the Iconoir library for minimalist icons that work well in dark
                                  mode interfaces.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {activeFeed === "tools" && (
                      <div className="space-y-6">
                        {/* Collaborative Whiteboard */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <PenTool className="h-5 w-5 mr-2" />
                              Collaborative Whiteboard
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground mb-4">
                              Brainstorm ideas, sketch concepts, and collaborate in real-time with other forum members.
                            </p>
                            <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center border">
                              <Button onClick={() => setIsWhiteboardOpen(true)}>Open Whiteboard</Button>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Peer Review System */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <FileText className="h-5 w-5 mr-2" />
                              Peer Review
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground mb-4">
                              Submit your work for feedback from peers and AI-powered analysis to identify strengths and
                              areas for improvement.
                            </p>
                            <Button onClick={() => setIsPeerReviewOpen(true)} className="w-full">
                              Submit Work for Review
                            </Button>
                          </CardContent>
                        </Card>

                        {/* Mentorship Challenges */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <Award className="h-5 w-5 mr-2" />
                              Mentorship Challenges
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground mb-4">
                              Complete challenges set by mentors to earn badges and improve your skills.
                            </p>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between p-3 bg-[#6E56CF]/5 rounded-lg border border-[#6E56CF]/20">
                                <div>
                                  <h4 className="font-medium">Design a mobile banking app homepage</h4>
                                  <p className="text-sm text-muted-foreground">Due in 2 days</p>
                                </div>
                                <Button onClick={() => setIsSubmitChallengeOpen(true)} size="sm">
                                  Submit
                                </Button>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border">
                                <div>
                                  <h4 className="font-medium">Create a logo for a coffee shop</h4>
                                  <p className="text-sm text-muted-foreground">Completed</p>
                                </div>
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Done
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar - Mentor & Resources */}
              <div className="hidden lg:block lg:col-span-3">
                <div className="space-y-6">
                  {/* Mentor Spotlight */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Mentor Spotlight</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center text-center">
                        <Avatar className="h-20 w-20 mb-4">
                          <AvatarImage
                            src={selectedForum.createdBy.avatar || "/placeholder.svg"}
                            alt={selectedForum.createdBy.name}
                          />
                          <AvatarFallback>{selectedForum.createdBy.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h3 className="font-medium text-lg">{selectedForum.createdBy.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{selectedForum.createdBy.role}</p>
                        <p className="text-sm mb-4">{selectedForum.createdBy.bio}</p>
                        <Button variant="outline" className="w-full">
                          View Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Trending Resources */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Trending Resources</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {trendingResources.map((resource) => (
                          <div key={resource.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                              {resource.type === "PDF" && <FileText className="h-4 w-4 mr-2 text-red-500" />}
                              {resource.type === "Template" && <FileText className="h-4 w-4 mr-2 text-blue-500" />}
                              {resource.type === "Video" && <FileText className="h-4 w-4 mr-2 text-purple-500" />}
                              <div>
                                <p className="font-medium text-sm">{resource.title}</p>
                                <p className="text-xs text-muted-foreground">By {resource.author}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <ThumbsUp className="h-4 w-4" />
                              </Button>
                              <span className="text-sm font-medium">{resource.upvotes}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Forum Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Forum Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Members</span>
                          <span className="font-medium">{selectedForum.memberCount}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Posts</span>
                          <span className="font-medium">{selectedForum.posts}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Active Today</span>
                          <span className="font-medium">24</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="explore" className="mt-6">
            <div className="mb-6">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search forums..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {forums.map((forum) => (
                <Card key={forum.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">{forum.name}</CardTitle>
                      <Badge variant="outline">
                        <Users className="h-3 w-3 mr-1" />
                        {forum.memberCount}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{forum.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {forum.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={forum.createdBy.avatar || "/placeholder.svg"} alt={forum.createdBy.name} />
                        <AvatarFallback>{forum.createdBy.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>Created by {forum.createdBy.name}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Button
                      className="w-full"
                      variant={forum.joined ? "outline" : "default"}
                      onClick={() => {
                        if (!forum.joined) {
                          // Join the forum
                          handleJoinForum(forum.id)
                        }
                        // Set as selected forum and switch to forums tab
                        setSelectedForum(forum)
                        setActiveTab("forums")
                      }}
                    >
                      {forum.joined ? "View Forum" : "Join Forum"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Create Forum Dialog (Mentor Only) */}
        <Dialog open={isCreateForumOpen} onOpenChange={setIsCreateForumOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Forum</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateForum}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="forum-name">Forum Name</Label>
                  <Input
                    id="forum-name"
                    placeholder="e.g., Web Development"
                    value={newForumName}
                    onChange={(e) => setNewForumName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="forum-description">Description</Label>
                  <Textarea
                    id="forum-description"
                    placeholder="What is this forum about?"
                    value={newForumDescription}
                    onChange={(e) => setNewForumDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="forum-tags">Tags (comma separated)</Label>
                  <Input
                    id="forum-tags"
                    placeholder="e.g., Coding, JavaScript, React"
                    value={newForumTags}
                    onChange={(e) => setNewForumTags(e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="forum-private" />
                  <Label htmlFor="forum-private">Make this forum private (invitation only)</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateForumOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Forum</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Create Post Dialog */}
        <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePost}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="post-title">Title</Label>
                  <Input
                    id="post-title"
                    placeholder="Enter a descriptive title"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="post-tag">Post Type</Label>
                  <Select value={newPostTag} onValueChange={setNewPostTag}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select post type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Question">Question</SelectItem>
                      <SelectItem value="Discussion">Discussion</SelectItem>
                      <SelectItem value="Resource">Resource</SelectItem>
                      <SelectItem value="Feedback">Feedback Request</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="post-content">Content</Label>
                  <Textarea
                    id="post-content"
                    placeholder="Describe your question or discussion topic..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="min-h-[150px]"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Attach files or links</span>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreatePostOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Post</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Whiteboard Dialog */}
        <Dialog open={isWhiteboardOpen} onOpenChange={setIsWhiteboardOpen}>
          <DialogContent className="sm:max-w-[90vw] sm:max-h-[80vh] sm:h-[80vh]">
            <DialogHeader>
              <DialogTitle>Collaborative Whiteboard</DialogTitle>
            </DialogHeader>
            <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <PenTool className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Whiteboard Placeholder</h3>
                <p className="text-muted-foreground mb-4">
                  This is a placeholder for the collaborative whiteboard feature.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button variant="outline">
                    <Pencil className="h-4 w-4 mr-2" />
                    Draw
                  </Button>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Image
                  </Button>
                  <Button variant="outline">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Peer Review Dialog */}
        <Dialog open={isPeerReviewOpen} onOpenChange={setIsPeerReviewOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Submit Work for Peer Review</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="review-title">Title</Label>
                <Input id="review-title" placeholder="e.g., Portfolio Website Feedback" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="review-description">Description</Label>
                <Textarea
                  id="review-description"
                  placeholder="Describe what you're looking for feedback on..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Upload Work</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">Drag and drop files here, or click to browse</p>
                  <p className="text-xs text-muted-foreground">
                    Supports images, PDFs, Figma links, and GitHub repositories
                  </p>
                  <Button variant="outline" size="sm" className="mt-4">
                    Browse Files
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Review Options</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="ai-review" defaultChecked />
                    <Label htmlFor="ai-review">Include AI analysis</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="mentor-review" />
                    <Label htmlFor="mentor-review">Request mentor review (Premium)</Label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsPeerReviewOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsPeerReviewOpen(false)}>Submit for Review</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Submit Challenge Dialog */}
        <Dialog open={isSubmitChallengeOpen} onOpenChange={setIsSubmitChallengeOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Submit Challenge: Design a mobile banking app homepage</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Upload Your Design</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop your design file here, or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">Supports PNG, JPG, PDF, or Figma link</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    Browse Files
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="challenge-notes">Notes (optional)</Label>
                <Textarea
                  id="challenge-notes"
                  placeholder="Share any context or explanation about your design..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsSubmitChallengeOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitChallenge}>Submit Challenge</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confetti Animation */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md text-center">
              <div className="mb-4 text-5xl">🎉</div>
              <h3 className="text-xl font-bold mb-2">Challenge Completed!</h3>
              <p className="mb-4">You've earned the "Financial UX" badge!</p>
              <div className="inline-block bg-[#6E56CF]/10 p-3 rounded-full mb-4">
                <Award className="h-12 w-12 text-[#6E56CF]" />
              </div>
              <p className="text-sm text-muted-foreground">
                Your submission will be reviewed by the mentor. Check your profile to see your new badge!
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// Forum Sidebar Component
function ForumSidebar({
  forums,
  selectedForum,
  setSelectedForum,
}: {
  forums: any[]
  selectedForum: any
  setSelectedForum: (forum: any) => void
}) {
  // Filter forums to show joined ones first
  const joinedForums = forums.filter((forum) => forum.joined)
  const otherForums = forums.filter((forum) => !forum.joined)
  const sortedForums = [...joinedForums, ...otherForums]

  return (
    <div className="space-y-1">
      {sortedForums.map((forum) => (
        <button
          key={forum.id}
          className={`w-full flex items-center justify-between p-2 rounded-md text-left ${
            selectedForum.id === forum.id ? "bg-primary/10 text-primary" : "hover:bg-muted"
          }`}
          onClick={() => setSelectedForum(forum)}
        >
          <div className="flex items-center">
            <Hash className="h-4 w-4 mr-2" />
            <span className="truncate">{forum.name}</span>
          </div>
          <div className="flex items-center space-x-1">
            {forum.joined && <Bookmark className="h-3 w-3 text-primary" />}
            <Badge variant="outline" className="text-xs">
              {forum.memberCount}
            </Badge>
          </div>
        </button>
      ))}
    </div>
  )
}
