import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET() {
  try {
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
      return NextResponse.json(
        { error: "Failed to fetch properties" },
        { status: 500 }
      )
    }

    // Ensure all properties have the required fields to prevent client-side errors
    const sanitizedProperties = properties.map(property => ({
      ...property,
      price: property.price || 0,
      currency: property.currency || 'USD',
      bedrooms: property.bedrooms || 0,
      bathrooms: property.bathrooms || 0,
      views: property.views || 0,
      status: property.status || 'draft',
      property_images: property.property_images || []
    }))

    return NextResponse.json({ properties: sanitizedProperties })
  } catch (error) {
    console.error("Error in properties API route:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
