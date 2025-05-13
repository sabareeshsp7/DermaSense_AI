"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Check, CreditCard, Landmark, Smartphone } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { useCart } from "@/contexts/cart-context"

const cardFormSchema = z.object({
  cardNumber: z.string().min(16, "Card number must be at least 16 digits"),
  cardName: z.string().min(2, "Cardholder name is required"),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, "Expiry date must be in MM/YY format"),
  cvv: z.string().min(3, "CVV must be at least 3 digits"),
})

const upiFormSchema = z.object({
  upiId: z.string().min(5, "UPI ID is required").regex(/@/, "UPI ID must include @"),
})

const netbankingFormSchema = z.object({
  bank: z.string().min(1, "Please select a bank"),
})

export default function PaymentPage() {
  const { items, subtotal, total, discount, deliveryAddress } = useCart()
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "netbanking" | "cod">("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  const cardForm = useForm<z.infer<typeof cardFormSchema>>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
    },
  })

  const upiForm = useForm<z.infer<typeof upiFormSchema>>({
    resolver: zodResolver(upiFormSchema),
    defaultValues: {
      upiId: "",
    },
  })

  const netbankingForm = useForm<z.infer<typeof netbankingFormSchema>>({
    resolver: zodResolver(netbankingFormSchema),
    defaultValues: {
      bank: "",
    },
  })

  if (!deliveryAddress) {
    router.push("/dashboard/cart")
    return null
  }

  const processPayment = async () => {
    try {
      setIsProcessing(true)

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setIsSuccess(true)

      // Simulate order confirmation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Payment successful!",
        description: "Your payment has been processed successfully.",
      })

      // Redirect to order confirmation page instead of clearing cart
      router.push("/dashboard/order-confirmation")
    } catch {
      toast({
        variant: "destructive",
        title: "Payment failed",
        description: "An error occurred while processing your payment. Please try again.",
      })
      setIsProcessing(false)
    }
  }

  const onCardSubmit = () => {
    processPayment()
  }

  const onUpiSubmit = () => {
    processPayment()
  }

  const onNetbankingSubmit = () => {
    processPayment()
  }

  const onCodSubmit = () => {
    processPayment()
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="rounded-full bg-green-100 p-4 dark:bg-green-900">
          <Check className="h-12 w-12 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="mt-6 text-2xl font-bold">Payment Successful!</h1>
        <p className="mt-2 text-center text-muted-foreground">
          Your payment has been processed successfully. Redirecting to order confirmation...
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Payment</h1>
        <Button variant="outline" onClick={() => router.push("/dashboard/cart")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cart
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Choose your preferred payment method</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value: "card" | "upi" | "netbanking" | "cod") => setPaymentMethod(value)}
                className="grid grid-cols-2 gap-4 md:grid-cols-4"
              >
                <div>
                  <RadioGroupItem value="card" id="card" className="peer sr-only" />
                  <label
                    htmlFor="card"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <CreditCard className="mb-3 h-6 w-6" />
                    Card
                  </label>
                </div>
                <div>
                  <RadioGroupItem value="upi" id="upi" className="peer sr-only" />
                  <label
                    htmlFor="upi"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Smartphone className="mb-3 h-6 w-6" />
                    UPI
                  </label>
                </div>
                <div>
                  <RadioGroupItem value="netbanking" id="netbanking" className="peer sr-only" />
                  <label
                    htmlFor="netbanking"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Landmark className="mb-3 h-6 w-6" />
                    Net Banking
                  </label>
                </div>
                <div>
                  <RadioGroupItem value="cod" id="cod" className="peer sr-only" />
                  <label
                    htmlFor="cod"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <svg className="mb-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Cash on Delivery
                  </label>
                </div>
              </RadioGroup>

              {paymentMethod === "card" && (
                <Form {...cardForm}>
                  <form onSubmit={cardForm.handleSubmit(onCardSubmit)} className="space-y-4">
                    <FormField
                      control={cardForm.control}
                      name="cardNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Card Number</FormLabel>
                          <FormControl>
                            <Input placeholder="1234 5678 9012 3456" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={cardForm.control}
                      name="cardName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cardholder Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={cardForm.control}
                        name="expiryDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiry Date</FormLabel>
                            <FormControl>
                              <Input placeholder="MM/YY" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={cardForm.control}
                        name="cvv"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CVV</FormLabel>
                            <FormControl>
                              <Input placeholder="123" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isProcessing}>
                      {isProcessing ? "Processing..." : "Pay Now"}
                    </Button>
                  </form>
                </Form>
              )}

              {paymentMethod === "upi" && (
                <Form {...upiForm}>
                  <form onSubmit={upiForm.handleSubmit(onUpiSubmit)} className="space-y-4">
                    <FormField
                      control={upiForm.control}
                      name="upiId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>UPI ID</FormLabel>
                          <FormControl>
                            <Input placeholder="yourname@upi" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isProcessing}>
                      {isProcessing ? "Processing..." : "Pay Now"}
                    </Button>
                  </form>
                </Form>
              )}

              {paymentMethod === "netbanking" && (
                <Form {...netbankingForm}>
                  <form onSubmit={netbankingForm.handleSubmit(onNetbankingSubmit)} className="space-y-4">
                    <FormField
                      control={netbankingForm.control}
                      name="bank"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Bank</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            >
                              <option value="">Select a bank</option>
                              <option value="sbi">State Bank of India</option>
                              <option value="hdfc">HDFC Bank</option>
                              <option value="icici">ICICI Bank</option>
                              <option value="axis">Axis Bank</option>
                              <option value="kotak">Kotak Mahindra Bank</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isProcessing}>
                      {isProcessing ? "Processing..." : "Pay Now"}
                    </Button>
                  </form>
                </Form>
              )}

              {paymentMethod === "cod" && (
                <div className="space-y-4">
                  <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 text-yellow-800 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-200">
                    <p>
                      Cash on Delivery is available for this order. You will need to pay ₹{total.toFixed(2)} when your
                      order is delivered.
                    </p>
                  </div>
                  <Button onClick={onCodSubmit} className="w-full" disabled={isProcessing}>
                    {isProcessing ? "Processing..." : "Place Order"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review your order details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-40 space-y-2 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <div className="h-10 w-10 flex-none overflow-hidden rounded-md">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-medium">
                      ₹
                      {(
                        (item.discount ? (item.price * (100 - item.discount)) / 100 : item.price) * item.quantity
                      ).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
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
          </Card>
        </div>
      </div>
    </div>
  )
}

