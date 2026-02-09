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
      console.error(`[staff/actions-breakdown] Error looking up user ${userId}:`, error)
    }
  }

  return null
}

// GET /api/staff/actions-breakdown
// Returns waste quantities by action type for the staff's café
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (user.role !== "STAFF" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

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

    const entries = await db.wasteEntry.findMany({
      where: {
        businessId,
      },
      select: {
        quantity: true,
        actionType: true,
      },
    })

    // Aggregate by action type
    const breakdown: Record<string, number> = {
      Donate: 0,
      Compost: 0,
      Reuse: 0,
    }

    for (const entry of entries) {
      const qty = entry.quantity || 0
      const actionType = String(entry.actionType).toUpperCase()

      if (actionType === "DONATE") {
        breakdown.Donate += qty
      } else if (actionType === "COMPOST" || actionType === "FARM") {
        breakdown.Compost += qty
      } else if (actionType === "REUSE") {
        breakdown.Reuse += qty
      }
    }

    // Convert to array format for chart
    const data = [
      {
        name: "Donate",
        value: Math.round(breakdown.Donate * 100) / 100,
        fill: "#1E4D2B",
        icon: "🫶",
      },
      {
        name: "Compost",
        value: Math.round(breakdown.Compost * 100) / 100,
        fill: "#3A7452",
        icon: "🌾",
      },
      {
        name: "Reuse",
        value: Math.round(breakdown.Reuse * 100) / 100,
        fill: "#9DBE76",
        icon: "🔁",
      },
    ].filter((item) => item.value > 0) // Only show actions with data

    return NextResponse.json(
      { data },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    )
  } catch (error) {
    console.error("[staff/actions-breakdown] Failed to fetch actions breakdown:", error)
    return NextResponse.json(
      { error: "Failed to fetch actions breakdown" },
      { status: 500 }
    )
  }
}


















