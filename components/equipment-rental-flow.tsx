"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import {
  CalendarIcon,
  Check,
  CreditCard,
  MapPin,
  Phone,
  User,
  Mail,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Smartphone,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EquipmentRentalFlowProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  equipment: {
    id: number
    name: string
    price: number
    image: string
    category: string
  }
}

export function EquipmentRentalFlow({ open, onOpenChange, equipment }: EquipmentRentalFlowProps) {
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [damageWaiver, setDamageWaiver] = useState(false)

  // Form state
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
    purpose: "",
  })

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvc: "",
  })

  const [dateRange, setDateRange] = useState<{
    from: Date
    to?: Date
  }>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 3)),
  })

  // Calculate rental days and total price
  const rentalDays =
    dateRange.to && dateRange.from
      ? Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1
      : 1

  const basePrice = equipment.price * rentalDays
  const waiverPrice = damageWaiver ? 5 * rentalDays : 0
  const totalPrice = basePrice + waiverPrice

  const handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactInfo({
      ...contactInfo,
      [e.target.name]: e.target.value,
    })
  }

  const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value

    // Format card number with spaces
    if (e.target.name === "cardNumber") {
      value = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim()
    }

    setPaymentInfo({
      ...paymentInfo,
      [e.target.name]: value,
    })
  }

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = () => {
    setIsLoading(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false)
      onOpenChange(false)

      toast({
        title: "Rental Confirmed!",
        description: `Your ${equipment.name} rental has been confirmed.`,
      })

      // Reset form
      setStep(1)
      setContactInfo({
        name: "",
        email: "",
        phone: "",
        purpose: "",
      })
      setPaymentInfo({
        cardNumber: "",
        cardName: "",
        expiry: "",
        cvc: "",
      })
      setDateRange({
        from: new Date(),
        to: new Date(new Date().setDate(new Date().getDate() + 3)),
      })
      setDamageWaiver(false)

      // In a real app, you would make an API call like:
      // POST /api/rentals
      // {
      //   equipmentId: equipment.id,
      //   startDate: dateRange.from,
      //   endDate: dateRange.to,
      //   contactInfo,
      //   damageWaiver,
      //   // Don't send full payment info to your server in a real app!
      //   // Use a payment processor like Stripe instead
      // }
    }, 2000)
  }

  const isContactInfoComplete = () => {
    return contactInfo.name.trim() !== "" && contactInfo.email.trim() !== "" && contactInfo.phone.trim() !== ""
  }

  const isPaymentInfoComplete = () => {
    return (
      paymentInfo.cardNumber.replace(/\s/g, "").length === 16 &&
      paymentInfo.cardName.trim() !== "" &&
      paymentInfo.expiry.trim() !== "" &&
      paymentInfo.cvc.trim() !== ""
    )
  }

  const formatDate = (date: Date) => {
    return format(date, "MMMM do, yyyy")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {step === 1 && "Rental Details"}
            {step === 2 && "Payment Information"}
            {step === 3 && "Confirmation"}
          </DialogTitle>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="relative mb-6">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted -translate-y-1/2"></div>
          <div className="relative flex justify-between">
            <div className="flex flex-col items-center">
              <div
                className={`z-10 flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                {step > 1 ? <Check className="h-5 w-5" /> : "1"}
              </div>
              <span className="text-xs mt-1">Details</span>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`z-10 flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                {step > 2 ? <Check className="h-5 w-5" /> : "2"}
              </div>
              <span className="text-xs mt-1">Payment</span>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`z-10 flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                3
              </div>
              <span className="text-xs mt-1">Confirm</span>
            </div>
          </div>
        </div>

        {/* Equipment summary */}
        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg mb-6">
          <img
            src={equipment.image || "/placeholder.svg"}
            alt={equipment.name}
            className="w-16 h-16 object-cover rounded-md"
          />
          <div>
            <h3 className="font-medium">{equipment.name}</h3>
            <p className="text-sm text-muted-foreground">{equipment.category}</p>
            <p className="text-sm font-medium">R{equipment.price}/day</p>
          </div>
        </div>

        {/* Step 1: Contact Information */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rental-dates">Rental Dates</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {formatDate(dateRange.from)} - {formatDate(dateRange.to)}
                          </>
                        ) : (
                          formatDate(dateRange.from)
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange as any}
                      numberOfMonths={2}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="damage-waiver">Damage Waiver</Label>
                  <span className="text-sm text-muted-foreground">+R5/day</span>
                </div>
                <div className="flex items-center justify-between space-x-2 rounded-md border p-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      <ShieldCheck className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm font-medium">Protection Plan</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Covers accidental damage</p>
                  </div>
                  <Switch checked={damageWaiver} onCheckedChange={setDamageWaiver} id="damage-waiver" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={contactInfo.name}
                  onChange={handleContactInfoChange}
                  className="pl-10"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={contactInfo.email}
                  onChange={handleContactInfoChange}
                  className="pl-10"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={contactInfo.phone}
                  onChange={handleContactInfoChange}
                  className="pl-10"
                />
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose of Rental (Optional)</Label>
              <Textarea
                id="purpose"
                name="purpose"
                placeholder="What will you be using this equipment for?"
                value={contactInfo.purpose}
                onChange={handleContactInfoChange}
                rows={3}
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleNextStep} disabled={!isContactInfoComplete()}>
                Continue to Payment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Payment Information */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="4242 4242 4242 4242"
                  value={paymentInfo.cardNumber}
                  onChange={handlePaymentInfoChange}
                  maxLength={19}
                  className="pl-10"
                />
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">For testing, use 4242 4242 4242 4242</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input
                id="cardName"
                name="cardName"
                placeholder="Name on card"
                value={paymentInfo.cardName}
                onChange={handlePaymentInfoChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  name="expiry"
                  placeholder="MM/YY"
                  value={paymentInfo.expiry}
                  onChange={handlePaymentInfoChange}
                  maxLength={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  name="cvc"
                  placeholder="123"
                  value={paymentInfo.cvc}
                  onChange={handlePaymentInfoChange}
                  maxLength={3}
                />
              </div>
            </div>

            <div className="rounded-lg border p-4 bg-muted/30 space-y-2">
              <h4 className="font-medium">Order Summary</h4>
              <div className="flex justify-between text-sm">
                <span>Equipment Rental ({rentalDays} days)</span>
                <span>R{basePrice}</span>
              </div>
              {damageWaiver && (
                <div className="flex justify-between text-sm">
                  <span>Damage Waiver</span>
                  <span>R{waiverPrice}</span>
                </div>
              )}
              <div className="flex justify-between font-medium pt-2 border-t">
                <span>Total</span>
                <span>R{totalPrice}</span>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handlePrevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleNextStep} disabled={!isPaymentInfoComplete()}>
                Review Order
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="rounded-lg border p-4 space-y-4">
              <div>
                <h4 className="font-medium mb-2">Rental Details</h4>
                <ul className="space-y-1 text-sm">
                  <li>
                    <span className="font-medium">Equipment:</span> {equipment.name}
                  </li>
                  <li>
                    <span className="font-medium">Rental Period:</span> {formatDate(dateRange.from)} -{" "}
                    {dateRange.to ? formatDate(dateRange.to) : formatDate(dateRange.from)}
                  </li>
                  <li>
                    <span className="font-medium">Duration:</span> {rentalDays} days
                  </li>
                  <li>
                    <span className="font-medium">Damage Waiver:</span> {damageWaiver ? "Yes" : "No"}
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Contact Information</h4>
                <ul className="space-y-1 text-sm">
                  <li>
                    <span className="font-medium">Name:</span> {contactInfo.name}
                  </li>
                  <li>
                    <span className="font-medium">Email:</span> {contactInfo.email}
                  </li>
                  <li>
                    <span className="font-medium">Phone:</span> {contactInfo.phone}
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Payment</h4>
                <ul className="space-y-1 text-sm">
                  <li>
                    <span className="font-medium">Card:</span> •••• {paymentInfo.cardNumber.slice(-4)}
                  </li>
                  <li>
                    <span className="font-medium">Total:</span> R{totalPrice}
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Pickup Location</h4>
              <div className="aspect-video rounded-lg overflow-hidden border">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3582.0698963028607!2d28.0336699!3d-26.1413729!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e950c68f0406a51%3A0x238ac9d9b1d34041!2sSkillForge%20Equipment%20Center!5e0!3m2!1sen!2sza!4v1621234567890!5m2!1sen!2sza"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <div className="flex items-start gap-2 mt-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">SkillForge Equipment Center</p>
                  <p className="text-muted-foreground">123 Innovation Drive, Johannesburg, 2000</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <Smartphone className="h-5 w-5 text-primary" />
              <p className="text-sm">
                You'll receive a confirmation SMS with pickup instructions at {contactInfo.phone}.
              </p>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handlePrevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    Processing...
                  </>
                ) : (
                  "Confirm Rental"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
