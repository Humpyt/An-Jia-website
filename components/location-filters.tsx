"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Filter, Home, Bed, Bath, DollarSign } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

// Define the props type
type PropertyFiltersProps = {
  currentFilters: {
    minPrice?: number
    maxPrice?: number
    bedrooms?: number
    bathrooms?: number
    propertyType?: string
  }
  locationName: string
}

export function LocationFilters({ currentFilters, locationName }: PropertyFiltersProps) {
  const router = useRouter()
  
  // Set up state for filters
  const [minPrice, setMinPrice] = useState<number>(currentFilters.minPrice || 0)
  const [maxPrice, setMaxPrice] = useState<number>(currentFilters.maxPrice || 5000)
  const [bedrooms, setBedrooms] = useState<string>(
    currentFilters.bedrooms ? currentFilters.bedrooms.toString() : 'any'
  )
  const [bathrooms, setBathrooms] = useState<string>(
    currentFilters.bathrooms ? currentFilters.bathrooms.toString() : 'any'
  )
  const [propertyType, setPropertyType] = useState<string>(
    currentFilters.propertyType || 'any'
  )
  
  // Handle filter application
  const applyFilters = () => {
    // Build query parameters
    const params = new URLSearchParams()
    
    if (minPrice > 0) {
      params.append('minPrice', minPrice.toString())
    }
    
    if (maxPrice < 5000) {
      params.append('maxPrice', maxPrice.toString())
    }
    
    if (bedrooms !== 'any') {
      params.append('bedrooms', bedrooms)
    }
    
    if (bathrooms !== 'any') {
      params.append('bathrooms', bathrooms)
    }
    
    if (propertyType !== 'any') {
      params.append('propertyType', propertyType)
    }
    
    // Navigate to the filtered URL
    router.push(`/location/${encodeURIComponent(locationName.toLowerCase())}?${params.toString()}`)
  }
  
  // Handle filter reset
  const resetFilters = () => {
    setMinPrice(0)
    setMaxPrice(5000)
    setBedrooms('any')
    setBathrooms('any')
    setPropertyType('any')
    
    // Navigate to the base URL without filters
    router.push(`/location/${encodeURIComponent(locationName.toLowerCase())}`)
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filter Properties
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div className="space-y-2">
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
            <Label>Price Range (USD)</Label>
          </div>
          <div className="pt-4 px-2">
            <Slider
              defaultValue={[minPrice, maxPrice]}
              min={0}
              max={5000}
              step={100}
              onValueChange={(values) => {
                setMinPrice(values[0])
                setMaxPrice(values[1])
              }}
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${minPrice}</span>
            <span>${maxPrice}</span>
          </div>
        </div>
        
        {/* Bedrooms */}
        <div className="space-y-2">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-2 text-muted-foreground" />
            <Label>Bedrooms</Label>
          </div>
          <Select value={bedrooms} onValueChange={setBedrooms}>
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Bathrooms */}
        <div className="space-y-2">
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-2 text-muted-foreground" />
            <Label>Bathrooms</Label>
          </div>
          <Select value={bathrooms} onValueChange={setBathrooms}>
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Property Type */}
        <div className="space-y-2">
          <div className="flex items-center">
            <Home className="h-4 w-4 mr-2 text-muted-foreground" />
            <Label>Property Type</Label>
          </div>
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
              <SelectItem value="office">Office</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col space-y-2 pt-4">
          <Button onClick={applyFilters}>Apply Filters</Button>
          <Button variant="outline" onClick={resetFilters}>Reset Filters</Button>
        </div>
      </CardContent>
    </Card>
  )
}
