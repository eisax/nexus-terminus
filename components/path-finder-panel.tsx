"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNavigationStore } from "@/lib/store"
import { Navigation, MapPin, Clock, Route } from "lucide-react"

export function PathFinderPanel() {
  const [startNodeId, setStartNodeId] = useState("")
  const [endNodeId, setEndNodeId] = useState("")
  const [startPOI, setStartPOI] = useState("")
  const [endPOI, setEndPOI] = useState("")

  const { currentFloor, currentPath, findPath, setCurrentPath } = useNavigationStore()

  const handleFindPath = () => {
    let start = startNodeId
    let end = endNodeId

    // If POIs are selected, find nearest nodes
    if (startPOI && currentFloor) {
      const poi = currentFloor.pois.find((p) => p.id === startPOI)
      if (poi) {
        // Find nearest node to POI
        const nearestNode = currentFloor.nodes.reduce((nearest, node) => {
          const distance = Math.sqrt(Math.pow(node.x - poi.x, 2) + Math.pow(node.y - poi.y, 2))
          const nearestDistance = Math.sqrt(Math.pow(nearest.x - poi.x, 2) + Math.pow(nearest.y - poi.y, 2))
          return distance < nearestDistance ? node : nearest
        })
        start = nearestNode.id
      }
    }

    if (endPOI && currentFloor) {
      const poi = currentFloor.pois.find((p) => p.id === endPOI)
      if (poi) {
        const nearestNode = currentFloor.nodes.reduce((nearest, node) => {
          const distance = Math.sqrt(Math.pow(node.x - poi.x, 2) + Math.pow(node.y - poi.y, 2))
          const nearestDistance = Math.sqrt(Math.pow(nearest.x - poi.x, 2) + Math.pow(nearest.y - poi.y, 2))
          return distance < nearestDistance ? node : nearest
        })
        end = nearestNode.id
      }
    }

    if (start && end) {
      findPath(start, end)
    }
  }

  const clearPath = () => {
    setCurrentPath(null)
    setStartNodeId("")
    setEndNodeId("")
    setStartPOI("")
    setEndPOI("")
  }

  if (!currentFloor) {
    return (
      <Card className="w-80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="w-5 h-5" />
            Path Finder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Select a floor to start navigation</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="w-5 h-5" />
          Path Finder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Start Location */}
        <div className="space-y-2">
          <label className="text-sm font-medium">From</label>
          <Select value={startPOI} onValueChange={setStartPOI}>
            <SelectTrigger>
              <SelectValue placeholder="Select starting point" />
            </SelectTrigger>
            <SelectContent>
              {currentFloor.pois.map((poi) => (
                <SelectItem key={poi.id} value={poi.id}>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {poi.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* End Location */}
        <div className="space-y-2">
          <label className="text-sm font-medium">To</label>
          <Select value={endPOI} onValueChange={setEndPOI}>
            <SelectTrigger>
              <SelectValue placeholder="Select destination" />
            </SelectTrigger>
            <SelectContent>
              {currentFloor.pois.map((poi) => (
                <SelectItem key={poi.id} value={poi.id}>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {poi.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={handleFindPath} className="flex-1">
            <Route className="w-4 h-4 mr-2" />
            Find Path
          </Button>
          <Button variant="outline" onClick={clearPath}>
            Clear
          </Button>
        </div>

        {/* Path Results */}
        {currentPath && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 text-green-800 mb-2">
              <Route className="w-4 h-4" />
              <span className="font-medium">Route Found</span>
            </div>
            <div className="text-sm text-green-700 space-y-1">
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                <span>Distance: {Math.round(currentPath.distance)} units</span>
              </div>
              <div>Steps: {currentPath.path.length} waypoints</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
