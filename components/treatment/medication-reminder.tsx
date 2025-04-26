"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Bell, Check, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

interface MedicationReminderProps {
  medication: {
    id: number
    name: string
    dosage: string
    frequency: string
    instructions: string
    nextDue?: Date
  }
}

export function MedicationReminder({ medication }: MedicationReminderProps) {
  const [taken, setTaken] = useState(false)

  const handleMarkAsTaken = () => {
    setTaken(true)

    toast({
      title: "Medication marked as taken",
      description: `You've recorded taking ${medication.name}`,
    })
  }

  const handleSnooze = () => {
    toast({
      title: "Reminder snoozed",
      description: "We'll remind you again in 30 minutes",
    })
  }

  return (
    <Card className={taken ? "bg-muted" : ""}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{medication.name}</CardTitle>
        <CardDescription>{medication.dosage}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{medication.nextDue ? `Due at ${format(medication.nextDue, "h:mm a")}` : medication.frequency}</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{medication.instructions}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        {taken ? (
          <div className="flex items-center gap-2 text-green-500">
            <Check className="h-4 w-4" />
            <span>Taken</span>
          </div>
        ) : (
          <>
            <Button variant="outline" size="sm" onClick={handleSnooze}>
              <Bell className="mr-2 h-4 w-4" />
              Snooze
            </Button>
            <Button size="sm" onClick={handleMarkAsTaken}>
              <Check className="mr-2 h-4 w-4" />
              Mark as Taken
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}

