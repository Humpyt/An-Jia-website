"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Upload } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"

export default function AddPropertyPage() {
  const [images, setImages] = useState<string[]>([])
  const [amenities, setAmenities] = useState<string[]>([])

  const handleAmenityChange = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter((a) => a !== amenity))
    } else {
      setAmenities([...amenities, amenity])
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            KampalaStay
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">View Website</Link>
            </Button>
          </div>
        </div>
      </header>
      <div className="flex-1 container grid md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr] gap-8 py-8">
        <aside className="hidden md:block">
          <DashboardNav />
        </aside>
        <main className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Add New Property</h1>
          </div>
          <form className="grid gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the basic details about your property</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="title">Property Title</Label>
                  <Input id="title" placeholder="e.g. Modern Apartment in Kololo" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your property in detail..."
                    className="min-h-[120px]"
                  />
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="grid gap-3">
                    <Label htmlFor="property-type">Property Type</Label>
                    <Select>
                      <SelectTrigger id="property-type">
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="condo">Condominium</SelectItem>
                        <SelectItem value="studio">Studio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="location">Location</Label>
                    <Select>
                      <SelectTrigger id="location">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kololo">Kololo</SelectItem>
                        <SelectItem value="naguru">Naguru</SelectItem>
                        <SelectItem value="bukoto">Bukoto</SelectItem>
                        <SelectItem value="muyenga">Muyenga</SelectItem>
                        <SelectItem value="ntinda">Ntinda</SelectItem>
                        <SelectItem value="bugolobi">Bugolobi</SelectItem>
                        <SelectItem value="nakasero">Nakasero</SelectItem>
                        <SelectItem value="kira">Kira</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
                <CardDescription>Provide specific details about your property</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="grid gap-3">
                    <Label htmlFor="price">Price (per month)</Label>
                    <Input id="price" type="number" placeholder="e.g. 1200" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="currency">Currency</Label>
                    <Select defaultValue="USD">
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="UGX">UGX</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Select>
                      <SelectTrigger id="bedrooms">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5+">5+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Select>
                      <SelectTrigger id="bathrooms">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5+">5+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="size">Size (square meters)</Label>
                  <Input id="size" type="number" placeholder="e.g. 120" />
                </div>
                <Separator />
                <div className="grid gap-3">
                  <Label>Amenities</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="wifi"
                        checked={amenities.includes("Wifi")}
                        onCheckedChange={() => handleAmenityChange("Wifi")}
                      />
                      <Label htmlFor="wifi">Wifi</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="parking"
                        checked={amenities.includes("Parking")}
                        onCheckedChange={() => handleAmenityChange("Parking")}
                      />
                      <Label htmlFor="parking">Parking</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="generator"
                        checked={amenities.includes("Generator")}
                        onCheckedChange={() => handleAmenityChange("Generator")}
                      />
                      <Label htmlFor="generator">Generator</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="security"
                        checked={amenities.includes("Security")}
                        onCheckedChange={() => handleAmenityChange("Security")}
                      />
                      <Label htmlFor="security">Security</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="pool"
                        checked={amenities.includes("Swimming Pool")}
                        onCheckedChange={() => handleAmenityChange("Swimming Pool")}
                      />
                      <Label htmlFor="pool">Swimming Pool</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="gym"
                        checked={amenities.includes("Gym")}
                        onCheckedChange={() => handleAmenityChange("Gym")}
                      />
                      <Label htmlFor="gym">Gym</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Images & Media</CardTitle>
                <CardDescription>Upload images of your property</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="images">Property Images</Label>
                    <div className="border border-dashed rounded-lg p-8 text-center">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Drag and drop your images here, or click to browse
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Supported formats: JPG, PNG, WEBP. Max 10MB each.
                      </p>
                      <Button variant="outline" className="mt-4">
                        Upload Images
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="map">Google Maps Location</Label>
                    <Input id="map" placeholder="Paste Google Maps URL" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-end gap-4">
              <Button variant="outline">Save as Draft</Button>
              <Button>Publish Property</Button>
            </div>
          </form>
        </main>
      </div>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col md:flex-row justify-between gap-4 md:h-16 md:items-center">
          <p className="text-sm text-muted-foreground">© 2025 KampalaStay. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:underline">
              Terms
            </Link>
            <Link href="#" className="hover:underline">
              Privacy
            </Link>
            <Link href="#" className="hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
