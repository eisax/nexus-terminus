"use client"

import { useRouter, usePathname } from "next/navigation"
import { Home, MapPin, Bell, GitBranch, Package, User } from "lucide-react"

const sidebarItems = [
  { icon: Home, label: "Home page", id: "home", path: "/locations" },
  { icon: MapPin, label: "Locations", id: "locations", path: "/" },
  { icon: Bell, label: "Notifications", id: "notifications", path: "/notifications" },
  { icon: GitBranch, label: "Versions", id: "versions", path: "/versions" },
  { icon: Package, label: "Apps", id: "apps", path: "/apps" },
  { icon: User, label: "Profile", id: "profile", path: "/profile" },
]

export function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <div className="w-48 bg-gray-50 border-r border-gray-200 flex flex-col h-screen">
      {/* Navigation */}
      <nav className="flex-1 py-4">
        <div className="space-y-1 px-3">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path

            return (
              <div
                key={item.id}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm cursor-pointer ${
                  isActive ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => handleNavigation(item.path)}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
            )
          })}
        </div>
      </nav>

      {/* Nexus Logo at bottom */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <span className="text-sm font-semibold text-gray-800">Nexus</span>
        </div>
      </div>
    </div>
  )
}
