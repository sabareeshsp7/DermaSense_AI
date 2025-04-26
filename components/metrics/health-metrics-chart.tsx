"use client"

import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface HealthMetricsChartProps {
  data: {
    date: string
    value: number
  }[]
  dataKey: string
  name: string
  color: string
}

export function HealthMetricsChart({ data, dataKey, name, color }: HealthMetricsChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip formatter={(value: number) => [`${value}`, name]} labelFormatter={(label) => `Date: ${label}`} />
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={{ strokeWidth: 2 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

