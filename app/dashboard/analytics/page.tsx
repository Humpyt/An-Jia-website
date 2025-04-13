"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PropertyViewsChart } from "@/components/dashboard/property-views-chart"
import { InquiriesChart } from "@/components/dashboard/inquiries-chart"
import { PopularPropertiesChart } from "@/components/dashboard/popular-properties-chart"
import { LocationsChart } from "@/components/dashboard/locations-chart"

export default function AnalyticsPage() {
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
        <TabsContent value="properties" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Property Performance</CardTitle>
              <CardDescription>Detailed analytics for all your properties</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left font-medium">Property</th>
                      <th className="py-3 px-4 text-left font-medium">Views</th>
                      <th className="py-3 px-4 text-left font-medium">Inquiries</th>
                      <th className="py-3 px-4 text-left font-medium">Conversion Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Sample data - would be replaced with real data */}
                    <tr className="border-b">
                      <td className="py-3 px-4">Luxury Apartment in Kololo</td>
                      <td className="py-3 px-4">245</td>
                      <td className="py-3 px-4">12</td>
                      <td className="py-3 px-4">4.9%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Modern House in Nakasero</td>
                      <td className="py-3 px-4">189</td>
                      <td className="py-3 px-4">8</td>
                      <td className="py-3 px-4">4.2%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Studio Apartment in Bukoto</td>
                      <td className="py-3 px-4">156</td>
                      <td className="py-3 px-4">5</td>
                      <td className="py-3 px-4">3.2%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inquiries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inquiry Analytics</CardTitle>
              <CardDescription>Detailed analytics for inquiries received</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Inquiry Status Distribution</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold">24</div>
                        <div className="text-sm text-muted-foreground">New</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold">18</div>
                        <div className="text-sm text-muted-foreground">Contacted</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold">32</div>
                        <div className="text-sm text-muted-foreground">Resolved</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold">8</div>
                        <div className="text-sm text-muted-foreground">Archived</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Response Time</h3>
                  <div className="h-[200px] bg-muted rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">Response time chart would go here</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Location Analytics</CardTitle>
              <CardDescription>Property distribution and performance by location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Top Neighborhoods</h3>
                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-3 px-4 text-left font-medium">Neighborhood</th>
                          <th className="py-3 px-4 text-left font-medium">Properties</th>
                          <th className="py-3 px-4 text-left font-medium">Avg. Price</th>
                          <th className="py-3 px-4 text-left font-medium">Avg. Views</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-3 px-4">Kololo</td>
                          <td className="py-3 px-4">12</td>
                          <td className="py-3 px-4">2,500,000 UGX</td>
                          <td className="py-3 px-4">185</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4">Nakasero</td>
                          <td className="py-3 px-4">8</td>
                          <td className="py-3 px-4">1,800,000 UGX</td>
                          <td className="py-3 px-4">142</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4">Bukoto</td>
                          <td className="py-3 px-4">15</td>
                          <td className="py-3 px-4">1,200,000 UGX</td>
                          <td className="py-3 px-4">98</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Map View</h3>
                  <div className="h-[400px] bg-muted rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">Interactive map would go here</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
