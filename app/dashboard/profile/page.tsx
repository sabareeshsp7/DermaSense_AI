"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { CalendarIcon, Loader2, User } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"

const profileFormSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters."),
  date_of_birth: z.date({
    required_error: "A date of birth is required.",
  }),
  gender: z.string({
    required_error: "Please select a gender.",
  }),
  contact_number: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().max(500, "Bio must not exceed 500 characters.").optional(),
})

const medicalHistorySchema = z.object({
  condition_name: z.string().min(2, "Condition name is required."),
  diagnosis_date: z.date({
    required_error: "Diagnosis date is required.",
  }),
  treatment: z.string().optional(),
  status: z.string(),
  notes: z.string().optional(),
})

interface UserType {
  id: string
  email?: string
}

// Sample user data for demo
const demoUser = {
  id: "demo-user-id",
  email: "demo@example.com",
  user_metadata: {
    full_name: "Demo User",
    avatar_url: null,
  },
}

// Sample profile data for demo
const demoProfile = {
  id: "demo-user-id",
  full_name: "Demo User",
  date_of_birth: "1990-01-01",
  gender: "prefer_not_to_say",
  contact_number: "+1 (555) 123-4567",
  address: "123 Demo Street, Demo City",
  bio: "This is a demo profile for testing purposes.",
  avatar_url: null,
}

