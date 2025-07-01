"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

interface MeasureDialogProps {
  open: boolean
  onClose: () => void
  onSave: (distance: number) => void
  pixelDistance: number
}

export function MeasureDialog({ open, onClose, onSave, pixelDistance }: MeasureDialogProps) {
  const [distance, setDistance] = useState("")

  const handleSave = () => {
    const distanceValue = Number.parseFloat(distance)
    if (!distanceValue || distanceValue <= 0) {
      alert("Please enter a valid distance in meters")
      return
    }

    onSave(distanceValue)
    handleClose()
  }

  const handleClose = () => {
    setDistance("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md w-full mx-4 bg-white rounded-lg shadow-xl border-0 p-0">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4">
          <DialogTitle className="text-2xl font-normal text-gray-800">Measure sublocation</DialogTitle>
          <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8 p-0">
            <X className="h-5 w-5 text-gray-500" />
          </Button>
        </DialogHeader>

        {/* Form Content */}
        <div className="px-6 pb-6 space-y-4">
          {/* Distance Input */}
          <div className="space-y-2">
            <Label htmlFor="distance" className="text-sm font-medium text-gray-700">
              <span className="text-red-500">*</span>Width (m):
            </Label>
            <Input
              id="distance"
              type="number"
              step="0.01"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
              placeholder="Enter distance in meters"
              autoFocus
            />
          </div>

          {/* Info Text */}
          <div className="text-sm text-gray-600">Pixel distance: {Math.round(pixelDistance)} px</div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button
              onClick={handleSave}
              className="w-full bg-blue-400 hover:bg-blue-500 text-white rounded-md py-2 text-base font-medium"
            >
              Save
            </Button>
            <Button
              onClick={handleClose}
              variant="outline"
              className="w-full border-red-400 text-red-400 hover:bg-red-50 rounded-md py-2 text-base font-medium bg-white"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
