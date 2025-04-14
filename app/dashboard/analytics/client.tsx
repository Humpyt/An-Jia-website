'use client'

import { getDashboardStats, getLocationDistribution, getPropertyViewsData, getRecentInquiries } from '@/app/actions/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AreaChart, BarChart, LineChart } from '@/components/ui/chart'
import { useState, useEffect } from 'react'

interface DashboardStats {
  totalProperties: number
  activeProperties: number
  totalViews: number
  totalInquiries: number
}

interface PropertyView {
  title: string
  views: number
}

interface LocationData {
  location: string
  count: number
}

interface Inquiry {
  id: string
  name: string
  email: string
  message: string
  created_at: string
  property_id: string
}

export default function AnalyticsClient() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [propertyViews, setPropertyViews] = useState<PropertyView[]>([])
  const [locationData, setLocationData] = useState<LocationData[]>([])
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([])

  useEffect(() => {
    async function fetchData() {
      const [statsData, viewsData, locData, inquiriesData] = await Promise.all([
        getDashboardStats(),
        getPropertyViewsData(),
        getLocationDistribution(),
        getRecentInquiries(5)
      ])
      
      setStats(statsData)
      setPropertyViews(viewsData)
      setLocationData(locData)
      setRecentInquiries(inquiriesData)
    }
    
    fetchData()
  }, [])

  if (!stats) return <div>Loading...</div>

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProperties}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeProperties}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalViews}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalInquiries}</div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Property Views</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={propertyViews}
                  index="title"
                  categories={['views']}
                  colors={['blue']}
                  valueFormatter={(value: number) => `${value} views`}
                  className="h-[300px]"
                />
              </CardContent>
            </Card>
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Location Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <AreaChart
                  data={locationData}
                  index="location"
                  categories={['count']}
                  colors={['blue']}
                  valueFormatter={(value: number) => `${value} properties`}
                  className="h-[300px]"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}