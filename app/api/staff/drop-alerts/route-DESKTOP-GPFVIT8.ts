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
      console.error(`[staff/drop-alerts] Error looking up user ${userId}:`, error)
    }
  }

  return null
}

// GET /api/staff/drop-alerts
// Returns waste entries approaching expiry (within 7 days) that haven't been collected
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
      const wasteEntry = await db.wasteEntry.findFirst({
        where: { loggedById: user.id },
        select: { businessId: true },
      })
      if (wasteEntry?.businessId) {
        businessId = wasteEntry.businessId
        await db.user.update({
          where: { id: user.id },
          data: { businessId },
        })
      } else {
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

    // Calculate date 7 days from now
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const sevenDaysFromNow = new Date(today)
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)

    // Find entries with expiryDate within 7 days, status not DROPPED, and not collected
    const entries = await db.wasteEntry.findMany({
      where: {
        businessId,
        expiryDate: {
          not: null,
          gte: today,
          lte: sevenDaysFromNow,
        },
        status: {
          not: "DROPPED",
        },
      },
      select: {
        id: true,
        subType: true,
        quantity: true,
        expiryDate: true,
      },
      orderBy: {
        expiryDate: "asc",
      },
    })

    // Transform to alert format
    const alerts = entries.map((entry) => {
      const expiryDate = entry.expiryDate ? new Date(entry.expiryDate) : null
      const daysLeft = expiryDate
        ? Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        : 0

      return {
        id: entry.id,
        item: entry.subType || "Unknown",
        quantity: `${entry.quantity} kg`,
        expiryDate: expiryDate ? expiryDate.toISOString().split("T")[0] : "",
        daysLeft: Math.max(0, daysLeft),
      }
    })

    return NextResponse.json(
      { alerts },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    )
  } catch (error) {
    console.error("[staff/drop-alerts] Failed to fetch drop alerts:", error)
    return NextResponse.json(
      { error: "Failed to fetch drop alerts" },
      { status: 500 }
    )
  }
}



















