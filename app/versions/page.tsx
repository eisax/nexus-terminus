"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit2, Download, HelpCircle } from "lucide-react"

interface VersionData {
  id: number
  version: number
  created: string
  comments: string
  size: string
  email: string
}

export default function VersionsPage() {
  const [selectedLocation, setSelectedLocation] = useState("campus")

  const versionsData: VersionData[] = [
    {
      id: 52008,
      version: 22,
      created: "01 Jul 2025 12:29",
      comments: "make new version",
      size: "169.83 KB",
      email: "eisaxoffice@ozzene.com",
    },
    {
      id: 51987,
      version: 21,
      created: "01 Jul 2025 03:17",
      comments: "Save action performed",
      size: "169.83 KB",
      email: "eisaxoffice@ozzene.com",
    },
    {
      id: 51986,
      version: 20,
      created: "01 Jul 2025 03:15",
      comments: "upload from mobile",
      size: "169.83 KB",
      email: "eisaxoffice@ozzene.com",
    },
    {
      id: 51985,
      version: 19,
      created: "01 Jul 2025 03:15",
      comments: "upload from mobile",
      size: "169.78 KB",
      email: "eisaxoffice@ozzene.com",
    },
    {
      id: 51984,
      version: 18,
      created: "01 Jul 2025 03:12",
      comments: "Save action performed",
      size: "169.88 KB",
      email: "eisaxoffice@ozzene.com",
    },
    {
      id: 51983,
      version: 17,
      created: "01 Jul 2025 02:58",
      comments: "Save action performed",
      size: "170.54 KB",
      email: "eisaxoffice@ozzene.com",
    },
    {
      id: 51982,
      version: 16,
      created: "01 Jul 2025 02:58",
      comments: "Save action performed",
      size: "170.56 KB",
      email: "eisaxoffice@ozzene.com",
    },
    {
      id: 51981,
      version: 15,
      created: "01 Jul 2025 02:53",
      comments: "Save action performed",
      size: "170.56 KB",
      email: "eisaxoffice@ozzene.com",
    },
    {
      id: 51980,
      version: 14,
      created: "01 Jul 2025 02:52",
      comments: "upload from mobile",
      size: "170.31 KB",
      email: "eisaxoffice@ozzene.com",
    },
  ]

  const handleGetLogs = () => {
    console.log("Get logs for location:", selectedLocation)
  }

  const handleEdit = (id: number) => {
    console.log("Edit version:", id)
  }

  const handleDownload = (id: number) => {
    console.log("Download version:", id)
  }

  return (
    <div className="h-screen flex bg-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 bg-gray-100 overflow-y-auto">
        {/* Top Section */}
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

            {/* Get Logs Button */}
            <div className="flex flex-col gap-2">
              <div className="h-5"></div> {/* Spacer to align with dropdown */}
              <Button
                onClick={handleGetLogs}
                className="bg-blue-400 hover:bg-blue-500 text-white px-8 py-2 rounded-full"
              >
                Get logs
              </Button>
            </div>
          </div>
        </div>

        {/* Versions Table */}
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Version</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Created</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Comments</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Size</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {versionsData.map((version, index) => (
                    <tr key={version.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-6 py-4 text-sm text-gray-900">{version.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{version.version}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{version.created}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{version.comments}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{version.size}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{version.email}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(version.id)}
                            className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownload(version.id)}
                            className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
      </div>
    </div>
  )
}
