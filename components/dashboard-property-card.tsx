import { Eye, MessageSquare, MoreHorizontal, Pencil, Trash } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DashboardPropertyCardProps {
  id: string
  title: string
  location: string
  price: number
  currency: "UGX" | "USD"
  bedrooms: number
  bathrooms: number
  status: "active" | "draft" | "archived"
  views: number
  inquiries: number
  lastUpdated: string
  imageUrl: string
}

export function DashboardPropertyCard({
  id,
  title,
  location,
  price,
  currency,
  bedrooms,
  bathrooms,
  status,
  views,
  inquiries,
  lastUpdated,
  imageUrl,
}: DashboardPropertyCardProps) {
  const formatPrice = (price: number, currency: "UGX" | "USD") => {
    if (currency === "UGX") {
      return `UGX ${price.toLocaleString()}`
    }
    return `$${price.toLocaleString()}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100/80"
      case "draft":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100/80"
      case "archived":
        return "bg-red-100 text-red-800 hover:bg-red-100/80"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80"
    }
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-[120px] h-[120px]">
            <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover sm:rounded-l-lg" />
          </div>
          <div className="flex flex-1 flex-col p-4">
            <div className="flex items-start justify-between">
              <div>
                <Link href={`/properties/${id}`} className="hover:underline">
                  <h3 className="font-semibold">{title}</h3>
                </Link>
                <p className="text-sm text-muted-foreground">{location}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <Badge variant="outline">
                {bedrooms} {bedrooms === 1 ? "bed" : "beds"}
              </Badge>
              <Badge variant="outline">
                {bathrooms} {bathrooms === 1 ? "bath" : "baths"}
              </Badge>
              <Badge className={getStatusColor(status)}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
            </div>
            <div className="mt-auto flex items-center justify-between pt-4">
              <div className="text-lg font-semibold">{formatPrice(price, currency)}</div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{inquiries}</span>
                </div>
                <div>Updated {lastUpdated}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
