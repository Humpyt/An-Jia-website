"use client"

import { useEffect, useState } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts"
import { getPropertyViewsData, getInquiriesData } from "@/app/actions/dashboard"

export function PropertyActivity() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [views, inquiries] = await Promise.all([getPropertyViewsData(), getInquiriesData()])

        // Combine data for the chart - only use last 7 days
        const last7Days = views.slice(-7).map((viewItem, index) => {
          const inquiryItem = inquiries.slice(-7)[index]
          return {
            date: viewItem.date,
            views: viewItem.count,
            inquiries: inquiryItem?.count || 0,
          }
        })

        setData(last7Days)
      } catch (error) {
        console.error("Error fetching activity data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="h-[200px] flex items-center justify-center">
        <p>Loading activity data...</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 10,
          left: 10,
          bottom: 0,
        }}
      >
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Views</span>
                      <span className="font-bold text-muted-foreground">{payload[0].value}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Inquiries</span>
                      <span className="font-bold text-muted-foreground">{payload[1].value}</span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Line
          type="monotone"
          strokeWidth={2}
          dataKey="views"
          activeDot={{
            r: 6,
            style: { fill: "var(--theme-primary)", opacity: 0.25 },
          }}
          style={{
            stroke: "var(--theme-primary)",
          }}
        />
        <Line
          type="monotone"
          dataKey="inquiries"
          strokeWidth={2}
          activeDot={{
            r: 8,
            style: { fill: "var(--theme-secondary)" },
          }}
          style={{
            stroke: "var(--theme-secondary)",
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
