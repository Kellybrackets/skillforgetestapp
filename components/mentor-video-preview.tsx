"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Play } from "lucide-react"

interface MentorVideoPreviewProps {
  mentorId: number
  mentorName: string
  thumbnailUrl: string
  videoUrl: string
}

export function MentorVideoPreview({ mentorId, mentorName, thumbnailUrl, videoUrl }: MentorVideoPreviewProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="relative group cursor-pointer rounded-md overflow-hidden" onClick={() => setIsOpen(true)}>
        <img
          src={thumbnailUrl || "/placeholder.svg"}
          alt={`${mentorName} video preview`}
          className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 group-hover:bg-black/60">
          <div className="bg-white/90 rounded-full p-2">
            <Play className="h-6 w-6 text-primary fill-primary" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1.5 text-center">
          Watch intro video
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{mentorName}'s Introduction</DialogTitle>
          </DialogHeader>
          <div className="aspect-video">
            <iframe
              src={videoUrl}
              title={`${mentorName}'s introduction video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-md"
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
