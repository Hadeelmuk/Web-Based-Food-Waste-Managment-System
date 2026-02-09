import { NextRequest, NextResponse } from "next/server"
import { users } from "./_data"
import type { User } from "./_types"

/**
 * Gets the user from the request header.
 * The frontend sends the user ID in the x-user-id header after login.
 */
export function getUser(req: NextRequest): User | null {
  const userId = req.headers.get("x-user-id")
  if (!userId) return null
  
  // Find the user in our in-memory users array
  const foundUser = users.find((u) => u.id === userId)
  return foundUser || null
}

/**
 * Result type for role checking functions.
 * Returns the user if authorized, or an error response if not.
 */
type GuardResult = { user: User | null; response: NextResponse | null }

/**
 * Checks if the request has a user with the required role.
 * Used by all the require* functions below.
 */
function requireRole(req: NextRequest, role: User["role"]): GuardResult {
  const user = getUser(req)
  
  // No user found in header
  if (!user) {
    return { user: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
  }
  
  // User exists but doesn't have the right role
  if (user.role !== role) {
    return {
      user: null,
      response: NextResponse.json({ error: `Forbidden: ${role} only` }, { status: 403 }),
    }
  }
  
  // User is authorized
  return { user, response: null }
}

/**
 * Checks if the request is from an admin user.
 * Also verifies that the admin has a cafe assigned.
 */
export function requireAdmin(req: NextRequest) {
  const result = requireRole(req, "admin")
  
  // If already failed, return the error
  if (!result.user || result.response) return result
  
  // Admin must have a cafe assigned
  if (!result.user.cafeId) {
    return { user: null, response: NextResponse.json({ error: "Admin has no cafe assigned" }, { status: 400 }) }
  }
  
  return result
}

/**
 * Checks if the request is from a staff user.
 * Also verifies that the staff has a cafe assigned.
 */
export function requireStaff(req: NextRequest) {
  const result = requireRole(req, "staff")
  
  // If already failed, return the error
  if (!result.user || result.response) return result
  
  // Staff must have a cafe assigned
  if (!result.user.cafeId) {
    return { user: null, response: NextResponse.json({ error: "Staff has no cafe assigned" }, { status: 400 }) }
  }
  
  return result
}

/**
 * Checks if the request is from a charity user.
 */
export function requireCharity(req: NextRequest) {
  return requireRole(req, "charity")
}

/**
 * Checks if the request is from a farmer user.
 */
export function requireFarmer(req: NextRequest) {
  return requireRole(req, "farmer")
}

