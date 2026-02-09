import { NextRequest, NextResponse } from "next/server"

import { users } from "@/app/api/_data"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

/**
 * POST /api/auth/login
 * Handles user login authentication.
 * 
 * First tries to find user in database (SQLite via Prisma).
 * If not found, falls back to in-memory demo users.
 * 
 * Returns user info needed by frontend for routing and session management.
 */
export async function POST(req: NextRequest) {
  // Parse request body
  const body = (await req.json().catch(() => null)) as { email?: string; password?: string } | null

  // Validate required fields
  if (!body?.email || !body?.password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
  }

  const email = body.email.toLowerCase()

  // Step 1: Try to find user in database
  try {
    const dbUser = await db.user.findFirst({
      where: { email },
      include: { business: true },
    })

    // Check if user exists and password matches
    if (dbUser && dbUser.password === body.password) {
      // Convert database role to frontend role format
      let appRole: "admin" | "staff" | "charity" | "farmer" = "staff"

      if (dbUser.role === "ADMIN") {
        appRole = "admin"
      } else if (dbUser.role === "STAFF") {
        appRole = "staff"
      } else if (dbUser.role === "PARTNER") {
        // Partners can be either charity or farmer based on business type
        const businessType = dbUser.business?.type
        if (businessType === "NGO") appRole = "charity"
        else if (businessType === "FARM") appRole = "farmer"
        else appRole = "staff"
      }

      // Return user info for frontend
      return NextResponse.json({
        userId: dbUser.id,
        role: appRole,
        organizationName: dbUser.business?.name || "My Business",
        cafeId: dbUser.businessId, // businessId serves as cafeId for routing
      })
    }
  } catch (error) {
    console.error("[POST /api/auth/login] Database lookup failed, trying demo users:", error)
  }

  // Step 2: Fallback to in-memory demo users
  const demoUser = users.find(
    (u) => u.email.toLowerCase() === email && u.passwordHash === body.password,
  )

  if (!demoUser) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  // Return demo user info
  return NextResponse.json({
    userId: demoUser.id,
    role: demoUser.role,
    organizationName: demoUser.organizationName,
    cafeId: demoUser.cafeId,
  })
}

