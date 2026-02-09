"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Trash2, Award, Settings, LogOut, Truck } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"

export function DashboardNav() {
  const { logout, user } = useAuth()
  const router = useRouter()
  const [businessName, setBusinessName] = useState<string>("")

  // Fetch business name on mount
  useEffect(() => {
    const fetchBusinessName = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
        if (!storedUser.userId) return

        // Check localStorage first for cached business name
        if (storedUser.businessName) {
          setBusinessName(storedUser.businessName)
        }

        const response = await fetch("/api/user/profile", {
          headers: {
            "x-user-id": storedUser.userId,
          },
        })

        if (response.ok) {
          const data = await response.json()
          // Use business name, fallback to user name
          const name = data.business?.name || data.name || ""
          setBusinessName(name)
        }
      } catch (error) {
        console.error("Error fetching business name:", error)
      }
    }

    fetchBusinessName()

    // Listen for profile updates from settings page
    const handleProfileUpdate = (event: CustomEvent) => {
      if (event.detail?.businessName) {
        setBusinessName(event.detail.businessName)
      }
    }

    window.addEventListener("profileUpdated", handleProfileUpdate as EventListener)
    
    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate as EventListener)
    }
  }, [])

  const handleLogout = () => {
    // Clear any stored user session and send back to login
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
    }
    logout()
    router.push("/login")
  }

  return (
    <nav className="fixed top-0 w-full bg-card border-b border-border z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image
              src="/placeholder-logo.png"
              alt="From Plate to Plant Logo"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
              priority
            />
            <span className="font-display font-bold text-xl text-foreground">From Plate to Plant</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/log-waste">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                <Trash2 className="w-4 h-4 mr-2" />
                Log Waste
              </Button>
            </Link>
            <Link href="/dashboard/transportation">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                <Truck className="w-4 h-4 mr-2" />
                Transport
              </Button>
            </Link>
            <Link href="/dashboard/points">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                <Award className="w-4 h-4 mr-2" />
                Points
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {(businessName || user) && (
              <span className="text-sm text-muted-foreground hidden lg:block font-medium">
                {businessName || user?.organizationName || user?.email || "Signed in"}
              </span>
            )}
            <Link href="/dashboard/settings">
              <Button variant="ghost" size="icon" title="Settings">
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
            <Button variant="ghost" className="text-foreground hover:text-destructive" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
