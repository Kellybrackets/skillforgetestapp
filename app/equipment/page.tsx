"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Search, Star, HelpCircle, Plus, Minus } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data for equipment with ZAR pricing
const equipment = [
  {
    id: 1,
    name: "Canon EOS R5",
    category: "Photography",
    price: 750,
    image: "/images/canon4.jpeg",
    description: "Professional mirrorless camera with 45MP full-frame sensor and 8K video recording.",
    rating: 4.9,
    reviews: 124,
    available: true,
  },
  {
    id: 2,
    name: "Sony A7 III",
    category: "Photography",
    price: 550,
    image: "/images/cam4.jpeg",
    description: "Full-frame mirrorless camera with excellent low-light performance and 4K video.",
    rating: 4.7,
    reviews: 98,
    available: true,
  },
  {
    id: 3,
    name: "Neumann U87 Microphone",
    category: "Audio",
    price: 320,
    image: "/images/mic2.jpeg",
    description: "Professional studio condenser microphone, ideal for vocals, podcasts, and streaming.",
    rating: 4.8,
    reviews: 156,
    available: true,
  },
  {
    id: 4,
    name: "Fujifilm X-T20",
    category: "Photography",
    price: 400,
    image: "/images/cam2.jpeg",
    description: "Compact mirrorless camera with vintage styling and excellent image quality.",
    rating: 4.6,
    reviews: 87,
    available: false,
  },
  {
    id: 5,
    name: "Canon EOS DSLR",
    category: "Video",
    price: 480,
    image: "/images/canon3.jpeg",
    description: "Versatile DSLR camera with 18-55mm lens, perfect for both photography and video.",
    rating: 4.9,
    reviews: 112,
    available: true,
  },
  {
    id: 6,
    name: "Canon EOS 1200D",
    category: "Photography",
    price: 350,
    image: "/images/canon2.jpeg",
    description: "Entry-level DSLR camera with 18MP sensor, ideal for beginners and enthusiasts.",
    rating: 4.5,
    reviews: 143,
    available: true,
  },
  {
    id: 7,
    name: "Professional DSLR Kit",
    category: "Video",
    price: 850,
    image: "/images/cam1.jpeg",
    description: "Complete DSLR setup with tripod for landscape and nature photography and videography.",
    rating: 4.8,
    reviews: 76,
    available: true,
  },
  {
    id: 8,
    name: "Studio Condenser Microphone",
    category: "Audio",
    price: 280,
    image: "/images/mic.jpeg",
    description: "High-quality condenser microphone for studio recording and professional audio capture.",
    rating: 4.7,
    reviews: 92,
    available: true,
  },
]

// Equipment Card Component
interface EquipmentCardProps {
  item: (typeof equipment)[0]
  onRentNow: (item: (typeof equipment)[0]) => void
}

