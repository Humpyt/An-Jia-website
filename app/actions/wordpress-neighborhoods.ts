"use server"

import { revalidatePath } from "next/cache"
import { getPropertiesWithFilters } from "@/lib/wordpress"
import { getNeighborhoods as fetchNeighborhoods, getPropertiesByNeighborhood as fetchPropertiesByNeighborhood } from "@/lib/wordpress-api"

/**
 * Get all neighborhoods with property counts and featured images
 */
export async function getNeighborhoods() {
  try {
    console.log('Server action: Fetching neighborhoods with property counts and images')
    const neighborhoods = await fetchNeighborhoods()

    // For each neighborhood, get a featured property image
    const enhancedNeighborhoods = await Promise.all(
      neighborhoods.map(async (neighborhood) => {
        // Get one property from this neighborhood to use its image
        const properties = await getPropertiesWithFilters({
          limit: 1,
          filters: {
            location: neighborhood.name
          }
        })

        // Use the first property's image if available, otherwise use the neighborhood image
        const featuredImage = properties.properties.length > 0 && properties.properties[0].images.length > 0
          ? properties.properties[0].images[0]
          : neighborhood.image

        return {
          ...neighborhood,
          featuredImage,
          propertyCount: properties.totalCount || 0
        }
      })
    )

    console.log(`Successfully fetched ${enhancedNeighborhoods.length} neighborhoods with property images`)
    return enhancedNeighborhoods
  } catch (error: any) {
    console.error('Error fetching neighborhoods:', error)
    return []
  }
}

/**
 * Get properties by neighborhood
 */
export async function getPropertiesByNeighborhood(neighborhoodName: string, options: {
  limit?: number
  offset?: number
  filters?: {
    minPrice?: number
    maxPrice?: number
    bedrooms?: number
    bathrooms?: number
    propertyType?: string
  }
} = {}) {
  try {
    console.log(`Server action: Fetching properties for neighborhood: ${neighborhoodName}`)

    const { limit = 12, offset = 0, filters = {} } = options

    // Get properties filtered by location (neighborhood name)
    const result = await fetchPropertiesByNeighborhood(neighborhoodName, {
      limit,
      offset,
      filters
    })

    console.log(`Found ${result.totalCount} properties in ${neighborhoodName}`)
    return result
  } catch (error: any) {
    console.error(`Error fetching properties for neighborhood ${neighborhoodName}:`, error)
    return {
      properties: [],
      totalCount: 0,
      totalPages: 0
    }
  }
}
