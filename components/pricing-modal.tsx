"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PricingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const pricingTiers = [
  {
    name: "Free",
    price: "R0",
    description: "Perfect for beginners",
    features: ["Access to basic courses", "Community forum access", "Email support"],
    color: "from-gray-500 to-gray-700",
    recommended: false,
  },
  {
    name: "Pro",
    price: "R299",
    period: "/month",
    description: "For serious learners",
    features: [
      "All Free features",
      "Unlimited course access",
      "Mentor sessions (2/month)",
      "Equipment rental discounts",
    ],
    color: "from-primary to-purple-700",
    recommended: true,
  },
  {
    name: "Premium",
    price: "R799",
    period: "/month",
    description: "For professionals",
    features: [
      "All Pro features",
      "Priority mentor matching",
      "Unlimited mentor sessions",
      "Free equipment rentals",
      "Certification included",
    ],
    color: "from-accent to-red-600",
    recommended: false,
  },
]

export function PricingModal({ open, onOpenChange }: PricingModalProps) {
  const { toast } = useToast()
  const [selectedTier, setSelectedTier] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = (tierName: string) => {
    setSelectedTier(tierName)
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      onOpenChange(false)
      toast({
        title: "Subscription successful!",
        description: `You've subscribed to the ${tierName} plan.`,
      })
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Choose Your Learning Plan</DialogTitle>
          <DialogDescription className="text-center">
            Select the plan that best fits your learning goals and budget
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-xl overflow-hidden border ${
                tier.recommended ? "border-primary shadow-lg" : "border-border"
              }`}
            >
              {tier.recommended && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-bl-lg">
                  RECOMMENDED
                </div>
              )}

              <div className={`bg-gradient-to-br ${tier.color} text-white p-6`}>
                <h3 className="text-xl font-bold">{tier.name}</h3>
                <div className="flex items-baseline mt-2">
                  <span className="text-2xl font-bold">{tier.price}</span>
                  {tier.period && <span className="ml-1 text-sm opacity-80">{tier.period}</span>}
                </div>
                <p className="mt-2 text-sm opacity-90">{tier.description}</p>
              </div>

              <div className="p-6 bg-card">
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full mt-6"
                  variant={tier.recommended ? "default" : "outline"}
                  onClick={() => handleSubscribe(tier.name)}
                  disabled={isLoading && selectedTier === tier.name}
                >
                  {isLoading && selectedTier === tier.name ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      Processing...
                    </span>
                  ) : (
                    `Subscribe to ${tier.name}`
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
