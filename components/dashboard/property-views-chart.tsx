"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Sample data - would be replaced with real data from the database
const data = [
  { day: "01", views: 45 },
  { day: "02", views: 52 },
  { day: "03", views: 38 },
  { day: "04", views: 65 },
  { day: "05", views: 48 },
  { day: "06", views: 59 },
  { day: "07", views: 73 },
  { day: "08", views: 62 },
  { day: "09", views: 58 },
  { day: "10", views: 71 },
  { day: "11", views: 82 },
  { day: "12", views: 69 },
  { day: "13", views: 78 },
  { day: "14", views: 92 },
  { day: "15", views: 85 },
  { day: "16", views: 79 },
  { day: "17", views: 88 },
  { day: "18", views: 95 },
  { day: "19", views: 87 },
  { day: "20", views: 92 },
  { day: "21", views: 104 },
  { day: "22", views: 98 },
  { day: "23", views: 112 },
  { day: "24", views: 105 },
  { day: "25", views: 118 },
  { day: "26", views: 124 },
  { day: "27", views: 131 },
  { day: "28", views: 142 },
  { day: "29", views: 136 },
  { day: "30", views: 148 },
]

export function PropertyViewsChart() {
  return (
    <ChartContainer
      config={{
        views: {
          label: "Views",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 0,
          }}
        >
          <XAxis
            dataKey="day"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line type="monotone" dataKey="views" stroke="var(--color-views)" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
