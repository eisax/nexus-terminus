"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { X, Check } from "lucide-react"

interface AddUserDialogProps {
  open: boolean
  onClose: () => void
  onAdd: (user: { email: string; role: string }) => void
}

const roleOptions = [
  { value: "watcher", label: "Watcher" },
  { value: "editor", label: "Editor" },
  { value: "admin", label: "Admin" },
]

export function AddUserDialog({ open, onClose, onAdd }: AddUserDialogProps) {
  const [email, setEmail] = useState("")
  const [selectedRole, setSelectedRole] = useState("watcher")

  const handleAdd = () => {
    if (!email.trim()) {
      alert("Please enter a user email")
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address")
      return
    }

    onAdd({
      email: email.trim(),
      role: selectedRole,
    })

    handleClose()
  }

  const handleClose = () => {
    setEmail("")
    setSelectedRole("watcher")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md w-full mx-4 bg-white rounded-2xl shadow-xl border-0 p-0">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-8 pb-6">
          <DialogTitle className="text-2xl font-medium text-gray-800">Add user to team</DialogTitle>
          <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8 p-0 hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-500" />
          </Button>
        </DialogHeader>

        {/* Form Content */}
        <div className="px-8 pb-8 space-y-6">
          {/* User Email */}
          <div className="space-y-3">
            <Label htmlFor="email" className="text-lg font-medium text-gray-800">
              User
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 bg-white border-2 border-red-400 rounded-lg text-base px-4 placeholder-gray-400"
              placeholder="User email"
            />
          </div>

          {/* Role */}
          <div className="space-y-3">
            <Label htmlFor="role" className="text-lg font-medium text-gray-800">
              Role
            </Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full h-12 bg-white border-2 border-gray-200 rounded-lg text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 rounded-lg shadow-lg">
                {roleOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-white hover:bg-gray-600 focus:bg-gray-600 py-3 px-4"
                  >
                    <div className="flex items-center gap-3">
                      {selectedRole === option.value && <Check className="w-4 h-4 text-white" />}
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Add Button */}
          <div className="pt-4">
            <Button
              onClick={handleAdd}
              className="w-full h-14 bg-blue-400 hover:bg-blue-500 text-white text-lg font-medium rounded-full"
            >
              Add
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
