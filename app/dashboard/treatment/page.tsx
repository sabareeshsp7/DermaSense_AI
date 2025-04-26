"use client"

import { useState } from "react"
import {
  Activity,
  Calendar,
  Clock,
  Download,
  FileText,
  Pill,
  Share2,
  Bell,
  CheckCircle,
  Printer,
  RefreshCw,
  ShoppingBag,
  MessageSquare,
} from "lucide-react"
import { format } from "date-fns"
import { jsPDF } from "jspdf"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { TreatmentPlanChart } from "@/components/treatment/treatment-plan-chart"
import { SideEffectsTracker } from "@/components/treatment/side-effects-tracker"
import { cn } from "@/lib/utils"

// Sample treatment plan data
const treatmentPlan = {
  id: "TP-12345",
  patientName: "John Doe",
  patientId: "P-7890",
  diagnosis: "Basal Cell Carcinoma (Stage I)",
  oncologist: "Dr. Priya Sharma",
  startDate: new Date(2023, 2, 15), // March 15, 2023
  endDate: new Date(2023, 8, 15), // September 15, 2023
  lastUpdated: new Date(2023, 5, 10), // June 10, 2023
  status: "active", // active, completed, modified
  adherenceRate: 92,
  progressRate: 65,
  nextAppointment: new Date(2023, 6, 5), // July 5, 2023
  notes:
    "Patient responding well to treatment. Continue with current medication regimen and monitor for any skin reactions.",
  medications: [
    {
      id: 1,
      name: "Fluorouracil 5% Cream",
      dosage: "Apply thin layer to affected area",
      frequency: "Twice daily",
      duration: "6 weeks",
      startDate: new Date(2023, 2, 15),
      endDate: new Date(2023, 3, 30),
      status: "completed",
      instructions: "Apply to affected areas only. Avoid contact with eyes and mucous membranes.",
      sideEffects: ["Skin irritation", "Redness", "Peeling", "Burning sensation"],
      adherence: 95,
    },
    {
      id: 2,
      name: "Imiquimod 5% Cream",
      dosage: "Apply thin layer to affected area",
      frequency: "5 times per week",
      duration: "12 weeks",
      startDate: new Date(2023, 4, 1),
      endDate: new Date(2023, 6, 31),
      status: "active",
      instructions:
        "Apply before bedtime and leave on skin for 8 hours. Wash area with mild soap and water after treatment.",
      sideEffects: ["Redness", "Swelling", "Scabbing", "Flaking", "Itching"],
      adherence: 88,
    },
    {
      id: 3,
      name: "Vitamin D3 Supplement",
      dosage: "1000 IU",
      frequency: "Once daily",
      duration: "Ongoing",
      startDate: new Date(2023, 2, 15),
      endDate: null,
      status: "active",
      instructions: "Take with food for better absorption.",
      sideEffects: ["Rarely causes side effects at this dosage"],
      adherence: 97,
    },
  ],
  treatments: [
    {
      id: 1,
      type: "Cryotherapy",
      description: "Freezing of abnormal tissue with liquid nitrogen",
      frequency: "Once every 3 weeks",
      sessions: [
        { date: new Date(2023, 2, 20), completed: true, notes: "Patient tolerated procedure well." },
        { date: new Date(2023, 3, 10), completed: true, notes: "Reduced lesion size observed." },
        { date: new Date(2023, 4, 1), completed: true, notes: "Significant improvement in treated areas." },
        { date: new Date(2023, 4, 22), completed: true, notes: "Minor inflammation post-procedure." },
        { date: new Date(2023, 5, 12), completed: false, notes: "" },
      ],
      sideEffects: ["Temporary pain", "Redness", "Swelling", "Blistering"],
      instructions: "Avoid sun exposure for 48 hours after treatment. Keep the area clean and dry.",
    },
  ],
  followUps: [
    { date: new Date(2023, 3, 15), type: "Oncologist Consultation", completed: true },
    { date: new Date(2023, 4, 15), type: "Dermatology Check-up", completed: true },
    { date: new Date(2023, 5, 15), type: "Oncologist Consultation", completed: true },
    { date: new Date(2023, 6, 15), type: "Dermatology Check-up", completed: false },
    { date: new Date(2023, 7, 15), type: "Oncologist Consultation", completed: false },
  ],
  progressData: [
    { month: "Mar", progress: 10 },
    { month: "Apr", progress: 25 },
    { month: "May", progress: 45 },
    { month: "Jun", progress: 65 },
    { month: "Jul", progress: 0 },
    { month: "Aug", progress: 0 },
    { month: "Sep", progress: 0 },
  ],
  sideEffectsData: [
    { date: "Week 1", severity: 2 },
    { date: "Week 2", severity: 3 },
    { date: "Week 3", severity: 4 },
    { date: "Week 4", severity: 3 },
    { date: "Week 5", severity: 2 },
    { date: "Week 6", severity: 2 },
    { date: "Week 7", severity: 1 },
    { date: "Week 8", severity: 1 },
    { date: "Week 9", severity: 0 },
    { date: "Week 10", severity: 0 },
    { date: "Week 11", severity: 0 },
    { date: "Week 12", severity: 0 },
  ],
  dailyLogs: [
    {
      date: new Date(2023, 5, 9),
      painLevel: 2,
      sideEffects: ["Mild redness", "Slight itching"],
      notes: "Feeling better today, less irritation than yesterday.",
      medicationsTaken: [2, 3],
    },
    {
      date: new Date(2023, 5, 10),
      painLevel: 1,
      sideEffects: ["Mild redness"],
      notes: "Almost no discomfort today.",
      medicationsTaken: [2, 3],
    },
  ],
}

