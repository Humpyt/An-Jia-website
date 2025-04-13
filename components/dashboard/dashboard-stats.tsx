import { Building, Eye, MessageSquare, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardStatsProps {
  stats: {
    propertiesCount: number
    totalViews: number
    inquiriesCount: number
    recentInquiries: number
    viewsGrowth: number
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.propertiesCount}</div>
          <p className="text-xs text-muted-foreground">Manage your property listings</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalViews}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
            <span className="text-green-500">{stats.viewsGrowth}%</span>
            <span className="ml-1">from last month</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inquiries</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.inquiriesCount}</div>
          <p className="text-xs text-muted-foreground">{stats.recentInquiries} new this month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.totalViews > 0 ? Math.round((stats.inquiriesCount / stats.totalViews) * 100) : 0}%
          </div>
          <p className="text-xs text-muted-foreground">Inquiries per view</p>
        </CardContent>
      </Card>
    </div>
  )
}
