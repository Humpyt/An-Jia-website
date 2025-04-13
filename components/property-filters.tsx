"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Bed, Bath, Wifi, Car, Zap, Shield, Dumbbell, Droplets, X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function PropertyFilters() {
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [bedrooms, setBedrooms] = useState<number | null>(null)
  const [bathrooms, setBathrooms] = useState<number | null>(null)

  const handleAmenityChange = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity))
    } else {
      setSelectedAmenities([...selectedAmenities, amenity])
    }
  }

  const handleLocationChange = (location: string) => {
    if (selectedLocations.includes(location)) {
      setSelectedLocations(selectedLocations.filter((l) => l !== location))
    } else {
      setSelectedLocations([...selectedLocations, location])
    }
  }

  const clearFilters = () => {
    setPriceRange([0, 5000])
    setSelectedAmenities([])
    setSelectedLocations([])
    setBedrooms(null)
    setBathrooms(null)
  }

  const hasActiveFilters = () => {
    return (
      selectedAmenities.length > 0 ||
      selectedLocations.length > 0 ||
      priceRange[0] > 0 ||
      priceRange[1] < 5000 ||
      bedrooms !== null ||
      bathrooms !== null
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-full p-1 shadow-lg flex flex-wrap md:flex-nowrap">
        <div className="relative flex-1 min-w-0">
          <Input
            type="text"
            placeholder="Search by location or property name"
            className="h-12 rounded-full border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 pl-4"
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="h-12 px-4 rounded-full hover:bg-neutral-100 flex gap-2">
              <Bed className="h-5 w-5 text-neutral-500" />
              <span>{bedrooms ? `${bedrooms}+ beds` : "Any beds"}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-4" align="start">
            <div className="space-y-4">
              <h4 className="font-medium">Bedrooms</h4>
              <div className="flex gap-2">
                <Button
                  variant={bedrooms === null ? "default" : "outline"}
                  size="sm"
                  className={bedrooms === null ? "bg-rose-500 hover:bg-rose-600" : ""}
                  onClick={() => setBedrooms(null)}
                >
                  Any
                </Button>
                {[1, 2, 3, 4, 5].map((num) => (
                  <Button
                    key={num}
                    variant={bedrooms === num ? "default" : "outline"}
                    size="sm"
                    className={bedrooms === num ? "bg-rose-500 hover:bg-rose-600" : ""}
                    onClick={() => setBedrooms(num)}
                  >
                    {num}+
                  </Button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="h-12 px-4 rounded-full hover:bg-neutral-100 flex gap-2">
              <Bath className="h-5 w-5 text-neutral-500" />
              <span>{bathrooms ? `${bathrooms}+ baths` : "Any baths"}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-4" align="start">
            <div className="space-y-4">
              <h4 className="font-medium">Bathrooms</h4>
              <div className="flex gap-2">
                <Button
                  variant={bathrooms === null ? "default" : "outline"}
                  size="sm"
                  className={bathrooms === null ? "bg-rose-500 hover:bg-rose-600" : ""}
                  onClick={() => setBathrooms(null)}
                >
                  Any
                </Button>
                {[1, 2, 3, 4].map((num) => (
                  <Button
                    key={num}
                    variant={bathrooms === num ? "default" : "outline"}
                    size="sm"
                    className={bathrooms === num ? "bg-rose-500 hover:bg-rose-600" : ""}
                    onClick={() => setBathrooms(num)}
                  >
                    {num}+
                  </Button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="h-12 px-4 rounded-full hover:bg-neutral-100 flex gap-2">
              <span>Price</span>
              {(priceRange[0] > 0 || priceRange[1] < 5000) && (
                <Badge className="bg-rose-500 hover:bg-rose-600 ml-1">
                  ${priceRange[0]} - ${priceRange[1]}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="start">
            <div className="space-y-4">
              <h4 className="font-medium">Price Range (USD)</h4>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">${priceRange[0]}</span>
                <span className="text-sm text-neutral-500">${priceRange[1]}</span>
              </div>
              <Slider defaultValue={[0, 5000]} max={5000} step={100} value={priceRange} onValueChange={setPriceRange} />
              <div className="flex justify-between gap-4">
                <div className="flex-1">
                  <Input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number.parseInt(e.target.value), priceRange[1]])}
                    className="h-9"
                  />
                </div>
                <div className="flex items-center">-</div>
                <div className="flex-1">
                  <Input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                    className="h-9"
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="h-12 px-4 rounded-full hover:bg-neutral-100 flex gap-2">
              <span>More filters</span>
              {selectedAmenities.length > 0 && (
                <Badge className="bg-rose-500 hover:bg-rose-600 ml-1">{selectedAmenities.length}</Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[340px] p-4" align="start">
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Amenities</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="wifi"
                      checked={selectedAmenities.includes("Wifi")}
                      onCheckedChange={() => handleAmenityChange("Wifi")}
                    />
                    <Label htmlFor="wifi" className="flex items-center text-sm">
                      <Wifi className="h-3.5 w-3.5 mr-1.5" /> Wifi
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="parking"
                      checked={selectedAmenities.includes("Parking")}
                      onCheckedChange={() => handleAmenityChange("Parking")}
                    />
                    <Label htmlFor="parking" className="flex items-center text-sm">
                      <Car className="h-3.5 w-3.5 mr-1.5" /> Parking
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="generator"
                      checked={selectedAmenities.includes("Generator")}
                      onCheckedChange={() => handleAmenityChange("Generator")}
                    />
                    <Label htmlFor="generator" className="flex items-center text-sm">
                      <Zap className="h-3.5 w-3.5 mr-1.5" /> Generator
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="security"
                      checked={selectedAmenities.includes("Security")}
                      onCheckedChange={() => handleAmenityChange("Security")}
                    />
                    <Label htmlFor="security" className="flex items-center text-sm">
                      <Shield className="h-3.5 w-3.5 mr-1.5" /> Security
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pool"
                      checked={selectedAmenities.includes("Swimming Pool")}
                      onCheckedChange={() => handleAmenityChange("Swimming Pool")}
                    />
                    <Label htmlFor="pool" className="flex items-center text-sm">
                      <Droplets className="h-3.5 w-3.5 mr-1.5" /> Pool
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="gym"
                      checked={selectedAmenities.includes("Gym")}
                      onCheckedChange={() => handleAmenityChange("Gym")}
                    />
                    <Label htmlFor="gym" className="flex items-center text-sm">
                      <Dumbbell className="h-3.5 w-3.5 mr-1.5" /> Gym
                    </Label>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Locations</h4>
                <div className="grid grid-cols-2 gap-3">
                  {["Kololo", "Naguru", "Bukoto", "Muyenga", "Ntinda", "Bugolobi"].map((location) => (
                    <div key={location} className="flex items-center space-x-2">
                      <Checkbox
                        id={`location-${location.toLowerCase()}`}
                        checked={selectedLocations.includes(location)}
                        onCheckedChange={() => handleLocationChange(location)}
                      />
                      <Label htmlFor={`location-${location.toLowerCase()}`} className="text-sm">
                        {location}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Button className="h-12 px-6 rounded-full bg-rose-500 hover:bg-rose-600 text-white ml-1">Search</Button>
      </div>

      {/* Active filters */}
      {hasActiveFilters() && (
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {bedrooms !== null && (
            <Badge variant="outline" className="rounded-full px-3 py-1 flex items-center gap-1 bg-white">
              {bedrooms}+ beds
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 hover:bg-transparent p-0"
                onClick={() => setBedrooms(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {bathrooms !== null && (
            <Badge variant="outline" className="rounded-full px-3 py-1 flex items-center gap-1 bg-white">
              {bathrooms}+ baths
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 hover:bg-transparent p-0"
                onClick={() => setBathrooms(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {(priceRange[0] > 0 || priceRange[1] < 5000) && (
            <Badge variant="outline" className="rounded-full px-3 py-1 flex items-center gap-1 bg-white">
              ${priceRange[0]} - ${priceRange[1]}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 hover:bg-transparent p-0"
                onClick={() => setPriceRange([0, 5000])}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {selectedLocations.map((location) => (
            <Badge key={location} variant="outline" className="rounded-full px-3 py-1 flex items-center gap-1 bg-white">
              {location}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 hover:bg-transparent p-0"
                onClick={() => handleLocationChange(location)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}

          {selectedAmenities.map((amenity) => (
            <Badge key={amenity} variant="outline" className="rounded-full px-3 py-1 flex items-center gap-1 bg-white">
              {amenity}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 hover:bg-transparent p-0"
                onClick={() => handleAmenityChange(amenity)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}

          <Button
            variant="ghost"
            size="sm"
            className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 ml-auto"
            onClick={clearFilters}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}
