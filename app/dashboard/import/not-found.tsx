"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function ImportNotFound() {
  return (
    <div className="container py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Import Page Not Found</CardTitle>
          <CardDescription>The import functionality could not be loaded</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This could be due to a configuration issue or missing environment variables.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button asChild>
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
