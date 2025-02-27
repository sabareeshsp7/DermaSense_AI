import type React from "react"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    user.user_metadata = {
      ...user.user_metadata,
      avatar_url: user.user_metadata.avatar_url || "",
    } as { avatar_url?: string };
  }

  if (user) {
    user.user_metadata = {
      ...user.user_metadata,
      avatar_url: user.user_metadata.avatar_url || "",
    };
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="lg:pl-64">
        {user ? <DashboardHeader user={user} /> : <div>Loading...</div>}
        <main className="container py-6">{children}</main>
      </div>
    </div>
  )
}

