"use client"

import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  MapPin,
  Activity,
  Settings,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  ArrowRight,
  Zap,
  Database,
  Wifi,
} from "lucide-react"
import { ProtectedRoute } from "@/components/auth/protected-route"

interface DashboardStats {
  totalApps: number
  activeLocations: number
  totalUsers: number
  systemHealth: number
}

interface RecentActivity {
  id: string
  type: "app_created" | "location_added" | "user_invited" | "system_alert"
  message: string
  timestamp: string
  status: "success" | "warning" | "error"
}

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  color: string
}

export default function DashboardPage() {
  // Mock data - in a real app, this would come from your API
  const stats: DashboardStats = {
    totalApps: 3,
    activeLocations: 12,
    totalUsers: 8,
    systemHealth: 98,
  }

  const recentActivity: RecentActivity[] = [
    {
      id: "1",
      type: "app_created",
      message: "New application 'ozzene' was created",
      timestamp: "2 hours ago",
      status: "success",
    },
    {
      id: "2",
      type: "location_added",
      message: "Location 'campus north' added to system",
      timestamp: "4 hours ago",
      status: "success",
    },
    {
      id: "3",
      type: "user_invited",
      message: "User 'tracking user' invited to team",
      timestamp: "6 hours ago",
      status: "success",
    },
    {
      id: "4",
      type: "system_alert",
      message: "System maintenance scheduled for tonight",
      timestamp: "1 day ago",
      status: "warning",
    },
  ]

  const quickActions: QuickAction[] = [
    {
      id: "1",
      title: "Create New App",
      description: "Set up a new tracking application",
      icon: Plus,
      href: "/apps",
      color: "bg-blue-500",
    },
    {
      id: "2",
      title: "Add Location",
      description: "Register a new location for tracking",
      icon: MapPin,
      href: "/add-location",
      color: "bg-green-500",
    },
    {
      id: "3",
      title: "Manage Users",
      description: "Invite team members and manage permissions",
      icon: Users,
      href: "/apps",
      color: "bg-purple-500",
    },
    {
      id: "4",
      title: "System Settings",
      description: "Configure system parameters",
      icon: Settings,
      href: "/apps",
      color: "bg-orange-500",
    },
  ]

  const getActivityIcon = (type: RecentActivity["type"]) => {
    switch (type) {
      case "app_created":
        return <Zap className="w-4 h-4" />
      case "location_added":
        return <MapPin className="w-4 h-4" />
      case "user_invited":
        return <Users className="w-4 h-4" />
      case "system_alert":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: RecentActivity["status"]) => {
    switch (status) {
      case "success":
        return "text-green-600 bg-green-100"
      case "warning":
        return "text-yellow-600 bg-yellow-100"
      case "error":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <ProtectedRoute>
      <div className="h-screen flex bg-white overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your tracking system.</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  System Online
                </Badge>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Applications</CardTitle>
                  <Zap className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalApps}</div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +1 from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Locations</CardTitle>
                  <MapPin className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stats.activeLocations}</div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +3 from last week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Team Members</CardTitle>
                  <Users className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +2 from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">System Health</CardTitle>
                  <Activity className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stats.systemHealth}%</div>
                  <Progress value={stats.systemHealth} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
                  <CardDescription>Common tasks to get you started</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {quickActions.map((action) => (
                    <div
                      key={action.id}
                      className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
                      onClick={() => (window.location.href = action.href)}
                    >
                      <div className={`p-2 rounded-lg ${action.color} text-white mr-4`}>
                        <action.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
                  <CardDescription>Latest updates from your system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className={`p-1.5 rounded-full ${getStatusColor(activity.status)}`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{activity.message}</p>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            {activity.timestamp}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" className="w-full mt-4 text-blue-600 hover:text-blue-700">
                    View All Activity
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* System Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium text-gray-900 flex items-center">
                    <Database className="w-4 h-4 mr-2 text-blue-600" />
                    Database Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Connection</span>
                    <Badge className="bg-green-100 text-green-800 border-green-200">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-600">Response Time</span>
                    <span className="text-sm font-medium text-gray-900">12ms</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium text-gray-900 flex items-center">
                    <Wifi className="w-4 h-4 mr-2 text-green-600" />
                    API Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Uptime</span>
                    <span className="text-sm font-medium text-gray-900">99.9%</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-600">Requests/min</span>
                    <span className="text-sm font-medium text-gray-900">1,247</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium text-gray-900 flex items-center">
                    <Activity className="w-4 h-4 mr-2 text-orange-600" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">CPU Usage</span>
                    <span className="text-sm font-medium text-gray-900">23%</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-600">Memory</span>
                    <span className="text-sm font-medium text-gray-900">1.2GB</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
