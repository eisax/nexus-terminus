"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HelpCircle, Plus } from "lucide-react"
import { AddNotificationDialog } from "@/components/add-notification-dialog"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function NotificationsPage() {
  const [selectedLocation, setSelectedLocation] = useState("campus")
  const [selectedFloor, setSelectedFloor] = useState("ozzene campus")
  const [showAddNotificationDialog, setShowAddNotificationDialog] = useState(false)

  const handleAddNotification = () => {
    setShowAddNotificationDialog(true)
  }

  const handleAddNotificationSubmit = (notificationData: any) => {
    console.log("New notification:", notificationData)
    // In a real app, you would save this to your database
    setShowAddNotificationDialog(false)
  }

  return (

    <ProtectedRoute>

    <div className="h-screen flex bg-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 bg-gray-100 overflow-y-auto">
        {/* Top Section with Dropdowns */}
        <div className="bg-gray-100 p-6 border-b border-gray-200">
          <div className="flex items-center gap-6">
            {/* Location Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600 font-medium">Location</label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-48 bg-white border border-gray-300 rounded-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="campus">campus</SelectItem>
                  <SelectItem value="downtown">downtown</SelectItem>
                  <SelectItem value="warehouse">warehouse</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Floor Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600 font-medium">Floor</label>
              <Select value={selectedFloor} onValueChange={setSelectedFloor}>
                <SelectTrigger className="w-48 bg-white border border-gray-300 rounded-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ozzene campus">ozzene campus</SelectItem>
                  <SelectItem value="ground floor">ground floor</SelectItem>
                  <SelectItem value="second floor">second floor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Main Content - Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          {/* Illustration */}
          <div className="mb-8 relative">
            {/* Bell Icon with decorative elements */}
            <div className="relative">
              {/* Main bell shape */}
              <div className="w-24 h-24 bg-gray-300 rounded-t-full relative">
                {/* Bell body */}
                <div className="absolute inset-x-2 top-2 bottom-0 bg-gray-400 rounded-t-full"></div>
                {/* Bell handle */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-3 h-2 bg-gray-500 rounded-t-full"></div>
                {/* Bell clapper */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-3 bg-red-400 rounded-full"></div>
              </div>

              {/* Decorative dots and lines */}
              <div className="absolute -top-4 -left-8">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              </div>
              <div className="absolute -top-2 -right-6">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              </div>
              <div className="absolute top-8 -right-8">
                <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
              </div>
              <div className="absolute -bottom-2 -left-6">
                <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
              </div>

              {/* Decorative lines */}
              <div className="absolute top-4 -left-12">
                <div className="w-8 h-0.5 bg-gray-400 transform rotate-12"></div>
              </div>
              <div className="absolute top-12 -right-10">
                <div className="w-6 h-0.5 bg-gray-400 transform -rotate-12"></div>
              </div>
              <div className="absolute -bottom-4 left-8">
                <div className="w-4 h-0.5 bg-blue-400 transform rotate-45"></div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">You haven't set up any notifications yet</h2>
            <p className="text-gray-600 text-lg">Click the "Add notification" button to start setting up</p>
          </div>

          {/* Add Notification Button */}
          <Button
            onClick={handleAddNotification}
            className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-medium"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add notification
          </Button>
        </div>

        {/* Bottom Section with Nexus Logo */}
        <div className="fixed bottom-6 left-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
            </div>
            <span className="text-xl font-bold text-gray-900">Nexus</span>
          </div>
        </div>

        {/* Help Button */}
        <div className="fixed bottom-6 right-6">
          <Button className="w-12 h-12 bg-blue-400 hover:bg-blue-500 text-white rounded-full shadow-lg">
            <HelpCircle className="w-6 h-6" />
          </Button>
        </div>
        {/* Add Notification Dialog */}
        <AddNotificationDialog
          open={showAddNotificationDialog}
          onClose={() => setShowAddNotificationDialog(false)}
          onAdd={handleAddNotificationSubmit}
        />
      </div>
    </div>

    </ProtectedRoute>

  )
}
