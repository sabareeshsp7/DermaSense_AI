"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface SideEffectsTrackerProps {
  data: {
    date: string
    severity: number
  }[]
}

export function SideEffectsTracker({ data }: SideEffectsTrackerProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          domain={[0, 5]}
          ticks={[0, 1, 2, 3, 4, 5]}
          tickFormatter={(value) => {
            const labels = ["None", "Mild", "Moderate", "Significant", "Severe", "Extreme"]
            return labels[value] || value.toString()
          }}
        />
        <Tooltip
          formatter={(value: number) => {
            const labels = ["None", "Mild", "Moderate", "Significant", "Severe", "Extreme"]
            return [labels[value] || value, "Severity"]
          }}
          labelFormatter={(label) => `Period: ${label}`}
        />
        <Area type="monotone" dataKey="severity" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/0.2)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

