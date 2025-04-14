"use server"

import { dataService } from "@/lib/data-service"

export async function getProperties() {
  const { data: properties, error } = await dataService.properties.getAll()
  if (error) throw new Error('Failed to fetch properties')
  return properties
}

export async function getPropertyById(id: string) {
  const { data: property, error } = await dataService.properties.getById(id)
  if (error) throw new Error('Failed to fetch property')
  return property
}

export async function searchProperties(query: string) {
  const { data: properties, error } = await dataService.properties.search(query)
  if (error) throw new Error('Failed to search properties')
  return properties
}
