"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function getNeighborhoods() {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("neighborhoods").select("*").order("name")

  if (error) {
    console.error("Error fetching neighborhoods:", error)
    throw new Error("Failed to fetch neighborhoods")
  }

  return data
}

export async function getNeighborhoodBySlug(slug: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("neighborhoods").select("*").eq("slug", slug).single()

  if (error) {
    console.error("Error fetching neighborhood:", error)
    throw new Error("Failed to fetch neighborhood")
  }

  return data
}

export async function getPropertiesByNeighborhood(neighborhoodName: string, limit = 6) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("properties")
    .select(`
      *,
      property_images!inner(id, image_url, is_primary),
      agents(id, name, email, phone, company, profile_image_url)
    `)
    .eq("neighborhood", neighborhoodName)
    .eq("active", true)
    .eq("status", "active")
    .order("is_premium", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching properties by neighborhood:", error)
    throw new Error("Failed to fetch properties by neighborhood")
  }

  return data
}
