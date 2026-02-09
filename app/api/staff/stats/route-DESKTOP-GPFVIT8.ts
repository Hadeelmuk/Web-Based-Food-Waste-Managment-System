import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"
export const revalidate = 0

async function getUserFromRequest(
  request: NextRequest,
): Promise<{ id: string; role: string; businessId: string | null } | null> {
  const session = await getServerSession(authOptions)
  if (session?.user) {
    return {
      id: session.user.id,
      role: session.user.role,
      businessId: session.user.businessId,
    }
  }

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
      console.error(`[staff/stats] Error looking up user ${userId}:`, error)
    }
  }

  return null
}

// GET /api/staff/stats
// Returns summary stats for the staff's café (Total Waste, Donated, Composted, Dropped)
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (user.role !== "STAFF" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Ensure user has a businessId
    let businessId = user.businessId
    if (!businessId) {
      // Try to find business from waste entries
      const wasteEntry = await db.wasteEntry.findFirst({
        where: {
          loggedById: user.id,
        },
        select: { businessId: true },
      })
      if (wasteEntry?.businessId) {
        businessId = wasteEntry.businessId
        // Update user's businessId
        await db.user.update({
          where: { id: user.id },
          data: { businessId },
        })
      } else {
        // Find any CAFE business
        const cafe = await db.business.findFirst({
          where: { type: "CAFE" },
        })
        if (cafe) {
          businessId = cafe.id
          await db.user.update({
            where: { id: user.id },
            data: { businessId },
          })
        }
      }
    }

    if (!businessId) {
      return NextResponse.json(
        { error: "User business not found" },
        { status: 400 }
      )
    }

    // Get all waste entries for this business
    const entries = await db.wasteEntry.findMany({
      where: {
        businessId,
      },
      select: {
        quantity: true,
        status: true,
        actionType: true,
      },
    })

    // Calculate stats from WasteEntry.status
    let totalWaste = 0
    let donated = 0
    let composted = 0
    let dropped = 0

    for (const entry of entries) {
      const qty = entry.quantity || 0
      totalWaste += qty

      const status = String(entry.status).toUpperCase()
      const actionType = String(entry.actionType).toUpperCase()

      if (status === "DROPPED" || actionType === "DROPPED") {
        dropped += qty
      } else if (status === "COMPLETED" || status === "AVAILABLE") {
        if (actionType === "DONATE") {
          donated += qty
        } else if (actionType === "COMPOST" || actionType === "FARM") {
          composted += qty
        }
      }
    }

    return NextResponse.json(
      {
        totalWaste: Math.round(totalWaste * 100) / 100,
        donated: Math.round(donated * 100) / 100,
        composted: Math.round(composted * 100) / 100,
        dropped: Math.round(dropped * 100) / 100,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    )
  } catch (error) {
    console.error("[staff/stats] Failed to fetch stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}



















