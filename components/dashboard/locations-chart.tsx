"use client"

import { Pie, PieChart, ResponsiveContainer, Cell, Legend, Tooltip } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

// Sample data - would be replaced with real data from the database
const data = [
  { name: "Kololo", value: 12 },
  { name: "Nakasero", value: 8 },
  { name: "Bukoto", value: 15 },
  { name: "Ntinda", value: 10 },
  { name: "Muyenga", value: 7 },
  { name: "Other", value: 18 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export function LocationsChart() {
  return (
    <ChartContainer className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
