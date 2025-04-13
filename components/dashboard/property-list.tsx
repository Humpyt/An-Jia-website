"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Eye, MoreVertical, Pencil, Trash2, Grid3X3, List, PlusCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface PropertyListProps {
  properties: any[]
}

export function PropertyList({ properties }: PropertyListProps) {
  const [view, setView] = useState<"grid" | "list">("grid")
  const [deleteProperty, setDeleteProperty] = useState<any | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const handleDelete = async () => {
    if (!deleteProperty) return

    setIsDeleting(true)
    try {
      // Delete the property from Supabase
      const response = await fetch(`/api/properties/${deleteProperty.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete property")
      }

      toast({
        title: "Property deleted",
        description: "The property has been deleted successfully",
      })

      // Refresh the page
      window.location.reload()
    } catch (error) {
      console.error("Error deleting property:", error)
      toast({
        title: "Error",
        description: "Failed to delete the property",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteProperty(null)
    }
  }

  const formatPrice = (price: number | undefined, currency: string | undefined) => {
    // Handle undefined values
    const safePrice = price || 0
    const safeCurrency = currency || 'USD'

    try {
      if (safeCurrency === "UGX") {
        return `UGX ${safePrice.toLocaleString()}`
      }
      return `$${safePrice.toLocaleString()}`
    } catch (error) {
      // Fallback if toLocaleString fails
      console.error('Error formatting price:', error)
      return safeCurrency === "UGX" ? `UGX ${safePrice}` : `$${safePrice}`
    }
  }

  const getStatusBadge = (status: string | undefined) => {
    // Handle undefined status
    const safeStatus = status || 'draft'

    switch (safeStatus) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      case "archived":
        return <Badge variant="secondary">Archived</Badge>
      default:
        return <Badge variant="outline">{safeStatus}</Badge>
    }
  }

  // Filter properties based on search term
  const filteredProperties = properties.filter((property) => {
    if (!searchTerm) return true

    const searchLower = searchTerm.toLowerCase()
    return (
      property.title.toLowerCase().includes(searchLower) ||
      property.location.toLowerCase().includes(searchLower) ||
      property.description?.toLowerCase().includes(searchLower)
    )
  })

  if (properties.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No properties found</CardTitle>
          <CardDescription>
            You haven't added any properties yet. Click the "Add Property" button to get started.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild>
            <Link href="/dashboard/properties/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Property
            </Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search properties..."
            className="w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Status: Active</DropdownMenuItem>
              <DropdownMenuItem>Status: Draft</DropdownMenuItem>
              <DropdownMenuItem>Status: Archived</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
              <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Date: Newest</DropdownMenuItem>
              <DropdownMenuItem>Date: Oldest</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={view === "grid" ? "default" : "outline"} size="sm" onClick={() => setView("grid")}>
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button variant={view === "list" ? "default" : "outline"} size="sm" onClick={() => setView("list")}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProperties.map((property) => {
            // Find primary image or use the first one
            const primaryImage =
              property.property_images?.find((img: any) => img.is_primary) || property.property_images?.[0]
            const imageUrl = primaryImage?.image_url || "/placeholder.svg?height=200&width=300"

            return (
              <Card key={property.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <Image src={imageUrl || "/placeholder.svg"} alt={property.title} fill className="object-cover" />
                  <div className="absolute top-2 right-2">{getStatusBadge(property.status)}</div>
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="line-clamp-1 text-lg">{property.title}</CardTitle>
                  <CardDescription className="line-clamp-1">{property.location}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{formatPrice(property.price, property.currency)}</div>
                    <div className="text-sm text-muted-foreground">
                      {property.bedrooms} bed • {property.bathrooms} bath
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-muted-foreground">
                    <Eye className="mr-1 h-4 w-4" />
                    {property.views} views
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <div className="flex w-full items-center justify-between">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/properties/${property.id}`}>View</Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/properties/${property.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteProperty(property)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="py-3 px-4 text-left font-medium">Property</th>
                <th className="py-3 px-4 text-left font-medium">Price</th>
                <th className="py-3 px-4 text-left font-medium">Status</th>
                <th className="py-3 px-4 text-left font-medium">Views</th>
                <th className="py-3 px-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties.map((property) => {
                // Find primary image or use the first one
                const primaryImage =
                  property.property_images?.find((img: any) => img.is_primary) || property.property_images?.[0]
                const imageUrl = primaryImage?.image_url || "/placeholder.svg?height=40&width=40"

                return (
                  <tr key={property.id} className="border-b">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-md">
                          <Image
                            src={imageUrl || "/placeholder.svg"}
                            alt={property.title}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{property.title}</div>
                          <div className="text-xs text-muted-foreground">{property.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium">{formatPrice(property.price, property.currency)}</div>
                      <div className="text-xs text-muted-foreground">
                        {property.bedrooms} bed • {property.bathrooms} bath
                      </div>
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(property.status)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Eye className="mr-1 h-4 w-4 text-muted-foreground" />
                        {property.views}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/properties/${property.id}`}>View</Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/properties/${property.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteProperty(property)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={!!deleteProperty} onOpenChange={(open) => !open && setDeleteProperty(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Property</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteProperty?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteProperty(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
