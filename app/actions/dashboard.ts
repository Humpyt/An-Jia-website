"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function getDashboardStats() {
  const supabase = createServerClient()

  // Get total properties count
  const { count: propertiesCount, error: propertiesError } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true })

  if (propertiesError) {
    console.error("Error fetching properties count:", propertiesError)
    throw new Error("Failed to fetch properties count")
  }

  // Get total views count
  const { data: viewsData, error: viewsError } = await supabase.from("properties").select("views").eq("active", true)

  if (viewsError) {
    console.error("Error fetching views:", viewsError)
    throw new Error("Failed to fetch views")
  }

  const totalViews = viewsData.reduce((sum, property) => sum + (property.views || 0), 0)

  // Get total inquiries count
  const { count: inquiriesCount, error: inquiriesError } = await supabase
    .from("inquiries")
    .select("*", { count: "exact", head: true })

  if (inquiriesError) {
    console.error("Error fetching inquiries count:", inquiriesError)
    throw new Error("Failed to fetch inquiries count")
  }

  // Get recent inquiries (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const thirtyDaysAgoStr = thirtyDaysAgo.toISOString()

  const { count: recentInquiriesCount, error: recentInquiriesError } = await supabase
    .from("inquiries")
    .select("*", { count: "exact", head: true })
    .gte("created_at", thirtyDaysAgoStr)

  if (recentInquiriesError) {
    console.error("Error fetching recent inquiries:", recentInquiriesError)
    throw new Error("Failed to fetch recent inquiries")
  }

  // Get views growth (compare current month to previous month)
  const currentMonth = new Date()
  const previousMonth = new Date()
  previousMonth.setMonth(previousMonth.getMonth() - 1)

  const currentMonthStr = currentMonth.toISOString().slice(0, 7) // YYYY-MM
  const previousMonthStr = previousMonth.toISOString().slice(0, 7) // YYYY-MM

  const { data: currentMonthViews, error: currentMonthError } = await supabase
    .from("property_views")
    .select("*", { count: "exact" })
    .like("viewed_at", `${currentMonthStr}%`)

  if (currentMonthError) {
    console.error("Error fetching current month views:", currentMonthError)
    throw new Error("Failed to fetch current month views")
  }

  const { data: previousMonthViews, error: previousMonthError } = await supabase
    .from("property_views")
    .select("*", { count: "exact" })
    .like("viewed_at", `${previousMonthStr}%`)

  if (previousMonthError) {
    console.error("Error fetching previous month views:", previousMonthError)
    throw new Error("Failed to fetch previous month views")
  }

  const viewsGrowth =
    previousMonthViews.length > 0
      ? ((currentMonthViews.length - previousMonthViews.length) / previousMonthViews.length) * 100
      : 100

  return {
    propertiesCount: propertiesCount || 0,
    totalViews,
    inquiriesCount: inquiriesCount || 0,
    recentInquiries: recentInquiriesCount || 0,
    viewsGrowth: Math.round(viewsGrowth),
  }
}

export async function getPropertyViewsData() {
  const supabase = createServerClient()

  // Get the last 30 days
  const dates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().slice(0, 10) // YYYY-MM-DD
  }).reverse()

  // Get views for each day
  const viewsPromises = dates.map(async (date) => {
    const { data, error } = await supabase
      .from("property_views")
      .select("*", { count: "exact" })
      .like("viewed_at", `${date}%`)

    if (error) {
      console.error(`Error fetching views for ${date}:`, error)
      return { date, count: 0 }
    }

    return { date, count: data.length }
  })

  const viewsData = await Promise.all(viewsPromises)

  return viewsData
}

export async function getInquiriesData() {
  const supabase = createServerClient()

  // Get the last 30 days
  const dates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().slice(0, 10) // YYYY-MM-DD
  }).reverse()

  // Get inquiries for each day
  const inquiriesPromises = dates.map(async (date) => {
    const { data, error } = await supabase
      .from("inquiries")
      .select("*", { count: "exact" })
      .like("created_at", `${date}%`)

    if (error) {
      console.error(`Error fetching inquiries for ${date}:`, error)
      return { date, count: 0 }
    }

    return { date, count: data.length }
  })

  const inquiriesData = await Promise.all(inquiriesPromises)

  return inquiriesData
}

export async function getPopularProperties(limit = 5) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("properties")
    .select(`
      id,
      title,
      views,
      property_images!inner(id, image_url, is_primary)
    `)
    .eq("active", true)
    .order("views", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching popular properties:", error)
    throw new Error("Failed to fetch popular properties")
  }

  return data
}

export async function getLocationDistribution() {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("properties").select("location").eq("active", true)

  if (error) {
    console.error("Error fetching location distribution:", error)
    throw new Error("Failed to fetch location distribution")
  }

  // Count properties by location
  const locationCounts = data.reduce((acc: Record<string, number>, property) => {
    const location = property.location.split(",")[0].trim() // Get the first part of the location (e.g., "Kololo" from "Kololo, Kampala")
    acc[location] = (acc[location] || 0) + 1
    return acc
  }, {})

  // Convert to array of objects
  return Object.entries(locationCounts).map(([name, value]) => ({ name, value }))
}

export async function getRecentInquiries(limit = 5) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("inquiries")
    .select(`
      *,
      properties(id, title)
    `)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching recent inquiries:", error)
    throw new Error("Failed to fetch recent inquiries")
  }

  return data
}
