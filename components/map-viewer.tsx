"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ZoomIn, ZoomOut, RotateCcw, Navigation, MapPin } from "lucide-react"

interface Node {
  id: string
  x: number
  y: number
  type: "start" | "end" | "waypoint" | "poi"
  name?: string
}

interface Path {
  from: string
  to: string
  distance: number
}

interface MapViewerProps {
  nodes?: Node[]
  paths?: Path[]
  selectedPath?: string[]
  className?: string
}

export function MapViewer({ nodes = [], paths = [], selectedPath = [], className }: MapViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 })

  // Default nodes for demonstration
  const defaultNodes: Node[] = [
    { id: "start", x: 100, y: 100, type: "start", name: "Entrance" },
    { id: "wp1", x: 200, y: 150, type: "waypoint", name: "Corridor A" },
    { id: "wp2", x: 300, y: 200, type: "waypoint", name: "Junction" },
    { id: "poi1", x: 250, y: 100, type: "poi", name: "Conference Room" },
    { id: "end", x: 400, y: 250, type: "end", name: "Destination" },
  ]

  const defaultPaths: Path[] = [
    { from: "start", to: "wp1", distance: 15 },
    { from: "wp1", to: "wp2", distance: 12 },
    { from: "wp1", to: "poi1", distance: 8 },
    { from: "wp2", to: "end", distance: 18 },
  ]

  const activeNodes = nodes.length > 0 ? nodes : defaultNodes
  const activePaths = paths.length > 0 ? paths : defaultPaths

  const draw = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Apply transformations
    ctx.save()
    ctx.translate(pan.x, pan.y)
    ctx.scale(zoom, zoom)

    // Draw background grid
    ctx.strokeStyle = "#f0f0f0"
    ctx.lineWidth = 1 / zoom
    const gridSize = 20
    for (let x = -pan.x / zoom; x < (canvas.width - pan.x) / zoom; x += gridSize) {
      if (x >= 0) {
        ctx.beginPath()
        ctx.moveTo(x, -pan.y / zoom)
        ctx.lineTo(x, (canvas.height - pan.y) / zoom)
        ctx.stroke()
      }
    }
    for (let y = -pan.y / zoom; y < (canvas.height - pan.y) / zoom; y += gridSize) {
      if (y >= 0) {
        ctx.beginPath()
        ctx.moveTo(-pan.x / zoom, y)
        ctx.lineTo((canvas.width - pan.x) / zoom, y)
        ctx.stroke()
      }
    }

    // Draw paths
    activePaths.forEach((path) => {
      const fromNode = activeNodes.find((n) => n.id === path.from)
      const toNode = activeNodes.find((n) => n.id === path.to)

      if (fromNode && toNode) {
        const isSelected = selectedPath.includes(path.from) && selectedPath.includes(path.to)

        ctx.beginPath()
        ctx.strokeStyle = isSelected ? "#FDB623" : "#333333"
        ctx.lineWidth = isSelected ? 4 / zoom : 2 / zoom
        ctx.moveTo(fromNode.x, fromNode.y)
        ctx.lineTo(toNode.x, toNode.y)
        ctx.stroke()

        // Draw distance label
        const midX = (fromNode.x + toNode.x) / 2
        const midY = (fromNode.y + toNode.y) / 2
        ctx.fillStyle = isSelected ? "#FDB623" : "#333333"
        ctx.font = `${12 / zoom}px Arial`
        ctx.textAlign = "center"
        ctx.fillText(`${path.distance}m`, midX, midY - 5 / zoom)
      }
    })

    // Draw nodes
    activeNodes.forEach((node) => {
      const isSelected = selectedPath.includes(node.id)
      let color = "#333333"
      let size = 8

      switch (node.type) {
        case "start":
          color = "#FDB623"
          size = 12
          break
        case "end":
          color = "#FDB623"
          size = 12
          break
        case "poi":
          color = isSelected ? "#FDB623" : "#333333"
          size = 10
          break
        case "waypoint":
          color = isSelected ? "#FDB623" : "#333333"
          size = 6
          break
      }

      // Draw node
      ctx.beginPath()
      ctx.fillStyle = color
      ctx.arc(node.x, node.y, size / zoom, 0, 2 * Math.PI)
      ctx.fill()

      // Draw node border
      ctx.beginPath()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2 / zoom
      ctx.arc(node.x, node.y, size / zoom, 0, 2 * Math.PI)
      ctx.stroke()

      // Draw node label
      if (node.name) {
        ctx.fillStyle = color
        ctx.font = `${11 / zoom}px Arial`
        ctx.textAlign = "center"
        ctx.fillText(node.name, node.x, node.y + (size + 15) / zoom)
      }
    })

    ctx.restore()
  }

  useEffect(() => {
    draw()
  }, [zoom, pan, activeNodes, activePaths, selectedPath])

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true)
    setLastMousePos({ x: event.clientX, y: event.clientY })
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = event.clientX - lastMousePos.x
      const deltaY = event.clientY - lastMousePos.y
      setPan((prev) => ({ x: prev.x + deltaX, y: prev.y + deltaY }))
      setLastMousePos({ x: event.clientX, y: event.clientY })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev * 1.2, 3))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev / 1.2, 0.5))
  }

  const handleReset = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleZoomIn}
          className="h-8 w-8 p-0 bg-card/90 backdrop-blur-sm"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleZoomOut}
          className="h-8 w-8 p-0 bg-card/90 backdrop-blur-sm"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="sm" onClick={handleReset} className="h-8 w-8 p-0 bg-card/90 backdrop-blur-sm">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Status */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm">
          <Navigation className="h-3 w-3 mr-1" />
          {activeNodes.length} Nodes
        </Badge>
        <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm">
          <MapPin className="h-3 w-3 mr-1" />
          {activePaths.length} Paths
        </Badge>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {/* Zoom indicator */}
      <div className="absolute bottom-4 right-4 z-10">
        <Badge variant="outline" className="bg-card/90 backdrop-blur-sm text-xs">
          {Math.round(zoom * 100)}%
        </Badge>
      </div>
    </Card>
  )
}
