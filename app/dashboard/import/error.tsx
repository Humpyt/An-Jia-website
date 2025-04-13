"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useEffect } from "react"

export default function ImportError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Import page error:", error)
  }, [error])

  return (
    <div className="container py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Import Properties</CardTitle>
          <CardDescription>There was an error loading the import functionality</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.message || "An unknown error occurred"}</AlertDescription>
          </Alert>
          <p className="text-sm text-muted-foreground mt-4">
            This could be due to a temporary issue with the server or missing environment variables.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={reset} className="w-full">Try Again</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
