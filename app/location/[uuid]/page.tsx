"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { LocationAPI } from "@/lib/api/locations"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import { MapPin, Calendar, ExternalLink } from "lucide-react"

interface LocationData {
  uuid: string
  locationName: string
  mappingData: any
  createdAt: string
}

export default function LocationPage() {
  const params = useParams()
  const uuid = params.uuid as string
  const [locationData, setLocationData] = useState<LocationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (uuid) {
      fetchLocationData()
    }
  }, [uuid])

  const fetchLocationData = async () => {
    try {
      setIsLoading(true)
      const response = await LocationAPI.getLocation(uuid)

      if (response.success && response.data) {
        setLocationData(response.data)
      } else {
        setError(response.message || "Location not found")
      }
    } catch (error: any) {
      console.error("Error fetching location:", error)
      setError(error.message || "Failed to load location")
      toast({
        title: "Error",
        description: "Failed to load location data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewMapping = () => {
    if (locationData?.mappingData) {
      // You can implement navigation to the mapping view here
      // For now, we'll just show a toast
      toast({
        title: "Mapping Data",
        description: "Opening mapping view...",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-10 w-32" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !locationData) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error || "Location not found"}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.history.back()} variant="outline">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {locationData.locationName}
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Created: {new Date(locationData.createdAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Location UUID:</p>
            <code className="bg-muted px-2 py-1 rounded text-sm font-mono">{locationData.uuid}</code>
          </div>

          {locationData.mappingData && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Mapping data is available for this location.</p>
              <Button onClick={handleViewMapping} className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                View Mapping
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
