"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, ChevronDown } from "lucide-react"

interface AddLocationDialogProps {
  open: boolean
  onClose: () => void
  onAdd: (location: { id: string; name: string }) => void
}

// Mock locations for search
const availableLocations = [
  { id: "1", name: "campus" },
  { id: "2", name: "campus north" },
  { id: "3", name: "campus south" },
  { id: "4", name: "downtown office" },
  { id: "5", name: "warehouse facility" },
  { id: "6", name: "research center" },
  { id: "7", name: "main building" },
]

export function AddLocationDialog({ open, onClose, onAdd }: AddLocationDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{ id: string; name: string } | null>(null)

  const filteredLocations = availableLocations.filter((location) =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const shouldShowResults = searchTerm.length >= 3 && showResults && filteredLocations.length > 0

  useEffect(() => {
    if (searchTerm.length >= 3) {
      setShowResults(true)
    } else {
      setShowResults(false)
    }
  }, [searchTerm])

  const handleAdd = () => {
    if (!selectedLocation) {
      alert("Please select a location")
      return
    }

    onAdd(selectedLocation)
    handleClose()
  }

  const handleClose = () => {
    setSearchTerm("")
    setShowResults(false)
    setSelectedLocation(null)
    onClose()
  }

  const handleLocationSelect = (location: { id: string; name: string }) => {
    setSelectedLocation(location)
    setSearchTerm(location.name)
    setShowResults(false)
  }

  const handleInputChange = (value: string) => {
    setSearchTerm(value)
    setSelectedLocation(null)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md w-full mx-4 bg-white rounded-2xl shadow-xl border-0 p-0">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-8 pb-6">
          <DialogTitle className="text-2xl font-medium text-gray-800">Add Location</DialogTitle>
          <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8 p-0 hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-500" />
          </Button>
        </DialogHeader>

        {/* Form Content */}
        <div className="px-8 pb-8 space-y-6">
          {/* Location Search */}
          <div className="space-y-3">
            <Label htmlFor="location" className="text-lg font-medium text-gray-800">
              Location
            </Label>
            <div className="relative">
              <div className="relative">
                <Input
                  id="location"
                  value={searchTerm}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="w-full h-12 bg-white border-2 border-gray-200 rounded-lg text-base px-4 pr-10 placeholder-gray-400"
                  placeholder={searchTerm.length < 3 ? "" : "Write more than 3 letters to search"}
                />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>

              {/* Search Results */}
              {shouldShowResults && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                  {filteredLocations.map((location) => (
                    <button
                      key={location.id}
                      onClick={() => handleLocationSelect(location)}
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      {location.name}
                    </button>
                  ))}
                </div>
              )}

              {/* Show placeholder text when not enough characters */}
              {searchTerm.length > 0 && searchTerm.length < 3 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 px-4 py-3">
                  <span className="text-sm text-gray-400">Write more than 3 letters to search</span>
                </div>
              )}
            </div>
          </div>

          {/* Add Button */}
          <div className="pt-4">
            <Button
              onClick={handleAdd}
              disabled={!selectedLocation}
              className="w-full h-14 bg-blue-400 hover:bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-lg font-medium rounded-full"
            >
              Add
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
