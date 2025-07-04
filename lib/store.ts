import { create } from "zustand"

export interface DrawnObject {
  id: string
  type: "wifi" | "location" | "grid" | "measure" | "path" | "qr" | "settings" | "polygon" | "venue"
  x: number
  y: number
  data?: any
  points?: { x: number; y: number }[] // For polygon points
  isComplete?: boolean // For polygon completion state
  connectedTo?: string[] // For path connections
  venueData?: {
    name: string
    nickname: string
    description: string
    phone: string
    class: string
    kx: number
    ky: number
    image?: File
  }
  measureData?: {
    startPoint: { x: number; y: number }
    endPoint: { x: number; y: number }
    pixelDistance: number
    actualDistance: number
    scale: number // pixels per meter
  }
  transmitterData?: {
    type: string
    description: string
    uuid: string
    major: number
    minor: number
  }
}

// New interfaces for pathfinding
export interface NavigationNode {
  id: string
  x: number
  y: number
  connections: string[] // IDs of connected nodes
}

export interface POI {
  id: string
  name: string
  x: number
  y: number
  type: string
  description?: string
}

export interface Floor {
  id: string
  name: string
  level: number
  nodes: NavigationNode[]
  pois: POI[]
  backgroundImage?: string
}

export interface PathResult {
  path: string[] // Array of node IDs
  distance: number
  instructions?: string[]
}

interface NavigationState {
  currentTool: string | null
  drawnObjects: DrawnObject[]
  isDrawing: boolean
  currentPolygon: { x: number; y: number }[] // Points for polygon being drawn
  pathConnections: { from: string; to: string }[] // Path connections between objects
  showVenueDialog: boolean
  pendingVenueCoordinates: { x: number; y: number } | null
  showMeasureDialog: boolean
  pendingMeasurement: {
    startPoint: { x: number; y: number }
    endPoint: { x: number; y: number }
    pixelDistance: number
  } | null
  showTransmitterDialog: boolean
  pendingTransmitterCoordinates: { x: number; y: number } | null
  measurePoints: { x: number; y: number }[] // Points for current measurement
  zoom: number
  panX: number
  panY: number
  backgroundImage: HTMLImageElement | null
  backgroundImageUrl: string | null
  showGrid: boolean
  
  // New pathfinding properties
  floors: Floor[]
  currentFloor: Floor | null
  currentPath: PathResult | null
  mappingData: {
    metadata: {
      exportDate: string
      totalObjects: number
      backgroundImageUrl: string | null
      canvasSize: { width: number; height: number }
      zoom: number
      pan: { x: number; y: number }
    }
    objects: Array<{
      id: string
      type: string
      coordinates: { x: number; y: number }
      points?: { x: number; y: number }[]
      venueData?: any
      measureData?: any
      transmitterData?: any
    }>
    pathConnections: { from: string; to: string }[]
    floors: Floor[]
    currentFloor: Floor | null
  }
  
  copyObject: (id: string) => void
  deleteSelectedObject: (id: string) => void
  exportMappingData: (format: "json" | "xml") => string
  hasMappingData: () => boolean
  setCurrentTool: (tool: string | null) => void
  addDrawnObject: (object: DrawnObject) => void
  removeDrawnObject: (id: string) => void
  setIsDrawing: (drawing: boolean) => void
  setCurrentPolygon: (points: { x: number; y: number }[]) => void
  addPolygonPoint: (point: { x: number; y: number }) => void
  completePolygon: () => void
  addPathConnection: (from: string, to: string) => void
  removePathConnection: (from: string, to: string) => void
  setShowVenueDialog: (show: boolean) => void
  setPendingVenueCoordinates: (coords: { x: number; y: number } | null) => void
  setShowMeasureDialog: (show: boolean) => void
  setPendingMeasurement: (
    measurement: {
      startPoint: { x: number; y: number }
      endPoint: { x: number; y: number }
      pixelDistance: number
    } | null,
  ) => void
  setShowTransmitterDialog: (show: boolean) => void
  setPendingTransmitterCoordinates: (coords: { x: number; y: number } | null) => void
  addMeasurePoint: (point: { x: number; y: number }) => void
  clearMeasurePoints: () => void
  setZoom: (zoom: number) => void
  setPan: (x: number, y: number) => void
  setBackgroundImage: (image: HTMLImageElement | null, url: string | null) => void
  toggleGrid: () => void
  clearAll: () => void
  
