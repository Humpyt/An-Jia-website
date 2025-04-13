"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getRecentInquiries } from "@/app/actions/dashboard"

export function RecentInquiries() {
  const [inquiries, setInquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInquiries() {
      try {
        const data = await getRecentInquiries()
        setInquiries(data)
      } catch (error) {
        console.error("Error fetching recent inquiries:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchInquiries()
  }, [])

  if (loading) {
    return (
      <div className="h-[200px] flex items-center justify-center">
        <p>Loading recent inquiries...</p>
      </div>
    )
  }

  if (inquiries.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No recent inquiries found.</p>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="default">New</Badge>
      case "contacted":
        return <Badge variant="outline">Contacted</Badge>
      case "resolved":
        return <Badge variant="secondary">Resolved</Badge>
      case "archived":
        return (
          <Badge variant="outline" className="bg-muted">
            Archived
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-8">
      {inquiries.map((inquiry) => (
        <div key={inquiry.id} className="flex items-start gap-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`/placeholder.svg?text=${inquiry.name.charAt(0)}`} alt={inquiry.name} />
            <AvatarFallback>{inquiry.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none">{inquiry.name}</p>
              {getStatusBadge(inquiry.status)}
              <p className="text-sm text-muted-foreground">{formatDate(inquiry.created_at)}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Inquiry for{" "}
              <Link href={`/properties/${inquiry.property_id}`} className="font-medium underline">
                {inquiry.properties?.title || "Unknown Property"}
              </Link>
            </p>
            <p className="text-sm line-clamp-2">{inquiry.message}</p>
          </div>
          <div className="ml-auto">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/dashboard/inquiries`}>View</Link>
            </Button>
          </div>
        </div>
      ))}
      <div className="text-center">
        <Button variant="outline" asChild>
          <Link href="/dashboard/inquiries">View All Inquiries</Link>
        </Button>
      </div>
    </div>
  )
}
