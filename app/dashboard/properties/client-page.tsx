"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PropertyList } from "@/components/dashboard/property-list"
import { PlusCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Define the type for our component props
interface ClientPropertiesPageProps {
  initialProperties: any[]
}

export default function ClientPropertiesPage({ initialProperties }: ClientPropertiesPageProps) {
  // Use state to store the properties
  const [properties, setProperties] = useState<any[]>(initialProperties || [])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch properties on the client side
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // If we already have initial properties, don't fetch again
        if (initialProperties && initialProperties.length > 0) {
          setProperties(initialProperties)
          setIsLoading(false)
          return
        }

        // Fetch properties from the API
        const response = await fetch('/api/properties')
        
        if (!response.ok) {
          throw new Error('Failed to fetch properties')
        }
        
        const data = await response.json()
        setProperties(data.properties || [])
      } catch (err) {
        console.error('Error fetching properties:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProperties()
  }, [initialProperties])

  // Handle loading state
  if (isLoading) {
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
        <Card>
          <CardHeader>
            <CardTitle>Loading Properties</CardTitle>
            <CardDescription>Please wait while we load your properties...</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Handle error state
  if (error) {
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
        <Card>
          <CardHeader>
            <CardTitle>Error Loading Properties</CardTitle>
            <CardDescription>There was an error loading your properties.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{error}</p>
            <Button 
              className="mt-4" 
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
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
