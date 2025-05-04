"use client"

import React, { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Building, Home, Hotel, Landmark, MapPin, Search, Store } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/components/language-switcher"

// Property type options with icons
const propertyTypes = [
  { id: "apartment", name: "apartment", icon: Building },
  { id: "house", name: "house", icon: Home },
  { id: "land", name: "land", icon: Landmark },
  { id: "hotel", name: "hotel", icon: Hotel },
  { id: "commercial", name: "commercial", icon: Store }
]

export function SearchBar() {
  const router = useRouter()
  const { translate } = useLanguage()
  const [location, setLocation] = useState("")
  const [propertyType, setPropertyType] = useState("")

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()

    // Build query parameters
    const params = new URLSearchParams()

    if (location) {
      params.append("location", location)
    }

    if (propertyType) {
      params.append("propertyType", propertyType)
    }

    // Navigate to the search page with search parameters
    // Use window.location.href for consistent navigation behavior
    window.location.href = `/search?${params.toString()}`
  }

  return (
    <form onSubmit={handleSearch} className="bg-white rounded-full p-2 shadow-lg flex flex-col md:flex-row">
      <div className="relative flex-1 min-w-0">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-neutral-400" />
        </div>
        <Input
          type="text"
          placeholder={translate("location") || "Where are you looking?"}
          className="h-12 pl-10 pr-4 rounded-full border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-black"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className="border-l border-neutral-200 hidden md:block" />

      {/* Property Type Selector */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className={cn(
              "h-12 px-4 text-left font-normal flex justify-start items-center gap-2 rounded-full hover:bg-neutral-100",
              !propertyType && "text-neutral-500",
            )}
          >
            {propertyType ? (
              <>
                {propertyTypes.find(pt => pt.id === propertyType)?.icon &&
                  React.createElement(
                    propertyTypes.find(pt => pt.id === propertyType)?.icon || Building,
                    { className: "h-5 w-5 text-neutral-400" }
                  )
                }
                <span>{translate(propertyType) || propertyType}</span>
              </>
            ) : (
              <>
                <Building className="h-5 w-5 text-neutral-400" />
                <span>{translate("property_type") || "Property type"}</span>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60 p-2" align="start">
          <div className="space-y-2">
            {propertyTypes.map((type) => (
              <Button
                key={type.id}
                type="button"
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  propertyType === type.id && "bg-neutral-100"
                )}
                onClick={() => setPropertyType(type.id)}
              >
                <type.icon className="h-5 w-5 mr-2 text-neutral-500" />
                <span>{translate(type.name) || type.name}</span>
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>



      <Button
        type="submit"
        className="h-12 px-6 rounded-full bg-rose-500 hover:bg-rose-600 text-white ml-2"
      >
        <Search className="h-5 w-5 md:mr-2" />
        <span className="hidden md:inline">{translate("search") || "Search"}</span>
      </Button>
    </form>
  )
}
