"use client"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Cloud, Bluetooth, TrendingUp, Monitor, ExternalLink, Github, FileText,Apple } from "lucide-react"

export default function LocationsPage() {
  const handleUpload = () => {
    console.log("Upload floor plan")
  }

  const handleGooglePlay = () => {
    window.open("https://play.google.com/store", "_blank")
  }

  const handleAppStore = () => {
    window.open("https://apps.apple.com", "_blank")
  }

  const handleDocumentation = () => {
    window.open("https://docs.Nexus.com", "_blank")
  }

  const handleGitHub = () => {
    window.open("https://github.com/Nexus", "_blank")
  }

  const handleAndroidSDK = () => {
    window.open("https://github.com/Nexus/Android-SDK", "_blank")
  }

  const handleiOSSDK = () => {
    window.open("https://github.com/Nexus/iOS-SDK", "_blank")
  }

  return (
    <div className="h-screen flex bg-white overflow-hidden">
      <Sidebar />
      <div className=" bg-gray-50  ">
        {/* Main Content */}
        <div className="p-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Welcome to Nexux!</h1>
            <p className="text-lg text-gray-600">These are simple steps to set up your first location</p>
          </div>

          {/* Step Process */}
          <div className="mb-12">
            {/* Step Numbers */}
            <div className="flex items-center justify-between max-w-4xl mx-auto mb-8">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center text-lg font-medium text-gray-700">
                  1
                </div>
                <div className="w-32 h-0.5 bg-gray-300 ml-4"></div>
              </div>
              <div className="flex items-center">
                <div className="w-32 h-0.5 bg-gray-300 mr-4"></div>
                <div className="w-12 h-12 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center text-lg font-medium text-gray-700">
                  2
                </div>
                <div className="w-32 h-0.5 bg-gray-300 ml-4"></div>
              </div>
              <div className="flex items-center">
                <div className="w-32 h-0.5 bg-gray-300 mr-4"></div>
                <div className="w-12 h-12 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center text-lg font-medium text-gray-700">
                  3
                </div>
                <div className="w-32 h-0.5 bg-gray-300 ml-4"></div>
              </div>
              <div className="flex items-center">
                <div className="w-32 h-0.5 bg-gray-300 mr-4"></div>
                <div className="w-12 h-12 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center text-lg font-medium text-gray-700">
                  4
                </div>
              </div>
            </div>

            {/* Step Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {/* Step 1: Add new location */}
              <Card className="bg-white shadow-sm border border-gray-200 h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-16 h-10  rounded-lg flex items-center justify-center mb-4">
                      <Cloud className="w-10 h-10 text-green-600" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Add new location</h3>
                    <p className="text-gray-600 text-sm">Upload floor plan</p>
                  </div>
                  <div className="mt-auto">
                    <Button
                      onClick={handleUpload}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                    >
                      Upload
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Step 2: Set up Equipment */}
              <Card className="bg-white shadow-sm border border-gray-200 h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-16 h-10 rounded-lg flex items-center justify-center mb-4">
                      <Bluetooth className="w-10 h-10 text-green-600" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Set up Equipment</h3>
                    <p className="text-gray-600 text-sm mb-4">Acquire beacons and mount them</p>
                  </div>
                  <div className="mt-auto">
                    <p className="text-sm text-gray-600 mb-3">Get the app</p>
                    <div className="space-y-2">
                      <Button
                        onClick={handleGooglePlay}
                        variant="outline"
                        className="w-full border-blue-300 text-blue-600 hover:bg-blue-50 rounded-md text-sm py-2 bg-transparent"
                      >
                        <span className="mr-2">▶</span>
                        Google Play
                      </Button>
                      <Button
                        onClick={handleAppStore}
                        variant="outline"
                        className="w-full border-blue-300 text-blue-600 hover:bg-blue-50 rounded-md text-sm py-2 bg-transparent"
                      >
                        <span className="mr-2">
                          <Apple className="w-4 h-4" />
                        </span>
                        App Store
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Step 3: Configure the location */}
              <Card className="bg-white shadow-sm border border-gray-200 h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-16 h-10 rounded-lg flex items-center justify-center mb-4">
                      <TrendingUp className="w-10 h-10 text-green-600" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Configure the location</h3>
                    <p className="text-gray-600 text-sm mb-4">Divide your venue into areas, points and paths</p>
                  </div>
                  <div className="mt-auto">
                    <p className="text-sm text-gray-600 mb-3">Resources</p>
                    <Button
                      onClick={handleDocumentation}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Documentation
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Step 4: Set up the app */}
              <Card className="bg-white shadow-sm border border-gray-200 h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-16 h-10 rounded-lg flex items-center justify-center mb-4">
                      <Monitor className="w-10 h-10 text-green-600" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Set up the app</h3>
                    <p className="text-gray-600 text-sm mb-4">Integrate Nexus SDK into your application</p>
                  </div>
                  <div className="mb-auto">
                    <p className="text-sm text-gray-600 mb-3">Resources</p>
                    <div className="space-y-2">
                      <Button
                        onClick={handleGitHub}
                        variant="outline"
                        className="w-full border-green-300 text-green-600 hover:bg-green-50 rounded-md text-sm py-2 bg-transparent"
                      >
                        <Github className="w-4 h-4 mr-2" />
                        GitHub
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleAndroidSDK}
                          variant="link"
                          className="flex-1 text-blue-500 hover:text-blue-600 text-xs p-1 h-auto"
                        >
                          Android SDK wiki
                        </Button>
                        <Button
                          onClick={handleiOSSDK}
                          variant="link"
                          className="flex-1 text-blue-500 hover:text-blue-600 text-xs p-1 h-auto"
                        >
                          iOS SDK wiki
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
