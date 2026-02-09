import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export const dynamic = "force-dynamic"

/**
 * Gets the current user from the request.
 * Tries NextAuth session first, then falls back to x-user-id header.
 */
async function getUserFromRequest(
  request: NextRequest,
): Promise<{ id: string; role: string; businessId: string | null } | null> {
  // Try NextAuth session first
  const session = await getServerSession(authOptions)
  if (session?.user) {
    return {
      id: session.user.id,
      role: session.user.role,
      businessId: session.user.businessId,
    }
  }

  // Fallback to x-user-id header (for demo/localStorage auth)
  const userId = request.headers.get("x-user-id")
  if (userId) {
    try {
      const dbUser = await db.user.findUnique({
        where: { id: userId },
        include: { business: true },
      })
      if (dbUser) {
        return {
          id: dbUser.id,
          role: dbUser.role,
          businessId: dbUser.businessId,
        }
      }
    } catch (error) {
      console.error(`[user/password] Error looking up user:`, error)
    }
  }

  return null
}

/**
 * POST /api/user/password
 * Changes the current user's password.
 * Validates current password before updating to new password.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { currentPassword, newPassword } = body

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      )
    }

    // Validate password length
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters" },
        { status: 400 }
      )
    }

    // Get user's current password from database
    const dbUser = await db.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        password: true,
      },
    })

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if this is a dummy password (for demo/mock users)
    // Dummy passwords start with a special prefix
    const isDummyPassword = dbUser.password.startsWith("$2a$10$dummy")
    
    // Verify current password (skip verification for dummy passwords)
    if (!isDummyPassword) {
      const isValidPassword = await bcrypt.compare(currentPassword, dbUser.password)
      if (!isValidPassword) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
      }
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password in database
    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Password changed successfully",
    })
  } catch (error) {
    console.error("[user/password] POST Error:", error)
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 })
  }
}

















