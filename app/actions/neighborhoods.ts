"use server"

import { dataService } from "@/lib/data-service"

export async function getNeighborhoods() {
  const { data: neighborhoods, error } = await dataService.neighborhoods.getAll()
  if (error) throw new Error('Failed to fetch neighborhoods')
  return neighborhoods
}

export async function getNeighborhoodById(id: string) {
  const { data: neighborhood, error } = await dataService.neighborhoods.getById(id)
  if (error) throw new Error('Failed to fetch neighborhood')
  return neighborhood
}
