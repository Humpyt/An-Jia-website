"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Sample data - would be replaced with real data from the database
const data = [
  {
    name: "Luxury Apt",
    views: 245,
  },
  {
    name: "Modern House",
    views: 189,
  },
  {
    name: "Studio Apt",
    views: 156,
  },
  {
    name: "Family Home",
    views: 134,
  },
  {
    name: "Penthouse",
    views: 121,
  },
]

export function PopularPropertiesChart() {
  return (
    <ChartContainer
      config={{
        views: {
          label: "Views",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{
            top: 5,
            right: 10,
            left: 80,
            bottom: 0,
          }}
        >
          <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis type="category" dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="views" fill="var(--color-views)" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
