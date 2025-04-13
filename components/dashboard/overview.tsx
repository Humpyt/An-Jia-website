"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getPropertyViewsData, getInquiriesData } from "@/app/actions/dashboard"

export function Overview() {
  const [viewsData, setViewsData] = useState<any[]>([])
  const [inquiriesData, setInquiriesData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [views, inquiries] = await Promise.all([getPropertyViewsData(), getInquiriesData()])

        // Combine data for the chart
        const combinedData = views.map((viewItem, index) => ({
          date: viewItem.date,
          views: viewItem.count,
          inquiries: inquiries[index]?.count || 0,
        }))

        setViewsData(combinedData)
        setInquiriesData(combinedData)
      } catch (error) {
        console.error("Error fetching chart data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <p>Loading chart data...</p>
      </div>
    )
  }

  return (
    <Tabs defaultValue="views">
      <TabsList className="mb-4">
        <TabsTrigger value="views">Views</TabsTrigger>
        <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
      </TabsList>
      <TabsContent value="views">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={viewsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => {
                const date = new Date(value)
                return `${date.getDate()}/${date.getMonth() + 1}`
              }}
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value: number) => [`${value} views`, "Views"]}
              labelFormatter={(label) => {
                const date = new Date(label)
                return date.toLocaleDateString()
              }}
            />
            <Bar dataKey="views" fill="#2563eb" name="Views" />
          </BarChart>
        </ResponsiveContainer>
      </TabsContent>
      <TabsContent value="inquiries">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={inquiriesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => {
                const date = new Date(value)
                return `${date.getDate()}/${date.getMonth() + 1}`
              }}
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value: number) => [`${value} inquiries`, "Inquiries"]}
              labelFormatter={(label) => {
                const date = new Date(label)
                return date.toLocaleDateString()
              }}
            />
            <Bar dataKey="inquiries" fill="#10b981" name="Inquiries" />
          </BarChart>
        </ResponsiveContainer>
      </TabsContent>
    </Tabs>
  )
}
