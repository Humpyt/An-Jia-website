"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export type InquiryData = {
  propertyId: string
  agentId?: string
  userId?: string
  name: string
  email: string
  phone?: string
  message: string
}

export async function getInquiries() {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("inquiries")
    .select(`
      *,
      properties(id, title)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching inquiries:", error)
    throw new Error("Failed to fetch inquiries")
  }

  return data || []
}

export async function submitInquiry(data: InquiryData) {
  const supabase = createServerClient()

  const { error } = await supabase.from("inquiries").insert({
    property_id: data.propertyId,
    agent_id: data.agentId || null,
    user_id: data.userId || null,
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    message: data.message,
  })

  if (error) {
    console.error("Error submitting inquiry:", error)
    throw new Error("Failed to submit inquiry")
  }

  return true
}

export async function getInquiriesByAgentId(agentId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("inquiries")
    .select(`
      *,
      properties(*)
    `)
    .eq("agent_id", agentId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching inquiries:", error)
    throw new Error("Failed to fetch inquiries")
  }

  return data || []
}

export async function getInquiriesByUserId(userId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("inquiries")
    .select(`
      *,
      properties(*)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching inquiries:", error)
    throw new Error("Failed to fetch inquiries")
  }

  return data || []
}

export async function updateInquiryStatus(inquiryId: string, status: "new" | "contacted" | "resolved" | "archived") {
  const supabase = createServerClient()

  const { error } = await supabase
    .from("inquiries")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", inquiryId)

  if (error) {
    console.error("Error updating inquiry status:", error)
    throw new Error("Failed to update inquiry status")
  }

  revalidatePath("/dashboard/inquiries")
  return true
}
