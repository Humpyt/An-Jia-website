import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import ClientPropertiesPage from './client-page'
import { createServerClient } from "@/lib/supabase/server"

// Define route segment config to prevent static generation
export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 0
export const fetchCache = 'force-no-store'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'

// Loading component for Suspense
function PropertiesLoading() {
  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  )
}

export default async function PropertiesPage() {
  let initialProperties = []

  try {
    const supabase = createServerClient()
    const { data: properties, error } = await supabase
      .from("properties")
      .select(`
        *,
        property_images(id, image_url, is_primary)
      `)
      .order("created_at", { ascending: false })

    if (!error && properties) {
      // Sanitize the data to prevent client-side errors
      initialProperties = properties.map(property => ({
        ...property,
        price: typeof property.price === 'number' ? property.price : 0,
        currency: property.currency || 'USD',
        bedrooms: property.bedrooms || '0',
        bathrooms: property.bathrooms || '0',
        views: property.views || 0,
        status: property.status || 'draft',
        location: property.location || '',
        title: property.title || '',
        property_images: Array.isArray(property.property_images) ? property.property_images : []
      }))
    }
  } catch (error) {
    console.error('Error fetching properties:', error)
  }

  return (
    <Suspense fallback={<PropertiesLoading />}>
      <ClientPropertiesPage initialProperties={initialProperties} />
    </Suspense>
  )
}
