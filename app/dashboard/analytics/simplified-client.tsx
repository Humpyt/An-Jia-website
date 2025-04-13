"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PropertyViewsChart } from "@/components/dashboard/property-views-chart"
import { InquiriesChart } from "@/components/dashboard/inquiries-chart"
import { PopularPropertiesChart } from "@/components/dashboard/popular-properties-chart"
import { LocationsChart } from "@/components/dashboard/locations-chart"

export default function AnalyticsSimplifiedClient() {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Property Views</CardTitle>
                <CardDescription>Daily property views over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <PropertyViewsChart />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Inquiries</CardTitle>
                <CardDescription>Inquiries received over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <InquiriesChart />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Popular Properties</CardTitle>
                <CardDescription>Most viewed properties in the last 30 days</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <PopularPropertiesChart />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Locations</CardTitle>
                <CardDescription>Property distribution by location</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <LocationsChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}