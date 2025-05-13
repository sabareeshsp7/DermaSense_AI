"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Filter, Grid, List, Search, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { ProductCard } from "@/components/shop/product-card"
import { ProductDetail } from "@/components/shop/product-detail"
import { useCart } from "@/contexts/cart-context"
import { cn } from "@/lib/utils"

const categories = [
  { id: "tablets", name: "Tablets & Capsules" },
  { id: "creams", name: "Creams & Ointments" },
  { id: "lotions", name: "Lotions" },
  { id: "supplements", name: "Supplements" },
  { id: "equipment", name: "Medical Equipment" },
]

const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
]

// Sample products data
const sampleProducts = [
  {
    id: 1,
    name: "Pain Relief Tablets",
    description: "Fast-acting pain relief for headaches and body aches",
    price: 199.99,
    rating: 4.5,
    image: "/placeholder.svg?height=200&width=200",
    category: "tablets",
    requiresPrescription: false,
    inStock: true,
    discount: 10,
  },
  {
    id: 2,
    name: "Skin Healing Cream",
    description: "Advanced formula for treating skin conditions and promoting healing",
    price: 349.99,
    rating: 4.7,
    image: "/placeholder.svg?height=200&width=200",
    category: "creams",
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: 3,
    name: "Vitamin D3 Supplements",
    description: "Essential vitamin D3 supplements for bone health and immunity",
    price: 499.99,
    rating: 4.8,
    image: "/placeholder.svg?height=200&width=200",
    category: "supplements",
    requiresPrescription: false,
    inStock: true,
    discount: 15,
  },
  {
    id: 4,
    name: "Digital Blood Pressure Monitor",
    description: "Accurate and easy-to-use digital blood pressure monitor for home use",
    price: 1999.99,
    rating: 4.6,
    image: "/placeholder.svg?height=200&width=200",
    category: "equipment",
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: 5,
    name: "Moisturizing Lotion",
    description: "Deeply hydrating lotion for dry and sensitive skin",
    price: 299.99,
    rating: 4.4,
    image: "/placeholder.svg?height=200&width=200",
    category: "lotions",
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: 6,
    name: "Antibiotic Ointment",
    description: "Medical-grade antibiotic ointment for treating minor cuts and burns",
    price: 149.99,
    rating: 4.3,
    image: "/placeholder.svg?height=200&width=200",
    category: "creams",
    requiresPrescription: true,
    inStock: true,
  },
  {
    id: 7,
    name: "Glucose Monitor Kit",
    description: "Complete glucose monitoring kit for diabetes management",
    price: 2499.99,
    rating: 4.9,
    image: "/placeholder.svg?height=200&width=200",
    category: "equipment",
    requiresPrescription: false,
    inStock: true,
    discount: 20,
  },
  {
    id: 8,
    name: "Multivitamin Tablets",
    description: "Daily multivitamin tablets for overall health and wellness",
    price: 599.99,
    rating: 4.7,
    image: "/placeholder.svg?height=200&width=200",
    category: "tablets",
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: 9,
    name: "Skin Healing Cream",
    description: "Advanced formula for treating skin conditions and promoting healing",
    price: 949.99,
    rating: 4.7,
    image: "/placeholder.svg?height=200&width=200",
    category: "creams",
    requiresPrescription: false,
    inStock: false,
  },
]

export default function ShopPage() {
  const [view, setView] = useState<"grid" | "list">("grid")
  type Product = {
    id: number
    name: string
    description: string
    price: number
    rating: number
    image: string
    category: string
    requiresPrescription: boolean
    inStock: boolean
    discount?: number
  }

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("popular")
  const router = useRouter()
  const { addItem, itemCount } = useCart()

  const handleAddToCart = (product: Product) => {
    addItem(product)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleAddToWishlist = (product: Product) => {
    toast({
      title: "Added to wishlist",
      description: `${product.name} has been added to your wishlist.`,
    })
  }

  const handleShare = (product: Product) => {
    const shareUrl = `${window.location.origin}/shop/product/${product.id}`

    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: product.description,
          url: shareUrl,
        })
        .catch((error) => console.log("Error sharing", error))
    } else {
      navigator.clipboard.writeText(shareUrl)
      toast({
        title: "Link copied",
        description: "Product link has been copied to clipboard.",
      })
    }
  }

  const filteredProducts = sampleProducts.filter((product) => {
    if (!searchQuery) return true
    return (
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "newest":
        return b.id - a.id
      default:
        return 0
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Medical Shop</h1>
          <p className="text-muted-foreground">Browse our collection of medical products</p>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="relative self-end sm:self-auto"
          onClick={() => router.push("/dashboard/cart")}
        >
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {itemCount}
            </span>
          )}
        </Button>
      </div>

      {/* Banner */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Summer Health Sale</h2>
            <p className="mt-2">Up to 40% off on all skincare products</p>
            <Button className="mt-4 bg-white text-blue-600 hover:bg-blue-50">Shop Now</Button>
          </div>
          <div className="hidden md:block">
            <img
              src="/placeholder.svg?height=200&width=400"
              alt="Summer Sale"
              className="ml-auto h-32 w-auto object-contain"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <Tabs defaultValue="tablets" className="space-y-6">
        <TabsList className="flex w-full space-x-4 overflow-x-auto p-0">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="rounded-full">
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex flex-1 items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Select defaultValue="popular" onValueChange={(value) => setSortBy(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={() => setView(view === "grid" ? "list" : "grid")}>
              {view === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Product Grid */}
        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div
              className={cn(
                "grid gap-6",
                view === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1",
              )}
            >
              {sortedProducts
                .filter((product) => product.category === category.id)
                .map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    view={view}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleAddToWishlist}
                    onShare={handleShare}
                    onClick={() => setSelectedProduct(product)}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Product Detail Modal */}
      <ProductDetail
        product={selectedProduct || {
          id: 0,
          name: '',
          image: '',
          price: 0,
          rating: 0,
          requiresPrescription: false,
          description: '',
          inStock: false,
          category: '',
        } as Product}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={() => selectedProduct && handleAddToCart(selectedProduct)}
      />
    </div>
  )
}

