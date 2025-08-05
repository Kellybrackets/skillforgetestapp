"use client"

import { useState } from "react"
import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import format from "date-fns/format"
import parse from "date-fns/parse"
import startOfWeek from "date-fns/startOfWeek"
import getDay from "date-fns/getDay"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"

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

interface EquipmentAvailabilityCalendarProps {
  equipmentId: number
  equipmentName: string
}

export function EquipmentAvailabilityCalendar({ equipmentId, equipmentName }: EquipmentAvailabilityCalendarProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Generate mock availability data for the equipment
  // In a real app, this would come from an API
  const generateMockAvailability = () => {
    const events = []
    const today = new Date()

    // Generate some random bookings for the next 30 days
    for (let i = 0; i < 5; i++) {
      const startDate = new Date(today)
      startDate.setDate(today.getDate() + Math.floor(Math.random() * 30))

      const endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + Math.floor(Math.random() * 5) + 1)

      events.push({
        title: "Booked",
        start: startDate,
        end: endDate,
        resource: { status: "booked" },
      })
    }

    return events
  }

  const events = generateMockAvailability()

  // Custom event styling based on availability
  const eventStyleGetter = (event: any) => {
    return {
      style: {
        backgroundColor: "#ef4444",
        borderRadius: "4px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
      },
    }
  }

  // Find the next available date (after all booked periods)
  const findNextAvailableDate = () => {
    if (events.length === 0) return new Date()

    // Sort events by end date
    const sortedEvents = [...events].sort((a, b) => a.end.getTime() - b.end.getTime())

    // Get the latest end date
    const latestEndDate = sortedEvents[sortedEvents.length - 1].end

    // Format the date
    return format(latestEndDate, "MMMM do, yyyy")
  }

  return (
    <>
      <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => setIsOpen(true)}>
        <CalendarIcon className="h-4 w-4" />
        Check Availability
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{equipmentName} Availability</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4">
              <p className="text-sm">
                <span className="font-medium">{equipmentName}</span> is available until{" "}
                <span className="font-medium">{findNextAvailableDate()}</span>, after which it has some bookings. Check
                the calendar below for detailed availability.
              </p>
            </div>

            <div className="bg-card border rounded-lg p-4">
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                eventPropGetter={eventStyleGetter}
                views={["month"]}
                defaultView="month"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
              <span className="text-sm">Booked</span>

              <div className="w-4 h-4 bg-background border rounded-sm ml-4"></div>
              <span className="text-sm">Available</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
