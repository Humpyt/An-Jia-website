"use server"

import { revalidatePath } from "next/cache"
import * as wordpressApi from "@/lib/wordpress"
import { Property } from "@/app/types/property";

interface CreatePropertyData {
  title: string
  description: string
  propertyType: string
  bedrooms: string
  location: string
  floor?: string
  units?: string
  price: string
  currency: string
  paymentTerms: string
  amenities: string[]
  ownerName: string
  ownerContact: string
  googlePin?: string
  isPremium?: boolean
  squareMeters?: string
  images: File[]
}

export async function createProperty(data: CreatePropertyData) {
  try {
    console.log('Creating property with data:', data)
    const response = await wordpressApi.createProperty(data)
    console.log('Property created:', response)
    
    // Revalidate the properties page
    revalidatePath('/properties')
    
    return { success: true, data: response }
  } catch (error: any) {
    console.error('Error creating property:', error)
    return { 
      success: false, 
      error: error.message || 'Failed to create property' 
    }
  }
}

/**
 * Fetch properties with filters from WordPress
 */
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
  try {
    console.log('Server action: Fetching properties with filters:', options);
    const properties = await wordpressApi.getPropertiesWithFilters(options);
    console.log(`Successfully fetched ${properties.length} properties`);
    return properties;
  } catch (error: any) {
    console.error("Error in getPropertiesWithFilters:", error);
    
    // If we're in development mode, return some fallback data
    if (process.env.NODE_ENV === 'development') {
      console.log('Returning fallback property data for development');
      return [
        {
          id: 'fallback-1',
          title: 'Fallback Property 1',
          description: 'This is a fallback property shown when the WordPress API is not available.',
          location: 'Kampala, Uganda',
          price: '1500000',
          currency: 'UGX',
          bedrooms: '3',
          amenities: ['WiFi', 'Parking'],
          images: [],
          propertyType: 'apartment',
          error: error.message || 'WordPress API error'
        },
        {
          id: 'fallback-2',
          title: 'Fallback Property 2',
          description: 'This is a fallback property shown when the WordPress API is not available.',
          location: 'Entebbe, Uganda',
          price: '2500000',
          currency: 'UGX',
          bedrooms: '4',
          amenities: ['WiFi', 'Parking', 'Pool'],
          images: [],
          propertyType: 'house',
          error: error.message || 'WordPress API error'
        }
      ];
    }
    
    // In production, return an empty array
    return [];
  }
}

/**
 * Get a property by ID from WordPress
 */
export async function getPropertyById(id: string): Promise<Property | null> {
  console.log(`Server action: Fetching property with ID ${id}`);
  
  // The wordpress.js implementation now handles errors and returns a fallback property
  // object if the API call fails, so we don't need to do additional error handling here
  const property = await wordpressApi.getPropertyById(id);
  
  console.log(`Server action: Completed property fetch for ID ${id}`);
  return property;
}

/**
 * Increment property views
 */
export async function incrementPropertyViews(propertyId: string, userId?: string) {
  try {
    return await wordpressApi.incrementPropertyViews(propertyId, userId || '');
  } catch (error) {
    console.error("Error in incrementPropertyViews:", error);
    return { success: false, error: "Failed to increment property views" };
  }
}

/**
 * Save property to user's favorites
 */
export async function saveProperty(propertyId: string, userId: string) {
  try {
    return await wordpressApi.saveProperty(propertyId, userId);
  } catch (error) {
    console.error("Error in saveProperty:", error);
    return { success: false, error: "Failed to save property" };
  }
}

/**
 * Remove property from user's favorites
 */
export async function unsaveProperty(propertyId: string, userId: string) {
  try {
    return await wordpressApi.unsaveProperty(propertyId, userId);
  } catch (error) {
    console.error("Error in unsaveProperty:", error);
    return { success: false, error: "Failed to unsave property" };
  }
}

/**
 * Submit a property inquiry
 */
export async function submitInquiry(data: {
  propertyId: string
  agentId?: string
  userId?: string
  name: string
  email: string
  phone?: string
  message: string
}) {
  try {
    return await wordpressApi.submitInquiry(data);
  } catch (error) {
    console.error("Error in submitInquiry:", error);
    return { success: false, error: "Failed to submit inquiry" };
  }
}
