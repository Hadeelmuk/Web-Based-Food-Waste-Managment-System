"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { useState, useEffect } from "react"

/**
 * Props for RoleTopbar component.
 */
type RoleTopbarProps = {
  title: string // Title to display in the topbar (e.g., "Charity Portal", "Farmer Portal")
  onLogout?: () => void // Optional logout callback
}

/**
 * Top navigation bar for authenticated dashboard pages.
 * Displays portal title, business name, settings button, and logout button.
 */
export function RoleTopbar({ title, onLogout }: RoleTopbarProps) {
  const router = useRouter()
  const [businessName, setBusinessName] = useState<string>("")

  /**
   * Fetches and displays the business name from user profile.
   * Also listens for profile updates from the settings page.
   */
  useEffect(() => {
    const fetchBusinessName = async () => {
      try {
        // Get user ID from localStorage
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
        if (!storedUser.userId) return

        // Use cached business name if available
        if (storedUser.businessName) {
          setBusinessName(storedUser.businessName)
        }

        // Fetch fresh data from API
        const response = await fetch("/api/user/profile", {
          headers: {
            "x-user-id": storedUser.userId,
          },
        })

        if (response.ok) {
          const data = await response.json()
          // Prefer business name, fallback to user name
          const name = data.business?.name || data.name || ""
          setBusinessName(name)
        }
      } catch (error) {
        console.error("Error fetching business name:", error)
      }
    }

    fetchBusinessName()

    /**
     * Handles custom event when profile is updated in settings page.
     * Updates business name display without page refresh.
     */
    const handleProfileUpdate = (event: CustomEvent) => {
      if (event.detail?.businessName) {
        setBusinessName(event.detail.businessName)
      }
    }

    // Listen for profile update events
    window.addEventListener("profileUpdated", handleProfileUpdate as EventListener)
    
    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate as EventListener)
    }
  }, [])

  /**
   * Handles logout action.
   * Clears localStorage and redirects to login page.
   */
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
    }
    onLogout?.()
    router.push("/login")
  }

  return (
    <header className="w-full bg-[#f5f3e9] border-b border-border">
      <div className="mx-auto flex items-center justify-between px-4 py-3 max-w-6xl">
        {/* Left side: Logo and title */}
        <div className="flex items-center gap-2">
          <Image src="/placeholder-logo.png" alt="Logo" width={28} height={28} className="h-7 w-7 object-contain" />
          <span className="font-display font-semibold text-sm text-foreground">{title}</span>
        </div>
        
        {/* Right side: Business name, settings, logout */}
        <div className="flex items-center gap-2">
          {/* Display business name if available */}
          {businessName && (
            <span className="text-sm text-muted-foreground hidden sm:block font-medium">
              {businessName}
            </span>
          )}
          {/* Settings button */}
          <Link href="/dashboard/settings">
            <Button variant="ghost" size="icon" title="Settings">
              <Settings className="w-5 h-5" />
            </Button>
          </Link>
          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

