"use client"

import { cn } from "@/lib/utils"
import { Building, Home, Landmark, Hotel, Store } from "lucide-react"
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
  const { translate } = useLanguage()

  return (
    <section className="py-10 bg-neutral-50">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categoryButtons.map((category) => (
              <div
                key={category.id}
                className="flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 bg-white border border-neutral-200 hover:border-rose-300 hover:bg-rose-50 shadow-sm hover:shadow-md transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-rose-50 mb-3 transition-all duration-300 hover:bg-rose-100">
                  <category.icon className="h-6 w-6 text-rose-500" />
                </div>
                <span className="font-medium capitalize text-neutral-800">{translate(category.name)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
