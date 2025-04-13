"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { updateInquiryStatus } from "@/app/actions/inquiries"

interface InquiriesListProps {
  inquiries: any[]
}

export function InquiriesList({ inquiries }: InquiriesListProps) {
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null)
  const [replyText, setReplyText] = useState("")
  const [status, setStatus] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleReply = async () => {
    if (!replyText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a reply message",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Here you would send the reply to the backend
      // await sendInquiryReply(selectedInquiry.id, replyText)

      // Update the status if changed
      if (status && status !== selectedInquiry.status) {
        await updateInquiryStatus(selectedInquiry.id, status as any)
      }

      toast({
        title: "Reply sent",
        description: `Your reply to ${selectedInquiry?.name} has been sent`,
      })

      setReplyText("")
      setSelectedInquiry(null)

      // Refresh the page to show updated status
      window.location.reload()
    } catch (error) {
      console.error("Error sending reply:", error)
      toast({
        title: "Error",
        description: "Failed to send reply",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
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

  if (inquiries.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <h3 className="text-lg font-medium">No inquiries found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          When you receive inquiries about your properties, they will appear here.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Inquiry</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.map((inquiry) => (
              <TableRow key={inquiry.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={`/placeholder.svg?text=${inquiry.name.charAt(0)}`} alt={inquiry.name} />
                      <AvatarFallback>{inquiry.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-0.5">
                      <div className="font-medium">{inquiry.name}</div>
                      <div className="text-xs text-muted-foreground">{inquiry.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{inquiry.properties?.title || "Unknown Property"}</TableCell>
                <TableCell>{new Date(inquiry.created_at).toLocaleDateString()}</TableCell>
                <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedInquiry(inquiry)
                      setStatus(inquiry.status)
                    }}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedInquiry} onOpenChange={(open) => !open && setSelectedInquiry(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Inquiry from {selectedInquiry?.name}</DialogTitle>
            <DialogDescription>
              {selectedInquiry?.properties?.title || "Unknown Property"} -{" "}
              {selectedInquiry?.created_at ? new Date(selectedInquiry.created_at).toLocaleDateString() : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">Status</div>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-md bg-muted p-4">
              <p className="text-sm">{selectedInquiry?.message}</p>
            </div>
            <div>
              <div className="font-medium mb-2">Your Reply</div>
              <Textarea
                placeholder="Type your reply here..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedInquiry(null)}>
              Cancel
            </Button>
            <Button onClick={handleReply} disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Reply"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
