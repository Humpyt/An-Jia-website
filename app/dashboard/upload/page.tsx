"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, FileSpreadsheet, Upload } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function BulkUploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
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
            <h1 className="text-3xl font-bold tracking-tight">Bulk Upload</h1>
          </div>
          <Tabs defaultValue="upload">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="history">Upload History</TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Properties</CardTitle>
                  <CardDescription>Upload multiple properties at once using a spreadsheet</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="file">Upload Spreadsheet</Label>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="#">
                          <FileSpreadsheet className="h-4 w-4 mr-2" />
                          Download Template
                        </Link>
                      </Button>
                    </div>
                    <div className="border border-dashed rounded-lg p-8 text-center">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Drag and drop your spreadsheet here, or click to browse
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">Supported formats: XLSX, CSV, XLS</p>
                      <div className="mt-4">
                        <Input
                          id="file"
                          type="file"
                          accept=".xlsx,.csv,.xls"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <Button variant="outline" onClick={() => document.getElementById("file")?.click()}>
                          Select File
                        </Button>
                      </div>
                      {selectedFile && (
                        <div className="mt-4 text-sm">
                          Selected file: <span className="font-medium">{selectedFile.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Separator />
                  <div className="grid gap-3">
                    <Label>Field Mapping</Label>
                    <p className="text-sm text-muted-foreground">
                      Make sure your spreadsheet columns match the following fields:
                    </p>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Spreadsheet Column</TableHead>
                            <TableHead>Maps To</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Apartment Name</TableCell>
                            <TableCell>Property Title</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Location</TableCell>
                            <TableCell>Property Location</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Price</TableCell>
                            <TableCell>Monthly Rent</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Bedrooms</TableCell>
                            <TableCell>Number of Bedrooms</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Bathrooms</TableCell>
                            <TableCell>Number of Bathrooms</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Amenities</TableCell>
                            <TableCell>Property Amenities (comma separated)</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Google Pin</TableCell>
                            <TableCell>Google Maps URL</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button disabled={!selectedFile}>Upload Properties</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="history" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload History</CardTitle>
                  <CardDescription>View your previous bulk uploads</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>File Name</TableHead>
                          <TableHead>Properties</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Apr 5, 2025</TableCell>
                          <TableCell>properties-batch-1.xlsx</TableCell>
                          <TableCell>12</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100/80">
                              Completed
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Mar 28, 2025</TableCell>
                          <TableCell>kampala-properties.csv</TableCell>
                          <TableCell>8</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100/80">
                              Completed
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