// Sample medical history for demo
const demoMedicalHistory: Array<{
  id: string
  user_id: string
  condition_name: string
  diagnosis_date: string
  treatment: string | null
  status: string
  notes: string | null
  created_at: string
  updated_at: string
}> = [
  {
    id: "1",
    user_id: "demo-user-id",
    condition_name: "Eczema",
    diagnosis_date: "2022-05-15",
    treatment: "Topical corticosteroids and moisturizers",
    status: "active",
    notes: "Flares up during winter months",
    created_at: "2022-05-15T00:00:00Z",
    updated_at: "2022-05-15T00:00:00Z",
  },
  {
    id: "2",
    user_id: "demo-user-id",
    condition_name: "Allergic Rhinitis",
    diagnosis_date: "2021-03-10",
    treatment: "Antihistamines",
    status: "chronic",
    notes: "Seasonal, worse in spring",
    created_at: "2021-03-10T00:00:00Z",
    updated_at: "2021-03-10T00:00:00Z",
  },
]

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<UserType | null>(null)
  interface ProfileType {
    id: string
    full_name: string
    date_of_birth: string
    gender: string
    contact_number?: string
    address?: string
    bio?: string
    avatar_url?: string | null
  }

  const [profile, setProfile] = useState<ProfileType | null>(null)
  const [medicalHistory, setMedicalHistory] = useState<typeof demoMedicalHistory>([])
  const [uploading, setUploading] = useState(false)
  const [demoMode, setDemoMode] = useState(false)

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
  })

  const medicalForm = useForm<z.infer<typeof medicalHistorySchema>>({
    resolver: zodResolver(medicalHistorySchema),
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
        setUser(demoUser as UserType)
        setProfile(demoProfile)
        setMedicalHistory(demoMedicalHistory)

        form.reset({
          full_name: demoProfile.full_name || "",
          date_of_birth: demoProfile.date_of_birth ? new Date(demoProfile.date_of_birth) : undefined,
          gender: demoProfile.gender || "",
          contact_number: demoProfile.contact_number || "",
          address: demoProfile.address || "",
          bio: demoProfile.bio || "",
        })

        setLoading(false)
        return
      }

      setUser(user)
      await Promise.all([getProfile(user.id), getMedicalHistory(user.id)])
    } catch (error) {
      console.error("Error:", error)
      // Use demo mode instead of redirecting
      setDemoMode(true)
      setUser(demoUser as UserType)
      setProfile(demoProfile)
      setMedicalHistory(demoMedicalHistory)

      form.reset({
        full_name: demoProfile.full_name || "",
        date_of_birth: demoProfile.date_of_birth ? new Date(demoProfile.date_of_birth) : undefined,
        gender: demoProfile.gender || "",
        contact_number: demoProfile.contact_number || "",
        address: demoProfile.address || "",
        bio: demoProfile.bio || "",
      })

      setLoading(false)
    }
  }

  async function getProfile(userId: string) {
    try {
      const { data: profile, error } = await supabase.from("extended_profiles").select("*").eq("id", userId).single()

      if (error && error.code !== "PGRST116") throw error

      if (profile) {
        setProfile(profile)
        form.reset({
          full_name: profile.full_name || "",
          date_of_birth: profile.date_of_birth ? new Date(profile.date_of_birth) : undefined,
          gender: profile.gender || "",
          contact_number: profile.contact_number || "",
          address: profile.address || "",
          bio: profile.bio || "",
        })
      } else {
        // If no profile found, use demo profile
        setProfile(demoProfile)
        form.reset({
          full_name: demoProfile.full_name || "",
          date_of_birth: demoProfile.date_of_birth ? new Date(demoProfile.date_of_birth) : undefined,
          gender: demoProfile.gender || "",
          contact_number: demoProfile.contact_number || "",
          address: demoProfile.address || "",
          bio: demoProfile.bio || "",
        })
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        variant: "destructive",
        description: "Could not load profile data.",
      })

      // Use demo profile on error
      setProfile(demoProfile)
      form.reset({
        full_name: demoProfile.full_name || "",
        date_of_birth: demoProfile.date_of_birth ? new Date(demoProfile.date_of_birth) : undefined,
        gender: demoProfile.gender || "",
        contact_number: demoProfile.contact_number || "",
        address: demoProfile.address || "",
        bio: demoProfile.bio || "",
      })
    } finally {
      setLoading(false)
    }
  }

  async function getMedicalHistory(userId: string) {
    try {
      const { data, error } = await supabase
        .from("medical_histories")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) throw error
      setMedicalHistory(data && data.length > 0 ? data : demoMedicalHistory)
    } catch (error) {
      console.error("Error:", error)
      toast({
        variant: "destructive",
        description: "Could not load medical history.",
      })

      // Use demo medical history on error
      setMedicalHistory(demoMedicalHistory)
    }
  }

  async function onSubmit(values: z.infer<typeof profileFormSchema>) {
    try {
      if (demoMode) {
        toast({
          description: "Profile updated successfully (Demo Mode).",
        })
        return
      }

      if (!user?.id) throw new Error("Not authenticated")

      const { error } = await supabase.from("extended_profiles").upsert({
        id: user.id,
        ...values,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      toast({
        description: "Profile updated successfully.",
      })

      await getProfile(user.id)
    } catch (error) {
      console.error("Error:", error)
      toast({
        variant: "destructive",
        description: "Could not update profile.",
      })
    }
  }

  async function onMedicalHistorySubmit(values: z.infer<typeof medicalHistorySchema>) {
    try {
      if (demoMode) {
        const newHistory = {
          id: (medicalHistory.length + 1).toString(),
          user_id: "demo-user-id",
          condition_name: values.condition_name,
          diagnosis_date: values.diagnosis_date.toISOString().split("T")[0],
          treatment: values.treatment || null,
          status: values.status,
          notes: values.notes || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        setMedicalHistory([newHistory, ...medicalHistory])

        toast({
          description: "Medical history updated successfully (Demo Mode).",
        })

        medicalForm.reset()
        return
      }

      if (!user?.id) throw new Error("Not authenticated")

      const { error } = await supabase.from("medical_histories").insert({
        user_id: user.id,
        ...values,
      })

      if (error) throw error

      toast({
        description: "Medical history updated successfully.",
      })

      await getMedicalHistory(user.id)
      medicalForm.reset()
    } catch (error) {
      console.error("Error:", error)
      toast({
        variant: "destructive",
        description: "Could not update medical history.",
      })
    }
  }

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      if (demoMode) {
        toast({
          description: "Profile picture updated successfully (Demo Mode).",
        })
        return
      }

      if (!user?.id) throw new Error("Not authenticated")
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.")
      }

      const file = event.target.files[0]
      const fileExt = file.name.split(".").pop()
      const filePath = `${user.id}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath)

      const { error: updateError } = await supabase.from("extended_profiles").upsert({
        id: user.id,
        avatar_url: publicUrl,
        updated_at: new Date().toISOString(),
      })

      if (updateError) throw updateError

      toast({
        description: "Profile picture updated successfully.",
      })

      await getProfile(user.id)
    } catch (error) {
      console.error("Error:", error)
      toast({
        variant: "destructive",
        description: "Could not upload profile picture.",
      })
    } finally {
      setUploading(false)
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
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground">Manage your personal information and medical history</p>
        {/* {demoMode && (
          <div className="mt-2 rounded-md bg-yellow-100 p-2 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <p className="text-sm">Demo Mode: Changes will not be saved to a database.</p>
          </div>
        )} */}
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList>
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="medical">Medical History</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          {/* Avatar Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Upload a profile picture to personalize your account</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.avatar_url ?? undefined} />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <div>
                <Input type="file" accept="image/*" onChange={uploadAvatar} disabled={uploading} className="max-w-xs" />
                <p className="text-sm text-muted-foreground mt-2">Recommended size: 256x256px. Max file size: 5MB.</p>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information Form */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="date_of_birth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                              <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="contact_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 000-0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter your address" className="resize-none" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Tell us a little about yourself" className="resize-none" {...field} />
                        </FormControl>
                        <FormDescription>Brief description for your profile. Maximum 500 characters.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit">Update Profile</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medical" className="space-y-6">
          {/* Add Medical History */}
          <Card>
            <CardHeader>
              <CardTitle>Add Medical History</CardTitle>
              <CardDescription>Record new medical conditions or treatments</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...medicalForm}>
                <form onSubmit={medicalForm.handleSubmit(onMedicalHistorySubmit)} className="space-y-4">
                  <FormField
                    control={medicalForm.control}
                    name="condition_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Condition Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter condition name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={medicalForm.control}
                      name="diagnosis_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Diagnosis Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date > new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={medicalForm.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                              <SelectItem value="chronic">Chronic</SelectItem>
                              <SelectItem value="in_treatment">In Treatment</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={medicalForm.control}
                    name="treatment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Treatment</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter treatment details" className="resize-none" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={medicalForm.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Additional notes" className="resize-none" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit">Add Medical History</Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Medical History List */}
          <Card>
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
              <CardDescription>Your recorded medical conditions and treatments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medicalHistory.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No medical history recorded yet.</p>
                ) : (
                  medicalHistory.map((record, index) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{record.condition_name}</h3>
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                              record.status === "active" && "bg-yellow-100 text-yellow-800",
                              record.status === "resolved" && "bg-green-100 text-green-800",
                              record.status === "chronic" && "bg-purple-100 text-purple-800",
                              record.status === "in_treatment" && "bg-blue-100 text-blue-800",
                            )}
                          >
                            {record.status}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          <p>Diagnosed: {format(new Date(record.diagnosis_date), "PPP")}</p>
                          {record.treatment && (
                            <>
                              <Separator className="my-2" />
                              <p>Treatment: {record.treatment}</p>
                            </>
                          )}
                          {record.notes && (
                            <>
                              <Separator className="my-2" />
                              <p>Notes: {record.notes}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

