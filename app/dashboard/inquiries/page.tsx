import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InquiriesList } from "@/components/dashboard/inquiries-list"
import { getInquiries } from "@/app/actions/inquiries"

export default async function InquiriesPage() {
  const inquiries = await getInquiries()

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Inquiries</h2>
      </div>
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="contacted">Contacted</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <Suspense fallback={<div>Loading inquiries...</div>}>
            <InquiriesList inquiries={inquiries} />
          </Suspense>
        </TabsContent>
        <TabsContent value="new" className="space-y-4">
          <Suspense fallback={<div>Loading inquiries...</div>}>
            <InquiriesList inquiries={inquiries.filter((inquiry) => inquiry.status === "new")} />
          </Suspense>
        </TabsContent>
        <TabsContent value="contacted" className="space-y-4">
          <Suspense fallback={<div>Loading inquiries...</div>}>
            <InquiriesList inquiries={inquiries.filter((inquiry) => inquiry.status === "contacted")} />
          </Suspense>
        </TabsContent>
        <TabsContent value="resolved" className="space-y-4">
          <Suspense fallback={<div>Loading inquiries...</div>}>
            <InquiriesList inquiries={inquiries.filter((inquiry) => inquiry.status === "resolved")} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
