"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface EditFieldModalProps {
  open: boolean
  onClose: () => void
  onSave: (value: string) => void
  fieldName: string
  currentValue: string
}

export function EditFieldModal({ open, onClose, onSave, fieldName, currentValue }: EditFieldModalProps) {
  const [value, setValue] = useState(currentValue)

  const handleSave = () => {
    onSave(value)
    onClose()
  }

  const handleCancel = () => {
    setValue(currentValue) // Reset to original value
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="max-w-2xl w-full mx-4 bg-white rounded-3xl shadow-xl border-0 p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-8 pb-6">
          <h2 className="text-3xl font-medium text-gray-900">{fieldName}</h2>
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="text-2xl font-medium text-gray-600 hover:text-gray-800 hover:bg-transparent p-0"
          >
            Cancel
          </Button>
        </div>

        {/* Input Field */}
        <div className="px-8 pb-6">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full h-16 text-2xl bg-white border-2 border-gray-900 rounded-2xl px-6 focus:border-gray-900 focus:ring-0"
            autoFocus
          />
        </div>

        {/* Edit Button */}
        <div className="px-8 pb-8">
          <Button
            onClick={handleSave}
            className="bg-black hover:bg-gray-800 text-white text-xl font-medium py-4 px-12 rounded-2xl h-auto"
          >
            Edit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
