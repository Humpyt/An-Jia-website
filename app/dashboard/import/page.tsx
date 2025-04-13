"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, FileUp, Loader2 } from "lucide-react"
import dynamic from 'next/dynamic'

// Define the route segment config to prevent static generation
export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 0
export const fetchCache = 'force-no-store'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'

// Create a dynamic import for the Supabase client component
// This ensures it only loads on the client side and avoids build-time errors
const ImportPageContent = dynamic(
  () => import('./import-content'),
  {
    ssr: false,
    loading: () => (
      <div className="container py-10">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Import Properties</CardTitle>
            <CardDescription>Loading import functionality...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
)

export default function ImportPage() {
  // Use a client-side effect to check if we're in the browser
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Only render the import content on the client side
  if (!isMounted) {
    return (
      <div className="container py-10">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Import Properties</CardTitle>
            <CardDescription>Loading import functionality...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render the dynamically imported component
  return <ImportPageContent />
}
