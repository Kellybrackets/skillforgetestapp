"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface MentorRatingProps {
  mentorId: number
  mentorName: string
  initialRating?: number
}

export function MentorRating({ mentorId, mentorName, initialRating = 0 }: MentorRatingProps) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [rating, setRating] = useState(initialRating)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    setIsSubmitting(true)

    // Simulate API call to submit rating
    setTimeout(() => {
      setIsSubmitting(false)
      setIsOpen(false)

      toast({
        title: "Rating Submitted",
        description: `Thank you for rating your session with ${mentorName}!`,
      })

      // In a real app, you would make an API call like:
      // POST /api/mentors/${mentorId}/ratings
      // {
      //   rating,
      //   feedback
      // }
    }, 1000)
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        Rate Session
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rate Your Session with {mentorName}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <p className="text-sm text-center font-medium">How would you rate your mentorship session?</p>

              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hoveredRating || rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>

              <p className="text-center text-sm text-muted-foreground">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="feedback" className="text-sm font-medium">
                Share your feedback (optional)
              </label>
              <Textarea
                id="feedback"
                placeholder="What did you like about the session? How could it be improved?"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={rating === 0 || isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Submitting...
                </>
              ) : (
                "Submit Rating"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
