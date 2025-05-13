"use client"

import { Heart, Share2, ShoppingCart, Star } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: {
    id: number
    name: string
    description: string
    price: number
    rating: number
    image: string
    requiresPrescription?: boolean
    category?: string
    inStock?: boolean
    discount?: number
  }
  view: "grid" | "list"
  onAddToCart: (product: ProductCardProps["product"]) => void
  onAddToWishlist: (product: ProductCardProps["product"]) => void
  onShare: (product: ProductCardProps["product"]) => void
  onClick: () => void
}

export function ProductCard({ product, view, onAddToCart, onAddToWishlist, onShare, onClick }: ProductCardProps) {
  const discountedPrice = product.discount ? (product.price * (100 - product.discount)) / 100 : product.price

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card
        className={cn(
          "group overflow-hidden transition-all hover:shadow-lg",
          view === "list" && "flex",
          !product.inStock && "opacity-70",
        )}
      >
        <div className={cn("relative aspect-square overflow-hidden", view === "list" && "w-48")}>
          <img
            src={product.image || "/placeholder.svg?height=200&width=200"}
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation()
              onAddToWishlist(product)
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
          {product.discount && (
            <div className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white">
              {product.discount}% OFF
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col">
          <CardHeader className="cursor-pointer" onClick={onClick}>
            <CardTitle className="line-clamp-1">{product.name}</CardTitle>
            <CardDescription className="line-clamp-2">{product.description}</CardDescription>
            {product.requiresPrescription && <span className="text-xs text-blue-500">Prescription Required</span>}
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="text-sm">{product.rating}</span>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold">₹{discountedPrice.toFixed(2)}</div>
              {product.discount && (
                <div className="text-sm text-muted-foreground line-through">₹{product.price.toFixed(2)}</div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  onShare(product)
                }}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  onAddToCart(product)
                }}
                disabled={!product.inStock}
                className="whitespace-nowrap"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
            </div>
          </CardFooter>
        </div>
      </Card>
    </motion.div>
  )
}

