"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    date: "Jan",
    "Skin Health Score": 65,
  },
  {
    date: "Feb",
    "Skin Health Score": 75,
  },
  {
    date: "Mar",
    "Skin Health Score": 70,
  },
  {
    date: "Apr",
    "Skin Health Score": 80,
  },
  {
    date: "May",
    "Skin Health Score": 85,
  },
  {
    date: "Jun",
    "Skin Health Score": 82,
  },
]

export function DashboardChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Line type="monotone" dataKey="Skin Health Score" stroke="#2563eb" strokeWidth={2} dot={{ strokeWidth: 2 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

