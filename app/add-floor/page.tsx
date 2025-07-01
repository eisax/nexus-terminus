"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Building } from "lucide-react"

export default function AddFloorPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    floorNumber: "",
    locationId: "",
    description: "",
    width: "",
    height: "",
  })

  // Mock locations - in a real app, this would come from your API
  const locations = [
    { id: "1", name: "campus" },
    { id: "2", name: "ozzene campus" },
    { id: "3", name: "downtown office" },
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.locationId) {
      alert("Floor name and location are required")
      return
    }

    // In a real app, you would save this to your database
    console.log("New floor:", formData)

    // Redirect back to main page
    router.push("/")
  }

  const handleCancel = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={handleCancel}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Building className="w-6 h-6 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-900">Add New Floor</h1>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Floor Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Floor Name - Required */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  <span className="text-red-500">*</span> Floor Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full"
                  placeholder="Enter floor name"
                  required
                />
              </div>

              {/* Location - Required */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                  <span className="text-red-500">*</span> Location
                </Label>
                <Select value={formData.locationId} onValueChange={(value) => handleInputChange("locationId", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Floor Number */}
              <div className="space-y-2">
                <Label htmlFor="floorNumber" className="text-sm font-medium text-gray-700">
                  Floor Number
                </Label>
                <Input
                  id="floorNumber"
                  type="number"
                  value={formData.floorNumber}
                  onChange={(e) => handleInputChange("floorNumber", e.target.value)}
                  className="w-full"
                  placeholder="Enter floor number (e.g., 1, 2, -1 for basement)"
                />
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="width" className="text-sm font-medium text-gray-700">
                    Width (meters)
                  </Label>
                  <Input
                    id="width"
                    type="number"
                    step="0.1"
                    value={formData.width}
                    onChange={(e) => handleInputChange("width", e.target.value)}
                    className="w-full"
                    placeholder="Width in meters"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height" className="text-sm font-medium text-gray-700">
                    Height (meters)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    value={formData.height}
                    onChange={(e) => handleInputChange("height", e.target.value)}
                    className="w-full"
                    placeholder="Height in meters"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="w-full min-h-[100px] resize-none"
                  placeholder="Enter floor description (optional)"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <Button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
                  Create Floor
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel} className="flex-1 bg-transparent">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
