"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/database.types"
import { CheckCircle, AlertCircle, FileUp, Loader2 } from "lucide-react"

export default function ImportPageContent() {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [importedCount, setImportedCount] = useState(0)

  // Initialize Supabase client only on the client side
  const supabase = createClientComponentClient<Database>()

  // Function to convert Google Drive link to direct download link
  const convertGoogleDriveLink = (url: string) => {
    if (!url) return null

    // Extract file ID from Google Drive link
    const match = url.match(/[-\w]{25,}/)
    if (!match) return null

    const fileId = match[0]
    return `https://drive.google.com/uc?export=view&id=${fileId}`
  }

  // Function to parse CSV data
  const parseCSV = (text: string) => {
    const lines = text.split("\n")
    const headers = lines[0].split(",").map((header) => header.trim())

    const result = []

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue

      const obj: Record<string, any> = {}
      const currentLine = lines[i]

      // Handle quoted fields that might contain commas
      const values = []
      let inQuotes = false
      let currentValue = ""

      for (let j = 0; j < currentLine.length; j++) {
        const char = currentLine[j]

        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === "," && !inQuotes) {
          values.push(currentValue.trim())
          currentValue = ""
        } else {
          currentValue += char
        }
      }

      // Add the last value
      values.push(currentValue.trim())

      // Map values to headers
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = values[j] ? values[j].replace(/^"|"$/g, "") : ""
      }

      result.push(obj)
    }

    return result
  }

  // Function to import properties
  const importProperties = async () => {
    setIsLoading(true)
    setProgress(0)
    setStatus("Fetching CSV data...")
    setError(null)
    setSuccess(false)
    setImportedCount(0)

    try {
      // Fetch CSV data
      const response = await fetch(
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Property%20Agent%20Data%20Collection%20Form%20%28Responses%29%20-%20Form%20Responses%201-z61RVTXRfln40LOgpcaaMm6LfOH0sM.csv",
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch CSV: ${response.statusText}`)
      }

      const csvText = await response.text()
      setStatus("Parsing CSV data...")
      setProgress(10)

      // Parse CSV
      const parsedData = parseCSV(csvText)
      setProgress(20)

      // Process and import properties
      setStatus("Importing properties...")
      let successCount = 0

      for (let i = 0; i < parsedData.length; i++) {
        const item = parsedData[i]

        try {
          // Extract and format data
          const title = item["Apartment Name:"] || "Unnamed Property"
          const location = item["Location (Area, City):"] || "Unknown Location"
          const floor = item["Floor/Level:"] || ""
          const bedroomsStr = item["Number of Bedrooms:"] || "0"
          const bedrooms = Number.parseInt(bedroomsStr, 10) || 0

          // Handle price with currency
          let price = 0
          let currency = "USD"
          const priceStr = item["Rent Amount:"] || "0"

          if (priceStr.includes("$")) {
            // Extract the first number followed by $
            const match = priceStr.match(/(\d+)\$/)
            if (match && match[1]) {
              price = Number.parseInt(match[1], 10)
              currency = "USD"
            }
          } else if (priceStr.includes("UGX")) {
            // Extract the first number followed by UGX
            const match = priceStr.match(/(\d+)\s*UGX/)
            if (match && match[1]) {
              price = Number.parseInt(match[1], 10)
              currency = "UGX"
            }
          } else {
            // Try to extract just a number
            const match = priceStr.match(/(\d+)/)
            if (match && match[1]) {
              price = Number.parseInt(match[1], 10)
              // Default to USD
              currency = "USD"
            }
          }

          // Set a default price if parsing failed
          if (isNaN(price) || price === 0) {
            price = 500
          }

          // Extract payment terms
          const paymentTerms = item["Payment Terms (Monthly, Quarterly, Yearly):"] || "Monthly"

          // Extract amenities
          const amenitiesStr = item["Amenities (Separate by comma):"] || ""
          const amenities = amenitiesStr
            .split(",")
            .map((a) => a.trim())
            .filter((a) => a)

          // Extract owner info
          const ownerName = item["Owner's Name:"] || ""
          const ownerContact = item["Owner's Contact Number:"] || ""

          // Extract image URLs
          const imageUrlsStr = item["Upload a photo of the apartment:"] || ""
          const imageUrls = imageUrlsStr
            .split(",")
            .map((url) => url.trim())
            .filter((url) => url)
            .map((url) => convertGoogleDriveLink(url))
            .filter((url) => url) as string[]

          // Create description
          const description = `
${title} is located in ${location}${floor ? ` on the ${floor}` : ""}.
${bedrooms > 0 ? `This property features ${bedrooms} bedroom${bedrooms > 1 ? "s" : ""}.` : ""}
${amenities.length > 0 ? `Amenities include: ${amenities.join(", ")}.` : ""}
${ownerName ? `Contact ${ownerName}${ownerContact ? ` at ${ownerContact}` : ""} for more information.` : ""}
`.trim()

          // Determine if premium based on price
          const isPremium = currency === "USD" && price > 500

          // Insert property into database
          const { data: propertyData, error: propertyError } = await supabase
            .from("properties")
            .insert({
              title,
              description,
              location,
              price,
              currency,
              bedrooms,
              bathrooms: 1, // Default value
              is_premium: isPremium,
              payment_terms: paymentTerms,
            })
            .select()

          if (propertyError) {
            console.error(`Error inserting property ${title}:`, propertyError)
            continue
          }

          const propertyId = propertyData[0].id

          // Insert images
          if (imageUrls.length > 0) {
            for (let j = 0; j < imageUrls.length; j++) {
              const isPrimary = j === 0 // First image is primary

              const { error: imageError } = await supabase.from("property_images").insert({
                property_id: propertyId,
                image_url: imageUrls[j],
                is_primary: isPrimary,
              })

              if (imageError) {
                console.error(`Error inserting image for property ${title}:`, imageError)
              }
            }
          }

          successCount++
          setImportedCount(successCount)
        } catch (itemError) {
          console.error(`Error processing item ${i}:`, itemError)
        }

        // Update progress
        setProgress(20 + Math.floor((i / parsedData.length) * 80))
      }

      setProgress(100)
      setStatus(`Successfully imported ${successCount} properties`)
      setSuccess(true)
    } catch (err) {
      console.error("Import error:", err)
      setError(err instanceof Error ? err.message : "Unknown error occurred")
      setProgress(0)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Import Properties</CardTitle>
          <CardDescription>Import properties from the CSV file into the database</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Success</AlertTitle>
              <AlertDescription className="text-green-700">
                Successfully imported {importedCount} properties
              </AlertDescription>
            </Alert>
          )}

          {isLoading && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p>{status}</p>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground">Imported {importedCount} properties so far...</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={importProperties} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <FileUp className="mr-2 h-4 w-4" />
                Import Properties
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
