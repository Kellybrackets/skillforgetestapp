import React from 'react'
import dynamic from 'next/dynamic'
import { Spinner } from '@/components/ui/spinner'

// Create reusable loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <Spinner size="lg" />
  </div>
)

// Heavy components that should be dynamically loaded
export const ChatInterface = dynamic(
  () => import('@/components/chat-interface'),
  {
    loading: LoadingSpinner,
    ssr: false, // Client-side only for interactive features
  }
)

export const PricingModal = dynamic(
  () => import('@/components/pricing-modal'),
  {
    loading: () => null, // No loading UI for modals
    ssr: false,
  }
)

export const PortfolioBuilder = dynamic(
  () => import('@/components/portfolio-builder'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
)

export const CVBuilder = dynamic(
  () => import('@/components/cv-builder'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
)

export const ARPreview = dynamic(
  () => import('@/components/ar-preview'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
)

// Learning path components
export const CareerSimulator = dynamic(
  () => import('@/components/learning-paths/career-simulator'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
)

export const ProgressTracker = dynamic(
  () => import('@/components/learning-paths/progress-tracker'),
  {
    loading: LoadingSpinner,
  }
)

// Charts and heavy visualizations
export const EquipmentCalendar = dynamic(
  () => import('@/components/equipment-availability-calendar'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
)

export const MentorCalendar = dynamic(
  () => import('@/components/mentor-calendar'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
)

// Video components
export const MentorVideoPreview = dynamic(
  () => import('@/components/mentor-video-preview'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
)