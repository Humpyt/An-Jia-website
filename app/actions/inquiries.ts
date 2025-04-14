"use server"

import { dataService } from "@/lib/data-service"

export async function createInquiry(data: {
  property_id: string
  name: string
  email: string
  message: string
}) {
  const { data: inquiry, error } = await dataService.inquiries.create(data)
  if (error) throw new Error('Failed to create inquiry')
  return inquiry
}

export async function getInquiries() {
  const { data: inquiries, error } = await dataService.inquiries.getAll()
  if (error) throw new Error('Failed to fetch inquiries')
  return inquiries
}
