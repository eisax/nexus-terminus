"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

interface TransmitterData {
  type: string
  description: string
  uuid: string
  major: number
  minor: number
}

interface AddTransmitterDialogProps {
  open: boolean
  onClose: () => void
  onAdd: (transmitterData: TransmitterData) => void
  coordinates: { x: number; y: number }
}

const transmitterTypes = ["iBeacon", "Wifi", "Wifi-RTT", "Gateway / Reciever / Locator", "Eddystone", "BLE"]

const commonUUIDs = [
  "AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEE",
  "12345678-1234-1234-1234-123456789ABC",
  "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0",
  "6E400001-B5A3-F393-E0A9-E50E24DCCA9E",
  "FDA50693-A4E2-4FB1-AFCF-C6EB07647825",
]

export function AddTransmitterDialog({ open, onClose, onAdd, coordinates }: AddTransmitterDialogProps) {
  const [formData, setFormData] = useState<TransmitterData>({
    type: "iBeacon",
    description: "",
    uuid: "AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEE",
    major: 65535,
    minor: 65535,
  })

  const handleInputChange = (field: keyof TransmitterData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAdd = () => {
    if (!formData.description.trim()) {
      alert("Description is required")
      return
    }

    onAdd(formData)
    handleClose()
  }

  const handleClose = () => {
    setFormData({
      type: "iBeacon",
      description: "",
      uuid: "AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEE",
      major: 65535,
      minor: 65535,
    })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg w-full mx-4 bg-white rounded-lg shadow-xl border-0 p-0 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4">
          <DialogTitle className="text-2xl font-normal text-gray-800">Add Transmitter</DialogTitle>
          <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8 p-0">
            <X className="h-5 w-5 text-gray-500" />
          </Button>
        </DialogHeader>

        {/* Form Content */}
        <div className="px-6 pb-6 space-y-4">
          {/* Type - Required */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium text-gray-700">
              <span className="text-red-500">*</span> Type
            </Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
              <SelectTrigger className="w-full bg-white border-2 border-blue-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-48">
                {transmitterTypes.map((type) => (
                  <SelectItem key={type} value={type} className="text-white hover:bg-gray-600 focus:bg-gray-600">
                    <div className="flex items-center gap-2">
                      {formData.type === type && <span className="text-green-400">✓</span>}
                      {type}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description - Required */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              <span className="text-red-500">*</span> Description:
            </Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
              placeholder="Name Example"
            />
          </div>

          {/* UUID - Required */}
          <div className="space-y-2">
            <Label htmlFor="uuid" className="text-sm font-medium text-gray-700">
              <span className="text-red-500">*</span> UUID:
            </Label>
            <Select value={formData.uuid} onValueChange={(value) => handleInputChange("uuid", value)}>
              <SelectTrigger className="w-full bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg">
                {commonUUIDs.map((uuid) => (
                  <SelectItem key={uuid} value={uuid} className="text-gray-900 hover:bg-gray-100">
                    {uuid}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Major - Required */}
          <div className="space-y-2">
            <Label htmlFor="major" className="text-sm font-medium text-gray-700">
              <span className="text-red-500">*</span> Major:
            </Label>
            <Input
              id="major"
              type="number"
              min="0"
              max="65535"
              value={formData.major}
              onChange={(e) => handleInputChange("major", Number.parseInt(e.target.value) || 0)}
              className="w-full bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Minor - Required */}
          <div className="space-y-2">
            <Label htmlFor="minor" className="text-sm font-medium text-gray-700">
              <span className="text-red-500">*</span> Minor:
            </Label>
            <Input
              id="minor"
              type="number"
              min="0"
              max="65535"
              value={formData.minor}
              onChange={(e) => handleInputChange("minor", Number.parseInt(e.target.value) || 0)}
              className="w-full bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button
              onClick={handleAdd}
              className="w-full bg-blue-400 hover:bg-blue-500 text-white rounded-full py-3 text-base font-medium"
            >
              Add
            </Button>
            <Button
              onClick={handleClose}
              variant="outline"
              className="w-full border-blue-400 text-blue-400 hover:bg-blue-50 rounded-full py-3 text-base font-medium bg-white"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
