"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export function ListPropertyForm() {
  const [formStep, setFormStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setFormStep(3) // Success state
    }, 1500)
  }

  return (
    <div>
      {formStep === 1 && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setFormStep(2)
          }}
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="property-type">Property Type</Label>
              <Select required>
                <SelectTrigger id="property-type" className="mt-1.5">
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

            <div>
              <Label htmlFor="title">Property Title</Label>
              <Input id="title" placeholder="e.g. Modern Apartment in Kololo" className="mt-1.5" required />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your property in detail..."
                className="mt-1.5 min-h-[100px]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Select required>
                  <SelectTrigger id="bedrooms" className="mt-1.5">
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

              <div>
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Select required>
                  <SelectTrigger id="bathrooms" className="mt-1.5">
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Monthly Rent</Label>
                <Input id="price" type="number" placeholder="e.g. 1200" className="mt-1.5" required />
              </div>

              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select defaultValue="USD" required>
                  <SelectTrigger id="currency" className="mt-1.5">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="UGX">UGX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full bg-rose-500 hover:bg-rose-600 text-white">
              Continue
            </Button>
          </div>
        </form>
      )}

      {formStep === 2 && (
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Select required>
                <SelectTrigger id="location" className="mt-1.5">
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

            <div>
              <Label htmlFor="address">Full Address</Label>
              <Input id="address" placeholder="Street address" className="mt-1.5" required />
            </div>

            <div>
              <Label className="mb-2 block">Amenities</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="wifi" />
                  <Label htmlFor="wifi" className="text-sm">
                    Wifi
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="parking" />
                  <Label htmlFor="parking" className="text-sm">
                    Parking
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="generator" />
                  <Label htmlFor="generator" className="text-sm">
                    Generator
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="security" />
                  <Label htmlFor="security" className="text-sm">
                    Security
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="pool" />
                  <Label htmlFor="pool" className="text-sm">
                    Swimming Pool
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="gym" />
                  <Label htmlFor="gym" className="text-sm">
                    Gym
                  </Label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="contact-name">Contact Name</Label>
              <Input id="contact-name" placeholder="Your name" className="mt-1.5" required />
            </div>

            <div>
              <Label htmlFor="contact-email">Contact Email</Label>
              <Input id="contact-email" type="email" placeholder="Your email" className="mt-1.5" required />
            </div>

            <div>
              <Label htmlFor="contact-phone">Contact Phone</Label>
              <Input id="contact-phone" placeholder="Your phone number" className="mt-1.5" required />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="terms" required />
              <Label htmlFor="terms" className="text-sm">
                I agree to the{" "}
                <a href="/terms" className="text-rose-500 hover:underline">
                  terms and conditions
                </a>
              </Label>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setFormStep(1)}>
                Back
              </Button>
              <Button type="submit" className="flex-1 bg-rose-500 hover:bg-rose-600 text-white" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Property"}
              </Button>
            </div>
          </div>
        </form>
      )}

      {formStep === 3 && (
        <div className="text-center py-6">
          <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Property Submitted Successfully!</h3>
          <p className="text-neutral-600 mb-6">
            Your property has been submitted for review. We'll notify you once it's approved and live on our platform.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" asChild>
              <a href="/dashboard">Go to Dashboard</a>
            </Button>
            <Button className="flex-1 bg-rose-500 hover:bg-rose-600 text-white" asChild>
              <a href="/list-property">List Another Property</a>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
