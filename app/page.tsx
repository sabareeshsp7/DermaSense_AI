import Link from "next/link"
import { ArrowRight, Stethoscope, Users, Microscope, Brain, HeartPulse } from "lucide-react"


import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <h1 className="text-xl font-bold">Carcino AI</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-teal-100 dark:from-blue-950 dark:to-teal-950" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block">Carcino AI</span>
              <span className="block text-blue-600 dark:text-blue-400">Carcinoma Cells Prediction</span>
            </h1>
            <p className="mx-auto mt-3 max-w-md text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
              Advanced AI-powered skin cancer detection, classification, and management platform. Get accurate
              predictions, personalized treatment plans, and comprehensive support throughout your healthcare journey.
            </p>
            <div className="mx-auto mt-5 max-w-md sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link href="/register">
                  <Button className="w-full px-8 py-3 text-base font-medium sm:px-10">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative bg-white dark:bg-gray-900 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="transform transition-all hover:scale-105">
              <CardContent className="p-6">
                <Microscope className="h-12 w-12 text-blue-500" />
                <h3 className="mt-4 text-lg font-medium">AI-Powered Analysis</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Get accurate skin cancer detection and classification using advanced machine learning models.
                </p>
              </CardContent>
            </Card>

            <Card className="transform transition-all hover:scale-105">
              <CardContent className="p-6">
                <Stethoscope className="h-12 w-12 text-blue-500" />
                <h3 className="mt-4 text-lg font-medium">Oncologist Connections</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Connect with specialized oncologists and get personalized treatment plans.
                </p>
              </CardContent>
            </Card>

            <Card className="transform transition-all hover:scale-105">
              <CardContent className="p-6">
                <Users className="h-12 w-12 text-blue-500" />
                <h3 className="mt-4 text-lg font-medium">Community Support</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Join our community form to share experiences and get support from others on similar cancer journeys.
                </p>
              </CardContent>
            </Card>

            <Card className="transform transition-all hover:scale-105">
              <CardContent className="p-6">
                <HeartPulse className="h-12 w-12 text-blue-500" />
                <h3 className="mt-4 text-lg font-medium">Health Tracking</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Monitor your health metrics, treatment progress, and medication adherence over time.
                </p>
              </CardContent>
            </Card>

            <Card className="transform transition-all hover:scale-105">
              <CardContent className="p-6">
                <Brain className="h-12 w-12 text-blue-500" />
                <h3 className="mt-4 text-lg font-medium">Mental Wellness</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Access resources for emotional and mental support throughout your cancer journey.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

