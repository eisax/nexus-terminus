"use client"

import type React from "react"

import { useRef, useEffect, useState, useCallback } from "react"
import { useNavigationStore } from "@/lib/store"
import type { Node, POI } from "@/types/navigation"

export function MapViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [floorPlanImage, setFloorPlanImage] = useState<HTMLImageElement | null>(null)

  const {
    currentFloor,
    zoom,
    panX,
    panY,
    selectedNodes,
    currentPath,
    editMode,
    userRole,
    setPan,
    setZoom,
    addNode,
    addPOI,
    setSelectedNodes,
  } = useNavigationStore()

  // Load floor plan image
  useEffect(() => {
    if (currentFloor?.imageUrl) {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => setFloorPlanImage(img)
      img.src = currentFloor.imageUrl
    }
  }, [currentFloor?.imageUrl])

  // Draw everything on canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !currentFloor) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Save context for transformations
    ctx.save()

    // Apply zoom and pan
    ctx.translate(panX, panY)
    ctx.scale(zoom, zoom)

    // Draw floor plan image
    if (floorPlanImage) {
      ctx.drawImage(floorPlanImage, 0, 0, currentFloor.width, currentFloor.height)
    }

    // Draw edges (paths)
    ctx.strokeStyle = "#10b981"
    ctx.lineWidth = 4 / zoom
    currentFloor.edges.forEach((edge) => {
      const fromNode = currentFloor.nodes.find((n) => n.id === edge.from)
      const toNode = currentFloor.nodes.find((n) => n.id === edge.to)

      if (fromNode && toNode) {
        ctx.beginPath()
        ctx.moveTo(fromNode.x, fromNode.y)
        ctx.lineTo(toNode.x, toNode.y)
        ctx.stroke()
      }
    })

    // Draw current path (highlighted)
    if (currentPath) {
      ctx.strokeStyle = "#ef4444"
      ctx.lineWidth = 6 / zoom
      ctx.beginPath()
      currentPath.path.forEach((node, index) => {
        if (index === 0) {
          ctx.moveTo(node.x, node.y)
        } else {
          ctx.lineTo(node.x, node.y)
        }
      })
      ctx.stroke()
    }

    // Draw nodes
    currentFloor.nodes.forEach((node) => {
      const isSelected = selectedNodes.includes(node.id)

      ctx.fillStyle = isSelected ? "#3b82f6" : "#6b7280"
      ctx.beginPath()
      ctx.arc(node.x, node.y, 8 / zoom, 0, 2 * Math.PI)
      ctx.fill()

      // Draw node label
      if (node.label) {
        ctx.fillStyle = "#000"
        ctx.font = `${12 / zoom}px Arial`
        ctx.fillText(node.label, node.x + 12 / zoom, node.y + 4 / zoom)
      }
    })

    // Draw POIs
    currentFloor.pois.forEach((poi) => {
      // Draw POI icon background
      ctx.fillStyle = getPOIColor(poi.type)
      ctx.beginPath()
      ctx.arc(poi.x, poi.y, 12 / zoom, 0, 2 * Math.PI)
      ctx.fill()

      // Draw POI icon (simplified)
      ctx.fillStyle = "#fff"
      ctx.font = `${14 / zoom}px Arial`
      ctx.textAlign = "center"
      ctx.fillText(getPOIIcon(poi.type), poi.x, poi.y + 4 / zoom)

      // Draw POI label
      ctx.fillStyle = "#000"
      ctx.font = `${10 / zoom}px Arial`
      ctx.fillText(poi.name, poi.x, poi.y + 25 / zoom)
    })

    ctx.restore()
  }, [currentFloor, floorPlanImage, zoom, panX, panY, selectedNodes, currentPath])

  // Redraw when dependencies change
  useEffect(() => {
    draw()
  }, [draw])

  // Handle canvas resize
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

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan(e.clientX - dragStart.x, e.clientY - dragStart.y)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleClick = (e: React.MouseEvent) => {
    if (!currentFloor || isDragging) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left - panX) / zoom
    const y = (e.clientY - rect.top - panY) / zoom

    // Check if clicking on existing node
    const clickedNode = currentFloor.nodes.find((node) => {
      const distance = Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2))
      return distance < 15
    })

    if (clickedNode) {
      setSelectedNodes([clickedNode.id])
      return
    }

    // Add new elements based on edit mode
    if (editMode === "nodes" && (userRole === "admin" || userRole === "editor")) {
      const newNode: Node = {
        id: `node_${Date.now()}`,
        x,
        y,
        type: "intersection",
      }
      addNode(newNode)
    } else if (editMode === "pois" && (userRole === "admin" || userRole === "editor")) {
      const newPOI: POI = {
        id: `poi_${Date.now()}`,
        name: "New POI",
        x,
        y,
        type: "other",
      }
      addPOI(newPOI)
    }
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setZoom(zoom + delta)
  }

  return (
    <div ref={containerRef} className="flex-1 relative overflow-hidden bg-gray-100">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
        onWheel={handleWheel}
      />

      {currentFloor && (
        <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow text-sm">
          Floor dimension: {currentFloor.width} x {currentFloor.height} px
        </div>
      )}
    </div>
  )
}

function getPOIColor(type: POI["type"]): string {
  const colors = {
    office: "#3b82f6",
    restroom: "#10b981",
    emergency: "#ef4444",
    elevator: "#8b5cf6",
    stairs: "#f59e0b",
    meeting: "#06b6d4",
    other: "#6b7280",
  }
  return colors[type] || colors.other
}

function getPOIIcon(type: POI["type"]): string {
  const icons = {
    office: "🏢",
    restroom: "🚻",
    emergency: "🚨",
    elevator: "🛗",
    stairs: "🪜",
    meeting: "👥",
    other: "📍",
  }
  return icons[type] || icons.other
}
