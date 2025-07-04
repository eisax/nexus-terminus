"use client"

import { Sidebar } from "@/components/sidebar"
import { Toolbar } from "@/components/toolbar"
import { FloorPlanCanvas } from "@/components/floor-plan-canvas"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function NavigationApp() {
  return (
    <ProtectedRoute>
      <div className="h-screen flex bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Toolbar />
        <FloorPlanCanvas />
      </div>
    </div>
    </ProtectedRoute>
    
  )
}
