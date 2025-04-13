import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/dashboard/overview"
import { RecentInquiries } from "@/components/dashboard/recent-inquiries"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { PropertyActivity } from "@/components/dashboard/property-activity"
import { getDashboardStats } from "@/app/actions/dashboard"

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Suspense fallback={<div>Loading stats...</div>}>
            <DashboardStats stats={stats} />
          </Suspense>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Property views and inquiries in the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <PropertyActivity />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Inquiries</CardTitle>
              <CardDescription>You have received {stats.recentInquiries} inquiries this month.</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentInquiries />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>View detailed analytics about your properties and inquiries.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <p>For more detailed analytics, visit the Analytics page.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Generate and download reports about your properties and inquiries.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <p>For more detailed reports, visit the Analytics page.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
