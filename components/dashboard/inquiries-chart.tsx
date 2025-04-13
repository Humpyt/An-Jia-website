"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Sample data - would be replaced with real data from the database
const data = [
  { day: "01", inquiries: 2 },
  { day: "02", inquiries: 1 },
  { day: "03", inquiries: 0 },
  { day: "04", inquiries: 3 },
  { day: "05", inquiries: 2 },
  { day: "06", inquiries: 1 },
  { day: "07", inquiries: 4 },
  { day: "08", inquiries: 2 },
  { day: "09", inquiries: 1 },
  { day: "10", inquiries: 3 },
  { day: "11", inquiries: 5 },
  { day: "12", inquiries: 2 },
  { day: "13", inquiries: 3 },
  { day: "14", inquiries: 4 },
  { day: "15", inquiries: 2 },
  { day: "16", inquiries: 1 },
  { day: "17", inquiries: 3 },
  { day: "18", inquiries: 4 },
  { day: "19", inquiries: 2 },
  { day: "20", inquiries: 3 },
  { day: "21", inquiries: 5 },
  { day: "22", inquiries: 3 },
  { day: "23", inquiries: 4 },
  { day: "24", inquiries: 2 },
  { day: "25", inquiries: 3 },
  { day: "26", inquiries: 5 },
  { day: "27", inquiries: 4 },
  { day: "28", inquiries: 6 },
  { day: "29", inquiries: 4 },
  { day: "30", inquiries: 5 },
]

export function InquiriesChart() {
  return (
    <ChartContainer
      config={{
        inquiries: {
          label: "Inquiries",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
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
          <Bar dataKey="inquiries" fill="var(--color-inquiries)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
