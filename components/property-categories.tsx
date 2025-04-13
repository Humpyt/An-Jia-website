"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Building, Home, Star, Wifi, Shield, Zap, Droplets, Dumbbell, Car, Landmark, Hotel } from "lucide-react"
import { categories } from "@/lib/property-data"

// Extend categories with icons and additional amenity filters
const categoryButtons = [
  {
    id: "all",
    name: "All",
    icon: Home,
    count: categories.reduce((sum, category) => sum + category.count, 0)
  },
  {
    id: "premium",
    name: "Premium",
    icon: Star,
  },
  {
    id: "apartments",
    name: "Apartments",
    icon: Building,
    count: categories.find(c => c.id === "apartments")?.count
  },
  {
    id: "houses",
    name: "Houses",
    icon: Home,
    count: categories.find(c => c.id === "houses")?.count
  },
  {
    id: "land",
    name: "Land",
    icon: Landmark,
    count: categories.find(c => c.id === "land")?.count
  },
  {
    id: "hotels",
    name: "Hotels",
    icon: Hotel,
    count: categories.find(c => c.id === "hotels")?.count
  },
  {
    id: "wifi",
    name: "Fast Wifi",
    icon: Wifi,
  },
  {
    id: "security",
    name: "24/7 Security",
    icon: Shield,
  },
  {
    id: "generator",
    name: "Generator",
    icon: Zap,
  },
  {
    id: "pool",
    name: "Swimming Pool",
    icon: Droplets,
  },
  {
    id: "gym",
    name: "Gym",
    icon: Dumbbell,
  },
  {
    id: "parking",
    name: "Parking",
    icon: Car,
  },
]

export function PropertyCategories() {
  const [activeCategory, setActiveCategory] = useState("all")

  return (
    <section className="py-8">
      <div className="container">
        <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
        <div className="relative">
          <div className="flex overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
            <div className="flex gap-3">
              {categoryButtons.map((category) => (
                <Button
                  key={category.id}
                  variant="outline"
                  className={cn(
                    "flex flex-col h-auto py-3 px-4 rounded-xl border-neutral-200 hover:border-neutral-300 shadow-sm",
                    activeCategory === category.id && "border-rose-500 bg-rose-50 text-rose-500 hover:border-rose-500",
                  )}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <category.icon className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">{category.name}</span>
                  {category.count && (
                    <span className="text-xs text-muted-foreground mt-1">({category.count})</span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
