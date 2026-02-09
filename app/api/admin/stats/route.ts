import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"
export const revalidate = 0

type StatsResponse = {
  totalWaste: number
  donated: number
  compost: number
  dropped: number
  pendingRequests: number
  collectedRequests: number
}

async function getUserFromRequest(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (session?.user) {
    return {
      id: session.user.id,
      role: session.user.role,
      businessId: session.user.businessId,
    }
  }

  const headerUserId = req.headers.get("x-user-id")
  if (headerUserId) {
    const dbUser = await db.user.findUnique({
      where: { id: headerUserId },
      include: { business: true },
    })
    if (dbUser) {
      return { id: dbUser.id, role: dbUser.role, businessId: dbUser.businessId }
    }
  }

  return null
}

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Allow both ADMIN and STAFF to view stats
    if (user.role !== "ADMIN" && user.role !== "STAFF") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Ensure we have a businessId; fallback to any CAFE for visibility
    let businessId = user.businessId
    if (!businessId) {
      const cafe = await db.business.findFirst({ where: { type: "CAFE" } })
      if (!cafe) {
        return NextResponse.json({ error: "Cafe business not found" }, { status: 400 })
      }
      businessId = cafe.id
    }

    // Fetch waste entries for this business
    const wasteEntries = await db.wasteEntry.findMany({
      where: { businessId },
      select: {
        quantity: true,
        status: true,
        actionType: true,
      },
    })

    // Fetch pickup requests for this business
    const pickupRequests = await db.pickupRequest.findMany({
      where: { businessId },
      select: { status: true },
    })

    const normalize = (v: string | null | undefined) => (v ? String(v).toUpperCase() : "")

    const totalWaste = wasteEntries.reduce((sum, w) => sum + (w.quantity || 0), 0)
    const donated = wasteEntries
      .filter((w) => {
        const s = normalize(w.status)
        return s === "COMPLETED" || s === "DONATED"
      })
      .reduce((sum, w) => sum + (w.quantity || 0), 0)
    const compost = wasteEntries
      .filter((w) => normalize(w.status).includes("COMPOST"))
      .reduce((sum, w) => sum + (w.quantity || 0), 0)
    const dropped = wasteEntries
      .filter((w) => normalize(w.status) === "DROPPED")
      .reduce((sum, w) => sum + (w.quantity || 0), 0)

    const pendingRequests = pickupRequests.filter((r) => normalize(r.status) === "PENDING").length
    const collectedRequests = pickupRequests.filter((r) => {
      const s = normalize(r.status)
      return s === "APPROVED" || s === "COMPLETED" || s === "COLLECTED"
    }).length

    const body: StatsResponse = {
      totalWaste,
      donated,
      compost,
      dropped,
      pendingRequests,
      collectedRequests,
    }

    return NextResponse.json(body, {
      headers: {
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("[Admin Stats] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

