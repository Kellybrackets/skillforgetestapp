import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReactNode } from "react"
import Link from "next/link"

interface FeatureCardProps {
  title: string
  description: string
  icon: ReactNode
  comingSoon?: boolean
  href?: string
}

export default function FeatureCard({ title, description, icon, comingSoon = true, href }: FeatureCardProps): ReactNode {
  const cardContent = (
    <Card className={`group hover:scale-105 transition-transform duration-200 hover:shadow-lg relative overflow-hidden ${
      href && !comingSoon ? 'cursor-pointer' : ''
    }`}>
      {/* Coming Soon Badge */}
      {comingSoon && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
            Coming Soon
          </div>
        </div>
      )}
      
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 p-3 bg-primary/10 dark:bg-primary/20 rounded-full w-16 h-16 flex items-center justify-center text-primary">
          {icon}
        </div>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      
      <CardContent className="text-center">
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )

  if (href && !comingSoon) {
    return (
      <Link href={href}>
        {cardContent}
      </Link>
    )
  }

  return cardContent
}