import { NextResponse } from "next/server"
import type { Location } from "@/types/navigation"

// Mock data - replace with actual database
const mockLocations: Location[] = [
  {
    id: "campus-1",
    name: "Main Campus",
    address: "123 University Ave",
    floors: [
      {
        id: "floor-1-1",
        name: "Ground Floor",
        locationId: "campus-1",
        floorNumber: 1,
        imageUrl: "/sample-floorplan.png",
        width: 1000,
        height: 600,
        scale: 10, // 10 pixels per meter
        nodes: [
          { id: "n1", x: 100, y: 100, type: "entrance", label: "Main Entrance" },
          { id: "n2", x: 300, y: 100, type: "intersection" },
          { id: "n3", x: 500, y: 100, type: "intersection" },
          { id: "n4", x: 700, y: 100, type: "intersection" },
          { id: "n5", x: 300, y: 300, type: "intersection" },
          { id: "n6", x: 500, y: 300, type: "intersection" },
          { id: "n7", x: 700, y: 300, type: "intersection" },
        ],
        edges: [
          { id: "e1", from: "n1", to: "n2", weight: 200 },
          { id: "e2", from: "n2", to: "n3", weight: 200 },
          { id: "e3", from: "n3", to: "n4", weight: 200 },
          { id: "e4", from: "n2", to: "n5", weight: 200 },
          { id: "e5", from: "n3", to: "n6", weight: 200 },
          { id: "e6", from: "n4", to: "n7", weight: 200 },
          { id: "e7", from: "n5", to: "n6", weight: 200 },
          { id: "e8", from: "n6", to: "n7", weight: 200 },
        ],
        pois: [
          { id: "p1", name: "Reception", x: 150, y: 80, type: "office" },
          { id: "p2", name: "Restroom", x: 250, y: 150, type: "restroom" },
          { id: "p3", name: "Conference Room A", x: 450, y: 80, type: "meeting" },
          { id: "p4", name: "Emergency Exit", x: 750, y: 80, type: "emergency" },
          { id: "p5", name: "Elevator", x: 350, y: 350, type: "elevator" },
        ],
      },
    ],
  },
]

export async function GET() {
  return NextResponse.json(mockLocations)
}

export async function POST(request: Request) {
  const location: Location = await request.json()

  // In a real app, save to database
  mockLocations.push(location)

  return NextResponse.json(location, { status: 201 })
}
