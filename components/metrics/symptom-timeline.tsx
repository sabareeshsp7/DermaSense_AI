"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Activity, Thermometer, Droplets, Brain, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface SymptomTimelineProps {
  healthLogs: { date: Date; metrics: Record<string, number>; alerts: string[]; notes: string }[]
}

export function SymptomTimeline({ healthLogs }: SymptomTimelineProps) {
  const [selectedMetric, setSelectedMetric] = useState("painLevel")

  const metrics = [
    { id: "painLevel", name: "Pain Level", icon: Activity, color: "hsl(var(--primary))" },
    { id: "fatigue", name: "Fatigue", icon: Thermometer, color: "#f97316" },
    { id: "hydration", name: "Hydration", icon: Droplets, color: "#0ea5e9" },
    { id: "mood", name: "Mood", icon: Brain, color: "#8b5cf6" },
    { id: "lesionSize", name: "Lesion Size", icon: Heart, color: "#ef4444" },
  ]

  // Sort logs by date (oldest to newest)
  const sortedLogs = [...healthLogs].sort((a, b) => a.date.getTime() - b.date.getTime())

  // Get min and max values for the selected metric
  const values = sortedLogs.map((log) => log.metrics[selectedMetric])
  const maxValue = Math.max(...values)
  const minValue = Math.min(...values)

  // Get the selected metric info
  const selectedMetricInfo = metrics.find((m) => m.id === selectedMetric)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {metrics.map((metric) => (
          <Button
            key={metric.id}
            variant={selectedMetric === metric.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedMetric(metric.id)}
            className="flex items-center gap-2"
          >
            <metric.icon className="h-4 w-4" />
            {metric.name}
          </Button>
        ))}
      </div>

      <div className="relative mt-8">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>

        {/* Timeline entries */}
        <div className="space-y-8 pl-12">
          {sortedLogs.map((log, index) => {
            // Calculate the value percentage for visualization
            const value = log.metrics[selectedMetric]
            const percentage = maxValue === minValue ? 50 : ((value - minValue) / (maxValue - minValue)) * 100

            // Determine color based on the metric and value
            let color = selectedMetricInfo?.color || "hsl(var(--primary))"

            // For pain, fatigue, lesionSize - lower is better
            if (selectedMetric === "painLevel" || selectedMetric === "fatigue" || selectedMetric === "lesionSize") {
              if (percentage < 33) color = "#22c55e" // green
              else if (percentage < 66) color = "#f59e0b" // amber
              else if (percentage < 66)
                color = "#f59e0b" // amber
              else color = "#ef4444" // red
            } else {
              // For hydration, mood - higher is better
              if (percentage > 66)
                color = "#22c55e" // green
              else if (percentage > 33)
                color = "#f59e0b" // amber
              else color = "#ef4444" // red
            }

            return (
              <div key={index} className="relative">
                {/* Date marker */}
                <div className="absolute left-[-40px] top-0 flex h-8 w-8 items-center justify-center rounded-full border bg-background">
                  <span className="text-xs font-medium">{format(log.date, "d")}</span>
                </div>

                {/* Entry content */}
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{format(log.date, "MMMM d, yyyy")}</h3>
                    {log.alerts.length > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {log.alerts.length} Alert{log.alerts.length > 1 ? "s" : ""}
                      </Badge>
                    )}
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {selectedMetricInfo && <selectedMetricInfo.icon className="h-5 w-5" style={{ color }} />}
                        <span className="font-medium">
                          {selectedMetricInfo?.name}: {value}
                        </span>
                      </div>
                      <div
                        className="h-2 w-24 rounded-full bg-gray-200 dark:bg-gray-700"
                        style={{
                          background: `linear-gradient(to right, ${color} ${percentage}%, transparent ${percentage}%)`,
                        }}
                      />
                    </div>

                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{log.notes}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

