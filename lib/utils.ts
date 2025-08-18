import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns a random interview cover image for Vapi.ai interviews
 */
export function getRandomInterviewCover(): string {
  const coverImages = [
    '/interview-covers/technical-1.jpg',
    '/interview-covers/technical-2.jpg',
    '/interview-covers/behavioral-1.jpg',
    '/interview-covers/behavioral-2.jpg',
    '/interview-covers/default.jpg'
  ]
  
  return coverImages[Math.floor(Math.random() * coverImages.length)]
}
