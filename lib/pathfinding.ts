import type { Node, Edge, PathResult } from "@/types/navigation"

export class PathFinder {
  private nodes: Map<string, Node>
  private edges: Map<string, Edge[]>

  constructor(nodes: Node[], edges: Edge[]) {
    this.nodes = new Map(nodes.map((node) => [node.id, node]))
    this.edges = new Map()

    // Build adjacency list
    edges.forEach((edge) => {
      if (!this.edges.has(edge.from)) {
        this.edges.set(edge.from, [])
      }
      this.edges.get(edge.from)!.push(edge)

      // Handle bidirectional edges
      if (edge.bidirectional !== false) {
        if (!this.edges.has(edge.to)) {
          this.edges.set(edge.to, [])
        }
        this.edges.get(edge.to)!.push({
          ...edge,
          from: edge.to,
          to: edge.from,
        })
      }
    })
  }

  findShortestPath(startId: string, endId: string): PathResult | null {
    const distances = new Map<string, number>()
    const previous = new Map<string, string>()
    const unvisited = new Set<string>()

    // Initialize distances
    for (const nodeId of this.nodes.keys()) {
      distances.set(nodeId, nodeId === startId ? 0 : Number.POSITIVE_INFINITY)
      unvisited.add(nodeId)
    }

    while (unvisited.size > 0) {
      // Find unvisited node with minimum distance
      const current = Array.from(unvisited).reduce((min, nodeId) =>
        distances.get(nodeId)! < distances.get(min)! ? nodeId : min,
      )

      if (distances.get(current) === Number.POSITIVE_INFINITY) break
      if (current === endId) break

      unvisited.delete(current)

      // Check neighbors
      const neighbors = this.edges.get(current) || []
      for (const edge of neighbors) {
        if (!unvisited.has(edge.to)) continue

        const alt = distances.get(current)! + edge.weight
        if (alt < distances.get(edge.to)!) {
          distances.set(edge.to, alt)
          previous.set(edge.to, current)
        }
      }
    }

    // Reconstruct path
    if (!previous.has(endId) && startId !== endId) {
      return null
    }

    const path: Node[] = []
    const pathEdges: Edge[] = []
    let current = endId

    while (current) {
      const node = this.nodes.get(current)
      if (node) path.unshift(node)

      const prev = previous.get(current)
      if (prev) {
        const edge = this.edges.get(prev)?.find((e) => e.to === current)
        if (edge) pathEdges.unshift(edge)
      }
      current = prev!
    }

    return {
      path,
      distance: distances.get(endId)!,
      edges: pathEdges,
    }
  }

  // A* algorithm for better performance with heuristic
  findShortestPathAStar(startId: string, endId: string): PathResult | null {
    const startNode = this.nodes.get(startId)
    const endNode = this.nodes.get(endId)

    if (!startNode || !endNode) return null

    const heuristic = (a: Node, b: Node) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))

    const openSet = new Set([startId])
    const cameFrom = new Map<string, string>()
    const gScore = new Map<string, number>()
    const fScore = new Map<string, number>()

    for (const nodeId of this.nodes.keys()) {
      gScore.set(nodeId, Number.POSITIVE_INFINITY)
      fScore.set(nodeId, Number.POSITIVE_INFINITY)
    }

    gScore.set(startId, 0)
    fScore.set(startId, heuristic(startNode, endNode))

    while (openSet.size > 0) {
      const current = Array.from(openSet).reduce((min, nodeId) =>
        fScore.get(nodeId)! < fScore.get(min)! ? nodeId : min,
      )

      if (current === endId) {
        // Reconstruct path
        const path: Node[] = []
        const pathEdges: Edge[] = []
        let curr = endId

        while (curr) {
          const node = this.nodes.get(curr)
          if (node) path.unshift(node)

          const prev = cameFrom.get(curr)
          if (prev) {
            const edge = this.edges.get(prev)?.find((e) => e.to === curr)
            if (edge) pathEdges.unshift(edge)
          }
          curr = prev!
        }

        return {
          path,
          distance: gScore.get(endId)!,
          edges: pathEdges,
        }
      }

      openSet.delete(current)
      const neighbors = this.edges.get(current) || []

      for (const edge of neighbors) {
        const tentativeGScore = gScore.get(current)! + edge.weight

        if (tentativeGScore < gScore.get(edge.to)!) {
          cameFrom.set(edge.to, current)
          gScore.set(edge.to, tentativeGScore)
          const targetNode = this.nodes.get(edge.to)!
          fScore.set(edge.to, gScore.get(edge.to)! + heuristic(targetNode, endNode))

          if (!openSet.has(edge.to)) {
            openSet.add(edge.to)
          }
        }
      }
    }

    return null
  }
}
