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
      console.error(`[staff/waste-breakdown] Error looking up user ${userId}:`, error)
    }
  }

  return null
}

// GET /api/staff/waste-breakdown
// Returns waste quantities by type for the staff's café
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
        wasteType: true,
      },
    })

    // Aggregate by waste type
    const breakdown: Record<string, number> = {}
    for (const entry of entries) {
      const wasteType = String(entry.wasteType)
      const typeMap: Record<string, string> = {
        EDIBLE: "Food Waste",
        COFFEE_GROUNDS: "Coffee Grounds",
        ORGANIC: "Organic Waste",
        PLATE_WASTE: "Plate Waste",
        EXPIRED: "Expired Food",
        RECYCLABLE: "Recyclable",
      }
      const displayType = typeMap[wasteType] || wasteType
      breakdown[displayType] = (breakdown[displayType] || 0) + (entry.quantity || 0)
    }

    // Convert to array format for chart
    const data = Object.entries(breakdown).map(([name, value]) => ({
      name,
      value: Math.round(value * 100) / 100,
      fill: name === "Food Waste" ? "#3A7452" : name === "Coffee Grounds" ? "#5C8A58" : "#9DBE76",
    }))

    return NextResponse.json(
      { data },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    )
  } catch (error) {
    console.error("[staff/waste-breakdown] Failed to fetch waste breakdown:", error)
    return NextResponse.json(
      { error: "Failed to fetch waste breakdown" },
      { status: 500 }
    )
  }
}


















