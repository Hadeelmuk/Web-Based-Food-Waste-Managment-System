import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"
export const revalidate = 0

// GET /api/admin/waste-breakdown
// Returns waste quantities by type for the café (staff/admin).
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    let user: { id: string; role: string; businessId: string | null } | null = null

    if (session?.user) {
      user = {
        id: session.user.id,
        role: session.user.role,
        businessId: session.user.businessId,
      }
    } else {
      const userId = req.headers.get("x-user-id")
      if (userId) {
        const dbUser = await db.user.findUnique({
          where: { id: userId },
          select: { id: true, role: true, businessId: true },
        })
        if (dbUser) {
          user = dbUser
        }
      }
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Allow both ADMIN and STAFF
    if (user.role !== "ADMIN" && user.role !== "STAFF") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Determine businessId
    let businessId = user.businessId
    if (!businessId) {
      const cafe = await db.business.findFirst({ where: { type: "CAFE" } })
      if (!cafe) {
        return NextResponse.json({ error: "Cafe business not found" }, { status: 400 })
      }
      businessId = cafe.id
    }

    const entries = await db.wasteEntry.findMany({
      where: { businessId },
      select: { wasteType: true, quantity: true },
    })

    const sumByType: Record<string, number> = {}
    for (const e of entries) {
      const t = (e.wasteType || "").toUpperCase()
      sumByType[t] = (sumByType[t] || 0) + (e.quantity || 0)
    }

    const breakdown = {
      edible: sumByType["EDIBLE"] || 0,
      organic: sumByType["ORGANIC"] || 0,
      coffee: sumByType["COFFEE_GROUNDS"] || 0,
      recyclable: sumByType["RECYCLABLE"] || 0,
    }

    return NextResponse.json(breakdown, {
      headers: { "Cache-Control": "no-store" },
    })
  } catch (error) {
    console.error("[Admin Waste Breakdown] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch waste breakdown", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

