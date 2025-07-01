"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Edit2, Lock, ChevronDown } from "lucide-react"
import { EditFieldModal } from "@/components/edit-field-modal"

export default function ProfilePage() {
  const [language, setLanguage] = useState("English")
  const [editingField, setEditingField] = useState<string | null>(null)
  const [profileData, setProfileData] = useState({
    name: "ozzene",
    position: "developer",
    linkedin: "linkedin",
    phone: "263774259097",
    company: "ozzene tech solutions",
  })

  const profileFields = [
    { key: "name", label: "Name", value: profileData.name, editable: true },
    { key: "position", label: "Position", value: profileData.position, editable: true },
    { key: "linkedin", label: "LinkedIn", value: profileData.linkedin, editable: true },
    { key: "phone", label: "Phone number", value: profileData.phone, editable: true },
    { key: "company", label: "Company name", value: profileData.company, editable: true },
  ]

  const secureFields = [
    { label: "Token", sublabel: "userHash", value: "0048-823E-BAC7-DC42", locked: true },
    { label: "Server URL (mobile)", value: "ips.nexus.com", locked: false },
    { label: "E-mail", value: "eisaxoffice@ozzene.com", locked: true },
  ]

  const handleEditField = (fieldKey: string) => {
    setEditingField(fieldKey)
  }

  const handleSaveField = (fieldKey: string, newValue: string) => {
    setProfileData((prev) => ({
      ...prev,
      [fieldKey]: newValue,
    }))
    setEditingField(null)
  }

  const handleCloseEdit = () => {
    setEditingField(null)
  }

  const getCurrentEditingField = () => {
    return profileFields.find((field) => field.key === editingField)
  }

  return (
    <div className="h-screen flex bg-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <div className="flex gap-6 h-full">
          {/* Left Profile Card */}
          <Card className="w-80 bg-white shadow-sm border border-gray-200 h-fit">
            <CardContent className="p-8 flex flex-col items-center">
              {/* Profile Avatar */}
              <div className="w-32 h-32 bg-purple-700 rounded-full flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <span className="text-purple-700 text-2xl font-bold">O</span>
                </div>
              </div>

              {/* Profile Info */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{profileData.name}</h2>
                <p className="text-gray-600 text-sm">{profileData.company}</p>
              </div>

              {/* Exit Button */}
              <Button
                variant="outline"
                className="mb-12 px-8 py-2 border-2 border-pink-300 text-pink-500 hover:bg-pink-50 rounded-full bg-transparent"
              >
                Exit
              </Button>

              {/* Profile Completion */}
              <div className="w-full">
                <div className="text-center mb-4">
                  <span className="text-gray-700 font-medium">Profile completion 80%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-500 h-3 rounded-full" style={{ width: "80%" }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Personal Information Card */}
          <Card className="flex-1 bg-white shadow-sm border border-gray-200 h-fit">
            <CardContent className="p-8">
              <h1 className="text-2xl font-medium text-gray-900 mb-8">Personal information</h1>

              <div className="space-y-6">
                {/* Editable Fields */}
                {profileFields.map((field, index) => (
                  <div key={index} className="flex items-center justify-between py-4 border-b border-gray-200">
                    <div className="flex-1">
                      <div className="text-lg font-medium text-gray-900 mb-1">{field.label}</div>
                      <div className="text-gray-600">{field.value}</div>
                    </div>
                    {field.editable && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-gray-600"
                        onClick={() => handleEditField(field.key)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}

                {/* Secure Fields */}
                {secureFields.map((field, index) => (
                  <div key={index} className="flex items-center justify-between py-4 border-b border-gray-200">
                    <div className="flex-1">
                      <div className="text-lg font-medium text-gray-900 mb-1">
                        {field.label}
                        {field.sublabel && (
                          <div className="text-sm font-normal text-gray-600 mt-1">{field.sublabel}</div>
                        )}
                      </div>
                      <div className="text-gray-600">{field.value}</div>
                    </div>
                    {field.locked && (
                      <Button variant="ghost" size="icon" className="text-gray-400">
                        <Lock className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}

                {/* Language Dropdown */}
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div className="flex-1">
                    <div className="text-lg font-medium text-gray-900 mb-1">Language</div>
                    <div className="text-gray-600">{language}</div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </div>

                {/* Password Field */}
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div className="flex-1">
                    <div className="text-lg font-medium text-gray-900 mb-1">Password</div>
                    <div className="text-gray-600">••••••••••••</div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Help Button */}
        <div className="fixed bottom-6 right-6">
          <Button className="w-12 h-12 bg-blue-400 hover:bg-blue-500 text-white rounded-full shadow-lg">
            <span className="text-lg font-bold">?</span>
          </Button>
        </div>
      </div>

      {/* Edit Field Modal */}
      {editingField && getCurrentEditingField() && (
        <EditFieldModal
          open={!!editingField}
          onClose={handleCloseEdit}
          onSave={(newValue) => handleSaveField(editingField, newValue)}
          fieldName={getCurrentEditingField()!.label}
          currentValue={getCurrentEditingField()!.value}
        />
      )}
    </div>
  )
}
