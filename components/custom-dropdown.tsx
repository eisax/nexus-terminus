"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface DropdownOption {
  id: string
  name: string
}

interface CustomDropdownProps {
  label: string
  value: string
  options: DropdownOption[]
  onSelect: (option: DropdownOption) => void
  onAdd: () => void
  addLabel: string
  placeholder?: string
}

export function CustomDropdown({
  label,
  value,
  options,
  onSelect,
  onAdd,
  addLabel,
  placeholder = "Search...",
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filteredOptions = options.filter((option) => option.name.toLowerCase().includes(searchTerm.toLowerCase()))

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (option: DropdownOption) => {
    onSelect(option)
    setIsOpen(false)
    setSearchTerm("")
  }

  const handleAdd = () => {
    onAdd()
    setIsOpen(false)
    setSearchTerm("")
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-600 font-medium">{label}</span>
        <Button
          variant="ghost"
          className="h-7 px-3 text-xs border border-gray-300 hover:bg-gray-50 bg-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-gray-700">{value}</span>
          <ChevronDown className="w-3 h-3 ml-1 text-gray-500" />
        </Button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          {/* Search Bar */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-8 text-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                autoFocus
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelect(option)}
                className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors ${
                  option.name === value ? "bg-blue-500 text-white hover:bg-blue-600" : "text-gray-700"
                }`}
              >
                {option.name}
              </button>
            ))}

            {filteredOptions.length === 0 && searchTerm && (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">No results found</div>
            )}
          </div>

          {/* Add Option */}
          <div className="border-t border-gray-100">
            <button
              onClick={handleAdd}
              className="w-full px-4 py-3 text-left text-sm bg-blue-100 hover:bg-blue-200 transition-colors text-blue-700 flex items-center gap-2"
            >
              <div className="w-5 h-5 bg-blue-500 rounded-sm flex items-center justify-center">
                <Plus className="w-3 h-3 text-white" />
              </div>
              {addLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
