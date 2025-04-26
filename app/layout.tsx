import { Toaster } from "sonner";

import type React from "react"
import { Inter } from "next/font/google"



import { CartProvider } from "@/contexts/cart-context"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
// import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
// Add this import at the top of the file
import "leaflet/dist/leaflet.css";

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Carcino AI",
  description: "Smart Skin Cancer Management Platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
        <CartProvider>
          {children}
          <Toaster />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}