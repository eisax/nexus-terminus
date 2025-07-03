"use client"
import type React from "react"
import { useRef, useEffect, useCallback, useState } from "react"
import { useNavigationStore } from "@/lib/store"
import type { DrawnObject } from "@/lib/store"
import { AddVenueDialog } from "./add-venue-dialog"
import { MeasureDialog } from "./measure-dialog"
import { AddTransmitterDialog } from "./add-transmitter-dialog"

export function FloorPlanCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [selectedObject, setSelectedObject] = useState<string | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const {
    currentTool,
    drawnObjects,
    currentPolygon,
    pathConnections,
    showVenueDialog,
    pendingVenueCoordinates,
    showMeasureDialog,
    pendingMeasurement,
    showTransmitterDialog,
    pendingTransmitterCoordinates,
    measurePoints,
    zoom,
    panX,
    panY,
    backgroundImage,
    showGrid,
    addDrawnObject,
    removeDrawnObject,
    addPolygonPoint,
    completePolygon,
    addPathConnection,
    setShowVenueDialog,
    setPendingVenueCoordinates,
    setShowMeasureDialog,
    setPendingMeasurement,
    setShowTransmitterDialog,
    setPendingTransmitterCoordinates,
    addMeasurePoint,
    clearMeasurePoints,
    setPan,
    setZoom,
    backgroundImageUrl,
    copyObject,
    deleteSelectedObject,
  } = useNavigationStore()

  const drawGrid = useCallback(
    (ctx: CanvasRenderingContext2D, scale: number, offsetX: number, offsetY: number) => {
      if (!showGrid) return

      ctx.save()
      ctx.translate(offsetX, offsetY)
      ctx.scale(scale, scale)

      ctx.strokeStyle = "#e5e7eb"
      ctx.lineWidth = 1 / scale
      ctx.globalAlpha = 0.5

      const gridSize = 20
      const canvasWidth = 1200
      const canvasHeight = 800

      // Draw vertical lines
      for (let x = 0; x <= canvasWidth; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvasHeight)
        ctx.stroke()
      }

      // Draw horizontal lines
      for (let y = 0; y <= canvasHeight; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvasWidth, y)
        ctx.stroke()
      }

      ctx.globalAlpha = 1
      ctx.restore()
    },
    [showGrid],
  )

  const drawBackground = useCallback(
    (ctx: CanvasRenderingContext2D, scale: number, offsetX: number, offsetY: number) => {
      ctx.save()
      ctx.translate(offsetX, offsetY)
      ctx.scale(scale, scale)

      // Set canvas background to white
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, 1200, 800)

      if (backgroundImage) {
        // Draw the uploaded floor plan image
        try {
          // Calculate aspect ratio to fit image properly
          const imgAspect = backgroundImage.width / backgroundImage.height
          const canvasAspect = 1200 / 800

          let drawWidth = 1200
          let drawHeight = 800
          let drawX = 0
          let drawY = 0

          if (imgAspect > canvasAspect) {
            // Image is wider - fit to width
            drawHeight = 1200 / imgAspect
            drawY = (800 - drawHeight) / 2
          } else {
            // Image is taller - fit to height
            drawWidth = 800 * imgAspect
            drawX = (1200 - drawWidth) / 2
          }

          ctx.drawImage(backgroundImage, drawX, drawY, drawWidth, drawHeight)
        } catch (error) {
          console.error("Error drawing background image:", error)
        }
      }
      // If no background image, just leave the white canvas

      ctx.restore()
    },
    [backgroundImage],
  )

  const drawMeasurement = useCallback(
    (ctx: CanvasRenderingContext2D, scale: number, offsetX: number, offsetY: number) => {
      if (measurePoints.length === 0) return

      ctx.save()
      ctx.translate(offsetX, offsetY)
      ctx.scale(scale, scale)

      // Draw measurement points
      measurePoints.forEach((point, index) => {
        ctx.fillStyle = "#f59e0b"
        ctx.beginPath()
        ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI)
        ctx.fill()

        // Draw point number
        ctx.fillStyle = "#fff"
        ctx.font = "12px Arial"
        ctx.textAlign = "center"
        ctx.fillText((index + 1).toString(), point.x, point.y + 4)
      })

      // Draw line between points if we have 2
      if (measurePoints.length === 2) {
        ctx.strokeStyle = "#f59e0b"
        ctx.lineWidth = 3
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.moveTo(measurePoints[0].x, measurePoints[0].y)
        ctx.lineTo(measurePoints[1].x, measurePoints[1].y)
        ctx.stroke()
        ctx.setLineDash([])

        // Draw distance text
        const midX = (measurePoints[0].x + measurePoints[1].x) / 2
        const midY = (measurePoints[0].y + measurePoints[1].y) / 2
        const pixelDistance = Math.sqrt(
          Math.pow(measurePoints[1].x - measurePoints[0].x, 2) + Math.pow(measurePoints[1].y - measurePoints[0].y, 2),
        )

        ctx.fillStyle = "#f59e0b"
        ctx.font = "14px Arial"
        ctx.textAlign = "center"
        ctx.fillRect(midX - 30, midY - 10, 60, 20)
        ctx.fillStyle = "#fff"
        ctx.fillText(`${Math.round(pixelDistance)}px`, midX, midY + 4)
      }

      // Draw preview line to mouse if we have 1 point
      if (measurePoints.length === 1) {
        ctx.strokeStyle = "#f59e0b"
        ctx.lineWidth = 2
        ctx.setLineDash([3, 3])
        ctx.globalAlpha = 0.7
        ctx.beginPath()
        ctx.moveTo(measurePoints[0].x, measurePoints[0].y)
        ctx.lineTo(mousePos.x, mousePos.y)
        ctx.stroke()
        ctx.setLineDash([])
        ctx.globalAlpha = 1
      }

      ctx.restore()
    },
    [measurePoints, mousePos],
  )

  const drawPathConnections = useCallback(
    (ctx: CanvasRenderingContext2D, scale: number, offsetX: number, offsetY: number) => {
      if (pathConnections.length === 0) return

      ctx.save()
      ctx.translate(offsetX, offsetY)
      ctx.scale(scale, scale)

      // Draw thick green lines for path connections
      ctx.strokeStyle = "#22c55e"
      ctx.lineWidth = 8 / scale
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      pathConnections.forEach((connection) => {
        const fromObj = drawnObjects.find((obj) => obj.id === connection.from)
        const toObj = drawnObjects.find((obj) => obj.id === connection.to)

        if (fromObj && toObj) {
          ctx.beginPath()
          ctx.moveTo(fromObj.x, fromObj.y)
          ctx.lineTo(toObj.x, toObj.y)
          ctx.stroke()

          // Draw direction arrows on the path
          const dx = toObj.x - fromObj.x
          const dy = toObj.y - fromObj.y
          const length = Math.sqrt(dx * dx + dy * dy)
          const unitX = dx / length
          const unitY = dy / length

          // Draw arrow in the middle of the path
          const midX = fromObj.x + dx / 2
          const midY = fromObj.y + dy / 2
          const arrowSize = 12 / scale

          ctx.fillStyle = "#22c55e"
          ctx.beginPath()
          ctx.moveTo(midX, midY)
          ctx.lineTo(
            midX - arrowSize * unitX - (arrowSize * unitY) / 2,
            midY - arrowSize * unitY + (arrowSize * unitX) / 2,
          )
          ctx.lineTo(
            midX - arrowSize * unitX + (arrowSize * unitY) / 2,
            midY - arrowSize * unitY - (arrowSize * unitX) / 2,
          )
          ctx.closePath()
          ctx.fill()
        }
      })

      ctx.restore()
    },
    [pathConnections, drawnObjects],
  )

  const getVenueColor = (venueClass: string) => {
    const colors = {
      General: "#8b5cf6",
      Office: "#3b82f6",
      "Meeting Room": "#22c55e",
      Restroom: "#06b6d4",
      Emergency: "#ef4444",
    }
    return colors[venueClass as keyof typeof colors] || colors.General
  }

  const drawObject = useCallback(
    (ctx: CanvasRenderingContext2D, obj: DrawnObject, scale: number, offsetX: number, offsetY: number) => {
      ctx.save()
      ctx.translate(offsetX, offsetY)
      ctx.scale(scale, scale)

      const isSelected = selectedObject === obj.id
      const isPathNode = obj.type === "path"
      const hasConnections = pathConnections.some((conn) => conn.from === obj.id || conn.to === obj.id)

      switch (obj.type) {
        case "wifi":
          // Draw WiFi beacon with transmitter info
          ctx.fillStyle = isSelected ? "#3b82f6" : "#10b981"
          ctx.beginPath()
          ctx.arc(obj.x, obj.y, 20, 0, 2 * Math.PI)
          ctx.fill()

          ctx.strokeStyle = "#fff"
          ctx.lineWidth = 3
          // Draw WiFi symbol
          ctx.beginPath()
          ctx.arc(obj.x, obj.y, 8, 0, Math.PI, true)
          ctx.stroke()
          ctx.beginPath()
          ctx.arc(obj.x, obj.y, 12, 0, Math.PI, true)
          ctx.stroke()
          ctx.beginPath()
          ctx.arc(obj.x, obj.y, 16, 0, Math.PI, true)
          ctx.stroke()

          // Draw transmitter type label if available
          if (obj.transmitterData?.type) {
            ctx.fillStyle = "#000"
            ctx.font = "10px Arial"
            ctx.textAlign = "center"
            ctx.fillText(obj.transmitterData.type, obj.x, obj.y + 35)
          }

          // Draw description if available
          if (obj.transmitterData?.description) {
            ctx.fillStyle = "#000"
            ctx.font = "12px Arial"
            ctx.textAlign = "center"
            ctx.fillText(obj.transmitterData.description, obj.x, obj.y + 50)
          }
          break

        case "location":
        case "venue":
          // Draw venue pin
          const venueColor = obj.venueData ? getVenueColor(obj.venueData.class) : "#ef4444"
          ctx.fillStyle = isSelected ? "#3b82f6" : venueColor
          ctx.beginPath()
          ctx.moveTo(obj.x, obj.y - 20)
          ctx.bezierCurveTo(obj.x - 10, obj.y - 30, obj.x - 15, obj.y - 10, obj.x, obj.y)
          ctx.bezierCurveTo(obj.x + 15, obj.y - 10, obj.x + 10, obj.y - 30, obj.x, obj.y - 20)
          ctx.fill()

          ctx.fillStyle = "#fff"
          ctx.beginPath()
          ctx.arc(obj.x, obj.y - 20, 6, 0, 2 * Math.PI)
          ctx.fill()

          // Draw venue name if available
          if (obj.venueData?.name) {
            ctx.fillStyle = "#000"
            ctx.font = "12px Arial"
            ctx.textAlign = "center"
            ctx.fillText(obj.venueData.name, obj.x, obj.y + 15)
          }
          break

        case "measure":
          // Draw measurement line with distance
          if (obj.measureData) {
            const { startPoint, endPoint, actualDistance, pixelDistance } = obj.measureData

            // Draw measurement line
            ctx.strokeStyle = isSelected ? "#3b82f6" : "#f59e0b"
            ctx.lineWidth = 3
            ctx.beginPath()
            ctx.moveTo(startPoint.x, startPoint.y)
            ctx.lineTo(endPoint.x, endPoint.y)
            ctx.stroke()

            // Draw measurement marks
            ctx.beginPath()
            const angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x)
            const perpAngle = angle + Math.PI / 2
            const markLength = 10

            // Start mark
            ctx.moveTo(startPoint.x + Math.cos(perpAngle) * markLength, startPoint.y + Math.sin(perpAngle) * markLength)
            ctx.lineTo(startPoint.x - Math.cos(perpAngle) * markLength, startPoint.y - Math.sin(perpAngle) * markLength)

            // End mark
            ctx.moveTo(endPoint.x + Math.cos(perpAngle) * markLength, endPoint.y + Math.sin(perpAngle) * markLength)
            ctx.lineTo(endPoint.x - Math.cos(perpAngle) * markLength, endPoint.y - Math.sin(perpAngle) * markLength)
            ctx.stroke()

            // Draw distance text
            const midX = (startPoint.x + endPoint.x) / 2
            const midY = (startPoint.y + endPoint.y) / 2

            ctx.fillStyle = isSelected ? "#3b82f6" : "#f59e0b"
            ctx.font = "14px Arial"
            ctx.textAlign = "center"
            ctx.fillRect(midX - 25, midY - 10, 50, 20)
            ctx.fillStyle = "#fff"
            ctx.fillText(`${actualDistance}m`, midX, midY + 4)
          }
          break

        case "path":
          // Draw path node with different styles based on connections
          const nodeRadius = 15

          // Draw outer ring for connected nodes
          if (hasConnections) {
            ctx.fillStyle = isSelected ? "#1d4ed8" : "#22c55e"
            ctx.beginPath()
            ctx.arc(obj.x, obj.y, nodeRadius + 3, 0, 2 * Math.PI)
            ctx.fill()
          }

          // Draw main path node
          ctx.fillStyle = isSelected ? "#3b82f6" : hasConnections ? "#16a34a" : "#8b5cf6"
          ctx.beginPath()
          ctx.arc(obj.x, obj.y, nodeRadius, 0, 2 * Math.PI)
          ctx.fill()

          // Draw inner circle
          ctx.fillStyle = "#fff"
          ctx.beginPath()
          ctx.arc(obj.x, obj.y, nodeRadius - 5, 0, 2 * Math.PI)
          ctx.fill()

          // Draw path symbol (crosshairs)
          ctx.strokeStyle = isSelected ? "#3b82f6" : hasConnections ? "#16a34a" : "#8b5cf6"
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.moveTo(obj.x - 8, obj.y)
          ctx.lineTo(obj.x + 8, obj.y)
          ctx.moveTo(obj.x, obj.y - 8)
          ctx.lineTo(obj.x, obj.y + 8)
          ctx.stroke()

          // Show connection count
          if (hasConnections) {
            const connectionCount = pathConnections.filter((conn) => conn.from === obj.id || conn.to === obj.id).length
            ctx.fillStyle = "#22c55e"
            ctx.font = "10px Arial"
            ctx.textAlign = "center"
            ctx.fillText(connectionCount.toString(), obj.x, obj.y + nodeRadius + 15)
          }
          break

        case "polygon":
          // Draw completed polygon
          if (obj.points && obj.points.length >= 3) {
            // Fill polygon
            ctx.fillStyle = isSelected ? "rgba(59, 130, 246, 0.3)" : "rgba(139, 92, 246, 0.2)"
            ctx.beginPath()
            ctx.moveTo(obj.points[0].x, obj.points[0].y)
            for (let i = 1; i < obj.points.length; i++) {
              ctx.lineTo(obj.points[i].x, obj.points[i].y)
            }
            ctx.closePath()
            ctx.fill()

            // Draw polygon outline
            ctx.strokeStyle = isSelected ? "#3b82f6" : "#8b5cf6"
            ctx.lineWidth = 3
            ctx.stroke()

            // Draw vertices
            obj.points.forEach((point, index) => {
              ctx.fillStyle = isSelected ? "#3b82f6" : "#8b5cf6"
              ctx.beginPath()
              ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI)
              ctx.fill()

              // Draw vertex numbers
              ctx.fillStyle = "#fff"
              ctx.font = "10px Arial"
              ctx.textAlign = "center"
              ctx.fillText((index + 1).toString(), point.x, point.y + 3)
            })
          }
          break

        case "qr":
          // Draw QR code
          ctx.fillStyle = isSelected ? "#3b82f6" : "#000"
          ctx.fillRect(obj.x - 15, obj.y - 15, 30, 30)

          ctx.fillStyle = "#fff"
          // Draw QR pattern
          const qrPattern = [
            [1, 1, 1, 0, 1, 1, 1],
            [1, 0, 1, 0, 1, 0, 1],
            [1, 1, 1, 0, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 0, 1, 1, 1],
            [1, 0, 1, 0, 1, 0, 1],
            [1, 1, 1, 0, 1, 1, 1],
          ]

          qrPattern.forEach((row, i) => {
            row.forEach((cell, j) => {
              if (cell) {
                ctx.fillRect(obj.x - 15 + j * 4, obj.y - 15 + i * 4, 4, 4)
              }
            })
          })
          break

        case "settings":
          // Draw settings gear
          ctx.fillStyle = isSelected ? "#3b82f6" : "#6b7280"
          ctx.beginPath()
          ctx.arc(obj.x, obj.y, 15, 0, 2 * Math.PI)
          ctx.fill()

          ctx.fillStyle = "#fff"
          ctx.beginPath()
          ctx.arc(obj.x, obj.y, 8, 0, 2 * Math.PI)
          ctx.fill()

          ctx.fillStyle = isSelected ? "#3b82f6" : "#6b7280"
          ctx.beginPath()
          ctx.arc(obj.x, obj.y, 4, 0, 2 * Math.PI)
          ctx.fill()

          // Draw gear teeth
          ctx.fillStyle = isSelected ? "#3b82f6" : "#6b7280"
          for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4
            const x1 = obj.x + Math.cos(angle) * 12
            const y1 = obj.y + Math.sin(angle) * 12
            const x2 = obj.x + Math.cos(angle) * 18
            const y2 = obj.y + Math.sin(angle) * 18

            ctx.beginPath()
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y2)
            ctx.lineWidth = 3
            ctx.stroke()
          }
          break
      }

      ctx.restore()
    },
    [selectedObject, pathConnections],
  )

  const drawCurrentPolygon = useCallback(
    (ctx: CanvasRenderingContext2D, scale: number, offsetX: number, offsetY: number) => {
      if (currentPolygon.length === 0) return

      ctx.save()
      ctx.translate(offsetX, offsetY)
      ctx.scale(scale, scale)

      // Draw lines between points
      if (currentPolygon.length > 1) {
        ctx.strokeStyle = "#8b5cf6"
        ctx.lineWidth = 3
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.moveTo(currentPolygon[0].x, currentPolygon[0].y)
        for (let i = 1; i < currentPolygon.length; i++) {
          ctx.lineTo(currentPolygon[i].x, currentPolygon[i].y)
        }
        ctx.stroke()
        ctx.setLineDash([])
      }

      // Draw preview line to mouse
      if (currentPolygon.length > 0) {
        ctx.strokeStyle = "#8b5cf6"
        ctx.lineWidth = 2
        ctx.setLineDash([3, 3])
        ctx.globalAlpha = 0.7
        ctx.beginPath()
        ctx.moveTo(currentPolygon[currentPolygon.length - 1].x, currentPolygon[currentPolygon.length - 1].y)
        ctx.lineTo(mousePos.x, mousePos.y)
        ctx.stroke()
        ctx.setLineDash([])
        ctx.globalAlpha = 1
      }

      // Draw closing line preview if we have 3+ points
      if (currentPolygon.length >= 3) {
        ctx.strokeStyle = "#22c55e"
        ctx.lineWidth = 2
        ctx.setLineDash([3, 3])
        ctx.globalAlpha = 0.5
        ctx.beginPath()
        ctx.moveTo(currentPolygon[currentPolygon.length - 1].x, currentPolygon[currentPolygon.length - 1].y)
        ctx.lineTo(currentPolygon[0].x, currentPolygon[0].y)
        ctx.stroke()
        ctx.setLineDash([])
        ctx.globalAlpha = 1
      }

      // Draw points
      currentPolygon.forEach((point, index) => {
        ctx.fillStyle = index === 0 ? "#22c55e" : "#8b5cf6"
        ctx.beginPath()
        ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI)
        ctx.fill()

        ctx.fillStyle = "#fff"
        ctx.font = "10px Arial"
        ctx.textAlign = "center"
        ctx.fillText((index + 1).toString(), point.x, point.y + 3)
      })

      ctx.restore()
    },
    [currentPolygon, mousePos],
  )

  const drawEmptyState = useCallback(
    (ctx: CanvasRenderingContext2D, scale: number, offsetX: number, offsetY: number) => {
      if (backgroundImage || drawnObjects.length > 0) return

      ctx.save()
      ctx.translate(offsetX, offsetY)
      ctx.scale(scale, scale)

      // Draw empty state message
      ctx.fillStyle = "#9ca3af"
      ctx.font = "18px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Upload a floor plan to get started", 600, 390)

      ctx.fillStyle = "#d1d5db"
      ctx.font = "14px Arial"
      ctx.fillText("Click 'Upload' in the toolbar to add your floor plan image", 600, 430)

      // Draw upload icon
      ctx.strokeStyle = "#d1d5db"
      ctx.lineWidth = 3
      ctx.beginPath()
      // Upload arrow
      ctx.moveTo(580, 320)
      ctx.lineTo(600, 300)
      ctx.lineTo(620, 320)
      ctx.moveTo(600, 300)
      ctx.lineTo(600, 330)
      // Upload box
      ctx.rect(580, 330, 40, 20)
      ctx.stroke()

      ctx.restore()
    },
    [backgroundImage, drawnObjects.length],
  )

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#f8f9fa"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const scale = Math.min(canvas.width / 1200, canvas.height / 800) * zoom
    const offsetX = (canvas.width - 1200 * scale) / 2 + panX
    const offsetY = (canvas.height - 800 * scale) / 2 + panY

    // Draw background (uploaded image only)
    drawBackground(ctx, scale, offsetX, offsetY)

    // Draw empty state if no content
    drawEmptyState(ctx, scale, offsetX, offsetY)

    // Draw grid overlay if enabled
    drawGrid(ctx, scale, offsetX, offsetY)

    // Draw path connections BEFORE objects so they appear behind
    drawPathConnections(ctx, scale, offsetX, offsetY)

    // Draw all placed objects
    drawnObjects.forEach((obj) => {
      drawObject(ctx, obj, scale, offsetX, offsetY)
    })

    // Draw current polygon being drawn
    if (currentTool === "polygon") {
      drawCurrentPolygon(ctx, scale, offsetX, offsetY)
    }

    // Draw measurement in progress
    if (currentTool === "measure") {
      drawMeasurement(ctx, scale, offsetX, offsetY)
    }

    // Set cursor style
    if (currentTool === "delete") {
      canvas.style.cursor = "not-allowed"
    } else if (currentTool === "copy") {
      canvas.style.cursor = "copy"
    } else if (currentTool === "measure") {
      canvas.style.cursor = "crosshair"
    } else if (currentTool) {
      canvas.style.cursor = "crosshair"
    } else {
      canvas.style.cursor = isDragging ? "grabbing" : "grab"
    }
  }, [
    zoom,
    panX,
    panY,
    drawnObjects,
    currentTool,
    isDragging,
    drawBackground,
    drawEmptyState,
    drawGrid,
    drawPathConnections,
    drawObject,
    drawCurrentPolygon,
    drawMeasurement,
  ])

  useEffect(() => {
    draw()
  }, [draw])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const resizeCanvas = () => {
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
      draw()
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    return () => window.removeEventListener("resize", resizeCanvas)
  }, [draw])

  const getCanvasCoordinates = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const scale = Math.min(canvas.width / 1200, canvas.height / 800) * zoom
    const offsetX = (canvas.width - 1200 * scale) / 2 + panX
    const offsetY = (canvas.height - 800 * scale) / 2 + panY

    const x = (e.clientX - rect.left - offsetX) / scale
    const y = (e.clientY - rect.top - offsetY) / scale

    return { x, y }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (currentTool) return

    setIsDragging(true)
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const { x, y } = getCanvasCoordinates(e)
    setMousePos({ x, y })

    if (isDragging && !currentTool) {
      setPan(e.clientX - dragStart.x, e.clientY - dragStart.y)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) return

    const { x, y } = getCanvasCoordinates(e)

    // Allow placement anywhere on canvas (0-1200, 0-800)
    if (x < 0 || x > 1200 || y < 0 || y > 800) return

    if (currentTool === "polygon") {
      // Check if clicking near the first point to close polygon
      if (currentPolygon.length >= 3) {
        const firstPoint = currentPolygon[0]
        const distance = Math.sqrt(Math.pow(firstPoint.x - x, 2) + Math.pow(firstPoint.y - y, 2))
        if (distance < 20) {
          completePolygon()
          return
        }
      }

      // Add point to current polygon
      addPolygonPoint({ x, y })
    } else if (currentTool === "wifi") {
      // Open transmitter dialog instead of directly placing
      setPendingTransmitterCoordinates({ x, y })
      setShowTransmitterDialog(true)
    } else if (currentTool === "location") {
      // Open venue dialog instead of directly placing
      setPendingVenueCoordinates({ x, y })
      setShowVenueDialog(true)
    } else if (currentTool === "measure") {
      // Add measurement point
      addMeasurePoint({ x, y })
    } else if (currentTool === "delete") {
      // Find clicked object to delete
      const clickedObject = drawnObjects.find((obj) => {
        if (obj.type === "polygon" && obj.points) {
          // Check if point is inside polygon
          let inside = false
          for (let i = 0, j = obj.points.length - 1; i < obj.points.length; j = i++) {
            if (
              obj.points[i].y > y !== obj.points[j].y > y &&
              x <
                ((obj.points[j].x - obj.points[i].x) * (y - obj.points[i].y)) / (obj.points[j].y - obj.points[i].y) +
                  obj.points[i].x
            ) {
              inside = !inside
            }
          }
          return inside
        } else {
          const distance = Math.sqrt(Math.pow(obj.x - x, 2) + Math.pow(obj.y - y, 2))
          return distance < 25
        }
      })

      if (clickedObject) {
        deleteSelectedObject(clickedObject.id)
        setSelectedObject(null)
      }
    } else if (currentTool === "copy") {
      // Find clicked object to copy
      const clickedObject = drawnObjects.find((obj) => {
        if (obj.type === "polygon" && obj.points) {
          // Check if point is inside polygon
          let inside = false
          for (let i = 0, j = obj.points.length - 1; i < obj.points.length; j = i++) {
            if (
              obj.points[i].y > y !== obj.points[j].y > y &&
              x <
                ((obj.points[j].x - obj.points[i].x) * (y - obj.points[i].y)) / (obj.points[j].y - obj.points[i].y) +
                  obj.points[i].x
            ) {
              inside = !inside
            }
          }
          return inside
        } else {
          const distance = Math.sqrt(Math.pow(obj.x - x, 2) + Math.pow(obj.y - y, 2))
          return distance < 25
        }
      })

      if (clickedObject) {
        copyObject(clickedObject.id)
        setSelectedObject(clickedObject.id)
      }
    } else if (currentTool === "path") {
      // Check if clicking near an existing path node to connect
      const nearbyPathNode = drawnObjects.find((obj) => {
        if (obj.type === "path") {
          const distance = Math.sqrt(Math.pow(obj.x - x, 2) + Math.pow(obj.y - y, 2))
          return distance < 30 // Connection threshold
        }
        return false
      })

      if (nearbyPathNode) {
        // Find the most recently placed path node to connect to
        const pathNodes = drawnObjects.filter((obj) => obj.type === "path")
        const lastPathNode = pathNodes[pathNodes.length - 1]

        if (lastPathNode && lastPathNode.id !== nearbyPathNode.id) {
          // Create connection between last placed node and nearby node
          addPathConnection(lastPathNode.id, nearbyPathNode.id)
        }
      } else {
        // Place new path node
        const newPathNode: DrawnObject = {
          id: `path_${Date.now()}`,
          type: "path",
          x,
          y,
        }

        addDrawnObject(newPathNode)

        // Auto-connect to nearby path nodes
        const nearbyNodes = drawnObjects.filter((obj) => {
          if (obj.type === "path") {
            const distance = Math.sqrt(Math.pow(obj.x - x, 2) + Math.pow(obj.y - y, 2))
            return distance < 80 && distance > 0 // Auto-connection threshold
          }
          return false
        })

        // Connect to the closest nearby node
        if (nearbyNodes.length > 0) {
          const closest = nearbyNodes.reduce((closest, node) => {
            const closestDist = Math.sqrt(Math.pow(closest.x - x, 2) + Math.pow(closest.y - y, 2))
            const nodeDist = Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2))
            return nodeDist < closestDist ? node : closest
          })
          addPathConnection(newPathNode.id, closest.id)
        }
      }
    } else if (currentTool) {
      // Place other objects
      const newObject: DrawnObject = {
        id: `${currentTool}_${Date.now()}`,
        type: currentTool as any,
        x,
        y,
      }

      addDrawnObject(newObject)
    }
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (currentTool === "polygon" && currentPolygon.length >= 3) {
      completePolygon()
      return
    }

    const { x, y } = getCanvasCoordinates(e)

    // Find clicked object
    const clickedObject = drawnObjects.find((obj) => {
      if (obj.type === "polygon" && obj.points) {
        // Check if point is inside polygon
        let inside = false
        for (let i = 0, j = obj.points.length - 1; i < obj.points.length; j = i++) {
          if (
            obj.points[i].y > y !== obj.points[j].y > y &&
            x <
              ((obj.points[j].x - obj.points[i].x) * (y - obj.points[i].y)) / (obj.points[j].y - obj.points[i].y) +
                obj.points[i].x
          ) {
            inside = !inside
          }
        }
        return inside
      } else {
        const distance = Math.sqrt(Math.pow(obj.x - x, 2) + Math.pow(obj.y - y, 2))
        return distance < 25
      }
    })

    if (clickedObject) {
      if (selectedObject === clickedObject.id) {
        removeDrawnObject(clickedObject.id)
        setSelectedObject(null)
      } else {
        setSelectedObject(clickedObject.id)
      }
    } else {
      setSelectedObject(null)
    }
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setZoom(zoom + delta)
  }

  const handleAddVenue = (venueData: any) => {
    if (!pendingVenueCoordinates) return

    const newVenue: DrawnObject = {
      id: `venue_${Date.now()}`,
      type: "venue",
      x: pendingVenueCoordinates.x,
      y: pendingVenueCoordinates.y,
      venueData,
    }

    addDrawnObject(newVenue)
    setPendingVenueCoordinates(null)
  }

  const handleCloseVenueDialog = () => {
    setShowVenueDialog(false)
    setPendingVenueCoordinates(null)
  }

  const handleSaveMeasurement = (actualDistance: number) => {
    if (!pendingMeasurement) return

    const { startPoint, endPoint, pixelDistance } = pendingMeasurement
    const scale = pixelDistance / actualDistance // pixels per meter

    const newMeasurement: DrawnObject = {
      id: `measure_${Date.now()}`,
      type: "measure",
      x: (startPoint.x + endPoint.x) / 2,
      y: (startPoint.y + endPoint.y) / 2,
      measureData: {
        startPoint,
        endPoint,
        pixelDistance,
        actualDistance,
        scale,
      },
    }

    addDrawnObject(newMeasurement)
    clearMeasurePoints()
    setPendingMeasurement(null)
  }

  const handleCloseMeasureDialog = () => {
    setShowMeasureDialog(false)
    setPendingMeasurement(null)
    clearMeasurePoints()
  }

  const handleAddTransmitter = (transmitterData: any) => {
    if (!pendingTransmitterCoordinates) return

    const newTransmitter: DrawnObject = {
      id: `wifi_${Date.now()}`,
      type: "wifi",
      x: pendingTransmitterCoordinates.x,
      y: pendingTransmitterCoordinates.y,
      transmitterData,
    }

    addDrawnObject(newTransmitter)
    setPendingTransmitterCoordinates(null)
  }

  const handleCloseTransmitterDialog = () => {
    setShowTransmitterDialog(false)
    setPendingTransmitterCoordinates(null)
  }

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentTool === "polygon") {
        if (e.key === "Escape") {
          useNavigationStore.getState().setCurrentPolygon([])
        } else if (e.key === "Enter" && currentPolygon.length >= 3) {
          completePolygon()
        }
      } else if (currentTool === "measure") {
        if (e.key === "Escape") {
          clearMeasurePoints()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentTool, currentPolygon.length, completePolygon, clearMeasurePoints])

  return (
    <div ref={containerRef} className="flex-1 relative bg-gray-100">
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onWheel={handleWheel}
      />

      {/* Add Venue Dialog */}
      <AddVenueDialog
        open={showVenueDialog}
        onClose={handleCloseVenueDialog}
        onAdd={handleAddVenue}
        coordinates={pendingVenueCoordinates || { x: 0, y: 0 }}
      />

      {/* Measure Dialog */}
      <MeasureDialog
        open={showMeasureDialog}
        onClose={handleCloseMeasureDialog}
        onSave={handleSaveMeasurement}
        pixelDistance={pendingMeasurement?.pixelDistance || 0}
      />

      {/* Add Transmitter Dialog */}
      <AddTransmitterDialog
        open={showTransmitterDialog}
        onClose={handleCloseTransmitterDialog}
        onAdd={handleAddTransmitter}
        coordinates={pendingTransmitterCoordinates || { x: 0, y: 0 }}
      />

      {/* Floor plan status */}
      <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded shadow text-sm text-gray-600">
        {backgroundImageUrl ? (
          <>
            Objects: {drawnObjects.length}
            {currentPolygon.length > 0 && ` • Drawing: ${currentPolygon.length} points`}
            {measurePoints.length > 0 && ` • Measuring: ${measurePoints.length}/2 points`}
            {showGrid && " • Grid: ON"}
            <span className="text-green-600"> • Floor Plan Loaded</span>
            {drawnObjects.length > 0 && <span className="text-blue-600"> • Ready for Export</span>}
          </>
        ) : (
          <>
            Objects: {drawnObjects.length}
            {currentPolygon.length > 0 && ` • Drawing: ${currentPolygon.length} points`}
            {measurePoints.length > 0 && ` • Measuring: ${measurePoints.length}/2 points`}
            {showGrid && " • Grid: ON"}
            <span className="text-orange-600"> • No Floor Plan</span>
            {drawnObjects.length > 0 && <span className="text-blue-600"> • Ready for Export</span>}
          </>
        )}
      </div>

      {/* Mapping Progress Indicator */}
      {currentTool && (
        <div className="absolute top-16 left-4 bg-blue-100 border border-blue-300 px-3 py-2 rounded shadow text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-blue-800 font-medium">
              Mapping Mode: {currentTool.charAt(0).toUpperCase() + currentTool.slice(1)}
            </span>
          </div>
          <div className="text-xs text-blue-600 mt-1">
            Click on the canvas to place{" "}
            {currentTool === "wifi"
              ? "WiFi beacons"
              : currentTool === "location"
                ? "venue markers"
                : currentTool === "path"
                  ? "path nodes"
                  : currentTool === "polygon"
                    ? "polygon points"
                    : currentTool === "measure"
                      ? "measurement points"
                      : "objects"}
          </div>
        </div>
      )}

      {/* Floor dimensions */}
      <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded shadow text-sm text-gray-600">
        Canvas: 1200 x 800 px
      </div>

      {/* Compass */}
      <div className="absolute bottom-16 right-4 bg-white p-2 rounded shadow border">
        <div className="w-8 h-8 relative border border-gray-300 rounded-full">
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-xs font-bold">N</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-3 bg-red-500"></div>
        </div>
      </div>

      {/* Help button */}
      <div className="absolute bottom-4 right-4">
        <button className="w-10 h-10 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 flex items-center justify-center">
          <span className="text-lg font-bold">?</span>
        </button>
      </div>

      {/* Measurement instructions */}
      {currentTool === "measure" && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-75 text-white px-4 py-3 rounded pointer-events-none max-w-sm text-center">
          <div className="text-sm">
            {measurePoints.length === 0 && "Click to place first measurement point"}
            {measurePoints.length === 1 && "Click to place second measurement point"}
            <div className="text-xs mt-1 opacity-75">Press Escape to cancel</div>
          </div>
        </div>
      )}

      {/* Polygon drawing instructions */}
      {currentTool === "polygon" && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-75 text-white px-4 py-3 rounded pointer-events-none max-w-sm text-center">
          <div className="text-sm">
            {currentPolygon.length === 0 && "Click anywhere to start drawing polygon"}
            {currentPolygon.length === 1 && "Click to add second point"}
            {currentPolygon.length === 2 && "Click to add third point"}
            {currentPolygon.length >= 3 && (
              <>
                <div>Click near first point or press Enter to complete</div>
                <div className="text-xs mt-1 opacity-75">Press Escape to cancel</div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