  // New pathfinding methods
  addFloor: (floor: Floor) => void
  setCurrentFloor: (floorId: string) => void
  addPOI: (floorId: string, poi: POI) => void
  addNavigationNode: (floorId: string, node: NavigationNode) => void
  connectNodes: (floorId: string, nodeId1: string, nodeId2: string) => void
  findPath: (startNodeId: string, endNodeId: string) => void
  setCurrentPath: (path: PathResult | null) => void
}

// Dijkstra's algorithm for pathfinding
function dijkstra(nodes: NavigationNode[], startId: string, endId: string): PathResult | null {
  const distances: { [key: string]: number } = {}
  const previous: { [key: string]: string | null } = {}
  const unvisited = new Set<string>()
  
  // Initialize distances
  nodes.forEach(node => {
    distances[node.id] = node.id === startId ? 0 : Infinity
    previous[node.id] = null
    unvisited.add(node.id)
  })
  
  while (unvisited.size > 0) {
    // Find unvisited node with minimum distance
    let currentId = Array.from(unvisited).reduce((min, nodeId) => 
      distances[nodeId] < distances[min] ? nodeId : min
    )
    
    if (distances[currentId] === Infinity) break
    
    unvisited.delete(currentId)
    
    if (currentId === endId) {
      // Reconstruct path
      const path: string[] = []
      let current: string | null = endId
      while (current !== null) {
        path.unshift(current)
        current = previous[current]
      }
      
      return {
        path,
        distance: distances[endId],
        instructions: generateInstructions(path, nodes)
      }
    }
    
    // Update distances to neighbors
    const currentNode = nodes.find(n => n.id === currentId)
    if (currentNode) {
      currentNode.connections.forEach(neighborId => {
        if (unvisited.has(neighborId)) {
          const neighbor = nodes.find(n => n.id === neighborId)
          if (neighbor) {
            const distance = Math.sqrt(
              Math.pow(neighbor.x - currentNode.x, 2) + 
              Math.pow(neighbor.y - currentNode.y, 2)
            )
            const alt = distances[currentId] + distance
            if (alt < distances[neighborId]) {
              distances[neighborId] = alt
              previous[neighborId] = currentId
            }
          }
        }
      })
    }
  }
  
  return null
}

function generateInstructions(path: string[], nodes: NavigationNode[]): string[] {
  const instructions: string[] = []
  
  for (let i = 0; i < path.length - 1; i++) {
    const current = nodes.find(n => n.id === path[i])
    const next = nodes.find(n => n.id === path[i + 1])
    
    if (current && next) {
      const direction = getDirection(current, next)
      instructions.push(`Head ${direction} to waypoint ${i + 2}`)
    }
  }
  
  return instructions
}