export default function TreatmentPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [showReminderDialog, setShowReminderDialog] = useState(false)
  const [showLogDialog, setShowLogDialog] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [painLevel, setPainLevel] = useState(0)
  const [sideEffectsInput, setSideEffectsInput] = useState("")
  const [notesInput, setNotesInput] = useState("")
  const [selectedMedications, setSelectedMedications] = useState<number[]>([])
  const [emailInput, setEmailInput] = useState("")
  const [reminderSettings, setReminderSettings] = useState({
    medicationReminders: true,
    treatmentReminders: true,
    followUpReminders: true,
    reminderTime: "08:00",
    advanceNotice: 30, // minutes
  })

  // Function to handle downloading the treatment plan as PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF()

    // Add header
    doc.setFontSize(20)
    doc.setTextColor(0, 102, 204)
    doc.text("DermaSense AI", 105, 20, { align: "center" })

    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text("Treatment Plan", 105, 30, { align: "center" })

    // Add patient and plan details
    doc.setFontSize(12)
    doc.text(`Patient: ${treatmentPlan.patientName}`, 20, 45)
    doc.text(`Patient ID: ${treatmentPlan.patientId}`, 20, 55)
    doc.text(`Diagnosis: ${treatmentPlan.diagnosis}`, 20, 65)
    doc.text(`Oncologist: ${treatmentPlan.oncologist}`, 20, 75)
    doc.text(`Start Date: ${format(treatmentPlan.startDate, "MMMM d, yyyy")}`, 20, 85)
    doc.text(`Plan ID: ${treatmentPlan.id}`, 150, 45)
    doc.text(`Status: ${treatmentPlan.status.toUpperCase()}`, 150, 55)
    doc.text(`Progress: ${treatmentPlan.progressRate}%`, 150, 65)
    doc.text(`Last Updated: ${format(treatmentPlan.lastUpdated, "MMMM d, yyyy")}`, 150, 75)

    // Add medications section
    doc.setFontSize(14)
    doc.text("Prescribed Medications", 20, 105)
    doc.setFontSize(10)

    let yPos = 115
    treatmentPlan.medications.forEach((med, index) => {
      doc.setFontSize(12)
      doc.text(`${index + 1}. ${med.name}`, 20, yPos)
      doc.setFontSize(10)
      doc.text(`Dosage: ${med.dosage}`, 25, yPos + 7)
      doc.text(`Frequency: ${med.frequency}`, 25, yPos + 14)
      doc.text(`Duration: ${med.duration}`, 25, yPos + 21)
      doc.text(`Status: ${med.status.toUpperCase()}`, 25, yPos + 28)
      doc.text(`Instructions: ${med.instructions}`, 25, yPos + 35)
      yPos += 45
    })

    // Add treatments section
    doc.setFontSize(14)
    doc.text("Treatments", 20, yPos)
    doc.setFontSize(10)

    yPos += 10
    treatmentPlan.treatments.forEach((treatment, index) => {
      doc.setFontSize(12)
      doc.text(`${index + 1}. ${treatment.type}`, 20, yPos)
      doc.setFontSize(10)
      doc.text(`Description: ${treatment.description}`, 25, yPos + 7)
      doc.text(`Frequency: ${treatment.frequency}`, 25, yPos + 14)
      doc.text(`Instructions: ${treatment.instructions}`, 25, yPos + 21)
      yPos += 30
    })

    // Add follow-ups section
    doc.setFontSize(14)
    doc.text("Follow-up Appointments", 20, yPos)
    doc.setFontSize(10)

    yPos += 10
    treatmentPlan.followUps.forEach((followUp, index) => {
      const status = followUp.completed ? "Completed" : "Scheduled"
      doc.text(`${format(followUp.date, "MMMM d, yyyy")} - ${followUp.type} (${status})`, 25, yPos + index * 7)
    })

    // Add notes section
    yPos += 10 + treatmentPlan.followUps.length * 7
    doc.setFontSize(14)
    doc.text("Oncologist Notes", 20, yPos)
    doc.setFontSize(10)
    doc.text(treatmentPlan.notes, 20, yPos + 10)

    // Add footer
    doc.setFontSize(8)
    doc.text("This treatment plan was generated by DermaSense AI under the supervision of your oncologist.", 105, 280, {
      align: "center",
    })
    doc.text("Please consult your healthcare provider before making any changes to your treatment regimen.", 105, 285, {
      align: "center",
    })

    // Save the PDF
    doc.save(`Treatment_Plan_${treatmentPlan.id}.pdf`)

    toast({
      title: "Treatment plan downloaded",
      description: "Your treatment plan has been downloaded as a PDF.",
    })
  }

  // Function to handle printing the treatment plan
  const handlePrint = () => {
    window.print()

    toast({
      title: "Print dialog opened",
      description: "Your treatment plan is ready to print.",
    })
  }

  // Function to handle sharing the treatment plan
  const handleShare = () => {
    if (!emailInput) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter an email address.",
      })
      return
    }

    // In a real app, this would send the treatment plan to the specified email
    // For this demo, we'll just show a success message
    toast({
      title: "Treatment plan shared",
      description: `Your treatment plan has been shared with ${emailInput}.`,
    })

    setEmailInput("")
    setShowShareDialog(false)
  }

  // Function to handle saving daily log
  const handleSaveLog = () => {
    if (painLevel === 0 && !sideEffectsInput && !notesInput && selectedMedications.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter at least one detail for your daily log.",
      })
      return
    }

    // In a real app, this would save the log to the database
    // For this demo, we'll just show a success message
    toast({
      title: "Daily log saved",
      description: "Your health update has been recorded successfully.",
    })

    // Reset form
    setPainLevel(0)
    setSideEffectsInput("")
    setNotesInput("")
    setSelectedMedications([])
    setShowLogDialog(false)
  }

  // Function to handle saving reminder settings
  const handleSaveReminders = () => {
    // In a real app, this would save the reminder settings to the database
    // For this demo, we'll just show a success message
    toast({
      title: "Reminder settings saved",
      description: "Your notification preferences have been updated.",
    })

    setShowReminderDialog(false)
  }

  // Function to toggle medication selection for daily log
  const toggleMedicationSelection = (id: number) => {
    if (selectedMedications.includes(id)) {
      setSelectedMedications(selectedMedications.filter((medId) => medId !== id))
    } else {
      setSelectedMedications([...selectedMedications, id])
    }
  }

  // Calculate days remaining in treatment
  const calculateDaysRemaining = () => {
    const today = new Date()
    const endDate = treatmentPlan.endDate
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  // Get active medications
  const getActiveMedications = () => {
    return treatmentPlan.medications.filter((med) => med.status === "active")
  }

  // Get upcoming appointments
  const getUpcomingAppointments = () => {
    const today = new Date()
    return treatmentPlan.followUps
      .filter((followUp) => !followUp.completed && followUp.date > today)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
  }

  // Check if a medication is due today
  const isMedicationDueToday = (medication: { id: number; name: string; dosage: string; frequency: string; duration: string; startDate: Date; endDate: Date | null; status: string; instructions: string; sideEffects: string[]; adherence: number }) => {
    // This is a simplified check. In a real app, you would check the frequency and last taken date
    return medication.status === "active"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Treatment Plans</h2>
          <p className="text-muted-foreground">Manage your personalized treatment plan and track your progress</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowReminderDialog(true)}>
            <Bell className="h-4 w-4" />
            Set Reminders
          </Button>
          <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowLogDialog(true)}>
            <FileText className="h-4 w-4" />
            Log Health Update
          </Button>
        </div>
      </div>

      {/* Treatment Plan Overview Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-2xl">
                {treatmentPlan.diagnosis}
                <Badge className="ml-2" variant={treatmentPlan.status === "active" ? "default" : "outline"}>
                  {treatmentPlan.status === "active" ? "Active" : "Completed"}
                </Badge>
              </CardTitle>
              <CardDescription>
                Treatment Plan ID: {treatmentPlan.id} • Started on {format(treatmentPlan.startDate, "MMMM d, yyyy")}
              </CardDescription>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={handlePrint}>
                <Printer className="h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={handleDownloadPDF}>
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setShowShareDialog(true)}
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm font-medium">{treatmentPlan.progressRate}%</span>
              </div>
              <Progress value={treatmentPlan.progressRate} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Treatment period: {format(treatmentPlan.startDate, "MMM d, yyyy")} -{" "}
                {format(treatmentPlan.endDate, "MMM d, yyyy")}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Medication Adherence</span>
                <span className="text-sm font-medium">{treatmentPlan.adherenceRate}%</span>
              </div>
              <Progress value={treatmentPlan.adherenceRate} className="h-2" />
              <p className="text-xs text-muted-foreground">Based on your reported medication intake</p>
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <span className="text-sm font-medium">Next Appointment</span>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{format(treatmentPlan.nextAppointment, "MMMM d, yyyy")}</span>
                </div>
              </div>
              <div>
                <span className="text-sm font-medium">Oncologist</span>
                <div className="flex items-center gap-2 mt-1">
                  <Activity className="h-4 w-4 text-primary" />
                  <span>{treatmentPlan.oncologist}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="treatments">Treatments</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Today's Medications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-primary" />
                  Today&apos;s Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {getActiveMedications().length === 0 ? (
                  <p className="text-center text-muted-foreground py-6">No active medications</p>
                ) : (
                  <div className="space-y-4">
                    {getActiveMedications().map((medication) => (
                      <div key={medication.id} className="flex items-start gap-4">
                        <div
                          className={cn(
                            "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full",
                            isMedicationDueToday(medication) ? "bg-primary/10" : "bg-muted",
                          )}
                        >
                          <Pill
                            className={cn(
                              "h-5 w-5",
                              isMedicationDueToday(medication) ? "text-primary" : "text-muted-foreground",
                            )}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{medication.name}</h4>
                            {isMedicationDueToday(medication) && (
                              <Badge variant="outline" className="text-xs">
                                Due Today
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {medication.dosage} • {medication.frequency}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">{medication.instructions}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => setActiveTab("medications")}>
                  View All Medications
                </Button>
              </CardFooter>
            </Card>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {getUpcomingAppointments().length === 0 ? (
                  <p className="text-center text-muted-foreground py-6">No upcoming appointments</p>
                ) : (
                  <div className="space-y-4">
                    {getUpcomingAppointments()
                      .slice(0, 3)
                      .map((appointment, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{appointment.type}</h4>
                            <p className="text-sm text-muted-foreground">
                              {format(appointment.date, "EEEE, MMMM d, yyyy")}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Reschedule
                          </Button>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Appointments
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Treatment Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Treatment Summary</CardTitle>
              <CardDescription>Overview of your current treatment plan and progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center rounded-lg border p-4 text-center">
                    <h3 className="text-2xl font-bold text-primary">{calculateDaysRemaining()}</h3>
                    <p className="text-sm text-muted-foreground">Days Remaining</p>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-lg border p-4 text-center">
                    <h3 className="text-2xl font-bold text-primary">{getActiveMedications().length}</h3>
                    <p className="text-sm text-muted-foreground">Active Medications</p>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-lg border p-4 text-center">
                    <h3 className="text-2xl font-bold text-primary">{getUpcomingAppointments().length}</h3>
                    <p className="text-sm text-muted-foreground">Upcoming Appointments</p>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-2">Oncologist Notes</h3>
                    <p className="text-sm text-muted-foreground">{treatmentPlan.notes}</p>
                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Last updated: {format(treatmentPlan.lastUpdated, "MMMM d, yyyy")}</span>
                      <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                        <MessageSquare className="mr-1 h-3 w-3" />
                        Contact Oncologist
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg border p-4">
                    <h3 className="font-medium mb-2">Treatment Timeline</h3>
                    <div className="relative mt-6 pl-6">
                      <div className="absolute left-0 top-0 bottom-0 w-px bg-border"></div>

                      <div className="mb-4 relative">
                        <div className="absolute left-[-24px] top-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <h4 className="font-medium">Treatment Started</h4>
                        <p className="text-sm text-muted-foreground">
                          {format(treatmentPlan.startDate, "MMMM d, yyyy")}
                        </p>
                      </div>

                      <div className="mb-4 relative">
                        <div className="absolute left-[-24px] top-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                          <Activity className="h-4 w-4 text-primary" />
                        </div>
                        <h4 className="font-medium">Current Progress</h4>
                        <p className="text-sm text-muted-foreground">{treatmentPlan.progressRate}% complete</p>
                      </div>

                      <div className="relative">
                        <div className="absolute left-[-24px] top-0 h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <h4 className="font-medium">Expected Completion</h4>
                        <p className="text-sm text-muted-foreground">{format(treatmentPlan.endDate, "MMMM d, yyyy")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medications Tab */}
        <TabsContent value="medications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Prescribed Medications</CardTitle>
              <CardDescription>Complete list of medications in your treatment plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {treatmentPlan.medications.map((medication) => (
                  <div key={medication.id} className="rounded-lg border p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div
                          className={cn(
                            "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full",
                            medication.status === "active" ? "bg-primary/10" : "bg-muted",
                          )}
                        >
                          <Pill
                            className={cn(
                              "h-6 w-6",
                              medication.status === "active" ? "text-primary" : "text-muted-foreground",
                            )}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{medication.name}</h3>
                            <Badge variant={medication.status === "active" ? "default" : "outline"}>
                              {medication.status === "active" ? "Active" : "Completed"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {medication.dosage} • {medication.frequency} • {medication.duration}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          Order Refill
                        </Button>
                        <Button variant="outline" size="sm">
                          <Bell className="mr-2 h-4 w-4" />
                          Set Reminder
                        </Button>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Instructions</h4>
                        <p className="text-sm text-muted-foreground">{medication.instructions}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Possible Side Effects</h4>
                        <ul className="text-sm text-muted-foreground list-disc pl-4">
                          {medication.sideEffects.map((effect, index) => (
                            <li key={index}>{effect}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Adherence Rate</h4>
                      <div className="flex items-center gap-4">
                        <Progress value={medication.adherence} className="h-2 flex-1" />
                        <span className="text-sm font-medium">{medication.adherence}%</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Ask About This Medication
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Treatments Tab */}
        <TabsContent value="treatments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Treatment Procedures</CardTitle>
              <CardDescription>Scheduled treatments and procedures as part of your care plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {treatmentPlan.treatments.map((treatment) => (
                  <div key={treatment.id} className="rounded-lg border p-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <h3 className="font-medium">{treatment.type}</h3>
                        <p className="text-sm text-muted-foreground">{treatment.description}</p>
                        <p className="text-sm text-muted-foreground mt-1">Frequency: {treatment.frequency}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        View Schedule
                      </Button>
                    </div>

                    <Separator className="my-4" />

                    <div>
                      <h4 className="text-sm font-medium mb-2">Sessions</h4>
                      <div className="space-y-2">
                        {treatment.sessions.map((session, index) => (
                          <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                            <div className="flex items-center gap-3">
                              {session.completed ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <Clock className="h-5 w-5 text-muted-foreground" />
                              )}
                              <div>
                                <p className="font-medium">{format(session.date, "MMMM d, yyyy")}</p>
                                {session.notes && <p className="text-xs text-muted-foreground">{session.notes}</p>}
                              </div>
                            </div>
                            <Badge variant={session.completed ? "outline" : "default"}>
                              {session.completed ? "Completed" : "Scheduled"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Instructions</h4>
                        <p className="text-sm text-muted-foreground">{treatment.instructions}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Possible Side Effects</h4>
                        <ul className="text-sm text-muted-foreground list-disc pl-4">
                          {treatment.sideEffects.map((effect, index) => (
                            <li key={index}>{effect}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Follow-up Appointments</CardTitle>
              <CardDescription>Scheduled check-ups with your healthcare providers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {treatmentPlan.followUps.map((followUp, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full",
                          followUp.completed ? "bg-muted" : "bg-primary/10",
                        )}
                      >
                        <Calendar
                          className={cn("h-5 w-5", followUp.completed ? "text-muted-foreground" : "text-primary")}
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">{followUp.type}</h4>
                        <p className="text-sm text-muted-foreground">{format(followUp.date, "EEEE, MMMM d, yyyy")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!followUp.completed && (
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                      )}
                      <Badge variant={followUp.completed ? "outline" : "default"}>
                        {followUp.completed ? "Completed" : "Scheduled"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Treatment Progress</CardTitle>
                <CardDescription>Tracking your recovery journey over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <TreatmentPlanChart data={treatmentPlan.progressData} />
                </div>
              </CardContent>
            </Card>

            {/* Side Effects Tracker */}
            <Card>
              <CardHeader>
                <CardTitle>Side Effects Severity</CardTitle>
                <CardDescription>Monitoring treatment side effects over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <SideEffectsTracker data={treatmentPlan.sideEffectsData} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Health Logs */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Health Logs</CardTitle>
              <CardDescription>Your recorded health updates and symptoms</CardDescription>
            </CardHeader>
            <CardContent>
              {treatmentPlan.dailyLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No health logs yet</h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-md">
                    Start tracking your daily symptoms and medication adherence to help your healthcare team monitor
                    your progress.
                  </p>
                  <Button className="mt-4" onClick={() => setShowLogDialog(true)}>
                    Log Health Update
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {treatmentPlan.dailyLogs.map((log, index) => (
                    <div key={index} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{format(log.date, "MMMM d, yyyy")}</h3>
                        <Badge variant="outline">Pain Level: {log.painLevel}/10</Badge>
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Side Effects</h4>
                          <ul className="text-sm text-muted-foreground list-disc pl-4">
                            {log.sideEffects.map((effect, i) => (
                              <li key={i}>{effect}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Medications Taken</h4>
                          <ul className="text-sm text-muted-foreground list-disc pl-4">
                            {log.medicationsTaken.map((medId) => {
                              const medication = treatmentPlan.medications.find((m) => m.id === medId)
                              return medication ? <li key={medId}>{medication.name}</li> : null
                            })}
                          </ul>
                        </div>
                      </div>

                      {log.notes && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Notes</h4>
                          <p className="text-sm text-muted-foreground">{log.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => setShowLogDialog(true)}>
                Add New Health Log
              </Button>
            </CardFooter>
          </Card>

          {/* Treatment Modifications */}
          <Card>
            <CardHeader>
              <CardTitle>Treatment Plan Modifications</CardTitle>
              <CardDescription>Changes made to your treatment plan by your healthcare team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <RefreshCw className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No modifications yet</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-md">
                  Your treatment plan has not been modified since it was created. If you experience severe side effects
                  or concerns, please contact your oncologist.
                </p>
                <Button variant="outline" className="mt-4">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact Oncologist
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Log Health Update Dialog */}
      <Dialog open={showLogDialog} onOpenChange={setShowLogDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Log Daily Health Update</DialogTitle>
            <DialogDescription>Record your symptoms, side effects, and medication adherence</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Pain Level (0-10)</Label>
              <Slider value={[painLevel]} min={0} max={10} step={1} onValueChange={(value) => setPainLevel(value[0])} />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>No Pain</span>
                <span>Severe Pain</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Side Effects Experienced</Label>
              <Textarea
                placeholder="Describe any side effects you experienced today..."
                value={sideEffectsInput}
                onChange={(e) => setSideEffectsInput(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Medications Taken Today</Label>
              <div className="space-y-2">
                {treatmentPlan.medications
                  .filter((med) => med.status === "active")
                  .map((medication) => (
                    <div key={medication.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`med-${medication.id}`}
                        title={`Select ${medication.name}`}
                        checked={selectedMedications.includes(medication.id)}
                        onChange={() => toggleMedicationSelection(medication.id)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor={`med-${medication.id}`} className="text-sm font-normal">
                        {medication.name} ({medication.dosage})
                      </Label>
                    </div>
                  ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Additional Notes</Label>
              <Textarea
                placeholder="Any other observations or notes..."
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveLog}>Save Health Log</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Set Reminders Dialog */}
      <Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reminder Settings</DialogTitle>
            <DialogDescription>Customize your treatment and medication reminders</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="medication-reminders" className="flex flex-col space-y-1">
                <span>Medication Reminders</span>
                <span className="font-normal text-xs text-muted-foreground">
                  Receive reminders for your prescribed medications
                </span>
              </Label>
              <Switch
                id="medication-reminders"
                checked={reminderSettings.medicationReminders}
                onCheckedChange={(checked) =>
                  setReminderSettings({ ...reminderSettings, medicationReminders: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="treatment-reminders" className="flex flex-col space-y-1">
                <span>Treatment Reminders</span>
                <span className="font-normal text-xs text-muted-foreground">
                  Receive reminders for upcoming treatment sessions
                </span>
              </Label>
              <Switch
                id="treatment-reminders"
                checked={reminderSettings.treatmentReminders}
                onCheckedChange={(checked) => setReminderSettings({ ...reminderSettings, treatmentReminders: checked })}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="followup-reminders" className="flex flex-col space-y-1">
                <span>Follow-up Appointment Reminders</span>
                <span className="font-normal text-xs text-muted-foreground">
                  Receive reminders for scheduled appointments
                </span>
              </Label>
              <Switch
                id="followup-reminders"
                checked={reminderSettings.followUpReminders}
                onCheckedChange={(checked) => setReminderSettings({ ...reminderSettings, followUpReminders: checked })}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="reminder-time">Default Reminder Time</Label>
              <Input
                id="reminder-time"
                type="time"
                value={reminderSettings.reminderTime}
                onChange={(e) => setReminderSettings({ ...reminderSettings, reminderTime: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Set the default time to receive daily medication reminders
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="advance-notice">Advance Notice (minutes)</Label>
              <Input
                id="advance-notice"
                type="number"
                min="0"
                max="120"
                value={reminderSettings.advanceNotice}
                onChange={(e) =>
                  setReminderSettings({ ...reminderSettings, advanceNotice: Number.parseInt(e.target.value) })
                }
              />
              <p className="text-xs text-muted-foreground">
                How many minutes before an appointment you want to be reminded
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReminderDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveReminders}>Save Reminder Settings</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Treatment Plan Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Treatment Plan</DialogTitle>
            <DialogDescription>
              Share your treatment plan with caregivers or other healthcare providers
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter recipient's email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
            </div>

            <div className="rounded-lg border p-4">
              <h4 className="font-medium mb-2">What will be shared:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Treatment plan details and schedule
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Medication information
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Upcoming appointments
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Oncologist notes and instructions
                </li>
              </ul>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowShareDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share Treatment Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

