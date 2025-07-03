"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Trash2 } from "lucide-react"
import { AddOptionsDialog } from "@/components/add-options-dialog"
import { AddUserDialog } from "@/components/add-user-dialog"
import { AddLocationDialog } from "@/components/add-location-dialog"
import { ProtectedRoute } from "@/components/auth/protected-route"

interface AppOption {
  id: string
  key: string
  value: string | number | boolean
  type: "tracking" | "reports"
}

interface TeamMember {
  id: string
  name: string
  role: "Admin" | "User"
  avatar?: string
}

interface AppLocation {
  id: string
  name: string
  creator: string
  added: string
}

export default function AppsPage() {
  const [selectedApp, setSelectedApp] = useState("ozzene")
  const [appEnabled, setAppEnabled] = useState(true)
  const [showAppDetails, setShowAppDetails] = useState(true)
  const [showAddOptionsDialog, setShowAddOptionsDialog] = useState(false)
  const [showAddUserDialog, setShowAddUserDialog] = useState(false)
  const [showAddLocationDialog, setShowAddLocationDialog] = useState(false)

  // Mock data
  const appOptions: AppOption[] = [
    { id: "1", key: "outdated_data", value: 48, type: "tracking" },
    { id: "2", key: "object_ttl", value: 60, type: "tracking" },
    { id: "3", key: "dashboard", value: true, type: "reports" },
    { id: "4", key: "object_reports", value: true, type: "reports" },
    { id: "5", key: "alert_reports", value: true, type: "reports" },
    { id: "6", key: "monitoring_devices", value: true, type: "reports" },
  ]

  const teamMembers: TeamMember[] = [
    { id: "1", name: "ozzene", role: "Admin" },
    { id: "2", name: "tracking user", role: "Admin" },
  ]

  const appLocations: AppLocation[] = [{ id: "1", name: "campus", creator: "ozzene", added: "2025-07-01 02:19:44" }]

  const handleDeleteOption = (optionId: string) => {
    console.log("Delete option:", optionId)
  }

  const handleDeleteTeamMember = (memberId: string) => {
    console.log("Delete team member:", memberId)
  }

  const handleDeleteLocation = (locationId: string) => {
    console.log("Delete location:", locationId)
  }

  const handleRoleChange = (memberId: string, newRole: string) => {
    console.log("Change role:", memberId, newRole)
  }

  const handleAddOption = (option: { type: string; key: string; value: string }) => {
    console.log("Add option:", option)
    // In a real app, you would add this to your state/database
    setShowAddOptionsDialog(false)
  }

  const handleAddUser = (user: { email: string; role: string }) => {
    console.log("Add user:", user)
    // In a real app, you would add this to your state/database
    setShowAddUserDialog(false)
  }

  const handleAddLocation = (location: { id: string; name: string }) => {
    console.log("Add location:", location)
    // In a real app, you would add this to your state/database
    setShowAddLocationDialog(false)
  }

  return (
      <ProtectedRoute>
          <div className="h-screen flex bg-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          {!showAppDetails ? (
            <>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-normal text-gray-800">Apps</h1>
              </div>

              {/* App Selector */}
              <div className="mb-6">
                <Select value={selectedApp} onValueChange={setSelectedApp}>
                  <SelectTrigger className="w-48 bg-white border border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ozzene">ozzene</SelectItem>
                    <SelectItem value="campus">campus</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* App Options Table */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <tbody>
                      {appOptions.map((option, index) => (
                        <tr key={option.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                          <td className="px-6 py-4 text-sm text-gray-900">{option.key}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {typeof option.value === "boolean" ? (option.value ? "true" : "false") : option.value}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{option.type}</td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteOption(option.id)}
                              className="text-gray-500 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 border-t border-gray-200">
                  <Button
                    variant="ghost"
                    className="text-gray-600 bg-gray-100 hover:bg-gray-200"
                    onClick={() => setShowAddOptionsDialog(true)}
                  >
                    Add Options
                  </Button>
                </div>
              </div>

              {/* Team Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    Team <span className="text-gray-500 font-normal">/ Users who can manage the application</span>
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Profile picture</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Participant</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Role</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Options</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamMembers.map((member, index) => (
                        <tr key={member.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                          <td className="px-6 py-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{member.name}</td>
                          <td className="px-6 py-4">
                            {member.name === "ozzene" ? (
                              <span className="text-sm text-gray-900">{member.role}</span>
                            ) : (
                              <Select value={member.role} onValueChange={(value) => handleRoleChange(member.id, value)}>
                                <SelectTrigger className="w-32 h-8 text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Admin">Admin</SelectItem>
                                  <SelectItem value="User">User</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {member.name !== "ozzene" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteTeamMember(member.id)}
                                className="text-gray-500 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 border-t border-gray-200">
                  <Button
                    variant="ghost"
                    className="text-gray-600 bg-gray-100 hover:bg-gray-200"
                    onClick={() => setShowAddUserDialog(true)}
                  >
                    Add user
                  </Button>
                </div>
              </div>

              {/* Locations Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    Locations <span className="text-gray-500 font-normal">Available in the app</span>
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Location</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Creator</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Added</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Options</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appLocations.map((location, index) => (
                        <tr key={location.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                          <td className="px-6 py-4 text-sm text-gray-900">{location.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{location.creator}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{location.added}</td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteLocation(location.id)}
                              className="text-gray-500 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 border-t border-gray-200">
                  <Button
                    variant="ghost"
                    className="text-gray-600 bg-gray-100 hover:bg-gray-200"
                    onClick={() => setShowAddLocationDialog(true)}
                  >
                    Add Location
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* App Details View */
            <div>
              {/* Header with Delete */}
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-normal text-gray-800">Apps</h1>
                <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                  Delete application
                </Button>
              </div>

              {/* App Selector */}
              <div className="mb-6">
                <Select value={selectedApp} onValueChange={setSelectedApp}>
                  <SelectTrigger className="w-48 bg-white border border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ozzene">ozzene</SelectItem>
                    <SelectItem value="campus">campus</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* App Details Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">ozzene</h2>
                  <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
                    Change
                  </Button>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-600 w-20">API Key:</span>
                    <span className="text-sm text-gray-900 font-mono">7b043346-7f2e-6359-aa81-fd20c293ff48</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-600 w-20">Created:</span>
                    <span className="text-sm text-gray-900">2025-07-01 02:05:14</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-600 w-20">APP ID:</span>
                    <span className="text-sm text-gray-900">967</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-600">Enable</span>
                  <Switch checked={appEnabled} onCheckedChange={setAppEnabled} />
                </div>
              </div>

              {/* Options Available in the app */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    Options <span className="text-gray-500 font-normal">Available in the app</span>
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Key</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Value</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Type</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Options</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appOptions.map((option, index) => (
                        <tr key={option.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                          <td className="px-6 py-4 text-sm text-gray-900">{option.key}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {typeof option.value === "boolean" ? (option.value ? "true" : "false") : option.value}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{option.type}</td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteOption(option.id)}
                              className="text-gray-500 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Team Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    Team <span className="text-gray-500 font-normal">/ Users who can manage the application</span>
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Profile picture</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Participant</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Role</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Options</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamMembers.map((member, index) => (
                        <tr key={member.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                          <td className="px-6 py-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{member.name}</td>
                          <td className="px-6 py-4">
                            {member.name === "ozzene" ? (
                              <span className="text-sm text-gray-900">{member.role}</span>
                            ) : (
                              <Select value={member.role} onValueChange={(value) => handleRoleChange(member.id, value)}>
                                <SelectTrigger className="w-32 h-8 text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Admin">Admin</SelectItem>
                                  <SelectItem value="User">User</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {member.name !== "ozzene" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteTeamMember(member.id)}
                                className="text-gray-500 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 border-t border-gray-200">
                  <Button
                    variant="ghost"
                    className="text-gray-600 bg-gray-100 hover:bg-gray-200"
                    onClick={() => setShowAddUserDialog(true)}
                  >
                    Add user
                  </Button>
                </div>
              </div>

              {/* Locations Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    Locations <span className="text-gray-500 font-normal">Available in the app</span>
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Location</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Creator</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Added</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Options</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appLocations.map((location, index) => (
                        <tr key={location.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                          <td className="px-6 py-4 text-sm text-gray-900">{location.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{location.creator}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{location.added}</td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteLocation(location.id)}
                              className="text-gray-500 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 border-t border-gray-200">
                  <Button
                    variant="ghost"
                    className="text-gray-600 bg-gray-100 hover:bg-gray-200"
                    onClick={() => setShowAddLocationDialog(true)}
                  >
                    Add Location
                  </Button>
                </div>
              </div>
            </div>
          )}
          {/* Add Options Dialog */}
          <AddOptionsDialog
            open={showAddOptionsDialog}
            onClose={() => setShowAddOptionsDialog(false)}
            onAdd={handleAddOption}
          />
          {/* Add User Dialog */}
          <AddUserDialog open={showAddUserDialog} onClose={() => setShowAddUserDialog(false)} onAdd={handleAddUser} />
          {/* Add Location Dialog */}
          <AddLocationDialog
            open={showAddLocationDialog}
            onClose={() => setShowAddLocationDialog(false)}
            onAdd={handleAddLocation}
          />
        </div>
      </div>
    </div>
      </ProtectedRoute>
  )
}
