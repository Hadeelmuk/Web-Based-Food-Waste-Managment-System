"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type StoredUser = {
  email?: string
  userId?: string
  role?: "admin" | "staff" | "charity" | "farmer"
  organizationName?: string
  cafeId?: string | null
}

type AuthContextType = {
  isAuthenticated: boolean
  login: (user: StoredUser) => void
  logout: () => void
  user: StoredUser | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<StoredUser | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
  }, [])

  const login = (authUser: StoredUser) => {
    localStorage.setItem("user", JSON.stringify(authUser))
    setUser(authUser)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
    setIsAuthenticated(false)
  }

  return <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
