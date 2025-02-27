import type React from "react";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

// Define a proper type for User
type CustomUser = {
  id: string;
  email: string;
  user_metadata: {
    avatar_url: string; // Ensure avatar_url is always present
    [key: string]: unknown; // Allow other metadata fields
  };
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase.auth.getUser();

  // Ensure user exists and format user_metadata properly
  const user: CustomUser | null = data.user
    ? {
        id: data.user.id,
        email: data.user.email || "",
        user_metadata: {
          avatar_url: data.user.user_metadata?.avatar_url || "",
          ...data.user.user_metadata, // Keep other metadata fields
        },
      }
    : null;

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="lg:pl-64">
        <DashboardHeader user={user} />
        <main className="container py-6">{children}</main>
      </div>
    </div>
  );
}
