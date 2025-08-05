"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { CalendarDays, Users, Search, MapPin } from "lucide-react"

// Mock data for events with South African cities
const events = [
  {
    id: 1,
    title: "Introduction to AI Workshop",
    date: "June 15, 2025",
    time: "14:00 - 16:00",
    location: "Cape Town, Western Cape",
    host: "Sandile Thamie Mhlanga",
    category: "Workshop",
    description:
      "Learn the fundamentals of artificial intelligence and machine learning in this beginner-friendly workshop.",
    image: "/images/workshop4.jpg",
    price: "R350",
  },
  {
    id: 2,
    title: "Portrait Photography Masterclass",
    date: "June 18, 2025",
    time: "10:00 - 13:00",
    location: "Johannesburg, Gauteng",
    host: "Keletso Ntseno",
    category: "Masterclass",
    description: "Master the art of portrait photography with professional lighting techniques and composition.",
    image: "/images/workshop5.jpg",
    price: "R450",
  },
  {
    id: 3,
    title: "Adobe Photoshop Workshop",
    date: "June 20, 2025",
    time: "15:00 - 17:00",
    location: "Online",
    host: "Adobe Creative Team",
    category: "Workshop",
    description: "Learn advanced photo editing techniques from Adobe's creative professionals.",
    image: "/images/workshop6.jpg",
    company: "Adobe",
    price: "R250",
  },
  {
    id: 4,
    title: "Social Media Marketing Strategies",
    date: "June 25, 2025",
    time: "11:00 - 12:30",
    location: "Durban, KwaZulu-Natal",
    host: "Dichwanyo Makgothi",
    category: "Webinar",
    description: "Discover effective strategies to grow your brand's presence on social media platforms.",
    image: "/images/datasci.jpg",
    price: "R200",
  },
  {
    id: 5,
    title: "Video Editing with Final Cut Pro",
    date: "July 2, 2025",
    time: "13:00 - 16:00",
    location: "Online",
    host: "Apple Creative Education",
    category: "Workshop",
    description: "A hands-on workshop covering advanced video editing techniques with Final Cut Pro.",
    image: "/images/workshop8.jpg",
    company: "Apple",
    price: "R300",
  },
  {
    id: 6,
    title: "Web Development Bootcamp",
    date: "July 10, 2025",
    time: "09:00 - 17:00",
    location: "Pretoria, Gauteng",
    host: "Tsehla Motjolopane",
    category: "Bootcamp",
    description: "Intensive one-day bootcamp covering modern web development frameworks and best practices.",
    image: "/images/workshop9.jpg",
    price: "R750",
  },
  {
    id: 7,
    title: "Data Visualization Workshop",
    date: "July 15, 2025",
    time: "14:00 - 17:00",
    location: "Stellenbosch, Western Cape",
    host: "Realeboha Nthathakane",
    category: "Workshop",
    description: "Learn how to create compelling data visualizations that tell a story with your data.",
    image: "/images/workshop10.jpg",
    price: "R400",
  },
  {
    id: 8,
    title: "Networking Event for Creatives",
    date: "July 20, 2025",
    time: "18:00 - 21:00",
    location: "Bloemfontein, Free State",
    host: "SkillForge Community",
    category: "Networking",
    description: "Connect with fellow creatives, share ideas, and build your professional network.",
    image: "/images/workshop11.jpg",
    price: "R150",
  },
]

export default function EventsPage() {
  const { toast } = useToast()
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedEvent, setSelectedEvent] = useState<(typeof events)[0] | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleRegister = (event: (typeof events)[0]) => {
    if (registeredEvents.includes(event.id)) {
      toast({
        title: "Already registered",
        description: `You're already registered for "${event.title}".`,
      })
      return
    }

    setSelectedEvent(event)
    setIsDialogOpen(true)
  }

  const confirmRegistration = () => {
    if (selectedEvent) {
      setRegisteredEvents([...registeredEvents, selectedEvent.id])
      setIsDialogOpen(false)
      toast({
        title: "Registration successful!",
        description: `You've been registered for "${selectedEvent.title}"!`,
      })
    }
  }

  // Filter events based on search query and category
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Get unique categories for filter tabs
  const categories = ["All", ...Array.from(new Set(events.map((event) => event.category)))]

  return (
    <div className="bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Events in South Africa</h1>
          <p className="mt-2 text-lg text-muted-foreground">Join workshops, webinars, and skill-building sessions</p>
        </div>

        {/* Search and Category Tabs */}
        <div className="mb-8">
          <div className="relative mb-6">
            <Input
              type="text"
              placeholder="Search events or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>

          <Tabs defaultValue="All" onValueChange={setSelectedCategory}>
            <TabsList className="w-full overflow-x-auto flex-nowrap justify-start h-auto p-0 bg-transparent">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <div className="h-48 relative">
                <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover" />
                <Badge className="absolute top-3 right-3">{event.category}</Badge>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2">{event.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {event.date}, {event.time}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4" />
                  {event.location}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-2 h-4 w-4" />
                  Hosted by {event.host}
                </div>
                <div className="text-primary font-medium">{event.price}</div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={registeredEvents.includes(event.id) ? "outline" : "default"}
                  onClick={() => handleRegister(event)}
                  disabled={registeredEvents.includes(event.id)}
                >
                  {registeredEvents.includes(event.id) ? "Registered" : "Register Now"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No events found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              We couldn't find any events matching your search criteria. Try adjusting your filters or search term.
            </p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("All")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Registration Confirmation Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Registration</DialogTitle>
              <DialogDescription>Please confirm that you want to register for this event.</DialogDescription>
            </DialogHeader>

            {selectedEvent && (
              <div className="py-4">
                <div className="mb-4">
                  <img
                    src={selectedEvent.image || "/placeholder.svg"}
                    alt={selectedEvent.title}
                    className="w-full h-48 object-cover rounded-md"
                  />
                </div>
                <h3 className="text-lg font-medium mb-2">{selectedEvent.title}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {selectedEvent.date}, {selectedEvent.time}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    {selectedEvent.location}
                  </div>
                  <div className="font-medium text-primary mt-2">{selectedEvent.price}</div>
                </div>
              </div>
            )}

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={confirmRegistration}>Confirm Registration</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
