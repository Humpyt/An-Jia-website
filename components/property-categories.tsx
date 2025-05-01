"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Building, Home, Landmark, Hotel, Store } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useLanguage } from "@/components/language-switcher"

// Define categories with icons and labels
const categoryButtons = [
  {
    id: "apartment",
    name: "apartment",
    icon: Building
  },
  {
    id: "house",
    name: "house",
    icon: Home
  },
  {
    id: "land",
    name: "land",
    icon: Landmark
  },
  {
    id: "hotel",
    name: "hotel",
    icon: Hotel
  },
  {
    id: "commercial",
    name: "commercial",
    icon: Store
  }
]

export function PropertyCategories() {
  const [activeCategory, setActiveCategory] = useState("all")
  const { translate } = useLanguage()
  const searchParams = useSearchParams()

  // Set active category based on URL parameters on load
  useEffect(() => {
    const propertyType = searchParams.get('propertyType')
    if (propertyType) {
      setActiveCategory(propertyType)
    }
  }, [searchParams])

  return (
    <section className="py-8">
      <div className="container">
        <h2 className="text-2xl font-bold mb-6">{translate("browse_by_category")}</h2>
        <div className="relative">
          <div className="flex overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
            <div className="flex gap-3">
              <Button
                key="all"
                variant="outline"
                className={cn(
                  "flex flex-col h-auto py-3 px-4 rounded-xl border-neutral-200 hover:border-neutral-300 shadow-sm",
                  activeCategory === "all" && "border-rose-500 bg-rose-50 text-rose-500 hover:border-rose-500",
                )}
                onClick={() => {
                  setActiveCategory("all")
                  const params = new URLSearchParams(window.location.search)
                  params.delete('propertyType')
                  window.location.href = `${window.location.pathname}?${params.toString()}`
                }}
              >
                <span className="text-xs font-medium">{translate("all")}</span>
              </Button>
              {categoryButtons.map((category) => (
                <Button
                  key={category.id}
                  variant="outline"
                  className={cn(
                    "flex flex-col h-auto py-3 px-4 rounded-xl border-neutral-200 hover:border-neutral-300 shadow-sm",
                    activeCategory === category.id && "border-rose-500 bg-rose-50 text-rose-500 hover:border-rose-500",
                  )}
                  onClick={() => {
                    setActiveCategory(category.id)
                    // Update URL with property type filter
                    const params = new URLSearchParams(window.location.search)
                    params.set('propertyType', category.id)
                    window.location.href = `${window.location.pathname}?${params.toString()}`
                  }}
                >
                  <category.icon className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">{translate(category.name)}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
