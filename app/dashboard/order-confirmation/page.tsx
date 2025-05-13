"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { Calendar, Check, Clock, Download, MapPin, Send, Share, Star, ThumbsUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { useCart } from "@/contexts/cart-context"

// Dynamically import the Map component to avoid SSR issues with Leaflet
const DeliveryMap = dynamic(() => import("@/components/shop/delivery-map"), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-gray-100 animate-pulse rounded-md"></div>,
})

export default function OrderConfirmationPage() {
  const router = useRouter()
  const { items, total, subtotal, discount, deliveryAddress, clearCart } = useCart()
  const [orderId, setOrderId] = useState("")
  const [orderDate, setOrderDate] = useState("")
  const [deliveryTime, setDeliveryTime] = useState("morning")
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const invoiceRef = useRef(null)

  useEffect(() => {
    // Generate random order ID and set current date
    if (!orderId) {
      setOrderId(`ORD-${Math.floor(100000 + Math.random() * 900000)}`)
      setOrderDate(format(new Date(), "PPP"))
    }

    // If no items in cart or no delivery address, redirect to dashboard
    if ((!items || items.length === 0) && !deliveryAddress) {
      router.push("/dashboard")
    }
  }, [items, deliveryAddress, orderId, router])

  const handleDownloadInvoice = () => {
    const doc = new jsPDF()

    // Add company logo/header
    doc.setFontSize(20)
    doc.setTextColor(0, 102, 204)
    doc.text("DermaSense AI", 105, 20, { align: "center" })

    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text("Medical Shop - Invoice", 105, 30, { align: "center" })

    // Add invoice details
    doc.setFontSize(10)
    doc.text(`Invoice #: ${orderId}`, 15, 45)
    doc.text(`Date: ${orderDate}`, 15, 52)

    // Add customer details
    if (deliveryAddress) {
      doc.text("Bill To:", 15, 65)
      doc.text(`${deliveryAddress.name}`, 15, 72)
      doc.text(`${deliveryAddress.address}`, 15, 79)
      doc.text(`${deliveryAddress.city}, ${deliveryAddress.state} ${deliveryAddress.pincode}`, 15, 86)
      doc.text(`Phone: ${deliveryAddress.phone}`, 15, 93)
      doc.text(`Email: ${deliveryAddress.email}`, 15, 100)
    }

    // Add items table
    const tableColumn = ["Item", "Price (₹)", "Qty", "Discount (%)", "Total (₹)"]
    const tableRows = items.map((item) => {
      const discountPercent = item.discount || 0
      const itemPrice = item.discount ? (item.price * (100 - item.discount)) / 100 : item.price

      return [
        item.name,
        item.price.toFixed(2),
        item.quantity.toString(),
        discountPercent.toString(),
        (itemPrice * item.quantity).toFixed(2),
      ]
    })

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 110,
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [0, 102, 204] },
    })

    // Add total section
    const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10

    doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 150, finalY)
    if (discount > 0) {
      doc.text(`Discount: -₹${discount.toFixed(2)}`, 150, finalY + 7)
    }
    doc.text(`Shipping: ₹50.00`, 150, finalY + 14)
    doc.text(`Total: ₹${total.toFixed(2)}`, 150, finalY + 21)

    // Add footer
    doc.setFontSize(8)
    doc.text("Thank you for shopping with DermaSense AI Medical Shop!", 105, finalY + 40, { align: "center" })
    doc.text("For any queries, please contact support@dermasense.ai", 105, finalY + 45, { align: "center" })

    // Save the PDF
    doc.save(`DermaSense-Invoice-${orderId}.pdf`)

    toast({
      title: "Invoice downloaded",
      description: "Your invoice has been downloaded successfully.",
    })
  }

  const handleSubmitFeedback = () => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Thank you for your feedback!",
        description: "Your feedback has been submitted successfully.",
      })
      setIsSubmitting(false)
    }, 1000)
  }

  const handleShareOrder = () => {
    const shareText = `I just ordered medical supplies from DermaSense AI! Order #${orderId}`

    if (navigator.share) {
      navigator
        .share({
          title: "My DermaSense Order",
          text: shareText,
          url: window.location.href,
        })
        .catch((err) => {
          console.error("Error sharing:", err)
        })
    } else {
      navigator.clipboard.writeText(shareText)
      toast({
        title: "Link copied",
        description: "Order details copied to clipboard.",
      })
    }
  }

  const handleReturnToDashboard = () => {
    clearCart()
    router.push("/dashboard")
  }

  if (!items || items.length === 0 || !deliveryAddress) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold">No order information found</h1>
        <p className="mt-2 text-muted-foreground">Please return to the dashboard and try again.</p>
        <Button className="mt-6" onClick={() => router.push("/dashboard")}>
          Return to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="rounded-full bg-green-100 p-4 dark:bg-green-900">
          <Check className="h-12 w-12 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="mt-4 text-3xl font-bold">Order Confirmed!</h1>
        <p className="mt-2 text-muted-foreground">
          Your order #{orderId} has been placed successfully on {orderDate}.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Order Summary
              <Button variant="outline" size="icon" onClick={handleDownloadInvoice}>
                <Download className="h-4 w-4" />
              </Button>
            </CardTitle>
            <CardDescription>Order #{orderId}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4" ref={invoiceRef}>
            <div className="max-h-60 space-y-2 overflow-y-auto">
              {items.map((item) => {
                const itemPrice = item.discount ? (item.price * (100 - item.discount)) / 100 : item.price

                return (
                  <div key={item.id} className="flex items-center gap-4 rounded-lg border p-2">
                    <div className="h-12 w-12 flex-none overflow-hidden rounded-md">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">{item.name}</h3>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">
                          ₹{itemPrice.toFixed(2)} x {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right font-medium">₹{(itemPrice * item.quantity).toFixed(2)}</div>
                  </div>
                )
              })}
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹50.00</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="rounded-md border p-4">
              <h3 className="font-medium">Delivery Address</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {deliveryAddress.name}
                <br />
                {deliveryAddress.address}
                <br />
                {deliveryAddress.city}, {deliveryAddress.state} {deliveryAddress.pincode}
                <br />
                {deliveryAddress.phone}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleShareOrder}>
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button onClick={handleReturnToDashboard}>Return to Dashboard</Button>
          </CardFooter>
        </Card>

        {/* Delivery and Feedback */}
        <div className="space-y-6">
          {/* Delivery Map */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Delivery Location
              </CardTitle>
              <CardDescription>Your order will be delivered to this location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] rounded-md border overflow-hidden">
                {deliveryAddress.coordinates && (
                  <DeliveryMap selectedPosition={deliveryAddress.coordinates} readOnly={true} />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Time */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Delivery Time
              </CardTitle>
              <CardDescription>Choose your preferred delivery time</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={deliveryTime}
                onValueChange={setDeliveryTime}
                className="grid grid-cols-1 gap-4 md:grid-cols-3"
              >
                <div>
                  <RadioGroupItem value="morning" id="morning" className="peer sr-only" />
                  <Label
                    htmlFor="morning"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Calendar className="mb-3 h-6 w-6" />
                    <span className="font-medium">Morning</span>
                    <span className="text-xs text-muted-foreground">9 AM - 12 PM</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="afternoon" id="afternoon" className="peer sr-only" />
                  <Label
                    htmlFor="afternoon"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Calendar className="mb-3 h-6 w-6" />
                    <span className="font-medium">Afternoon</span>
                    <span className="text-xs text-muted-foreground">12 PM - 4 PM</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="evening" id="evening" className="peer sr-only" />
                  <Label
                    htmlFor="evening"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Calendar className="mb-3 h-6 w-6" />
                    <span className="font-medium">Evening</span>
                    <span className="text-xs text-muted-foreground">4 PM - 8 PM</span>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ThumbsUp className="mr-2 h-5 w-5" />
                Rate Your Experience
              </CardTitle>
              <CardDescription>Help us improve our service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setRating(star)}
                    className="rounded-full p-1 focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${rating >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  </motion.button>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="feedback">Share your feedback</Label>
                <Textarea
                  id="feedback"
                  placeholder="Tell us about your experience..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                />
              </div>
              <Button className="w-full" onClick={handleSubmitFeedback} disabled={isSubmitting || rating === 0}>
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

