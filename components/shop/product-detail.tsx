"use client"

import { ShoppingCart, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ProductDetailProps {
  product: {
    name: string
    image: string
    price: number
    discount?: number
    rating: number
    requiresPrescription: boolean
    description: string
    brand?: string
    category?: string
    contents?: string
    inStock: boolean
  }
  open: boolean
  onClose: () => void
  onAddToCart: (product: ProductDetailProps['product']) => void
}

export function ProductDetail({ product, open, onClose, onAddToCart }: ProductDetailProps) {
  if (!product) return null

  const discountedPrice = product.discount ? (product.price * (100 - product.discount)) / 100 : product.price

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
          <DialogDescription>View detailed product information</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-lg">
            <img
              src={product.image || "/placeholder.svg?height=400&width=400"}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span>
                  {product.rating} ({Math.floor(Math.random() * 100) + 50} reviews)
                </span>
              </div>
              {product.requiresPrescription && <div className="mt-2 text-sm text-blue-500">Prescription Required</div>}
            </div>
            <Separator />
            <Tabs defaultValue="description">
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="usage">Usage</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="space-y-4">
                <p>{product.description}</p>
                <div>
                  <h4 className="font-semibold">Key Benefits:</h4>
                  <ul className="list-inside list-disc">
                    <li>Clinically tested and proven effective</li>
                    <li>Fast-acting formula</li>
                    <li>No known side effects</li>
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold">Brand</h4>
                    <p>{product.brand || "DermaSense"}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Category</h4>
                    <p>{product.category || "General"}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Contents</h4>
                    <p>{product.contents || "30 tablets"}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Prescription</h4>
                    <p>{product.requiresPrescription ? "Required" : "Not Required"}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="usage" className="space-y-4">
                <div>
                  <h4 className="font-semibold">Directions</h4>
                  <p>
                    Take one tablet daily with water, preferably with meals or as directed by your healthcare
                    professional.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Precautions</h4>
                  <ul className="list-inside list-disc">
                    <li>Keep out of reach of children</li>
                    <li>Store in a cool, dry place</li>
                    <li>Consult doctor if pregnant or nursing</li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">₹{discountedPrice.toFixed(2)}</div>
                {product.discount && (
                  <div className="text-sm text-muted-foreground line-through">₹{product.price.toFixed(2)}</div>
                )}
              </div>
              <div className="flex gap-2">
                <Button onClick={() => onAddToCart(product)} disabled={!product.inStock} className="whitespace-nowrap">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

