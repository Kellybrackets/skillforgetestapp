"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ViewIcon as View3d } from "lucide-react"

interface ARPreviewProps {
  equipmentId: number
  equipmentName: string
  equipmentImage: string
}

export function ARPreview({ equipmentId, equipmentName, equipmentImage }: ARPreviewProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => setIsOpen(true)}>
        <View3d className="h-4 w-4" />
        View in AR
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>AR Preview: {equipmentName}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              {/* This is a mock AR preview - in a real app, this would be an AR viewer */}
              <img
                src={equipmentImage || "/placeholder.svg"}
                alt={equipmentName}
                className="absolute inset-0 w-full h-full object-contain"
              />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/70 text-white px-4 py-2 rounded-lg">
                  <p className="text-center">AR Preview Placeholder</p>
                  <p className="text-xs text-center mt-1">
                    In a real app, this would show a 3D model you can place in your environment
                  </p>
                </div>
              </div>

              {/* Mock AR interface elements */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                <Button size="sm" variant="secondary" className="bg-black/50 text-white border-white/20">
                  <View3d className="h-4 w-4 mr-2" />
                  Place Model
                </Button>
                <Button size="sm" variant="secondary" className="bg-black/50 text-white border-white/20">
                  Rotate
                </Button>
                <Button size="sm" variant="secondary" className="bg-black/50 text-white border-white/20">
                  Scale
                </Button>
              </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="font-medium mb-2">How to use AR View</h3>
              <ol className="text-sm space-y-2 list-decimal list-inside">
                <li>Point your camera at a flat surface</li>
                <li>Tap "Place Model" to position the equipment</li>
                <li>Use pinch gestures to resize the model</li>
                <li>Drag with one finger to rotate the model</li>
              </ol>
            </div>

            <p className="text-sm text-muted-foreground">
              Note: This is a demonstration of how AR would work in the full app. Actual AR functionality requires
              device camera access and AR frameworks.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
