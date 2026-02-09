import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"
export const revalidate = 0

type ActionsBreakdownResponse = {
  donate: number
  compost: number
  farm: number
  reuse: number
  dropped: number
}

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
      console.error(`[admin/actions-breakdown] Error looking up user ${userId}:`, error)
    }
  }

  return null
}

// GET /api/admin/actions-breakdown
// Returns waste quantities by action type for the admin's business.
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Allow ADMIN and STAFF
    if (user.role !== "ADMIN" && user.role !== "STAFF") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Ensure admin has a business; if not, aggregate across all
    let businessId = user.businessId
    const { searchParams } = new URL(req.url)
    const businessIdParam = searchParams.get("businessId")

    if (businessIdParam) {
      businessId = businessIdParam
    }

    if (!businessId) {
      const cafe = await db.business.findFirst({ where: { type: "CAFE" } })
      businessId = cafe?.id || null
    }

    const where: any = {}
    if (businessId) {
      where.businessId = businessId
    }

    const entries = await db.wasteEntry.findMany({
      where,
      select: {
        quantity: true,
        actionType: true,
      },
    })

    const breakdown: ActionsBreakdownResponse = {
      donate: 0,
      compost: 0,
      farm: 0,
      reuse: 0,
      dropped: 0,
    }

    for (const entry of entries) {
      const qty = entry.quantity || 0
      switch (entry.actionType) {
        case "DONATE":
          breakdown.donate += qty
          break
        case "COMPOST":
          breakdown.compost += qty
          break
        case "FARM":
          breakdown.farm += qty
          break
        case "REUSE":
          breakdown.reuse += qty
          break
        case "DROPPED":
          breakdown.dropped += qty
          break
        default:
          break
      }
    }

    return NextResponse.json(breakdown, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    console.error("[admin/actions-breakdown] Failed to fetch actions breakdown:", error)
    return NextResponse.json({ error: "Failed to fetch actions breakdown" }, { status: 500 })
  }
}



