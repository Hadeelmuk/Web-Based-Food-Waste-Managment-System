"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

/**
 * User session data stored in localStorage after login.
 */
type UserSession = {
  userId?: string
  role?: "admin" | "staff" | "charity" | "farmer"
  organizationName?: string
  cafeId?: string | null
}

/**
 * Higher-order component to protect pages with authentication.
 * Checks if user is logged in and has the required role.
 * 
 * @param Page - The page component to protect
 * @param allowedRoles - Array of roles that can access this page
 * @returns Protected page component
 */
export function withAuth<P>(
  Page: React.ComponentType<P & { user: UserSession }>,
  allowedRoles: UserSession["role"][],
) {
  return function ProtectedPage(props: P) {
    const router = useRouter()
    const [user, setUser] = useState<UserSession | null>(null)

    useEffect(() => {
      // Skip on server-side
      if (typeof window === "undefined") return
      
      // Remove old demo user data if it exists
      localStorage.removeItem("demo_user")
      
      // Get user data from localStorage
      const stored = localStorage.getItem("user")
      const parsed: UserSession | null = stored ? JSON.parse(stored) : null

      // Check if user is logged in
      if (!parsed?.role || !parsed?.userId) {
        router.replace("/login")
        return
      }

      // Check if user has the required role
      if (!allowedRoles.includes(parsed.role)) {
        router.replace("/not-authorized")
        return
      }

      // User is authorized, set user state
      setUser(parsed)
    }, [allowedRoles, router])

    // Don't render page until user is loaded
    if (!user) return null
    
    return <Page {...props} user={user} />
  }
}

/**
 * Logs out the user by clearing localStorage and redirecting to login.
 */
export function logout(router: ReturnType<typeof useRouter>) {
  if (typeof window === "undefined") return
  localStorage.removeItem("user")
  router.push("/login")
}

