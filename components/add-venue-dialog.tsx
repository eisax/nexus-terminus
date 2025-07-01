"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { X, MapPin, Upload } from "lucide-react"

interface VenueData {
  name: string
  nickname: string
  description: string
  phone: string
  class: string
  kx: number
  ky: number
  image?: File
}

interface AddVenueDialogProps {
  open: boolean
  onClose: () => void
  onAdd: (venueData: VenueData) => void
  coordinates: { x: number; y: number }
}

export function AddVenueDialog({ open, onClose, onAdd, coordinates }: AddVenueDialogProps) {
  const [formData, setFormData] = useState<VenueData>({
    name: "",
    nickname: "",
    description: "",
    phone: "",
    class: "General",
    kx: coordinates.x / 1200, // Normalize to 0-1 range
    ky: coordinates.y / 800, // Normalize to 0-1 range
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (field: keyof VenueData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      setFormData((prev) => ({
        ...prev,
        image: file,
      }))
    }
  }

  const handleAdd = () => {
    if (!formData.name.trim()) {
      alert("Name is required")
      return
    }

    onAdd(formData)
    handleClose()
  }

  const handleClose = () => {
    setFormData({
      name: "",
      nickname: "",
      description: "",
      phone: "",
      class: "General",
      kx: coordinates.x / 1200,
      ky: coordinates.y / 800,
    })
    setSelectedImage(null)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg w-full mx-4 bg-white rounded-lg shadow-xl border-0 p-0 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4">
          <DialogTitle className="text-2xl font-normal text-gray-800">Add Venue</DialogTitle>
          <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8 p-0">
            <X className="h-5 w-5 text-gray-500" />
          </Button>
        </DialogHeader>

        {/* Form Content */}
        <div className="px-6 pb-6 space-y-3 max-h-[70vh] overflow-y-auto">
          {/* Name - Required */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              <span className="text-red-500">*</span> Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
              placeholder=""
            />
          </div>

          {/* Nickname */}
          <div className="space-y-2">
            <Label htmlFor="nickname" className="text-sm font-medium text-gray-700">
              Nickname
            </Label>
            <Input
              id="nickname"
              value={formData.nickname}
              onChange={(e) => handleInputChange("nickname", e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
              placeholder=""
            />
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
              className="w-full bg-white border border-gray-300 rounded-md min-h-[80px] resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
              placeholder=""
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Phone
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
              placeholder=""
            />
          </div>

          {/* Class - Required */}
          <div className="space-y-2">
            <Label htmlFor="class" className="text-sm font-medium text-gray-700">
              <span className="text-red-500">*</span> Class
            </Label>
            <Select value={formData.class} onValueChange={(value) => handleInputChange("class", value)}>
              <SelectTrigger className="w-full bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                    <MapPin className="w-2 h-2 text-white" />
                  </div>
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg">
                <SelectItem value="General" className="text-gray-900 hover:bg-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                      <MapPin className="w-2 h-2 text-white" />
                    </div>
                    General
                  </div>
                </SelectItem>
                <SelectItem value="Office" className="text-gray-900 hover:bg-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <MapPin className="w-2 h-2 text-white" />
                    </div>
                    Office
                  </div>
                </SelectItem>
                <SelectItem value="Meeting Room" className="text-gray-900 hover:bg-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <MapPin className="w-2 h-2 text-white" />
                    </div>
                    Meeting Room
                  </div>
                </SelectItem>
                <SelectItem value="Restroom" className="text-gray-900 hover:bg-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-cyan-500 rounded-full flex items-center justify-center">
                      <MapPin className="w-2 h-2 text-white" />
                    </div>
                    Restroom
                  </div>
                </SelectItem>
                <SelectItem value="Emergency" className="text-gray-900 hover:bg-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <MapPin className="w-2 h-2 text-white" />
                    </div>
                    Emergency
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="kx" className="text-sm font-medium text-gray-700">
                <span className="text-red-500">*</span> kx:
              </Label>
              <Input
                id="kx"
                type="number"
                step="0.000000000000001"
                value={formData.kx}
                onChange={(e) => handleInputChange("kx", Number.parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ky" className="text-sm font-medium text-gray-700">
                <span className="text-red-500">*</span> ky:
              </Label>
              <Input
                id="ky"
                type="number"
                step="0.000000000000001"
                value={formData.ky}
                onChange={(e) => handleInputChange("ky", Number.parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900 text-sm"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Image:</Label>
            <div
              className="w-full border-2 border-dashed border-blue-300 bg-blue-50 rounded-md p-4 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-100 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex items-center justify-center gap-2">
                <Upload className="w-4 h-4 text-blue-500" />
                <span className="text-blue-600 text-sm font-medium">
                  {selectedImage ? selectedImage.name : "Select file:"}
                </span>
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
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
