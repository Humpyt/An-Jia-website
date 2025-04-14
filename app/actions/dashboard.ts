"use server"

import { dataService } from "@/lib/data-service"

export async function getDashboardStats() {
  const { data: properties } = await dataService.properties.getAll()
  const { data: inquiries } = await dataService.inquiries.getAll()
  
  return {
    totalProperties: properties?.length || 0,
    activeProperties: properties?.filter(p => p.active).length || 0,
    totalInquiries: inquiries?.length || 0,
    totalViews: properties?.reduce((sum, p) => sum + (p.views || 0), 0) || 0
  }
}

export async function getPropertyViewsData() {
  const { data: properties } = await dataService.properties.getAll()
  
  return properties?.map(p => ({
    title: p.title,
    views: p.views || 0
  })) || []
}

export async function getInquiriesData() {
  const { data: inquiries } = await dataService.inquiries.getAll()
  
  return inquiries || []
}

export async function getPopularProperties(limit = 5) {
  const { data: properties } = await dataService.properties.getAll()
  
  return properties
    ?.sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, limit) || []
}

export async function getLocationDistribution() {
  const { data: properties } = await dataService.properties.getAll()
  
  const distribution = properties?.reduce((acc: Record<string, number>, p) => {
    const location = p.location.split(',')[0].trim()
    acc[location] = (acc[location] || 0) + 1
    return acc
  }, {})

  return Object.entries(distribution || {}).map(([location, count]) => ({
    location,
    count
  }))
}

export async function getRecentInquiries(limit = 5) {
  const { data: inquiries } = await dataService.inquiries.getAll()
  
  return inquiries
    ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit) || []
}
