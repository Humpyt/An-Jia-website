"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface PropertyData {
  title: string
  description?: string
  location: string
  neighborhood?: string
  price: number
  currency: "UGX" | "USD"
  bedrooms: number
  bathrooms: number
  size?: number
  amenities?: string[]
  features?: string[]
  is_premium?: boolean
  status?: "active" | "draft" | "archived"
}

export async function createProperty(data: PropertyData) {
  const supabase = createServerClient()

  try {
    const { data: property, error } = await supabase
      .from("properties")
      .insert({
        title: data.title,
        description: data.description || null,
        location: data.location,
        neighborhood: data.neighborhood || null,
        price: data.price,
        currency: data.currency,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        size: data.size || null,
        amenities: data.amenities || [],
        features: data.features || [],
        is_premium: data.is_premium || false,
        views: 0,
        active: true,
        status: data.status || "active",
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create property: ${error.message}`)
    }

    revalidatePath("/dashboard/properties")
    revalidatePath("/properties")
    return { success: true, property }
  } catch (error) {
    console.error("Error creating property:", error)
    return { success: false, error: (error as Error).message }
  }
}

export async function updateProperty(id: string, data: Partial<PropertyData>) {
  const supabase = createServerClient()

  try {
    const { data: property, error } = await supabase
      .from("properties")
      .update({
        title: data.title,
        description: data.description,
        location: data.location,
        neighborhood: data.neighborhood,
        price: data.price,
        currency: data.currency,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        size: data.size,
        amenities: data.amenities,
        features: data.features,
        is_premium: data.is_premium,
        status: data.status,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update property: ${error.message}`)
    }

    revalidatePath(`/dashboard/properties/${id}`)
    revalidatePath(`/properties/${id}`)
    revalidatePath("/dashboard/properties")
    revalidatePath("/properties")
    return { success: true, property }
  } catch (error) {
    console.error("Error updating property:", error)
    return { success: false, error: (error as Error).message }
  }
}

export async function deleteProperty(id: string) {
  const supabase = createServerClient()

  try {
    // First delete property images
    const { error: imagesError } = await supabase.from("property_images").delete().eq("property_id", id)

    if (imagesError) {
      throw new Error(`Failed to delete property images: ${imagesError.message}`)
    }

    // Then delete the property
    const { error } = await supabase.from("properties").delete().eq("id", id)

    if (error) {
      throw new Error(`Failed to delete property: ${error.message}`)
    }

    revalidatePath("/dashboard/properties")
    revalidatePath("/properties")
    return { success: true }
  } catch (error) {
    console.error("Error deleting property:", error)
    return { success: false, error: (error as Error).message }
  }
}
