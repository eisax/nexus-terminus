export interface Node {
  id: string
  x: number
  y: number
  type: "room" | "intersection" | "door" | "entrance"
  label?: string
}

export interface Edge {
  id: string
  from: string
  to: string
  weight: number
  bidirectional?: boolean
}

export interface POI {
  id: string
  name: string
  x: number
  y: number
  type: "office" | "restroom" | "emergency" | "elevator" | "stairs" | "meeting" | "other"
  icon?: string
  description?: string
}

export interface FloorPlan {
  id: string
  name: string
  locationId: string
  floorNumber: number
  imageUrl: string
  width: number
  height: number
  scale: number
  nodes: Node[]
  edges: Edge[]
  pois: POI[]
}

export interface Location {
  id: string
  name: string
  address: string
  floors: FloorPlan[]
}

export type UserRole = "admin" | "editor" | "viewer"

export interface PathResult {
  path: Node[]
  distance: number
  edges: Edge[]
}
