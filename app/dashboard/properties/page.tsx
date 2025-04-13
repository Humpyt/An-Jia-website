import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PropertyList } from "@/components/dashboard/property-list"
import { PlusCircle } from "lucide-react"
import { createServerClient } from "@/lib/supabase/server"

export default async function PropertiesPage() {
  const supabase = createServerClient()

  // Fetch all properties with their images
  const { data: properties, error } = await supabase
    .from("properties")
    .select(`
      *,
      property_images(id, image_url, is_primary)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching properties:", error)
    throw new Error("Failed to fetch properties")
  }

  // Get active, draft, and archived properties
  const activeProperties = properties.filter((property) => property.status === "active")
  const draftProperties = properties.filter((property) => property.status === "draft")
  const archivedProperties = properties.filter((property) => property.status === "archived")

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Properties</h2>
        <Button asChild>
          <Link href="/dashboard/properties/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Property
          </Link>
        </Button>
      </div>
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Properties</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <PropertyList properties={properties} />
        </TabsContent>
        <TabsContent value="active" className="space-y-4">
          <PropertyList properties={activeProperties} />
        </TabsContent>
        <TabsContent value="draft" className="space-y-4">
          <PropertyList properties={draftProperties} />
        </TabsContent>
        <TabsContent value="archived" className="space-y-4">
          <PropertyList properties={archivedProperties} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