function EquipmentCard({ item, onRentNow }: EquipmentCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="h-64 w-full relative">
        {/* Using a div with background-image as a fallback since we don't have actual image files */}
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }}></div>
        <Badge variant="accent" className="absolute top-3 right-3 z-10">
          {item.category}
        </Badge>
        {!item.available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
            <Badge variant="secondary" className="text-base px-3 py-1">
              Currently Unavailable
            </Badge>
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{item.name}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <div className="flex items-center mb-2">
          <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
          <span className="font-medium mr-1">{item.rating}</span>
          <span className="text-sm text-muted-foreground">({item.reviews} reviews)</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="w-full">
          <div className="flex items-center text-xl font-bold text-primary mb-3">
            <span>R{item.price}</span>
            <span className="text-sm font-normal text-muted-foreground ml-1">/day</span>
          </div>
          <Button
            className="w-full"
            variant={item.available ? "default" : "outline"}
            onClick={() => item.available && onRentNow(item)}
            disabled={!item.available}
          >
            {item.available ? "Rent Now" : "Unavailable"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default function EquipmentPage() {
  const { toast } = useToast()
  const [activeCategory, setActiveCategory] = useState("all")
  const [selectedEquipment, setSelectedEquipment] = useState<(typeof equipment)[0] | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [rentalStep, setRentalStep] = useState(1)
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false)
  const [rentalDays, setRentalDays] = useState(3)
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvc: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const filteredEquipment = equipment.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category.toLowerCase() === activeCategory.toLowerCase()
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })

  const handleRentNow = (item: (typeof equipment)[0]) => {
    setSelectedEquipment(item)
    setRentalStep(1)
    setIsRentalModalOpen(true)
  }

  const handleNextStep = () => {
    if (rentalStep < 3) {
      setRentalStep(rentalStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (rentalStep > 1) {
      setRentalStep(rentalStep - 1)
    }
  }

  const handlePaymentDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Format card number with spaces
    if (name === "cardNumber") {
      const formattedValue = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim()
        .slice(0, 19)

      setPaymentDetails({
        ...paymentDetails,
        [name]: formattedValue,
      })
      return
    }

    setPaymentDetails({
      ...paymentDetails,
      [name]: value,
    })
  }

  const handleConfirmRental = () => {
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setIsRentalModalOpen(false)

      if (selectedEquipment) {
        toast({
          title: "Rental Confirmed!",
          description: `Your ${selectedEquipment.name} rental has been confirmed for ${rentalDays} days.`,
        })
      }

      // Reset form
      setRentalStep(1)
      setRentalDays(3)
      setPaymentDetails({
        cardNumber: "",
        cardName: "",
        expiry: "",
        cvc: "",
      })
    }, 1500)
  }

  const incrementRentalDays = () => {
    if (rentalDays < 7) {
      setRentalDays(rentalDays + 1)
    }
  }

  const decrementRentalDays = () => {
    if (rentalDays > 1) {
      setRentalDays(rentalDays - 1)
    }
  }

  const calculateTotalPrice = () => {
    if (!selectedEquipment) return 0
    return selectedEquipment.price * rentalDays
  }

  return (
    <div className="bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Rent Equipment in South Africa</h1>
          <p className="mt-2 text-lg text-muted-foreground">Access professional gear for your creative projects</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveCategory}>
          <TabsList className="grid grid-cols-4 w-full max-w-md mx-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="photography">Photography</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
            <TabsTrigger value="video">Video</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEquipment.map((item) => (
                <EquipmentCard key={item.id} item={item} onRentNow={handleRentNow} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="photography" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEquipment.map((item) => (
                <EquipmentCard key={item.id} item={item} onRentNow={handleRentNow} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="audio" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEquipment.map((item) => (
                <EquipmentCard key={item.id} item={item} onRentNow={handleRentNow} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="video" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEquipment.map((item) => (
                <EquipmentCard key={item.id} item={item} onRentNow={handleRentNow} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {filteredEquipment.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No equipment found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              We couldn't find any equipment matching your search criteria. Try adjusting your filters or search term.
            </p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setActiveCategory("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Rental Modal */}
        <Dialog open={isRentalModalOpen} onOpenChange={setIsRentalModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {rentalStep === 1 && "Rental Details"}
                {rentalStep === 2 && "Payment Information"}
                {rentalStep === 3 && "Confirmation"}
              </DialogTitle>
            </DialogHeader>

            {/* Progress indicator */}
            <div className="relative mb-6">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted -translate-y-1/2"></div>
              <div className="relative flex justify-between">
                <div className="flex flex-col items-center">
                  <div
                    className={`z-10 flex items-center justify-center w-8 h-8 rounded-full ${
                      rentalStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    1
                  </div>
                  <span className="text-xs mt-1">Details</span>
                </div>
                <div className="flex flex-col items-center">
                  <div
                    className={`z-10 flex items-center justify-center w-8 h-8 rounded-full ${
                      rentalStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    2
                  </div>
                  <span className="text-xs mt-1">Payment</span>
                </div>
                <div className="flex flex-col items-center">
                  <div
                    className={`z-10 flex items-center justify-center w-8 h-8 rounded-full ${
                      rentalStep >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    3
                  </div>
                  <span className="text-xs mt-1">Confirm</span>
                </div>
              </div>
            </div>

            {/* Equipment summary */}
            {selectedEquipment && (
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg mb-6">
                <div className="w-16 h-16 relative rounded-md overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${selectedEquipment.image || "/placeholder.svg?height=64&width=64"})`,
                    }}
                  ></div>
                </div>
                <div>
                  <h3 className="font-medium">{selectedEquipment.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedEquipment.category}</p>
                  <p className="text-sm font-medium">R{selectedEquipment.price}/day</p>
                </div>
              </div>
            )}

            {/* Step 1: Rental Details */}
            {rentalStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rental Days (1-7)</label>
                  <div className="flex items-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={decrementRentalDays}
                      disabled={rentalDays <= 1}
                      className="h-8 w-8"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="w-12 mx-2">
                      <Input
                        type="number"
                        min={1}
                        max={7}
                        value={rentalDays}
                        onChange={(e) => setRentalDays(Number(e.target.value))}
                        className="text-center"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={incrementRentalDays}
                      disabled={rentalDays >= 7}
                      className="h-8 w-8"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Maximum rental period is 7 days</p>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between mb-2">
                    <span>Daily Rate</span>
                    <span>R{selectedEquipment?.price || 0}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Duration</span>
                    <span>
                      {rentalDays} day{rentalDays !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Total</span>
                    <span>R{calculateTotalPrice()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Payment Information */}
            {rentalStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="cardNumber" className="text-sm font-medium">
                    Card Number
                  </label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="4242 4242 4242 4242"
                    value={paymentDetails.cardNumber}
                    onChange={handlePaymentDetailsChange}
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="cardName" className="text-sm font-medium">
                    Cardholder Name
                  </label>
                  <Input
                    id="cardName"
                    name="cardName"
                    placeholder="John Smith"
                    value={paymentDetails.cardName}
                    onChange={handlePaymentDetailsChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="expiry" className="text-sm font-medium">
                      Expiry Date
                    </label>
                    <Input
                      id="expiry"
                      name="expiry"
                      placeholder="MM/YY"
                      value={paymentDetails.expiry}
                      onChange={handlePaymentDetailsChange}
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="cvc" className="text-sm font-medium">
                      CVC
                    </label>
                    <Input
                      id="cvc"
                      name="cvc"
                      placeholder="123"
                      value={paymentDetails.cvc}
                      onChange={handlePaymentDetailsChange}
                      maxLength={3}
                    />
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between font-medium">
                    <span>Total Amount</span>
                    <span>R{calculateTotalPrice()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {rentalStep === 3 && (
              <div className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Rental Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Equipment:</span>
                      <span className="font-medium">{selectedEquipment?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rental Period:</span>
                      <span>
                        {rentalDays} day{rentalDays !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Daily Rate:</span>
                      <span>R{selectedEquipment?.price || 0}</span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t mt-2">
                      <span>Total:</span>
                      <span>R{calculateTotalPrice()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Payment Method</h3>
                  <div className="flex items-center">
                    <div className="w-10 h-6 bg-gray-200 rounded mr-3"></div>
                    <span>•••• •••• •••• {paymentDetails.cardNumber.slice(-4) || "4242"}</span>
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Pickup Location</h3>
                  <p className="text-sm mb-2">SkillForge Equipment Center</p>
                  <p className="text-sm text-muted-foreground">123 Main Street, Cape Town, 8001</p>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-6">
              {rentalStep > 1 ? (
                <Button variant="outline" onClick={handlePrevStep}>
                  Back
                </Button>
              ) : (
                <Button variant="outline" onClick={() => setIsRentalModalOpen(false)}>
                  Cancel
                </Button>
              )}

              {rentalStep < 3 ? (
                <Button onClick={handleNextStep}>Continue</Button>
              ) : (
                <Button onClick={handleConfirmRental} disabled={isProcessing}>
                  {isProcessing ? "Processing..." : "Confirm Rental"}
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </main>

      {/* Sticky Support Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t py-3 px-4 flex justify-center shadow-lg">
        <Button variant="outline" className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4" />
          <span>Need help? Contact support</span>
        </Button>
      </div>
    </div>
  )
}
