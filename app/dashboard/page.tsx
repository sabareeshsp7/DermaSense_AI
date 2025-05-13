"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Activity,
  Calendar,
  FileText,
  ShoppingBag,
  User,
  Users,
  Microscope,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  Pill,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Banner data for the carousel
const banners = [
  {
    title: "AI-Powered Skin Analysis",
    description: "Get instant, accurate analysis of skin conditions using our advanced machine learning algorithms",
    color: "from-blue-500 to-blue-600",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "Connect with Expert Dermatologists",
    description: "Schedule consultations with qualified specialists for personalized care and treatment",
    color: "from-purple-500 to-purple-600",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "Track Your Skin Health Journey",
    description: "Monitor your progress, manage appointments, and access your complete medical history",
    color: "from-green-500 to-green-600",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "Comprehensive Medical Shop",
    description: "Access recommended skincare products and medical supplies from trusted providers",
    color: "from-pink-500 to-pink-600",
    image: "/placeholder.svg?height=400&width=600",
  },
]

// Feature cards data
const features = [
    {
      title: "Skin Cancer Analysis",
      description: "Upload images for AI-powered carcinoma detection",
      icon: Microscope,
      href: "/dashboard/analysis",
      color: "bg-blue-100",
      iconColor: "text-blue-500",
    },
    {
      title: "Oncologist Appointments",
      description: "Schedule consultations with skin cancer specialists",
      icon: Calendar,
      href: "/dashboard/appointments",
      color: "bg-green-100",
      iconColor: "text-green-500",
    },
    {
      title: "Treatment Plans",
      description: "View and manage your personalized treatment plans",
      icon: Activity,
      href: "/dashboard/treatment",
      color: "bg-purple-100",
      iconColor: "text-purple-500",
    },
    {
      title: "Health Metrics & Medication",
      description: "Track health indicators and manage medications",
      icon: Pill,
      href: "/dashboard/metrics",
      color: "bg-red-100",
      iconColor: "text-red-500",
    },
    {
      title: "Community & Resources",
      description: "Connect with others and access educational resources",
      icon: Users,
      href: "/dashboard/community",
      color: "bg-yellow-100",
      iconColor: "text-yellow-500",
    },
    {
      title: "Medical Shop",
      description: "Purchase recommended medical supplies and products",
      icon: ShoppingBag,
      href: "/dashboard/shop",
      color: "bg-pink-100",
      iconColor: "text-pink-500",
    },
    {
      title: "Medical History",
      description: "View your complete medical records and history",
      icon: FileText,
      href: "/dashboard/medical-history",
      color: "bg-indigo-100",
      iconColor: "text-indigo-500",
    },
    {
      title: "Profile & Settings",
      description: "Manage your account and preferences",
      icon: User,
      href: "/dashboard/profile",
      color: "bg-gray-100",
      iconColor: "text-gray-500",
    },
  
]

export default function DashboardPage() {
  const [currentBanner, setCurrentBanner] = useState(0)

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length)
  }

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)
  }

  // Auto-advance banner every 5 seconds
  useEffect(() => {
    const timer = setInterval(nextBanner, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Welcome to Carcino AI</h1>
        <p className="text-xl text-muted-foreground">Your comprehensive skin cancer management platform</p>
      </div>

      {/* Feature Banner Carousel */}
      <div className="relative overflow-hidden rounded-lg">
        <div className="relative h-[300px] w-full">
          {banners.map((banner, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                currentBanner === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className={`h-full w-full bg-gradient-to-r ${banner.color} p-8 flex items-center`}>
                <div className="w-1/2 text-white">
                  <h2 className="text-3xl font-bold mb-4">{banner.title}</h2>
                  <p className="text-lg text-white/90">{banner.description}</p>
                </div>
                <div className="w-1/2">
                  <img
                    src={banner.image || "/placeholder.svg"}
                    alt={banner.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full"
          onClick={prevBanner}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full"
          onClick={nextBanner}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              aria-label={`Go to banner ${index + 1}`}
              className={`w-2 h-2 rounded-full transition-all ${
                currentBanner === index ? "w-6 bg-white" : "bg-white/50"
              }`}
              onClick={() => setCurrentBanner(index)}
            />
          ))}
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Link key={feature.title} href={feature.href}>
            <Card className="h-full transition-all duration-200 hover:shadow-lg">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center`}>
                  <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                </div>
                <CardTitle className="mt-4">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full">
                  Get Started
                  <span className="ml-2">→</span>
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Additional Features Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Why Choose Carcino AI?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Microscope className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Advanced AI Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  State-of-the-art machine learning for accurate skin condition detection
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Stethoscope className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Expert Dermatologists</h4>
                <p className="text-sm text-muted-foreground">
                  Connect with qualified specialists for personalized care
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Comprehensive Care</h4>
                <p className="text-sm text-muted-foreground">Complete solution for skin health management</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Latest Updates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <p className="font-medium">New AI Model Released</p>
              <p className="text-sm text-muted-foreground">
                Our latest AI model achieves 95% accuracy in skin condition detection
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-medium">Expanded Doctor Network</p>
              <p className="text-sm text-muted-foreground">
                Now featuring over 100 specialized dermatologists across India
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-medium">Enhanced Telemedicine</p>
              <p className="text-sm text-muted-foreground">Improved video consultation experience with new features</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

