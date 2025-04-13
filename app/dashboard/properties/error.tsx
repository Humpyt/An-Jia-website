"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, PlusCircle } from "lucide-react"
import { useEffect } from "react"

export default function PropertiesError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Properties page error:", error)
  }, [error])

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Properties</h2>
        <Button asChild>
          <Link href="/dashboard/properties/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Property
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Properties</CardTitle>
          <CardDescription>There was an error loading your properties.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.message || "An unknown error occurred"}</AlertDescription>
          </Alert>
          <p className="text-sm text-muted-foreground mt-4">
            This could be due to a temporary issue with the server or database.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={reset}>Try Again</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
