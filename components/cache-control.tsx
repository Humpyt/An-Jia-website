"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function CacheControl() {
  const [isClearing, setIsClearing] = useState(false)
  const { toast } = useToast()

  const clearCache = async () => {
    try {
      setIsClearing(true)
      
      // Call the cache clearing API
      const response = await fetch('/api/cache', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cacheType: 'all' }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Cache cleared successfully",
          description: `Cleared ${data.result.total} cached items. The page will refresh to show updated data.`,
          duration: 3000,
        })
        
        // Refresh the page after a short delay to show the toast
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else {
        throw new Error(data.error || 'Failed to clear cache')
      }
    } catch (error) {
      console.error('Error clearing cache:', error)
      toast({
        title: "Error clearing cache",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={clearCache} 
      disabled={isClearing}
      className="flex items-center gap-2"
    >
      <RefreshCw className={`h-4 w-4 ${isClearing ? 'animate-spin' : ''}`} />
      {isClearing ? "Clearing..." : "Refresh Data"}
    </Button>
  )
}
