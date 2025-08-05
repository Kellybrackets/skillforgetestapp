"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import format from "date-fns/format"
import parse from "date-fns/parse"
import startOfWeek from "date-fns/startOfWeek"
import getDay from "date-fns/getDay"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Star, ArrowLeft, CheckCircle, CreditCard } from "lucide-react"
import Link from "next/link"

const locales = {
  "en-US": require("date-fns/locale/en-US"),
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

// Mock data for mentors with South African pricing
const mentors = [
  {
    id: 1,
    name: "Sandile Thamie Mhlanga",
    expertise: "AI & Machine Learning",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download.jpg-GjIN7Tt7xyqYcVOj9Ka7NclIC0Rx4z.png",
    bio: "Former Google AI researcher with 10+ years of experience in machine learning and neural networks. I specialize in helping students understand complex AI concepts and implement practical machine learning solutions for South African businesses.",
    rating: 4.9,
    reviews: 124,
    hourlyRate: 350, // ZAR
    skills: ["Machine Learning", "Neural Networks", "Python", "TensorFlow", "Computer Vision"],
    experience: [
      { company: "Google AI", role: "Senior Researcher", period: "2018-2022" },
      { company: "University of Cape Town", role: "Adjunct Professor", period: "2016-2018" },
      { company: "DeepMind", role: "Research Scientist", period: "2014-2016" },
    ],
    education: [
      { institution: "MIT", degree: "PhD in Computer Science", year: "2014" },
      { institution: "University of the Witwatersrand", degree: "MSc in AI", year: "2010" },
    ],
    testimonials: [
      {
        student: "Thabo M.",
        text: "Sandile's guidance helped me land a job at a top AI startup in Cape Town.",
        rating: 5,
      },
      { student: "Lerato K.", text: "Incredible mentor who explains complex concepts clearly.", rating: 5 },
      { student: "David N.", text: "Transformed my understanding of neural networks.", rating: 4 },
    ],
  },
  {
    id: 2,
    name: "Keletso Ntseno",
    expertise: "Photography",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-09%20at%2017.06.22-lwaEDkJeaZ2nTPuYsOUeuCCSsiFzHS.jpeg",
    bio: "Award-winning photographer specializing in portrait and landscape photography with over 8 years of professional experience. I love helping aspiring photographers develop their unique style and master technical skills for capturing South Africa's diverse landscapes and cultures.",
    rating: 4.7,
    reviews: 98,
    hourlyRate: 250, // ZAR
    skills: ["Portrait Photography", "Landscape", "Lighting", "Composition", "Adobe Lightroom"],
    experience: [
      { company: "National Geographic", role: "Contributor", period: "2020-Present" },
      { company: "Johannesburg Art Gallery", role: "Resident Photographer", period: "2018-2020" },
      { company: "Self-employed", role: "Professional Photographer", period: "2015-2018" },
    ],
    education: [
      { institution: "New York Film Academy", degree: "MFA in Photography", year: "2015" },
      { institution: "University of Cape Town", degree: "BA in Fine Arts", year: "2013" },
    ],
    testimonials: [
      { student: "Nomsa P.", text: "Keletso's feedback transformed my portfolio completely.", rating: 5 },
      { student: "James T.", text: "Learned more in one session than months of self-study.", rating: 4 },
      { student: "Ayanda M.", text: "Incredibly talented and patient mentor.", rating: 5 },
    ],
  },
  {
    id: 3,
    name: "Thulani Ndlovu",
    expertise: "Web Development",
    image: "/placeholder.svg?height=200&width=200",
    bio: "Full-stack developer with expertise in React, Node.js, and modern web technologies. I've helped build several successful South African tech startups and enjoy mentoring new developers to navigate the local tech ecosystem.",
    rating: 4.8,
    reviews: 87,
    hourlyRate: 150, // ZAR
    skills: ["React", "Node.js", "JavaScript", "TypeScript", "AWS"],
    experience: [
      { company: "Takealot", role: "Senior Developer", period: "2019-Present" },
      { company: "Luno", role: "Frontend Developer", period: "2017-2019" },
      { company: "Freelance", role: "Web Developer", period: "2015-2017" },
    ],
    education: [
      { institution: "University of Johannesburg", degree: "BSc Computer Science", year: "2015" },
      { institution: "CodeX", degree: "Web Development Bootcamp", year: "2014" },
    ],
    testimonials: [
      { student: "Sipho K.", text: "Thulani helped me build my first professional web app.", rating: 5 },
      { student: "Zanele M.", text: "Great at explaining complex concepts in simple terms.", rating: 5 },
      { student: "Trevor L.", text: "Practical advice that helped me land my first dev job.", rating: 4 },
    ],
  },
]

export default function MentorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const mentorId = Number.parseInt(params.id as string)
  const [mentor, setMentor] = useState<(typeof mentors)[0] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSlot, setSelectedSlot] = useState<any>(null)
  const [bookingDuration, setBookingDuration] = useState("1")
  const [bookingPurpose, setBookingPurpose] = useState("")
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Mock payment details
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvc: "",
  })

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      const foundMentor = mentors.find((m) => m.id === mentorId)
      setMentor(foundMentor || null)
      setIsLoading(false)
    }, 500)
  }, [mentorId])

  // Generate mock availability data for the mentor
  const generateMockAvailability = () => {
    const events = []
    const today = new Date()

    // Generate available slots for the next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue

      // Morning slots
      for (let hour = 9; hour < 12; hour++) {
        const start = new Date(date)
        start.setHours(hour, 0, 0)
        const end = new Date(date)
        end.setHours(hour + 1, 0, 0)

        // Randomly mark some slots as booked
        const isBooked = Math.random() > 0.7
        events.push({
          title: isBooked ? "Booked" : "Available",
          start,
          end,
          resource: { status: isBooked ? "booked" : "available", hourlyRate: mentor?.hourlyRate || 250 },
        })
      }

      // Afternoon slots
      for (let hour = 14; hour < 18; hour++) {
        const start = new Date(date)
        start.setHours(hour, 0, 0)
        const end = new Date(date)
        end.setHours(hour + 1, 0, 0)

        // Randomly mark some slots as booked
        const isBooked = Math.random() > 0.7
        events.push({
          title: isBooked ? "Booked" : "Available",
          start,
          end,
          resource: { status: isBooked ? "booked" : "available", hourlyRate: mentor?.hourlyRate || 250 },
        })
      }
    }

    return events
  }

  const events = mentor ? generateMockAvailability() : []

  const handleSelectSlot = (slotInfo: any) => {
    // Check if the selected time slot overlaps with any available event
    const availableEvent = events.find(
      (event) => event.resource?.status === "available" && event.start <= slotInfo.start && event.end >= slotInfo.end,
    )

    if (availableEvent) {
      // Use the event's exact time range instead of the selected slot
      setSelectedSlot({
        start: availableEvent.start,
        end: availableEvent.end,
      })
      setIsBookingModalOpen(true)
    } else {
      toast({
        title: "Unavailable Time Slot",
        description: "Please select an available time slot marked in green.",
        variant: "destructive",
      })
    }
  }

  const handleBookSession = () => {
    if (!bookingPurpose.trim()) {
      toast({
        title: "Missing Information",
        description: "Please describe the purpose of your session.",
        variant: "destructive",
      })
      return
    }

    setIsBookingModalOpen(false)
    setIsPaymentModalOpen(true)
  }

  const handlePaymentDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Format card number with spaces
    if (name === "cardNumber") {
      const formattedValue = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim()
        .slice(0, 19)

      setPaymentDetails({
        ...paymentDetails,
        [name]: formattedValue,
      })
      return
    }

    setPaymentDetails({
      ...paymentDetails,
      [name]: value,
    })
  }

  const handlePaymentSubmit = () => {
    // Validate payment details
    if (
      paymentDetails.cardNumber.replace(/\s/g, "").length !== 16 ||
      !paymentDetails.cardName ||
      !paymentDetails.expiry ||
      paymentDetails.cvc.length !== 3
    ) {
      toast({
        title: "Invalid Payment Details",
        description: "Please check your payment information and try again.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setIsPaymentModalOpen(false)
      setIsConfirmationModalOpen(true)

      // Reset form
      setBookingDuration("1")
      setBookingPurpose("")
      setPaymentDetails({
        cardNumber: "",
        cardName: "",
        expiry: "",
        cvc: "",
      })
    }, 1500)
  }

  // Custom event styling based on availability
  const eventStyleGetter = (event: any) => {
    const isAvailable = event.resource?.status === "available"

    return {
      style: {
        backgroundColor: isAvailable ? "rgba(110, 86, 207, 0.3)" : "rgba(255, 107, 107, 0.8)",
        color: isAvailable ? "#1A1A1A" : "white",
        border: isAvailable ? "1px solid rgba(110, 86, 207, 0.5)" : "1px solid rgba(255, 107, 107, 1)",
        borderRadius: "4px",
        opacity: 1,
        display: "block",
        cursor: isAvailable ? "pointer" : "not-allowed",
      },
    }
  }

  // Format the date for display
  const formatDate = (date: Date) => {
    return format(date, "EEEE, MMMM do, yyyy 'at' h:mm a")
  }

  // Calculate total price based on duration
  const calculateTotalPrice = () => {
    if (!mentor || !selectedSlot) return 0
    const hours = Number.parseFloat(bookingDuration)
    return mentor.hourlyRate * hours
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!mentor) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Mentor Not Found</h1>
        <p className="text-muted-foreground mb-6">The mentor you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/mentors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Mentors
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/mentors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Mentors
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mentor Profile */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-32 w-32 rounded-full overflow-hidden mb-4">
                    <img
                      src={mentor.image || "/placeholder.svg"}
                      alt={mentor.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <h1 className="text-2xl font-bold mb-1">{mentor.name}</h1>

                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 mb-2">
                    {mentor.expertise}
                  </Badge>

                  <div className="flex items-center mb-4">
                    <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                    <span className="font-medium mr-1">{mentor.rating}</span>
                    <span className="text-sm text-muted-foreground">({mentor.reviews} reviews)</span>
                  </div>

                  <div className="text-xl font-bold text-primary mb-4">R{mentor.hourlyRate}/hr</div>

                  <p className="text-sm text-muted-foreground mb-6">{mentor.bio}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Skills & Expertise</h2>
                <div className="flex flex-wrap gap-2 mb-6">
                  {mentor.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <h2 className="text-lg font-semibold mb-4">Experience</h2>
                <div className="space-y-3 mb-6">
                  {mentor.experience.map((exp, index) => (
                    <div key={index}>
                      <p className="font-medium">{exp.role}</p>
                      <p className="text-sm text-muted-foreground">{exp.company}</p>
                      <p className="text-xs text-muted-foreground">{exp.period}</p>
                    </div>
                  ))}
                </div>

                <h2 className="text-lg font-semibold mb-4">Education</h2>
                <div className="space-y-3">
                  {mentor.education.map((edu, index) => (
                    <div key={index}>
                      <p className="font-medium">{edu.degree}</p>
                      <p className="text-sm text-muted-foreground">
                        {edu.institution}, {edu.year}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Calendar and Testimonials */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="calendar">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="calendar">Book a Session</TabsTrigger>
                <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
              </TabsList>

              <TabsContent value="calendar" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Schedule a Session with {mentor.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6">
                      Select an available time slot from the calendar below to book a one-on-one session with{" "}
                      {mentor.name}.
                    </p>

                    <div className="h-[600px] border rounded-md overflow-hidden">
                      <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: "100%" }}
                        onSelectSlot={handleSelectSlot}
                        onSelectEvent={(event) => {
                          // Only allow booking for available slots
                          if (event.resource?.status === "available") {
                            setSelectedSlot({
                              start: event.start,
                              end: event.end,
                            })
                            setIsBookingModalOpen(true)
                          } else {
                            toast({
                              title: "Time Slot Unavailable",
                              description: "This time slot is already booked.",
                              variant: "destructive",
                            })
                          }
                        }}
                        selectable={true}
                        eventPropGetter={eventStyleGetter}
                        views={["week", "day"]}
                        defaultView="week"
                        min={new Date(0, 0, 0, 8, 0)} // 8:00 AM
                        max={new Date(0, 0, 0, 20, 0)} // 8:00 PM
                        tooltipAccessor={(event) => {
                          const status = event.resource?.status
                          const hourlyRate = event.resource?.hourlyRate
                          return status === "available"
                            ? `${format(event.start, "h:mm a")} - ${format(event.end, "h:mm a")} | R${hourlyRate}/hr | Click to book`
                            : "Booked"
                        }}
                        components={{
                          event: (props) => {
                            const { event } = props
                            const isAvailable = event.resource?.status === "available"
                            return (
                              <div
                                className={`p-1 text-xs ${isAvailable ? "cursor-pointer hover:bg-primary/40" : "cursor-not-allowed"}`}
                                title={isAvailable ? "Click to book this slot" : "This slot is already booked"}
                              >
                                {event.title}
                              </div>
                            )
                          },
                        }}
                      />
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded mr-2"
                          style={{ backgroundColor: "rgba(110, 86, 207, 0.3)" }}
                        ></div>
                        <span className="text-sm">Available</span>
                      </div>
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded mr-2"
                          style={{ backgroundColor: "rgba(255, 107, 107, 0.8)" }}
                        ></div>
                        <span className="text-sm">Booked</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="testimonials" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Testimonials</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {mentor.testimonials.map((testimonial, index) => (
                        <div key={index} className="border-b border-border pb-6 last:border-0 last:pb-0">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium">{testimonial.student}</p>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-muted-foreground">{testimonial.text}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Booking Modal */}
        <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Book a Session with {mentor.name}</DialogTitle>
            </DialogHeader>

            {selectedSlot && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Selected Time</h3>
                  <div className="p-3 bg-muted rounded-md">{formatDate(selectedSlot.start)}</div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Session Duration</h3>
                  <Select value={bookingDuration} onValueChange={setBookingDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="1.5">1.5 hours</SelectItem>
                      <SelectItem value="2">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Purpose of Session</h3>
                  <Textarea
                    placeholder="Describe what you'd like to discuss in this session..."
                    value={bookingPurpose}
                    onChange={(e) => setBookingPurpose(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="bg-muted/30 p-4 rounded-md">
                  <div className="flex justify-between mb-2">
                    <span>Hourly Rate</span>
                    <span>R{mentor.hourlyRate}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Duration</span>
                    <span>
                      {bookingDuration} hour{bookingDuration !== "1" && "s"}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Total</span>
                    <span>R{calculateTotalPrice()}</span>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsBookingModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleBookSession}>Continue to Payment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Payment Modal */}
        <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Payment Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="bg-muted/30 p-4 rounded-md mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Session with {mentor.name}</span>
                  <span className="text-sm font-medium">
                    {bookingDuration} hour{bookingDuration !== "1" && "s"}
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>R{calculateTotalPrice()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="4242 4242 4242 4242"
                  value={paymentDetails.cardNumber}
                  onChange={handlePaymentDetailsChange}
                  maxLength={19}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <p className="text-xs text-muted-foreground">For testing, use 4242 4242 4242 4242</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Cardholder Name</label>
                <input
                  type="text"
                  name="cardName"
                  placeholder="John Smith"
                  value={paymentDetails.cardName}
                  onChange={handlePaymentDetailsChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Expiry Date</label>
                  <input
                    type="text"
                    name="expiry"
                    placeholder="MM/YY"
                    value={paymentDetails.expiry}
                    onChange={handlePaymentDetailsChange}
                    maxLength={5}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">CVC</label>
                  <input
                    type="text"
                    name="cvc"
                    placeholder="123"
                    value={paymentDetails.cvc}
                    onChange={handlePaymentDetailsChange}
                    maxLength={3}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPaymentModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handlePaymentSubmit} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay R{calculateTotalPrice()}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confirmation Modal */}
        <Dialog open={isConfirmationModalOpen} onOpenChange={setIsConfirmationModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                Booking Confirmed!
              </DialogTitle>
            </DialogHeader>

            {selectedSlot && (
              <div className="space-y-4 py-4">
                <p className="mb-4">
                  Your session with {mentor.name} has been booked successfully. The mentor will contact you via email to
                  confirm the details.
                </p>

                <div className="bg-muted/30 p-4 rounded-md space-y-3">
                  <div>
                    <p className="font-medium">Date & Time</p>
                    <p className="text-sm text-muted-foreground">{formatDate(selectedSlot.start)}</p>
                  </div>

                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-sm text-muted-foreground">
                      {bookingDuration} hour{bookingDuration !== "1" && "s"}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">Total Paid</p>
                    <p className="text-sm text-muted-foreground">R{calculateTotalPrice()}</p>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                onClick={() => {
                  setIsConfirmationModalOpen(false)
                  router.push("/dashboard")
                }}
              >
                Go to Dashboard
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
