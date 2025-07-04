import { supabase } from "@/lib/supabase/client"
import { config } from "@/lib/config/env"
import { generateUUID } from "@/lib/utils/uuid"

export interface LocationRequest {
  uuid: string
  locationName: string
  jsonUrl: string
}

export interface LocationResponse {
  success: boolean
  message: string
  data?: any
}

export interface UploadMappingRequest {
  locationName: string
  mappingData: any
}

export class LocationAPI {
  private static async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${config.api.baseUrl}${endpoint}`

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    return response.json()
  }

  static async uploadMappingData(request: UploadMappingRequest): Promise<string> {
    try {
      // Generate UUID for location
      const uuid = generateUUID()

      // Create JSON file content
      const jsonContent = {
        uuid,
        locationName: request.locationName,
        mappingData: request.mappingData,
        createdAt: new Date().toISOString(),
      }

      // Convert to blob
      const jsonBlob = new Blob([JSON.stringify(jsonContent, null, 2)], {
        type: "application/json",
      })

      // Upload to Supabase storage
      const fileName = `locations/${uuid}.json`
      const { data, error } = await supabase.storage.from("mapping-data").upload(fileName, jsonBlob, {
        cacheControl: "3600",
        upsert: false,
      })

      if (error) {
        throw new Error(`Upload failed: ${error.message}`)
      }

      // Get public URL
      const { data: urlData } = supabase.storage.from("mapping-data").getPublicUrl(fileName)

      return urlData.publicUrl
    } catch (error) {
      console.error("Error uploading mapping data:", error)
      throw error
    }
  }

  static async addLocation(request: LocationRequest): Promise<LocationResponse> {
    return this.makeRequest<LocationResponse>("/add-location", {
      method: "POST",
      body: JSON.stringify(request),
    })
  }

  static async getLocation(uuid: string): Promise<LocationResponse> {
    return this.makeRequest<LocationResponse>(`/location/${uuid}`, {
      method: "GET",
    })
  }

  static async getAllLocations(): Promise<LocationResponse> {
    return this.makeRequest<LocationResponse>("/locations", {
      method: "GET",
    })
  }
}