function getDirection(from: NavigationNode, to: NavigationNode): string {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const angle = Math.atan2(dy, dx) * 180 / Math.PI
  
  if (angle >= -45 && angle <= 45) return "east"
  if (angle >= 45 && angle <= 135) return "south"
  if (angle >= 135 || angle <= -135) return "west"
  return "north"
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  currentTool: null,
  drawnObjects: [],
  isDrawing: false,
  currentPolygon: [],
  pathConnections: [],
  showVenueDialog: false,
  pendingVenueCoordinates: null,
  showMeasureDialog: false,
  pendingMeasurement: null,
  showTransmitterDialog: false,
  pendingTransmitterCoordinates: null,
  measurePoints: [],
  zoom: 1,
  panX: 0,
  panY: 0,
  backgroundImage: null,
  backgroundImageUrl: null,
  showGrid: false,
  
  // New pathfinding state
  floors: [],
  currentFloor: null,
  currentPath: null,
  mappingData: {
    metadata: {
      exportDate: new Date().toISOString(),
      totalObjects: 0,
      backgroundImageUrl: null,
      canvasSize: { width: 1200, height: 800 },
      zoom: 1,
      pan: { x: 0, y: 0 },
    },
    objects: [],
    pathConnections: [],
    floors: [],
    currentFloor: null,
  },

  setCurrentTool: (tool) => {
    if (tool === "grid") {
      get().toggleGrid()
      set({ currentTool: null })
    } else {
      set({ currentTool: tool, currentPolygon: [], measurePoints: [] })
    }
  },
  addDrawnObject: (object) =>
    set((state) => {
      const newDrawnObjects = [...state.drawnObjects, object]
      return {
        drawnObjects: newDrawnObjects,
        mappingData: {
          ...state.mappingData,
          metadata: {
            ...state.mappingData.metadata,
            exportDate: new Date().toISOString(),
            totalObjects: newDrawnObjects.length,
          },
          objects: newDrawnObjects.map((obj) => ({
            id: obj.id,
            type: obj.type,
            coordinates: { x: obj.x, y: obj.y },
            ...(obj.points && { points: obj.points }),
            ...(obj.venueData && { venueData: obj.venueData }),
            ...(obj.measureData && { measureData: obj.measureData }),
            ...(obj.transmitterData && { transmitterData: obj.transmitterData }),
          })),
        },
      }
    }),
  removeDrawnObject: (id) =>
    set((state) => {
      const newDrawnObjects = state.drawnObjects.filter((obj) => obj.id !== id)
      return {
        drawnObjects: newDrawnObjects,
        pathConnections: state.pathConnections.filter((conn) => conn.from !== id && conn.to !== id),
        mappingData: {
          ...state.mappingData,
          metadata: {
            ...state.mappingData.metadata,
            exportDate: new Date().toISOString(),
            totalObjects: newDrawnObjects.length,
          },
          objects: newDrawnObjects.map((obj) => ({
            id: obj.id,
            type: obj.type,
            coordinates: { x: obj.x, y: obj.y },
            ...(obj.points && { points: obj.points }),
            ...(obj.venueData && { venueData: obj.venueData }),
            ...(obj.measureData && { measureData: obj.measureData }),
            ...(obj.transmitterData && { transmitterData: obj.transmitterData }),
          })),
          pathConnections: state.pathConnections.filter((conn) => conn.from !== id && conn.to !== id),
        },
      }
    }),
  setIsDrawing: (drawing) => set({ isDrawing: drawing }),
  setCurrentPolygon: (points) => set({ currentPolygon: points }),
  addPolygonPoint: (point) =>
    set((state) => ({
      currentPolygon: [...state.currentPolygon, point],
    })),
  completePolygon: () => {
    const state = get()
    if (state.currentPolygon.length >= 3) {
      const newPolygon: DrawnObject = {
        id: `polygon_${Date.now()}`,
        type: "polygon",
        x: state.currentPolygon[0].x,
        y: state.currentPolygon[0].y,
        points: [...state.currentPolygon],
        isComplete: true,
      }
      const newDrawnObjects = [...state.drawnObjects, newPolygon]
      set({
        drawnObjects: newDrawnObjects,
        currentPolygon: [],
        mappingData: {
          ...state.mappingData,
          metadata: {
            ...state.mappingData.metadata,
            exportDate: new Date().toISOString(),
            totalObjects: newDrawnObjects.length,
          },
          objects: newDrawnObjects.map((obj) => ({
            id: obj.id,
            type: obj.type,
            coordinates: { x: obj.x, y: obj.y },
            ...(obj.points && { points: obj.points }),
            ...(obj.venueData && { venueData: obj.venueData }),
            ...(obj.measureData && { measureData: obj.measureData }),
            ...(obj.transmitterData && { transmitterData: obj.transmitterData }),
          })),
        },
      })
    }
  },
  addPathConnection: (from, to) =>
    set((state) => {
      const exists = state.pathConnections.some(
        (conn) => (conn.from === from && conn.to === to) || (conn.from === to && conn.to === from),
      )
      if (!exists) {
        const newPathConnections = [...state.pathConnections, { from, to }]
        return {
          pathConnections: newPathConnections,
          mappingData: {
            ...state.mappingData,
            pathConnections: newPathConnections,
          },
        }
      }
      return state
    }),
  removePathConnection: (from, to) =>
    set((state) => {
      const newPathConnections = state.pathConnections.filter(
        (conn) => !((conn.from === from && conn.to === to) || (conn.from === to && conn.to === from)),
      )
      return {
        pathConnections: newPathConnections,
        mappingData: {
          ...state.mappingData,
          pathConnections: newPathConnections,
        },
      }
    }),
  setShowVenueDialog: (show) => set({ showVenueDialog: show }),
  setPendingVenueCoordinates: (coords) => set({ pendingVenueCoordinates: coords }),
  setShowMeasureDialog: (show) => set({ showMeasureDialog: show }),
  setPendingMeasurement: (measurement) => set({ pendingMeasurement: measurement }),
  setShowTransmitterDialog: (show) => set({ showTransmitterDialog: show }),
  setPendingTransmitterCoordinates: (coords) => set({ pendingTransmitterCoordinates: coords }),
  addMeasurePoint: (point) =>
    set((state) => {
      const newPoints = [...state.measurePoints, point]
      if (newPoints.length === 2) {
        // Calculate pixel distance and show dialog
        const pixelDistance = Math.sqrt(
          Math.pow(newPoints[1].x - newPoints[0].x, 2) + Math.pow(newPoints[1].y - newPoints[0].y, 2),
        )
        return {
          measurePoints: newPoints,
          pendingMeasurement: {
            startPoint: newPoints[0],
            endPoint: newPoints[1],
            pixelDistance,
          },
          showMeasureDialog: true,
        }
      }
      return { measurePoints: newPoints }
    }),
  clearMeasurePoints: () => set({ measurePoints: [] }),
  setZoom: (zoom) => set((state) => {
    const newZoom = Math.max(0.1, Math.min(5, zoom))
    return {
      zoom: newZoom,
      mappingData: {
        ...state.mappingData,
        metadata: {
          ...state.mappingData.metadata,
          zoom: newZoom,
        },
      },
    }
  }),
  setPan: (x, y) => set((state) => ({
    panX: x,
    panY: y,
    mappingData: {
      ...state.mappingData,
      metadata: {
        ...state.mappingData.metadata,
        pan: { x, y },
      },
    },
  })),
  setBackgroundImage: (image, url) => set((state) => ({
    backgroundImage: image,
    backgroundImageUrl: url,
    mappingData: {
      ...state.mappingData,
      metadata: {
        ...state.mappingData.metadata,
        backgroundImageUrl: url,
      },
    },
  })),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  clearAll: () => set((state) => ({
    drawnObjects: [],
    currentPolygon: [],
    pathConnections: [],
    measurePoints: [],
    mappingData: {
      metadata: {
        exportDate: new Date().toISOString(),
        totalObjects: 0,
        backgroundImageUrl: state.backgroundImageUrl,
        canvasSize: { width: 1200, height: 800 },
        zoom: state.zoom,
        pan: { x: state.panX, y: state.panY },
      },
      objects: [],
      pathConnections: [],
      floors: state.floors,
      currentFloor: state.currentFloor,
    },
  })),
  copyObject: (id) => {
    const state = get()
    const objectToCopy = state.drawnObjects.find((obj) => obj.id === id)
    if (objectToCopy) {
      const copiedObject: DrawnObject = {
        ...objectToCopy,
        id: `${objectToCopy.type}_${Date.now()}`,
        x: objectToCopy.x + 20, // Offset the copy slightly
        y: objectToCopy.y + 20,
      }
      const newDrawnObjects = [...state.drawnObjects, copiedObject]
      set({
        drawnObjects: newDrawnObjects,
        mappingData: {
          ...state.mappingData,
          metadata: {
            ...state.mappingData.metadata,
            exportDate: new Date().toISOString(),
            totalObjects: newDrawnObjects.length,
          },
          objects: newDrawnObjects.map((obj) => ({
            id: obj.id,
            type: obj.type,
            coordinates: { x: obj.x, y: obj.y },
            ...(obj.points && { points: obj.points }),
            ...(obj.venueData && { venueData: obj.venueData }),
            ...(obj.measureData && { measureData: obj.measureData }),
            ...(obj.transmitterData && { transmitterData: obj.transmitterData }),
          })),
        },
      })
    }
  },
  deleteSelectedObject: (id) => {
    const state = get()
    const newDrawnObjects = state.drawnObjects.filter((obj) => obj.id !== id)
    set({
      drawnObjects: newDrawnObjects,
      pathConnections: state.pathConnections.filter((conn) => conn.from !== id && conn.to !== id),
      mappingData: {
        ...state.mappingData,
        metadata: {
          ...state.mappingData.metadata,
          exportDate: new Date().toISOString(),
          totalObjects: newDrawnObjects.length,
        },
        objects: newDrawnObjects.map((obj) => ({
          id: obj.id,
          type: obj.type,
          coordinates: { x: obj.x, y: obj.y },
          ...(obj.points && { points: obj.points }),
          ...(obj.venueData && { venueData: obj.venueData }),
          ...(obj.measureData && { measureData: obj.measureData }),
          ...(obj.transmitterData && { transmitterData: obj.transmitterData }),
        })),
        pathConnections: state.pathConnections.filter((conn) => conn.from !== id && conn.to !== id),
      },
    })
  },

  exportMappingData: (format) => {
    const state = get()
    const mappingData = state.mappingData

    if (format === "json") {
      return JSON.stringify(mappingData, null, 2)
    } else {
      // XML format
      const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n'
      const xmlContent = `<mappingData>
  <metadata>
    <exportDate>${mappingData.metadata.exportDate}</exportDate>
    <totalObjects>${mappingData.metadata.totalObjects}</totalObjects>
    <backgroundImageUrl>${mappingData.metadata.backgroundImageUrl || ""}</backgroundImageUrl>
    <canvasSize width="${mappingData.metadata.canvasSize.width}" height="${mappingData.metadata.canvasSize.height}" />
    <zoom>${mappingData.metadata.zoom}</zoom>
    <pan x="${mappingData.metadata.pan.x}" y="${mappingData.metadata.pan.y}" />
  </metadata>
  <objects>
${mappingData.objects
  .map(
    (obj) => `    <object id="${obj.id}" type="${obj.type}">
      <coordinates x="${obj.coordinates.x}" y="${obj.coordinates.y}" />
${obj.points ? `      <points>${obj.points.map((p) => `<point x="${p.x}" y="${p.y}" />`).join("")}</points>` : ""}
${
  obj.venueData
    ? `      <venueData>
        <name>${obj.venueData.name}</name>
        <class>${obj.venueData.class}</class>
        <description>${obj.venueData.description}</description>
      </venueData>`
    : ""
}
${
  obj.measureData
    ? `      <measureData>
        <actualDistance>${obj.measureData.actualDistance}</actualDistance>
        <pixelDistance>${obj.measureData.pixelDistance}</pixelDistance>
      </measureData>`
    : ""
}
${
  obj.transmitterData
    ? `      <transmitterData>
        <type>${obj.transmitterData.type}</type>
        <description>${obj.transmitterData.description}</description>
        <uuid>${obj.transmitterData.uuid}</uuid>
      </transmitterData>`
    : ""
}
    </object>`,
  )
  .join("\n")}
  </objects>
  <pathConnections>
${mappingData.pathConnections.map((conn) => `    <connection from="${conn.from}" to="${conn.to}" />`).join("\n")}
  </pathConnections>
  <floors>
${mappingData.floors.map((floor) => `    <floor id="${floor.id}" name="${floor.name}" level="${floor.level}" />`).join("\n")}
  </floors>
</mappingData>`
      return xmlHeader + xmlContent
    }
  },
  hasMappingData: () => {
    const state = get()
    return state.drawnObjects.length > 0 || state.floors.length > 0
  },
  
  // New pathfinding methods
  addFloor: (floor) => set((state) => {
    const newFloors = [...state.floors, floor]
    return {
      floors: newFloors,
      mappingData: {
        ...state.mappingData,
        floors: newFloors,
      },
    }
  }),
  
  setCurrentFloor: (floorId) => set((state) => {
    const newCurrentFloor = state.floors.find(f => f.id === floorId) || null
    return {
      currentFloor: newCurrentFloor,
      currentPath: null, // Clear current path when changing floors
      mappingData: {
        ...state.mappingData,
        currentFloor: newCurrentFloor,
      },
    }
  }),
  
  addPOI: (floorId, poi) => set((state) => {
    const newFloors = state.floors.map(floor => 
      floor.id === floorId 
        ? { ...floor, pois: [...floor.pois, poi] }
        : floor
    )
    return {
      floors: newFloors,
      mappingData: {
        ...state.mappingData,
        floors: newFloors,
      },
    }
  }),
  
  addNavigationNode: (floorId, node) => set((state) => {
    const newFloors = state.floors.map(floor => 
      floor.id === floorId 
        ? { ...floor, nodes: [...floor.nodes, node] }
        : floor
    )
    return {
      floors: newFloors,
      mappingData: {
        ...state.mappingData,
        floors: newFloors,
      },
    }
  }),
  
  connectNodes: (floorId, nodeId1, nodeId2) => set((state) => {
    const newFloors = state.floors.map(floor => 
      floor.id === floorId 
        ? {
            ...floor,
            nodes: floor.nodes.map(node => {
              if (node.id === nodeId1) {
                return { ...node, connections: [...node.connections, nodeId2] }
              }
              if (node.id === nodeId2) {
                return { ...node, connections: [...node.connections, nodeId1] }
              }
              return node
            })
          }
        : floor
    )
    return {
      floors: newFloors,
      mappingData: {
        ...state.mappingData,
        floors: newFloors,
      },
    }
  }),
  
  findPath: (startNodeId, endNodeId) => {
    const state = get()
    if (!state.currentFloor) return
    
    const path = dijkstra(state.currentFloor.nodes, startNodeId, endNodeId)
    set({ currentPath: path })
  },
  
  setCurrentPath: (path) => set({ currentPath: path })
}))