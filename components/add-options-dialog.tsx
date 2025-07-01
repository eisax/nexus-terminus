"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { X, Check } from "lucide-react"

interface AddOptionsDialogProps {
  open: boolean
  onClose: () => void
  onAdd: (option: { type: string; key: string; value: string }) => void
}

const typeOptions = [
  { value: "work_day_picture", label: "Work day picture" },
  { value: "reports", label: "Reports" },
  { value: "tracking", label: "Tracking" },
]

const keyOptions = {
  work_day_picture: [
    { value: "time_limit", label: "time_limit" },
    { value: "distance_limit", label: "distance_limit" },
    { value: "smoothing_factor", label: "smoothing_factor" },
  ],
  reports: [
    { value: "dashboard", label: "dashboard" },
    { value: "object_reports", label: "object_reports" },
    { value: "alert_reports", label: "alert_reports" },
  ],
  tracking: [
    { value: "object_ttl", label: "object_ttl" },
    { value: "monitoring_devices", label: "monitoring_devices" },
    { value: "outdated_data", label: "outdated_data" },
  ],
}

export function AddOptionsDialog({ open, onClose, onAdd }: AddOptionsDialogProps) {
  const [selectedType, setSelectedType] = useState("work_day_picture")
  const [selectedKey, setSelectedKey] = useState("time_limit")
  const [value, setValue] = useState("60")

  const handleAdd = () => {
    if (!selectedType || !selectedKey || !value.trim()) {
      alert("Please fill in all fields")
      return
    }

    onAdd({
      type: selectedType,
      key: selectedKey,
      value: value,
    })

    handleClose()
  }

  const handleClose = () => {
    setSelectedType("work_day_picture")
    setSelectedKey("time_limit")
    setValue("60")
    onClose()
  }

  const handleTypeChange = (newType: string) => {
    setSelectedType(newType)
    // Reset key to first option of new type
    const firstKey = keyOptions[newType as keyof typeof keyOptions]?.[0]?.value
    if (firstKey) {
      setSelectedKey(firstKey)
    }
  }

  const availableKeys = keyOptions[selectedType as keyof typeof keyOptions] || []

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md w-full mx-4 bg-white rounded-2xl shadow-xl border-0 p-0">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-8 pb-6">
          <DialogTitle className="text-2xl font-medium text-gray-800">Set application parameters</DialogTitle>
          <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8 p-0 hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-500" />
          </Button>
        </DialogHeader>

        {/* Form Content */}
        <div className="px-8 pb-8 space-y-6">
          {/* Type */}
          <div className="space-y-3">
            <Label htmlFor="type" className="text-lg font-medium text-gray-800">
              Type
            </Label>
            <Select value={selectedType} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-full h-12 bg-white border-2 border-gray-200 rounded-lg text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 rounded-lg shadow-lg">
                {typeOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-white hover:bg-gray-600 focus:bg-gray-600 py-3 px-4"
                  >
                    <div className="flex items-center gap-3">
                      {selectedType === option.value && <Check className="w-4 h-4 text-white" />}
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Key */}
          <div className="space-y-3">
            <Label htmlFor="key" className="text-lg font-medium text-gray-800">
              Key
            </Label>
            <Select value={selectedKey} onValueChange={setSelectedKey}>
              <SelectTrigger className="w-full h-12 bg-white border-2 border-gray-200 rounded-lg text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 rounded-lg shadow-lg">
                {availableKeys.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-white hover:bg-gray-600 focus:bg-gray-600 py-3 px-4"
                  >
                    <div className="flex items-center gap-3">
                      {selectedKey === option.value && <Check className="w-4 h-4 text-white" />}
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Value */}
          <div className="space-y-3">
            <Label htmlFor="value" className="text-lg font-medium text-gray-800">
              Value
            </Label>
            <Input
              id="value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full h-12 bg-white border-2 border-gray-200 rounded-lg text-base px-4"
              placeholder="Enter value"
            />
          </div>

          {/* Set Button */}
          <div className="pt-4">
            <Button
              onClick={handleAdd}
              className="w-full h-14 bg-blue-400 hover:bg-blue-500 text-white text-lg font-medium rounded-full"
            >
              Set
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
