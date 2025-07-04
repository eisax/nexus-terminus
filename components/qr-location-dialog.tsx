"use client"

import type React from "react"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { QRCodeCanvas } from "qrcode.react"
import { LocationAPI } from "@/lib/api/locations"
import { config } from "@/lib/config/env"
import { generateUUID } from "@/lib/utils/uuid"
import { Loader2 } from "lucide-react"

interface QrLocationDialogProps {
  children?: React.ReactNode
  mappingData?: any
}

export function QrLocationDialog({ children, mappingData }: QrLocationDialogProps) {
  const [open, setOpen] = useState(false)
  const [locationName, setLocationName] = useState("")
  const [qrUrl, setQrUrl] = useState("")
  const [uuid, setUuid] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)

  const handleGenerateQR = async () => {
    if (!locationName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a location name",
        variant: "destructive",
      })
      return
    }

    if (!mappingData) {
      toast({
        title: "Error",
        description: "No mapping data available",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Upload mapping data to Supabase and get URL
      const jsonUrl = await LocationAPI.uploadMappingData({
        locationName: locationName.trim(),
        mappingData,
      })

      // Extract UUID from the uploaded file path
      const uploadedUuid = jsonUrl.split("/").pop()?.replace(".json", "") || generateUUID()

      // Send location data to backend
      const response = await LocationAPI.addLocation({
        uuid: uploadedUuid,
        locationName: locationName.trim(),
        jsonUrl,
      })

      if (response.success) {
        setUuid(uploadedUuid)
        const qrCodeUrl = `${config.app.url}/location/${uploadedUuid}`
        setQrUrl(qrCodeUrl)
        setIsGenerated(true)

        toast({
          title: "Success",
          description: "Location created and QR code generated successfully",
        })
      } else {
        throw new Error(response.message || "Failed to create location")
      }
    } catch (error: any) {
      console.error("Error generating QR code:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to generate QR code",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleCopyUUID = () => {
    navigator.clipboard.writeText(uuid)
    toast({
      title: "Copied",
      description: "UUID copied to clipboard",
    })
  }

  const handleCopyQRUrl = () => {
    navigator.clipboard.writeText(qrUrl)
    toast({
      title: "Copied",
      description: "QR URL copied to clipboard",
    })
  }

  const handleReset = () => {
    setLocationName("")
    setQrUrl("")
    setUuid("")
    setIsGenerated(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      handleReset()
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      {children && <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>}
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Generate Location QR Code</AlertDialogTitle>
          <AlertDialogDescription>
            {!isGenerated
              ? "Enter a location name to generate a QR code for this mapping data."
              : "QR code generated successfully. Scan to access the location."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          {!isGenerated ? (
            <div className="grid gap-2">
              <Label htmlFor="locationName">Location Name</Label>
              <Input
                id="locationName"
                type="text"
                placeholder="Enter location name..."
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                disabled={isUploading}
              />
            </div>
          ) : (
            <>
              <div className="flex justify-center">
                <QRCodeCanvas value={qrUrl} size={200} />
              </div>

              <div className="space-y-2">
                <div className="grid gap-2">
                  <Label htmlFor="generatedUuid">UUID</Label>
                  <div className="flex gap-2">
                    <Input id="generatedUuid" type="text" value={uuid} readOnly className="font-mono text-sm" />
                    <Button type="button" variant="outline" size="sm" onClick={handleCopyUUID}>
                      Copy
                    </Button>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="generatedUrl">QR URL</Label>
                  <div className="flex gap-2">
                    <Input id="generatedUrl" type="text" value={qrUrl} readOnly className="font-mono text-sm" />
                    <Button type="button" variant="outline" size="sm" onClick={handleCopyQRUrl}>
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleReset}>{isGenerated ? "Close" : "Cancel"}</AlertDialogCancel>
          {!isGenerated && (
            <AlertDialogAction onClick={handleGenerateQR} disabled={isUploading || !locationName.trim()}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate QR Code"
              )}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
