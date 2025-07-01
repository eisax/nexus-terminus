"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { X, ChevronDown, Check, Plus } from "lucide-react"

interface AddNotificationDialogProps {
  open: boolean
  onClose: () => void
  onAdd: (notification: NotificationData) => void
}

interface NotificationData {
  transmitters: string[]
  title: string
  description: string
  interval: string
  priority: string
  proximity: string
  active: boolean
  picture?: File
}

const transmitterOptions = [
  { id: "tac1", name: "TAC1" },
  { id: "qwmnh", name: "qWmnh" },
  { id: "m9kw", name: "M9KW" },
]

const proximityOptions = [
  { value: "immediate", label: "Immediate" },
  { value: "near", label: "Near" },
  { value: "far", label: "Far" },
]

export function AddNotificationDialog({ open, onClose, onAdd }: AddNotificationDialogProps) {
  const [selectedTransmitters, setSelectedTransmitters] = useState<string[]>(["TAC1"])
  const [formData, setFormData] = useState<NotificationData>({
    transmitters: ["TAC1"],
    title: "",
    description: "",
    interval: "",
    priority: "",
    proximity: "immediate",
    active: true,
  })
  const [selectedPicture, setSelectedPicture] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (field: keyof NotificationData, value: string | boolean | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleTransmitterRemove = (transmitter: string) => {
    const updated = selectedTransmitters.filter((t) => t !== transmitter)
    setSelectedTransmitters(updated)
    handleInputChange("transmitters", updated)
  }

  const handleAddBeacons = () => {
    console.log("Add beacons clicked")
    // This would open a beacon selection dialog
  }

  const handleAddPicture = () => {
    fileInputRef.current?.click()
  }

  const handlePictureSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedPicture(file)
      setFormData((prev) => ({
        ...prev,
        picture: file,
      }))
    }
  }

  const handleAdd = () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Please fill in all required fields")
      return
    }

    onAdd(formData)
    handleClose()
  }

  const handleClose = () => {
    setFormData({
      transmitters: ["TAC1"],
      title: "",
      description: "",
      interval: "",
      priority: "",
      proximity: "immediate",
      active: true,
    })
    setSelectedTransmitters(["TAC1"])
    setSelectedPicture(null)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg w-full mx-4 bg-white rounded-3xl shadow-xl border-0 p-0 max-h-[90vh] overflow-y-auto">
        {/* Form Content */}
        <div className="p-8 space-y-6">
          {/* Transmitters Section */}
          <div className="space-y-3">
            <Label className="text-lg font-medium text-gray-700">
              <span className="text-red-500">*</span> Transmitters
            </Label>

            {/* Selected Transmitters */}
            <div className="space-y-2">
              {selectedTransmitters.map((transmitter) => (
                <div
                  key={transmitter}
                  className="flex items-center justify-between p-3 bg-white border-2 border-blue-500 rounded-lg"
                >
                  <span className="text-gray-900 font-medium">{transmitter}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleTransmitterRemove(transmitter)}
                      className="h-6 w-6 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>

            {/* Add Beacons Link */}
            <Button
              variant="link"
              onClick={handleAddBeacons}
              className="text-blue-500 hover:text-blue-600 p-0 h-auto font-normal"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add beacons
            </Button>
          </div>

          {/* Title */}
          <div className="space-y-3">
            <Label htmlFor="title" className="text-lg font-medium text-gray-700">
              <span className="text-red-500">*</span> Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full h-12 bg-white border-2 border-gray-200 rounded-lg text-base px-4"
              placeholder=""
            />
          </div>

          {/* Description */}
          <div className="space-y-3">
            <Label htmlFor="description" className="text-lg font-medium text-gray-700">
              <span className="text-red-500">*</span> Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full min-h-[120px] bg-white border-2 border-gray-200 rounded-lg text-base px-4 py-3 resize-none"
              placeholder=""
            />
          </div>

          {/* Three Column Fields */}
          <div className="grid grid-cols-3 gap-4">
            {/* Interval */}
            <div className="space-y-3">
              <Label htmlFor="interval" className="text-lg font-medium text-gray-700">
                <span className="text-red-500">*</span> Interval
              </Label>
              <Input
                id="interval"
                value={formData.interval}
                onChange={(e) => handleInputChange("interval", e.target.value)}
                className="w-full h-12 bg-white border-2 border-gray-200 rounded-lg text-base px-4"
                placeholder=""
              />
            </div>

            {/* Priority */}
            <div className="space-y-3">
              <Label htmlFor="priority" className="text-lg font-medium text-gray-700">
                <span className="text-red-500">*</span> Priority
              </Label>
              <Input
                id="priority"
                value={formData.priority}
                onChange={(e) => handleInputChange("priority", e.target.value)}
                className="w-full h-12 bg-white border-2 border-gray-200 rounded-lg text-base px-4"
                placeholder=""
              />
            </div>

            {/* Proximity */}
            <div className="space-y-3">
              <Label htmlFor="proximity" className="text-lg font-medium text-gray-700">
                <span className="text-red-500">*</span> Proximity
              </Label>
              <Select value={formData.proximity} onValueChange={(value) => handleInputChange("proximity", value)}>
                <SelectTrigger className="w-full h-12 bg-white border-2 border-gray-200 rounded-lg text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 rounded-lg shadow-lg">
                  {proximityOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-white hover:bg-gray-600 focus:bg-gray-600 py-3 px-4"
                    >
                      <div className="flex items-center gap-3">
                        {formData.proximity === option.value && <Check className="w-4 h-4 text-white" />}
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center gap-4">
            <Label className="text-lg font-medium text-gray-700">
              <span className="text-red-500">*</span> Active
            </Label>
            <Switch
              checked={formData.active}
              onCheckedChange={(checked) => handleInputChange("active", checked)}
              className="data-[state=checked]:bg-green-500"
            />
          </div>

          {/* Add Picture */}
          <div>
            <Button
              variant="link"
              onClick={handleAddPicture}
              className="text-blue-500 hover:text-blue-600 p-0 h-auto font-normal"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add picture
            </Button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePictureSelect} className="hidden" />
            {selectedPicture && <div className="mt-2 text-sm text-gray-600">Selected: {selectedPicture.name}</div>}
          </div>

          {/* Add Button */}
          <div className="pt-4">
            <Button
              onClick={handleAdd}
              className="w-full h-14 bg-gray-400 hover:bg-gray-500 text-white text-lg font-medium rounded-lg"
            >
              Add
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
