"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  discount?: number
}

interface DeliveryAddress {
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  coordinates?: {
    lat: number
    lng: number
  }
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: any) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  subtotal: number
  total: number
  itemCount: number
  discount: number
  setDiscount: (amount: number) => void
  deliveryAddress: DeliveryAddress | null
  setDeliveryAddress: (address: DeliveryAddress) => void
  voucherCode: string
  setVoucherCode: (code: string) => void
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  subtotal: 0,
  total: 0,
  itemCount: 0,
  discount: 0,
  setDiscount: () => {},
  deliveryAddress: null,
  setDeliveryAddress: () => {},
  voucherCode: "",
  setVoucherCode: () => {},
})

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [discount, setDiscount] = useState(0)
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress | null>(null)
  const [voucherCode, setVoucherCode] = useState("")

  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart))
        } catch (e) {
          console.error("Error parsing cart data:", e)
          localStorage.removeItem("cart")
        }
      }

      const savedAddress = localStorage.getItem("deliveryAddress")
      if (savedAddress) {
        try {
          setDeliveryAddress(JSON.parse(savedAddress))
        } catch (e) {
          console.error("Error parsing address data:", e)
          localStorage.removeItem("deliveryAddress")
        }
      }

      const savedDiscount = localStorage.getItem("cartDiscount")
      if (savedDiscount) {
        try {
          setDiscount(Number.parseFloat(savedDiscount))
        } catch (e) {
          console.error("Error parsing discount data:", e)
          localStorage.removeItem("cartDiscount")
        }
      }

      const savedVoucher = localStorage.getItem("voucherCode")
      if (savedVoucher) {
        setVoucherCode(savedVoucher)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items])

  useEffect(() => {
    if (typeof window !== "undefined" && deliveryAddress) {
      localStorage.setItem("deliveryAddress", JSON.stringify(deliveryAddress))
    }
  }, [deliveryAddress])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cartDiscount", discount.toString())
    }
  }, [discount])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("voucherCode", voucherCode)
    }
  }, [voucherCode])

  const addItem = (product: any) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)

      if (existingItem) {
        return prevItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }

      return [
        ...prevItems,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image || "/placeholder.svg",
          quantity: 1,
          discount: product.discount,
        },
      ]
    })
  }

  const removeItem = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      removeItem(id)
      return
    }

    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
    setDiscount(0)
    setVoucherCode("")
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart")
      localStorage.removeItem("cartDiscount")
      localStorage.removeItem("voucherCode")
    }
  }

  const subtotal = items.reduce((total, item) => {
    const itemPrice = item.discount ? (item.price * (100 - item.discount)) / 100 : item.price
    return total + itemPrice * item.quantity
  }, 0)

  const shipping = items.length > 0 ? 50 : 0
  const total = subtotal + shipping - discount

  const itemCount = items.reduce((count, item) => count + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        total,
        itemCount,
        discount,
        setDiscount,
        deliveryAddress,
        setDeliveryAddress,
        voucherCode,
        setVoucherCode,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)

