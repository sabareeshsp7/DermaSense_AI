"use client"

import { motion } from "framer-motion"
import { Activity, Calendar, FileText, ShoppingBag, Stethoscope, User } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    title: "AI Skin Analysis",
    description: "Get instant AI-powered analysis of your skin condition",
    icon: Activity,
    href: "/dashboard/analysis",
    color: "bg-blue-500",
  },
  {
    title: "Book Appointment",
    description: "Schedule a consultation with a dermatologist",
    icon: Calendar,
    href: "/dashboard/appointments",
    color: "bg-green-500",
  },
  {
    title: "Find Doctors",
    description: "Browse and connect with qualified dermatologists",
    icon: Stethoscope,
    href: "/dashboard/doctors",
    color: "bg-purple-500",
  },
  {
    title: "Medical Shop",
    description: "Purchase recommended skincare products",
    icon: ShoppingBag,
    href: "/dashboard/shop",
    color: "bg-pink-500",
  },
  {
    title: "Medical History",
    description: "View and manage your medical records",
    icon: FileText,
    href: "/dashboard/medical-history",
    color: "bg-yellow-500",
  },
  {
    title: "Profile & Settings",
    description: "Manage your account and preferences",
    icon: User,
    href: "/dashboard/profile",
    color: "bg-orange-500",
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome to DermaSense AI</h2>
        <p className="text-muted-foreground">Your comprehensive skin health management platform</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link href={feature.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${feature.color}`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

