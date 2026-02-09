import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

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
      console.error(`[user/profile] Error looking up user:`, error)
    }
  }

  return null
}

/**
 * GET /api/user/profile
 * Returns the current user's profile information including business details.
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch user with business information
    const dbUser = await db.user.findUnique({
      where: { id: user.id },
      include: {
        business: {
          select: {
            id: true,
            name: true,
            type: true,
            email: true,
            phone: true,
            address: true,
          },
        },
      },
    })

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Return user profile data
    return NextResponse.json({
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role,
      business: dbUser.business,
    })
  } catch (error) {
    console.error("[user/profile] GET Error:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

/**
 * PATCH /api/user/profile
 * Updates the current user's profile and business information.
 */
export async function PATCH(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { name, businessName, businessPhone, businessAddress } = body

    // Update user's name
    await db.user.update({
      where: { id: user.id },
      data: {
        name: name || undefined,
      },
    })

    // Update business information if user has a business
    if (user.businessId && (businessName || businessPhone || businessAddress)) {
      await db.business.update({
        where: { id: user.businessId },
        data: {
          name: businessName || undefined,
          phone: businessPhone || undefined,
          address: businessAddress || undefined,
        },
      })
    }

    // Fetch updated user with business to return
    const updatedUser = await db.user.findUnique({
      where: { id: user.id },
      include: {
        business: {
          select: {
            id: true,
            name: true,
            type: true,
            email: true,
            phone: true,
            address: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser?.id,
        name: updatedUser?.name,
        email: updatedUser?.email,
        role: updatedUser?.role,
        business: updatedUser?.business,
      },
    })
  } catch (error) {
    console.error("[user/profile] PATCH Error:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}

















