"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Activity,
  Calendar,
  ChevronRight,
  FileText,
  Home,
  Menu,
  Settings,
  ShoppingBag,
  User,
  Users,
  Microscope,
  Pill,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/dashboard",
  },
  {
    title: "Skin Cancer Analysis",
    icon: Microscope,
    href: "/dashboard/analysis",
  },
  {
    title: "Oncologist Appointments",
    icon: Calendar,
    href: "/dashboard/appointments",
  },
  {
    title: "Treatment Plans",
    icon: Activity,
    href: "/dashboard/treatment",
  },
  {
    title: "Health Metrics & Medication",
    icon: Pill,
    href: "/dashboard/metrics",
  },
  {
    title: "Community & Resources",
    icon: Users,
    href: "/dashboard/community",
  },
  {
    title: "Medical Shop",
    icon: ShoppingBag,
    href: "/dashboard/shop",
  },
  {
    title: "Medical History",
    icon: FileText,
    href: "/dashboard/medical-history",
  },
  {
    title: "Profile",
    icon: User,
    href: "/dashboard/profile",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const SidebarContent = () => (
    <nav className="flex-1 space-y-1 p-4">
      {menuItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link key={item.href} href={item.href}>
            <div
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
              {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
            </div>
          </Link>
        )
      })}
    </nav>
  )

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="h-14 border-b px-4">
            <SheetTitle className="flex items-center gap-2">
              <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                <Activity className="h-6 w-6 text-primary" />
                <span>Carcino AI</span>
              </Link>
            </SheetTitle>
          </SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-screen w-64 flex-col fixed left-0 top-0 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <Activity className="h-6 w-6 text-primary" />
            <span>Carcino AI</span>
          </Link>
        </div>
        <SidebarContent />
      </div>
    </>
  )
}

