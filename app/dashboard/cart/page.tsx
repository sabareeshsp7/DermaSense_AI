"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, Minus, Plus, Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { useCart } from "@/contexts/cart-context"

// Dynamically import the Map component to avoid SSR issues with Leaflet
const AddressMap = dynamic(() => import("@/components/shop/address-map"), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-gray-100 animate-pulse rounded-md"></div>,
})

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  pincode: z.string().min(6, "Pincode must be at least 6 characters"),
})

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    subtotal,
    total,
    clearCart,
    discount,
    setDiscount,
    voucherCode,
    setVoucherCode,
    deliveryAddress,
    setDeliveryAddress,
  } = useCart()
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: deliveryAddress?.name || "",
      email: deliveryAddress?.email || "",
      phone: deliveryAddress?.phone || "",
      address: deliveryAddress?.address || "",
      city: deliveryAddress?.city || "",
      state: deliveryAddress?.state || "",
      pincode: deliveryAddress?.pincode || "",
    },
  })

  useEffect(() => {
    if (deliveryAddress) {
      form.reset({
        name: deliveryAddress.name,
        email: deliveryAddress.email,
        phone: deliveryAddress.phone,
        address: deliveryAddress.address,
        city: deliveryAddress.city,
        state: deliveryAddress.state,
        pincode: deliveryAddress.pincode,
      })

      if (deliveryAddress.coordinates) {
        setSelectedLocation(deliveryAddress.coordinates)
      }
    }
  }, [deliveryAddress, form])

  const applyVoucher = () => {
    if (voucherCode.toLowerCase() === "derma10") {
      setDiscount(subtotal * 0.1)
      toast({
        title: "Voucher applied",
        description: "10% discount has been applied to your order.",
      })
    } else if (voucherCode.toLowerCase() === "derma20") {
      setDiscount(subtotal * 0.2)
      toast({
        title: "Voucher applied",
        description: "20% discount has been applied to your order.",
      })
    } else {
      toast({
        variant: "destructive",
        title: "Invalid voucher",
        description: "The voucher code you entered is invalid.",
      })
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!selectedLocation) {
      toast({
        variant: "destructive",
        title: "Location required",
        description: "Please select your delivery location on the map.",
      })
      return
    }

    setDeliveryAddress({
      ...values,
      coordinates: selectedLocation,
    })

    router.push("/dashboard/payment")
  }

  const handleMapClick = async (position: { lat: number; lng: number }) => {
    setSelectedLocation(position)

    try {
      // Use OpenStreetMap Nominatim API directly
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}&addressdetails=1`,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "DermaSense AI Application",
          },
        },
      )

      if (!response.ok) {
        throw new Error("Failed to fetch address data")
      }

      const data = await response.json()

      if (data && data.address) {
        const address = data.address

        // Build a complete address string
        const addressParts = [
          address.road,
          address.house_number,
          address.suburb,
          address.neighbourhood,
          address.hamlet,
        ].filter(Boolean)

        if (addressParts.length > 0) {
          form.setValue("address", addressParts.join(", "))
        }

        // Set city
        if (address.city || address.town || address.village) {
          form.setValue("city", address.city || address.town || address.village)
        }

        // Set state
        if (address.state) {
          form.setValue("state", address.state)
        }

        // Set pincode
        if (address.postcode) {
          form.setValue("pincode", address.postcode)
        }

        toast({
          title: "Address updated",
          description: "Location details have been filled automatically.",
        })
      }
    } catch (error) {
      console.error("Error fetching address:", error)
      toast({
        variant: "destructive",
        title: "Address lookup failed",
        description: "Could not retrieve address details. Please fill them manually.",
      })
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Add some products to your cart to continue shopping.</p>
        <Button className="mt-6" onClick={() => router.push("/dashboard/shop")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shop
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
        <Button variant="outline" onClick={() => router.push("/dashboard/shop")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Continue Shopping
        </Button>
      </div>

      {/* Cart Items */}
      <Card>
        <CardHeader>
          <CardTitle>Cart Items</CardTitle>
          <CardDescription>Review and modify your cart items</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => {
            const itemPrice = item.discount ? (item.price * (100 - item.discount)) / 100 : item.price

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center gap-4 rounded-lg border p-4"
              >
                <div className="h-20 w-20 flex-none overflow-hidden rounded-md">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-1 flex-col">
                  <h3 className="font-medium">{item.name}</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold">₹{itemPrice.toFixed(2)}</p>
                    {item.discount && (
                      <p className="text-xs text-muted-foreground line-through">₹{item.price.toFixed(2)}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-right font-medium">₹{(itemPrice * item.quantity).toFixed(2)}</div>
                <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            )
          })}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Enter voucher code"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              className="w-48"
            />
            <Button variant="outline" onClick={applyVoucher}>
              Apply
            </Button>
          </div>
          <Button variant="destructive" onClick={clearCart}>
            Clear Cart
          </Button>
        </CardFooter>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
          <CardDescription>Review your order details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      {/* Delivery Address */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Address</CardTitle>
          <CardDescription>Enter your delivery details</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+91 9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormLabel>Select Location on Map</FormLabel>
                <div className="h-[300px] rounded-md border overflow-hidden">
                  <AddressMap selectedPosition={selectedLocation} onPositionChange={handleMapClick} />
                </div>
                <p className="text-sm text-muted-foreground">
                  Click on the map to select your delivery location. We&apos;ll automatically fill your address details.
                </p>
              </div>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Mumbai" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="Maharashtra" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pincode</FormLabel>
                      <FormControl>
                        <Input placeholder="400001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full">
                Proceed to Payment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

