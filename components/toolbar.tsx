"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import {
  Wifi,
  Grid3X3,
  MapPin,
  Ruler,
  Edit3,
  QrCode,
  Settings,
  Trash2,
  Copy,
  RotateCcw,
  Layers,
  ChevronDown,
  Pentagon,
  Upload,
  X,
} from "lucide-react"
import { useNavigationStore } from "@/lib/store"
import { useRef, useState } from "react"
import { CustomDropdown } from "./custom-dropdown"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { QRCodeCanvas } from "qrcode.react"

// Mock data - in a real app, this would come from your API/database
const mockLocations = [
  { id: "1", name: "campus" },
  { id: "2", name: "ozzene campus" },
  { id: "3", name: "downtown office" },
  { id: "4", name: "warehouse facility" },
]

const mockFloors = [
  { id: "1", name: "ozzene campus" },
  { id: "2", name: "ground floor" },
  { id: "3", name: "second floor" },
  { id: "4", name: "basement" },
]

export function Toolbar() {
  const router = useRouter()
  const [selectedLocation, setSelectedLocation] = useState("campus")
  const [selectedFloor, setSelectedFloor] = useState("ozzene campus")
  const [qrModalOpen, setQrModalOpen] = useState(false)

  const {
    currentTool,
    currentPolygon,
    backgroundImageUrl,
    showGrid,
    setCurrentTool,
    completePolygon,
    setBackgroundImage,
    clearAll,
  } = useNavigationStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleToolClick = (toolName: string) => {
    setCurrentTool(currentTool === toolName ? null : toolName)
  }

  const handleCompletePolygon = () => {
    completePolygon()
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && (file.type.startsWith("image/") || file.name.endsWith(".svg"))) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          setBackgroundImage(img, e.target?.result as string)
        }
        img.onerror = () => {
          alert("Failed to load image. Please try a different file.")
        }
        img.src = e.target?.result as string
      }
      reader.onerror = () => {
        alert("Failed to read file. Please try again.")
      }
      reader.readAsDataURL(file)
    } else {
      alert("Please select a valid image file (PNG, JPG, GIF, SVG)")
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemoveBackground = () => {
    setBackgroundImage(null, null)
  }

  const handleLocationSelect = (location: { id: string; name: string }) => {
    setSelectedLocation(location.name)
  }

  const handleFloorSelect = (floor: { id: string; name: string }) => {
    setSelectedFloor(floor.name)
  }

  const handleAddLocation = () => {
    // Redirect to add location page
    router.push("/add-location")
  }

  const handleAddFloor = () => {
    // Redirect to add floor page
    router.push("/add-floor")
  }

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Top section with location/floor selectors */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
        <div className="flex items-center gap-6">
          <CustomDropdown
            label="Location"
            value={selectedLocation}
            options={mockLocations}
            onSelect={handleLocationSelect}
            onAdd={handleAddLocation}
            addLabel="Add Location"
            placeholder="Search locations..."
          />

          <CustomDropdown
            label="Floor"
            value={selectedFloor}
            options={mockFloors}
            onSelect={handleFloorSelect}
            onAdd={handleAddFloor}
            addLabel="Add Floor"
            placeholder="Search floors..."
          />

          {/* Background Image Controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 font-medium">Floor Plan</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.svg"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs hover:bg-gray-100"
              onClick={() => fileInputRef.current?.click()}
              title="Upload Floor Plan"
            >
              <Upload className="w-3 h-3 mr-1" />
              {backgroundImageUrl ? "Change" : "Upload"}
            </Button>
            {backgroundImageUrl && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs hover:bg-gray-100 text-red-600 hover:text-red-700"
                onClick={handleRemoveBackground}
                title="Delete Floor Plan"
              >
                <X className="w-3 h-3 mr-1" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom section with tools */}
      <div className="flex items-center justify-between px-4 py-2">
        {/* Create section */}
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-600 font-medium">Create</span>
          <div className="flex items-center gap-1">
            <Button
              variant={currentTool === "wifi" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100"
              onClick={() => handleToolClick("wifi")}
              title="Place WiFi Beacon"
            >
              <Wifi className="w-4 h-4 text-gray-600" />
            </Button>
            <Button
              variant={showGrid ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100"
              onClick={() => handleToolClick("grid")}
              title="Toggle Grid Overlay"
            >
              <Grid3X3 className="w-4 h-4 text-gray-600" />
            </Button>
            <Button
              variant={currentTool === "location" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100"
              onClick={() => handleToolClick("location")}
              title="Add Venue"
            >
              <MapPin className="w-4 h-4 text-gray-600" />
            </Button>
            <Button
              variant={currentTool === "measure" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100"
              onClick={() => handleToolClick("measure")}
              title="Measure Tool"
            >
              <Ruler className="w-4 h-4 text-gray-600" />
            </Button>
            <Button
              variant={currentTool === "path" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100"
              onClick={() => handleToolClick("path")}
              title="Draw Path"
            >
              <Edit3 className="w-4 h-4 text-gray-600" />
            </Button>
            <Button
              variant={currentTool === "polygon" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100"
              onClick={() => handleToolClick("polygon")}
              title="Draw Polygon"
            >
              <Pentagon className="w-4 h-4 text-gray-600" />
            </Button>
            <Button
              variant={qrModalOpen ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100"
              onClick={() => setQrModalOpen(true)}
              title="Show QR Code"
            >
              <QrCode className="w-4 h-4 text-gray-600" />
            </Button>
            <Button
              variant={currentTool === "settings" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100"
              onClick={() => handleToolClick("settings")}
              title="Settings"
            >
              <Settings className="w-4 h-4 text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Edit section */}
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-600 font-medium">Edit</span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100"
              onClick={() => {
                // This will be handled by the canvas component to copy selected items
                handleToolClick("copy")
              }}
              title="Copy Selected"
            >
              <Copy className="w-4 h-4 text-gray-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100"
              onClick={() => {
                // This will be handled by the canvas component to delete selected items
                handleToolClick("delete")
              }}
              title="Delete Selected"
            >
              <Trash2 className="w-4 h-4 text-gray-600" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100" title="Undo">
              <RotateCcw className="w-4 h-4 text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Applications and Layers */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 font-medium">Applications</span>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs hover:bg-gray-100">
              <span className="text-gray-700">Apps</span>
              <ChevronDown className="w-3 h-3 ml-1 text-gray-500" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 font-medium">Layers</span>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs hover:bg-gray-100">
              <Layers className="w-3 h-3 mr-1 text-gray-600" />
              <span className="text-gray-700">Layers</span>
              <ChevronDown className="w-3 h-3 ml-1 text-gray-500" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tool status indicator */}
      {currentTool && (
        <div className="px-4 py-1 bg-blue-50 border-b border-blue-200 flex items-center justify-between">
          <span className="text-xs text-blue-700 font-medium">
            {currentTool === "wifi" && "Click anywhere to place WiFi beacon"}
            {currentTool === "location" && "Click anywhere to add venue"}
            {currentTool === "measure" && "Click anywhere to measure distance"}
            {currentTool === "path" && "Click anywhere to draw navigation path"}
            {currentTool === "polygon" &&
              (currentPolygon.length === 0
                ? "Click anywhere to start drawing polygon"
                : `Click to add point (${currentPolygon.length} points) • Double-click or press Complete to finish`)}
            {currentTool === "qr" && "Click anywhere to place QR code"}
            {currentTool === "settings" && "Click anywhere to add settings marker"}
            {currentTool === "delete" && "Click on an item to delete it"}
            {currentTool === "copy" && "Click on an item to copy it"}
          </span>

          {currentTool === "polygon" && currentPolygon.length >= 3 && (
            <Button size="sm" className="h-6 px-2 text-xs" onClick={handleCompletePolygon}>
              Complete Polygon
            </Button>
          )}
        </div>
      )}

      {/* Grid status indicator */}
      {showGrid && (
        <div className="px-4 py-1 bg-green-50 border-b border-green-200">
          <span className="text-xs text-green-700 font-medium">Grid overlay is active</span>
        </div>
      )}

      <Dialog open={qrModalOpen} onOpenChange={setQrModalOpen}>
        <DialogContent className="max-w-xs p-0 rounded-2xl shadow-xl border bg-white">
          <DialogTitle asChild>
            <span className="sr-only">Open in Mobile Application</span>
          </DialogTitle>
          <div className="flex flex-col items-center w-full">
            <div className="w-full rounded-t-2xl px-6 pt-6 pb-2">
              <div className="text-center text-lg font-medium text-gray-900">Open in Mobile Application</div>
            </div>
            <div className="bg-white px-4 pt-2 pb-0 flex flex-col items-center w-full">
              <div className="bg-white border rounded-lg p-2 mt-2 mb-2" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <QRCodeCanvas value="https://example.com/app" size={200} bgColor="#fff" />
              </div>
              <div className="text-gray-500 text-sm mt-2 mb-1">Learn more:</div>
              <div className="flex flex-row gap-8 mb-4">
                <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" className="text-gray-800 font-medium hover:underline">Android app</a>
                <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" className="text-gray-800 font-medium hover:underline">IOS app</a>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
