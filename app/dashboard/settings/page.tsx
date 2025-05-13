"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"

const settingsFormSchema = z.object({
  theme: z.string(),
  language: z.string(),
  notifications_enabled: z.boolean(),
  email_notifications: z.boolean(),
  measurement_unit: z.string(),
})

interface User {
  id: string
  email?: string
}

// Sample user data for demo
const demoUser = {
  id: "demo-user-id",
  email: "demo@example.com",
}

// Sample settings data for demo
const demoSettings = {
  id: "demo-user-id",
  theme: "system",
  language: "en",
  notifications_enabled: true,
  email_notifications: true,
  measurement_unit: "metric",
}

export default function SettingsPage() {
  // const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [demoMode, setDemoMode] = useState(false)

  const form = useForm<z.infer<typeof settingsFormSchema>>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      theme: "system",
      language: "en",
      notifications_enabled: true,
      email_notifications: true,
      measurement_unit: "metric",
    },
  })

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        // Use demo mode instead of redirecting
        setDemoMode(true)
        setUser(demoUser as User)

        form.reset({
          theme: demoSettings.theme,
          language: demoSettings.language,
          notifications_enabled: demoSettings.notifications_enabled,
          email_notifications: demoSettings.email_notifications,
          measurement_unit: demoSettings.measurement_unit,
        })

        setLoading(false)
        return
      }

      setUser(user)
      await getSettings(user.id)
    } catch (error) {
      console.error("Error:", error)
      // Use demo mode instead of redirecting
      setDemoMode(true)
      setUser(demoUser as User)

      form.reset({
        theme: demoSettings.theme,
        language: demoSettings.language,
        notifications_enabled: demoSettings.notifications_enabled,
        email_notifications: demoSettings.email_notifications,
        measurement_unit: demoSettings.measurement_unit,
      })

      setLoading(false)
    }
  }

  async function getSettings(userId: string) {
    try {
      const { data: settings, error } = await supabase.from("user_settings").select("*").eq("user_id", userId).single()

      if (error && error.code !== "PGRST116") {
        // PGRST116 is "no rows returned" error
        throw error
      }

      if (settings) {
        form.reset({
          theme: settings.theme || "system",
          language: settings.language || "en",
          notifications_enabled: settings.notifications_enabled ?? true,
          email_notifications: settings.email_notifications ?? true,
          measurement_unit: settings.measurement_unit || "metric",
        })
      } else {
        // If no settings found, use demo settings
        form.reset({
          theme: demoSettings.theme,
          language: demoSettings.language,
          notifications_enabled: demoSettings.notifications_enabled,
          email_notifications: demoSettings.email_notifications,
          measurement_unit: demoSettings.measurement_unit,
        })
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        variant: "destructive",
        description: "Could not load settings.",
      })

      // Use demo settings on error
      form.reset({
        theme: demoSettings.theme,
        language: demoSettings.language,
        notifications_enabled: demoSettings.notifications_enabled,
        email_notifications: demoSettings.email_notifications,
        measurement_unit: demoSettings.measurement_unit,
      })
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(values: z.infer<typeof settingsFormSchema>) {
    try {
      if (demoMode) {
        toast({
          description: "Settings updated successfully (Demo Mode).",
        })
        return
      }

      if (!user?.id) {
        throw new Error("Not authenticated")
      }

      const { error } = await supabase.from("user_settings").upsert({
        user_id: user.id,
        ...values,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      toast({
        description: "Settings updated successfully.",
      })
    } catch (error) {
      console.error("Error:", error)
      toast({
        variant: "destructive",
        description: "Could not update settings.",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account preferences and application settings</p>
        {/* {demoMode && (
          <div className="mt-2 rounded-md bg-yellow-100 p-2 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <p className="text-sm">Demo Mode: Changes will not be saved to a database.</p>
          </div>
        )} */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how Carcino AI looks and feels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Theme</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Select your preferred theme for the application</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Choose your preferred language</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="measurement_unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Measurement Unit</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="metric">Metric</SelectItem>
                        <SelectItem value="imperial">Imperial</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Choose your preferred measurement system</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notifications_enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Push Notifications</FormLabel>
                      <FormDescription>Receive push notifications for important updates</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email_notifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Email Notifications</FormLabel>
                      <FormDescription>Receive email notifications for important updates</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit">Save Settings</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Management</CardTitle>
          <CardDescription>Manage your account settings and data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <h3 className="font-medium">Delete Account</h3>
            <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data</p>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

