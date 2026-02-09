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
      console.error(`[stats/impact] Error looking up user ${userId}:`, error)
    }
  }

  return null
}

// GET /api/stats/impact
// Single source of truth: Calculates all stats from WasteEntry with status = "COMPLETED"
// Rule: 1 kg collected = 1 point
// Returns: points, totalWaste, donated, composted, dropped, pointsHistory, level info
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

    // Get ALL waste entries for this business (for total waste calculation)
    const allEntries = await db.wasteEntry.findMany({
      where: {
        businessId,
      },
      select: {
        quantity: true,
        status: true,
        actionType: true,
        wasteType: true,
        subType: true,
        createdAt: true,
      },
    })

    // Get COMPLETED entries only (single source of truth for points and collected stats)
    const completedEntries = allEntries.filter(
      (entry) => String(entry.status).toUpperCase() === "COMPLETED"
    )

    // Calculate points: 1 kg collected = 1 point
    // Only count COMPLETED entries
    let totalPoints = 0
    for (const entry of completedEntries) {
      totalPoints += entry.quantity || 0
    }

    // Calculate stats from COMPLETED entries only
    let donated = 0
    let composted = 0
    let dropped = 0
    let totalWaste = 0

    for (const entry of allEntries) {
      const qty = entry.quantity || 0
      totalWaste += qty

      const status = String(entry.status).toUpperCase()
      const actionType = String(entry.actionType).toUpperCase()

      if (status === "DROPPED" || actionType === "DROPPED") {
        dropped += qty
      } else if (status === "COMPLETED") {
        // Only count COMPLETED entries for donated/composted
        if (actionType === "DONATE") {
          donated += qty
        } else if (actionType === "COMPOST" || actionType === "FARM") {
          composted += qty
        }
      }
    }

    // Build points history from COMPLETED entries
    const pointsHistory = completedEntries
      .map((entry) => {
        const actionType = String(entry.actionType).toUpperCase()
        let reason = ""
        if (actionType === "DONATE") {
          reason = `Donated ${entry.quantity} kg of ${entry.subType || entry.wasteType} to charity`
        } else if (actionType === "COMPOST" || actionType === "FARM") {
          reason = `Sent ${entry.quantity} kg of ${entry.subType || entry.wasteType} to farm`
        } else {
          reason = `Collected ${entry.quantity} kg of ${entry.subType || entry.wasteType}`
        }

        return {
          date: entry.createdAt.toISOString().split("T")[0],
          reason,
          points: `+${entry.quantity}`,
          quantity: entry.quantity,
          wasteType: entry.wasteType,
          actionType: entry.actionType,
        }
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 50) // Limit to recent 50 entries

    // Calculate level based on points
    let level = "Green Starter"
    let nextLevel = 50
    let nextLevelName = "Eco Achiever"
    let pointsToNextLevel = nextLevel - totalPoints

    if (totalPoints >= 200) {
      level = "Sustainability Champion"
      nextLevel = 200
      nextLevelName = "Sustainability Champion"
      pointsToNextLevel = 0
    } else if (totalPoints >= 100) {
      level = "Green Hero"
      nextLevel = 200
      nextLevelName = "Sustainability Champion"
      pointsToNextLevel = 200 - totalPoints
    } else if (totalPoints >= 50) {
      level = "Eco Achiever"
      nextLevel = 100
      nextLevelName = "Green Hero"
      pointsToNextLevel = 100 - totalPoints
    } else {
      level = "Green Starter"
      nextLevel = 50
      nextLevelName = "Eco Achiever"
      pointsToNextLevel = 50 - totalPoints
    }

    return NextResponse.json(
      {
        // Points data
        totalPoints: Math.round(totalPoints * 100) / 100,
        level,
        nextLevel,
        nextLevelName,
        pointsToNextLevel: Math.max(0, Math.round(pointsToNextLevel * 100) / 100),
        pointsHistory,

        // Waste stats (from COMPLETED entries)
        totalWaste: Math.round(totalWaste * 100) / 100,
        donated: Math.round(donated * 100) / 100,
        composted: Math.round(composted * 100) / 100,
        dropped: Math.round(dropped * 100) / 100,

        // Metadata
        completedEntriesCount: completedEntries.length,
        totalEntriesCount: allEntries.length,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    )
  } catch (error) {
    console.error("[stats/impact] Failed to fetch impact stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch impact stats" },
      { status: 500 }
    )
  }
}
















