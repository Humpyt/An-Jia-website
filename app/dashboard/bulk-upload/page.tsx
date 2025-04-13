"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Download, FileSpreadsheet, Upload, AlertCircle, CheckCircle2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function BulkUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [uploadResult, setUploadResult] = useState<{
    total: number
    success: number
    errors: number
    errorDetails?: string[]
  } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Check if file is CSV or Excel
      const fileType = selectedFile.type
      if (
        fileType === "text/csv" ||
        fileType === "application/vnd.ms-excel" ||
        fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        setFile(selectedFile)
        setUploadStatus("idle")
        setUploadResult(null)
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV or Excel file",
          variant: "destructive",
        })
      }
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    setProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 500)

    // Simulate API call
    setTimeout(() => {
      clearInterval(interval)
      setProgress(100)
      setUploading(false)

      // Simulate success with some errors
      setUploadStatus("success")
      setUploadResult({
        total: 25,
        success: 22,
        errors: 3,
        errorDetails: [
          "Row 5: Missing required field 'price'",
          "Row 12: Invalid location",
          "Row 18: Duplicate property title",
        ],
      })

      toast({
        title: "Upload complete",
        description: "Your properties have been processed",
      })
    }, 5000)
  }

  const downloadTemplate = () => {
    // In a real app, this would download a template file
    toast({
      title: "Template downloaded",
      description: "The template has been downloaded to your device",
    })
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Bulk Upload</h2>
      </div>
      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="history">Upload History</TabsTrigger>
        </TabsList>
        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Properties</CardTitle>
              <CardDescription>Upload multiple properties at once using a CSV or Excel file.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={downloadTemplate}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Template
                </Button>
                <div className="text-sm text-muted-foreground">
                  Download our template to ensure your data is formatted correctly.
                </div>
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="file">Upload File</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".csv,.xls,.xlsx"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                <p className="text-sm text-muted-foreground">Accepted formats: CSV, Excel (.xls, .xlsx)</p>
              </div>
              {file && (
                <div className="flex items-center gap-2 text-sm">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>{file.name}</span>
                  <span className="text-muted-foreground">({(file.size / 1024).toFixed(2)} KB)</span>
                </div>
              )}
              {uploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
              {uploadStatus === "success" && uploadResult && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-600">Upload successful</AlertTitle>
                  <AlertDescription>
                    <div className="mt-2">
                      <p>Total properties: {uploadResult.total}</p>
                      <p>Successfully uploaded: {uploadResult.success}</p>
                      <p>Errors: {uploadResult.errors}</p>
                    </div>
                    {uploadResult.errors > 0 && uploadResult.errorDetails && (
                      <div className="mt-2">
                        <p className="font-medium">Error details:</p>
                        <ul className="list-disc pl-5 mt-1 text-sm">
                          {uploadResult.errorDetails.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}
              {uploadStatus === "error" && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Upload failed</AlertTitle>
                  <AlertDescription>There was an error uploading your file. Please try again.</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleUpload} disabled={!file || uploading}>
                <Upload className="mr-2 h-4 w-4" />
                {uploading ? "Uploading..." : "Upload Properties"}
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Bulk Upload Guidelines</CardTitle>
              <CardDescription>Follow these guidelines to ensure a successful upload.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Required Fields</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Title - The property title</li>
                    <li>Location - The property location</li>
                    <li>Price - The monthly rental price</li>
                    <li>Currency - UGX or USD</li>
                    <li>Bedrooms - Number of bedrooms</li>
                    <li>Bathrooms - Number of bathrooms</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Optional Fields</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Description - Detailed property description</li>
                    <li>Size - Property size in square meters</li>
                    <li>Amenities - Comma-separated list of amenities</li>
                    <li>Features - Comma-separated list of features</li>
                    <li>Is Premium - Set to TRUE for premium listings</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Images</h3>
                  <p className="mt-2">
                    Images cannot be uploaded via bulk upload. You will need to add images to each property individually
                    after the upload.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload History</CardTitle>
              <CardDescription>View your previous bulk uploads.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left font-medium">Date</th>
                      <th className="py-3 px-4 text-left font-medium">File</th>
                      <th className="py-3 px-4 text-left font-medium">Properties</th>
                      <th className="py-3 px-4 text-left font-medium">Status</th>
                      <th className="py-3 px-4 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4">2023-10-15</td>
                      <td className="py-3 px-4">properties-batch-1.csv</td>
                      <td className="py-3 px-4">25 (22 success, 3 errors)</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                          Completed
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">2023-09-28</td>
                      <td className="py-3 px-4">properties-batch-2.xlsx</td>
                      <td className="py-3 px-4">18 (18 success, 0 errors)</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                          Completed
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
