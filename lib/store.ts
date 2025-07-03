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
  setPan: (x, y: number) => void
  setBackgroundImage: (image: HTMLImageElement | null, url: string | null) => void
  toggleGrid: () => void
  clearAll: () => void
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

  setCurrentTool: (tool) => {
    if (tool === "grid") {
      get().toggleGrid()
      set({ currentTool: null })
    } else {
      set({ currentTool: tool, currentPolygon: [], measurePoints: [] })
    }
  },
  addDrawnObject: (object) =>
    set((state) => ({
      drawnObjects: [...state.drawnObjects, object],
    })),
  removeDrawnObject: (id) =>
    set((state) => ({
      drawnObjects: state.drawnObjects.filter((obj) => obj.id !== id),
      pathConnections: state.pathConnections.filter((conn) => conn.from !== id && conn.to !== id),
    })),
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
      set({
        drawnObjects: [...state.drawnObjects, newPolygon],
        currentPolygon: [],
      })
    }
  },
  addPathConnection: (from, to) =>
    set((state) => {
      const exists = state.pathConnections.some(
        (conn) => (conn.from === from && conn.to === to) || (conn.from === to && conn.to === from),
      )
      if (!exists) {
        return {
          pathConnections: [...state.pathConnections, { from, to }],
        }
      }
      return state
    }),
  removePathConnection: (from, to) =>
    set((state) => ({
      pathConnections: state.pathConnections.filter(
        (conn) => !((conn.from === from && conn.to === to) || (conn.from === to && conn.to === from)),
      ),
    })),
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
  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(5, zoom)) }),
  setPan: (x, y) => set({ panX: x, panY: y }),
  setBackgroundImage: (image, url) => set({ backgroundImage: image, backgroundImageUrl: url }),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  clearAll: () => set({ drawnObjects: [], currentPolygon: [], pathConnections: [], measurePoints: [] }),
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
      set({
        drawnObjects: [...state.drawnObjects, copiedObject],
      })
    }
  },
  deleteSelectedObject: (id) => {
    set((state) => ({
      drawnObjects: state.drawnObjects.filter((obj) => obj.id !== id),
      pathConnections: state.pathConnections.filter((conn) => conn.from !== id && conn.to !== id),
    }))
  },
  exportMappingData: (format) => {
    const state = get()
    const mappingData = {
      metadata: {
        exportDate: new Date().toISOString(),
        totalObjects: state.drawnObjects.length,
        backgroundImageUrl: state.backgroundImageUrl,
        canvasSize: { width: 1200, height: 800 },
        zoom: state.zoom,
        pan: { x: state.panX, y: state.panY },
      },
      objects: state.drawnObjects.map((obj) => ({
        id: obj.id,
        type: obj.type,
        coordinates: { x: obj.x, y: obj.y },
        ...(obj.points && { points: obj.points }),
        ...(obj.venueData && { venueData: obj.venueData }),
        ...(obj.measureData && { measureData: obj.measureData }),
        ...(obj.transmitterData && { transmitterData: obj.transmitterData }),
      })),
      pathConnections: state.pathConnections,
    }

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
</mappingData>`
      return xmlHeader + xmlContent
    }
  },
  hasMappingData: () => {
    const state = get()
    return state.drawnObjects.length > 0
  },
}))
