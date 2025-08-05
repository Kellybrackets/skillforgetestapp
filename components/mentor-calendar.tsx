"use client"

import { useState } from "react"
import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import format from "date-fns/format"
import parse from "date-fns/parse"
import startOfWeek from "date-fns/startOfWeek"
import getDay from "date-fns/getDay"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Check, CalendarIcon } from "lucide-react"

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

// Purpose options for booking
const purposeOptions = [
  "General Mentorship",
  "Portfolio Review",
  "Career Advice",
  "Technical Help",
  "Project Feedback",
  "Interview Preparation",
  "Other",
]

interface MentorCalendarProps {
  mentorId: number
  mentorName: string
}

export function MentorCalendar({ mentorId, mentorName }: MentorCalendarProps) {
  const { toast } = useToast()
  const [selectedSlot, setSelectedSlot] = useState<any>(null)
  const [bookingPurpose, setBookingPurpose] = useState<string>(purposeOptions[0])
  const [additionalNotes, setAdditionalNotes] = useState<string>("")
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Generate mock availability data for the mentor
  // In a real app, this would come from an API
  const generateMockAvailability = () => {
    const events = []
    const today = new Date()

    // Generate available slots for the next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue

      // Morning slot
      const morningStart = new Date(date)
      morningStart.setHours(9, 0, 0)
      const morningEnd = new Date(date)
      morningEnd.setHours(10, 0, 0)

      // Afternoon slot
      const afternoonStart = new Date(date)
      afternoonStart.setHours(14, 0, 0)
      const afternoonEnd = new Date(date)
      afternoonEnd.setHours(15, 0, 0)

      // Evening slot
      const eveningStart = new Date(date)
      eveningStart.setHours(17, 0, 0)
      const eveningEnd = new Date(date)
      eveningEnd.setHours(18, 0, 0)

      // Randomly mark some slots as booked
      const isMorningBooked = Math.random() > 0.7
      const isAfternoonBooked = Math.random() > 0.7
      const isEveningBooked = Math.random() > 0.7

      if (!isMorningBooked) {
        events.push({
          title: "Available",
          start: morningStart,
          end: morningEnd,
          resource: { status: "available" },
        })
      } else {
        events.push({
          title: "Booked",
          start: morningStart,
          end: morningEnd,
          resource: { status: "booked" },
        })
      }

      if (!isAfternoonBooked) {
        events.push({
          title: "Available",
          start: afternoonStart,
          end: afternoonEnd,
          resource: { status: "available" },
        })
      } else {
        events.push({
          title: "Booked",
          start: afternoonStart,
          end: afternoonEnd,
          resource: { status: "booked" },
        })
      }

      if (!isEveningBooked) {
        events.push({
          title: "Available",
          start: eveningStart,
          end: eveningEnd,
          resource: { status: "available" },
        })
      } else {
        events.push({
          title: "Booked",
          start: eveningStart,
          end: eveningEnd,
          resource: { status: "booked" },
        })
      }
    }

    return events
  }

  const events = generateMockAvailability()

  const handleSelectSlot = (slotInfo: any) => {
    // Check if the selected time slot is within any available event
    const isAvailableSlot = events.some(
      (event) =>
        event.resource?.status === "available" &&
        event.start.getTime() <= slotInfo.start.getTime() &&
        event.end.getTime() >= slotInfo.end.getTime(),
    )

    if (isAvailableSlot) {
      setSelectedSlot(slotInfo)
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
    setIsLoading(true)

    // Simulate API call to book the session
    setTimeout(() => {
      setIsLoading(false)
      setIsBookingModalOpen(false)
      setIsConfirmationModalOpen(true)

      // In a real app, you would make an API call like:
      // POST /api/bookings
      // {
      //   mentorId,
      //   startTime: selectedSlot.start,
      //   endTime: selectedSlot.end,
      //   purpose: bookingPurpose,
      //   notes: additionalNotes
      // }
    }, 1500)
  }

  const handleConfirmation = () => {
    setIsConfirmationModalOpen(false)

    toast({
      title: "Booking Confirmed!",
      description: `Your session with ${mentorName} has been booked successfully.`,
    })

    // Reset form
    setSelectedSlot(null)
    setBookingPurpose(purposeOptions[0])
    setAdditionalNotes("")
  }

  // Custom event styling based on availability
  const eventStyleGetter = (event: any) => {
    const isAvailable = event.resource?.status === "available"

    return {
      style: {
        backgroundColor: isAvailable ? "#10b981" : "#ef4444",
        borderRadius: "4px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
        cursor: isAvailable ? "pointer" : "not-allowed",
      },
    }
  }

  // Format the date for display
  const formatDate = (date: Date) => {
    return format(date, "EEEE, MMMM do, yyyy 'at' h:mm a")
  }

  // AI-suggested time (mock implementation)
  const suggestedTime = events.find((event) => event.resource?.status === "available")

  return (
    <div className="space-y-6">
      {suggestedTime && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-2">
            <CalendarIcon className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-primary">AI-Suggested Time</h4>
              <p className="text-sm text-muted-foreground">
                This mentor is available on {formatDate(suggestedTime.start)}. This time works well with your schedule!
              </p>
              <Button
                variant="link"
                className="p-0 h-auto text-primary"
                onClick={() => {
                  setSelectedSlot({
                    start: suggestedTime.start,
                    end: suggestedTime.end,
                  })
                  setIsBookingModalOpen(true)
                }}
              >
                Book this slot
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-card border rounded-lg p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectSlot={handleSelectSlot}
          selectable
          eventPropGetter={eventStyleGetter}
          views={["week", "day"]}
          defaultView="week"
          min={new Date(0, 0, 0, 8, 0)} // 8:00 AM
          max={new Date(0, 0, 0, 20, 0)} // 8:00 PM
        />
      </div>

      {/* Booking Modal */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book a Session with {mentorName}</DialogTitle>
          </DialogHeader>

          {selectedSlot && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Selected Time</Label>
                <div className="p-2 bg-muted rounded-md text-sm">
                  {formatDate(selectedSlot.start)} - {format(selectedSlot.end, "h:mm a")}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose of Session</Label>
                <Select value={bookingPurpose} onValueChange={setBookingPurpose}>
                  <SelectTrigger id="purpose">
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    {purposeOptions.map((purpose) => (
                      <SelectItem key={purpose} value={purpose}>
                        {purpose}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Share any specific topics or questions you'd like to discuss"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBookingModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBookSession} disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Processing...
                </>
              ) : (
                "Book Session"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog open={isConfirmationModalOpen} onOpenChange={setIsConfirmationModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              Booking Confirmed!
            </DialogTitle>
          </DialogHeader>

          {selectedSlot && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg border p-4 bg-muted/50">
                <h4 className="font-medium mb-2">Session Details</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <span className="font-medium">Mentor:</span> {mentorName}
                  </li>
                  <li>
                    <span className="font-medium">Date & Time:</span> {formatDate(selectedSlot.start)}
                  </li>
                  <li>
                    <span className="font-medium">Duration:</span> 1 hour
                  </li>
                  <li>
                    <span className="font-medium">Purpose:</span> {bookingPurpose}
                  </li>
                </ul>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>A confirmation email has been sent to your registered email address.</p>
                <p>You will also receive a WhatsApp reminder 1 hour before the session.</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={handleConfirmation}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
