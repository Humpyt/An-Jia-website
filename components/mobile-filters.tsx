"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Filter, Search, Bed, Bath, Wifi, Car, Zap, Shield } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function MobileFilters() {
  const [priceRange, setPriceRange] = useState([0, 5000])

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Search locations, properties..." className="pl-8" />
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh]">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="grid gap-6 py-4">
            <div>
              <h3 className="text-sm font-medium mb-3">Bedrooms</h3>
              <Select defaultValue="any">
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Bed className="h-4 w-4" />
                    <SelectValue placeholder="Beds" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any beds</SelectItem>
                  <SelectItem value="1">1+ bed</SelectItem>
                  <SelectItem value="2">2+ beds</SelectItem>
                  <SelectItem value="3">3+ beds</SelectItem>
                  <SelectItem value="4">4+ beds</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-3">Bathrooms</h3>
              <Select defaultValue="any">
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Bath className="h-4 w-4" />
                    <SelectValue placeholder="Baths" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any baths</SelectItem>
                  <SelectItem value="1">1+ bath</SelectItem>
                  <SelectItem value="2">2+ baths</SelectItem>
                  <SelectItem value="3">3+ baths</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium">Price Range (USD)</h3>
                <span className="text-sm text-muted-foreground">
                  ${priceRange[0]} - ${priceRange[1]}
                </span>
              </div>
              <Slider defaultValue={[0, 5000]} max={5000} step={100} value={priceRange} onValueChange={setPriceRange} />
            </div>
            <div>
              <h3 className="text-sm font-medium mb-3">Amenities</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="mobile-wifi" />
                  <Label htmlFor="mobile-wifi" className="flex items-center text-sm">
                    <Wifi className="h-3.5 w-3.5 mr-1.5" /> Wifi
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="mobile-parking" />
                  <Label htmlFor="mobile-parking" className="flex items-center text-sm">
                    <Car className="h-3.5 w-3.5 mr-1.5" /> Parking
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="mobile-generator" />
                  <Label htmlFor="mobile-generator" className="flex items-center text-sm">
                    <Zap className="h-3.5 w-3.5 mr-1.5" /> Generator
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="mobile-security" />
                  <Label htmlFor="mobile-security" className="flex items-center text-sm">
                    <Shield className="h-3.5 w-3.5 mr-1.5" /> Security
                  </Label>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Button variant="outline">Reset</Button>
              <Button>Apply Filters</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
