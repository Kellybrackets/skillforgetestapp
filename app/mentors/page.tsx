"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Search, Filter, Star } from "lucide-react"
import Link from "next/link"

// Mock data for mentors
const mentors = [
  {
    id: 1,
    name: "Sandile Thamie Mhlanga",
    expertise: "AI & Machine Learning",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download.jpg-GjIN7Tt7xyqYcVOj9Ka7NclIC0Rx4z.png",
    bio: "Former Google AI researcher with 10+ years of experience in machine learning and neural networks.",
    rating: 4.9,
    reviews: 124,
    availability: "Available",
  },
  {
    id: 2,
    name: "Keletso Ntseno",
    expertise: "Photography",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-09%20at%2017.06.22-lwaEDkJeaZ2nTPuYsOUeuCCSsiFzHS.jpeg",
    bio: "Award-winning photographer specializing in portrait and landscape photography.",
    rating: 4.7,
    reviews: 98,
    availability: "Limited",
  },
  {
    id: 3,
    name: "Dichwanyo Makgothi",
    expertise: "Digital Marketing",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-09%20at%2016.38.07-mlZ3qzRH0V8C9OFaBcgudXkqcseXyV.jpeg",
    bio: "Digital marketing strategist who has worked with Fortune 500 companies on social media campaigns.",
    rating: 4.8,
    reviews: 156,
    availability: "Available",
  },
  {
    id: 4,
    name: "Matthew Olifant",
    expertise: "UI/UX Design",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-09%20at%2017.24.00-MW5n3DdeSgdSXV7G0J2MdnZmsH2iMx.jpeg",
    bio: "Senior designer with experience at top tech companies, specializing in user-centered design.",
    rating: 4.6,
    reviews: 87,
    availability: "Available",
  },
  {
    id: 5,
    name: "Vuyolwethu Mbhele",
    expertise: "Video Production",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-09%20at%2017.20.57-uVE08DItoJO6s4Knv1h29jm9LMwuUx.jpeg",
    bio: "Emmy-nominated filmmaker with expertise in documentary and commercial video production.",
    rating: 4.9,
    reviews: 112,
    availability: "Limited",
  },
  {
    id: 6,
    name: "Tsehla Motjolopane",
    expertise: "Web Development",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-09%20at%2017.21.57-IvMlL9S8TJfDXfXl76Ar58x9i4Fih7.jpeg",
    bio: "Full-stack developer and educator with a passion for teaching modern web technologies.",
    rating: 4.8,
    reviews: 143,
    availability: "Available",
  },
  {
    id: 7,
    name: "Realeboha Nthathakane",
    expertise: "Data Science",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-09%20at%2017.04.11-qSZAy7OWpKjtgoGraHQynqCcw5dLN4.jpeg",
    bio: "Data scientist with expertise in machine learning algorithms and statistical analysis for business insights.",
    rating: 4.7,
    reviews: 89,
    availability: "Available",
  },
  {
    id: 8,
    name: "Tadiwanashe Tuwe",
    expertise: "Blockchain & Cryptocurrency",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-09%20at%2017.19.32-ymSZfZ6rFvDUO3phRIsE2Ph2TWKw1R.jpeg",
    bio: "Blockchain developer and educator specializing in smart contracts and decentralized applications.",
    rating: 4.8,
    reviews: 76,
    availability: "Limited",
  },
]

// Expertise categories for filtering
const expertiseCategories = [
  "All",
  "AI & Machine Learning",
  "Photography",
  "Digital Marketing",
  "UI/UX Design",
  "Video Production",
  "Web Development",
  "Data Science",
  "Blockchain & Cryptocurrency",
]

export default function MentorsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedExpertise, setSelectedExpertise] = useState("All")

  // Filter mentors based on search query and selected expertise
  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.expertise.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesExpertise = selectedExpertise === "All" || mentor.expertise === selectedExpertise

    return matchesSearch && matchesExpertise
  })

  return (
    <div className="bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Find Your Mentor</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Connect with industry experts to accelerate your learning journey
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search mentors by name or expertise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>

          <div className="flex-shrink-0">
            <div className="relative inline-block w-full md:w-auto">
              <select
                value={selectedExpertise}
                onChange={(e) => setSelectedExpertise(e.target.value)}
                className="appearance-none w-full bg-card border border-border rounded-md py-2 pl-10 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {expertiseCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <Card key={mentor.id} className="overflow-hidden h-full">
              <Link href={`/mentors/${mentor.id}`} className="block h-full">
                <div className="p-6 flex flex-col items-center text-center h-full">
                  <div className="h-24 w-24 mb-4 rounded-full overflow-hidden">
                    <img
                      src={mentor.image || "/placeholder.svg"}
                      alt={mentor.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-1">{mentor.name}</h3>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 mb-2">
                    {mentor.expertise}
                  </Badge>
                  <div className="flex items-center mb-4">
                    <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                    <span className="font-medium mr-1">{mentor.rating}</span>
                    <span className="text-sm text-muted-foreground">({mentor.reviews} reviews)</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{mentor.bio}</p>
                  <Badge variant={mentor.availability === "Available" ? "default" : "secondary"} className="mb-4">
                    {mentor.availability}
                  </Badge>

                  <CardContent className="p-0 mt-auto w-full">
                    <Button variant="outline" className="w-full">
                      View Profile
                    </Button>
                  </CardContent>
                </div>
              </Link>
            </Card>
          ))}
        </div>

        {filteredMentors.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No mentors found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              We couldn't find any mentors matching your search criteria. Try adjusting your filters or search term.
            </p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedExpertise("All")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
