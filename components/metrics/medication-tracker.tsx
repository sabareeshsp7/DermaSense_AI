"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar, Check, Clock, Pill, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface MedicationTrackerProps {
  medication: {
    id: number
    name: string
    dosage: string
    frequency: string
    timeOfDay: string[]
    startDate: Date
    endDate: Date | null
    status: string
    adherence: number
    remainingDoses: number | null
    lastTaken: Date | null
    nextDose: Date | null
  }
}

export function MedicationTracker({ medication }: MedicationTrackerProps) {
  const [taken, setTaken] = useState(false)

  const handleMarkAsTaken = () => {
    setTaken(true)

    toast({
      title: "Medication marked as taken",
      description: `You've recorded taking ${medication.name}`,
    })
  }

  const handleSkip = () => {
    toast({
      variant: "destructive",
      title: "Medication skipped",
      description: "Remember to take your medication as prescribed for best results.",
    })
  }

  const handleRefill = () => {
    toast({
      title: "Refill requested",
      description: "Your medication refill request has been sent.",
    })
  }

  // Calculate days remaining if there's an end date
  const calculateDaysRemaining = () => {
    if (!medication.endDate) return "Ongoing"

    const today = new Date()
    const endDate = medication.endDate
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays > 0 ? `${diffDays} days` : "Completed"
  }

  return (
    <Card className={medication.status !== "active" ? "bg-muted/50" : ""}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {medication.name}
              <Badge variant={medication.status === "active" ? "default" : "outline"}>
                {medication.status === "active" ? "Active" : "Completed"}
              </Badge>
            </CardTitle>
            <CardDescription>
              {medication.dosage} • {medication.frequency}
            </CardDescription>
          </div>
          {medication.status === "active" && medication.remainingDoses !== null && (
            <Badge variant="outline" className="text-sm">
              {medication.remainingDoses} doses remaining
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {format(medication.startDate, "MMM d, yyyy")} -{" "}
              {medication.endDate ? format(medication.endDate, "MMM d, yyyy") : "Ongoing"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{medication.timeOfDay.join(" & ")}</span>
          </div>
        </div>

        {medication.status === "active" && (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Adherence</span>
                <span className="text-sm font-medium">{medication.adherence}%</span>
              </div>
              <Progress
                value={medication.adherence}
                className={cn(
                  "h-2",
                  medication.adherence >= 90
                    ? "bg-green-500"
                    : medication.adherence >= 70
                    ? "bg-yellow-500"
                    : "bg-red-500"
                )}
              />
            </div>

            <div className="rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full",
                      taken ? "bg-green-100 dark:bg-green-900" : "bg-primary/10",
                    )}
                  >
                    <Pill className={cn("h-4 w-4", taken ? "text-green-500" : "text-primary")} />
                  </div>
                  <div>
                    <p className="font-medium">Next Dose</p>
                    <p className="text-xs text-muted-foreground">
                      {medication.nextDose ? format(medication.nextDose, "EEEE, MMMM d, h:mm a") : "No upcoming doses"}
                    </p>
                  </div>
                </div>

                {!taken && medication.nextDose && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleSkip}>
                      Skip
                    </Button>
                    <Button size="sm" onClick={handleMarkAsTaken}>
                      <Check className="mr-2 h-4 w-4" />
                      Mark as Taken
                    </Button>
                  </div>
                )}

                {taken && (
                  <Badge variant="outline" className="text-green-500">
                    <Check className="mr-1 h-3 w-3" />
                    Taken
                  </Badge>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
      {medication.status === "active" && (
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            {medication.endDate ? `${calculateDaysRemaining()} remaining` : "Ongoing medication"}
          </div>
          {medication.remainingDoses !== null && medication.remainingDoses <= 5 && (
            <Button variant="outline" size="sm" onClick={handleRefill}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Request Refill
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  )
}

