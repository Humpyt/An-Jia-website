"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useLanguage } from "@/components/language-switcher"

export function ListPropertyForm() {
  const [formStep, setFormStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { translate } = useLanguage()

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
              <Label htmlFor="property-type">{translate("property_type")}</Label>
              <Select required>
                <SelectTrigger id="property-type" className="mt-1.5">
                  <SelectValue placeholder={translate("select_property_type")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">{translate("apartment")}</SelectItem>
                  <SelectItem value="house">{translate("house")}</SelectItem>
                  <SelectItem value="villa">{translate("villa")}</SelectItem>
                  <SelectItem value="condominium">{translate("condominium")}</SelectItem>
                  <SelectItem value="studio">{translate("studio")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="title">{translate("property_title")}</Label>
              <Input id="title" placeholder={translate("property_title_placeholder")} className="mt-1.5" required />
            </div>

            <div>
              <Label htmlFor="description">{translate("property_description")}</Label>
              <Textarea
                id="description"
                placeholder={translate("property_description_placeholder")}
                className="mt-1.5 min-h-[100px]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bedrooms">{translate("bedrooms")}</Label>
                <Select required>
                  <SelectTrigger id="bedrooms" className="mt-1.5">
                    <SelectValue placeholder={translate("select_bedrooms")} />
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
                <Label htmlFor="bathrooms">{translate("bathrooms")}</Label>
                <Select required>
                  <SelectTrigger id="bathrooms" className="mt-1.5">
                    <SelectValue placeholder={translate("select_bathrooms")} />
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
                <Label htmlFor="price">{translate("monthly_rent")}</Label>
                <Input id="price" type="number" placeholder={translate("rent_placeholder")} className="mt-1.5" required />
              </div>

              <div>
                <Label htmlFor="currency">{translate("currency")}</Label>
                <Select defaultValue="USD" required>
                  <SelectTrigger id="currency" className="mt-1.5">
                    <SelectValue placeholder={translate("select_currency")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="UGX">UGX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full bg-rose-500 hover:bg-rose-600 text-white">
              {translate("continue")}
            </Button>
          </div>
        </form>
      )}

      {formStep === 2 && (
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="location">{translate("location")}</Label>
              <Select required>
                <SelectTrigger id="location" className="mt-1.5">
                  <SelectValue placeholder={translate("select_location")} />
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
              <Label htmlFor="address">{translate("full_address")}</Label>
              <Input id="address" placeholder={translate("address_placeholder")} className="mt-1.5" required />
            </div>

            <div>
              <Label className="mb-2 block">{translate("amenities")}</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="wifi" />
                  <Label htmlFor="wifi" className="text-sm">
                    {translate("wifi")}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="parking" />
                  <Label htmlFor="parking" className="text-sm">
                    {translate("parking")}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="generator" />
                  <Label htmlFor="generator" className="text-sm">
                    {translate("generator")}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="security" />
                  <Label htmlFor="security" className="text-sm">
                    {translate("security")}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="pool" />
                  <Label htmlFor="pool" className="text-sm">
                    {translate("swimming_pool")}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="gym" />
                  <Label htmlFor="gym" className="text-sm">
                    {translate("gym")}
                  </Label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="contact-name">{translate("contact_name")}</Label>
              <Input id="contact-name" placeholder={translate("contact_name_placeholder")} className="mt-1.5" required />
            </div>

            <div>
              <Label htmlFor="contact-email">{translate("contact_email")}</Label>
              <Input id="contact-email" type="email" placeholder={translate("contact_email_placeholder")} className="mt-1.5" required />
            </div>

            <div>
              <Label htmlFor="contact-phone">{translate("contact_phone")}</Label>
              <Input id="contact-phone" placeholder={translate("contact_phone_placeholder")} className="mt-1.5" required />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="terms" required />
              <Label htmlFor="terms" className="text-sm">
                {translate("terms_agreement")}
              </Label>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setFormStep(1)}>
                {translate("back")}
              </Button>
              <Button type="submit" className="flex-1 bg-rose-500 hover:bg-rose-600 text-white" disabled={isSubmitting}>
                {isSubmitting ? translate("submitting") : translate("submit_property")}
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
          <h3 className="text-xl font-bold mb-2">{translate("success_title")}</h3>
          <p className="text-neutral-600 mb-6">
            {translate("success_message")}
          </p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" asChild>
              <a href="/dashboard">{translate("go_to_dashboard")}</a>
            </Button>
            <Button className="flex-1 bg-rose-500 hover:bg-rose-600 text-white" asChild>
              <a href="/list-property">{translate("list_another")}</a>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
