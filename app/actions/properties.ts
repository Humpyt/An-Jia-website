"use server"

import { revalidatePath } from "next/cache"
import { properties } from "@/lib/property-data"

export async function getPropertiesWithFilters(options: {
  limit?: number
  offset?: number
  filters?: {
    location?: string
    minPrice?: number
    maxPrice?: number
    bedrooms?: number
    bathrooms?: number
    amenities?: string[]
  }
}) {
  const { limit = 10, offset = 0, filters } = options

  try {
    // Get all properties from our data file
    let filteredProperties = [...properties]

    // Filter the properties based on the provided filters
    if (filters) {
      if (filters.location) {
        filteredProperties = filteredProperties.filter(p => 
          p.location.toLowerCase().includes(filters.location!.toLowerCase())
        )
      }

      if (filters.minPrice) {
        filteredProperties = filteredProperties.filter(p => {
          const price = parseFloat(p.price.split('-')[0])
          return !isNaN(price) && price >= filters.minPrice!
        })
      }

      if (filters.maxPrice) {
        filteredProperties = filteredProperties.filter(p => {
          const price = parseFloat(p.price.split('-')[0])
          return !isNaN(price) && price <= filters.maxPrice!
        })
      }

      if (filters.bedrooms) {
        filteredProperties = filteredProperties.filter(p => {
          const bedrooms = parseInt(p.bedrooms.split('-')[0]) 
          return !isNaN(bedrooms) && bedrooms >= filters.bedrooms!
        })
      }

      if (filters.amenities && filters.amenities.length > 0) {
        filteredProperties = filteredProperties.filter(p => 
          filters.amenities!.every(amenity => 
            p.amenities.some(a => a.toLowerCase().includes(amenity.toLowerCase()))
          )
        )
      }
    }

    // Sort by premium status
    filteredProperties.sort((a, b) => (b.isPremium ? 1 : 0) - (a.isPremium ? 1 : 0))
    
    // Apply pagination
    const paginatedProperties = filteredProperties.slice(offset, offset + limit)

    return paginatedProperties
  } catch (error) {
    console.error("Unexpected error in getProperties:", error)
    throw new Error(`Failed to fetch properties: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export async function getPropertyById(id: string) {
  try {
    const property = properties.find(p => p.id === id)
    
    if (!property) {
      throw new Error(`Property with ID ${id} not found`)
    }

    // Add mock agent data
    const propertyWithAgent = {
      ...property,
      agents: {
        id: "agent-1",
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+256 701 234 567",
        company: "An Jia You Xuan Real Estate"
      }
    }

    return propertyWithAgent
  } catch (error) {
    console.error("Unexpected error in getPropertyById:", error)
    throw new Error(`Failed to fetch property: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export async function incrementPropertyViews(propertyId: string, userId?: string) {
  // In a real app, this would increment the view count in the database
  // For our mock, we'll just log it
  console.log(`Property ${propertyId} viewed by user ${userId || 'anonymous'}`)
  
  // No need to revalidate the path since we're not storing the view count
  return { success: true }
}

export async function saveProperty(propertyId: string, userId: string) {
  // In a real app, this would save the property to the user's saved properties
  // For our mock implementation, we'll just return success
  console.log(`Property ${propertyId} saved by user ${userId}`)
  
  return { success: true, message: "Property saved successfully" }
}

export async function unsaveProperty(propertyId: string, userId: string) {
  // In a real app, this would remove the property from the user's saved properties
  // For our mock implementation, we'll just return success
  console.log(`Property ${propertyId} unsaved by user ${userId}`)
  
  return { success: true, message: "Property unsaved successfully" }
}

export async function submitInquiry(data: {
  propertyId: string
  agentId?: string
  userId?: string
  name: string
  email: string
  phone?: string
  message: string
}) {
  // In a real app, this would store the inquiry in the database
  // For our mock implementation, we'll just log it and return success
  console.log(`Inquiry submitted for property ${data.propertyId}:`, data)
  
  return { success: true, message: "Inquiry submitted successfully" }
}
