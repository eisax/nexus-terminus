"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Home, MapPin, Building2, Users, Bell, Navigation, Layers, GitBranch } from "lucide-react"
import Image from "next/image"

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    name: "Locations",
    href: "/locations",
    icon: MapPin,
  },
  {
    name: "Add Location",
    href: "/add-location",
    icon: Building2,
  },
  {
    name: "Add Floor",
    href: "/add-floor",
    icon: Layers,
  },
  {
    name: "Apps",
    href: "/apps",
    icon: Navigation,
  },
  {
    name: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: Users,
  },
  {
    name: "Versions",
    href: "/versions",
    icon: GitBranch,
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 relative">
              <Image src="/logo.png" alt="Nexus Terminus" width={40} height={40} className="object-contain" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Nexus Terminus</h2>
              <p className="text-xs text-muted-foreground">Navigation Platform</p>
            </div>
          </div>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Button
                    key={item.name}
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 h-10",
                      isActive && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
                    )}
                    asChild
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  </Button>
                )
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
