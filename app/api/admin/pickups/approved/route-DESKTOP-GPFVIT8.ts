import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

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
      console.error(`[admin/pickups/approved] Error looking up user ${userId}:`, error)
    }
  }

  return null
}

// GET /api/admin/pickups/approved
// Returns all APPROVED pickup requests that don't have transportation yet
// These are ready for scheduling transportation
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (user.role !== "STAFF" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Find user's businessId if not set
    let businessId = user.businessId
    if (!businessId) {
      const wasteEntry = await db.wasteEntry.findFirst({
        where: { loggedById: user.id },
        select: { businessId: true },
      })
      if (wasteEntry?.businessId) {
        businessId = wasteEntry.businessId
      } else {
        const cafe = await db.business.findFirst({
          where: { type: "CAFE" },
        })
        if (cafe) {
          businessId = cafe.id
        }
      }
    }

    // Build where clause
    const where: any = {
      status: "APPROVED",
      // Exclude pickups that already have transportation
      transportation: null,
    }

    // Filter by business for non-admin
    if (user.role !== "ADMIN" && businessId) {
      where.businessId = businessId
    }

    const approvedPickups = await db.pickupRequest.findMany({
      where,
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            business: {
              select: {
                id: true,
                name: true,
                type: true,
                address: true,
                phone: true,
              },
            },
          },
        },
        wasteEntry: {
          select: {
            id: true,
            wasteType: true,
            subType: true,
            quantity: true,
            status: true,
            expiryDate: true,
          },
        },
        business: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
      orderBy: {
        approvedAt: "desc",
      },
    })

    // Transform for frontend
    const items = approvedPickups.map((p) => {
      const requesterBusiness = p.requester?.business
      const requesterType = requesterBusiness?.type === "NGO" ? "charity" : "farmer"
      
      return {
        id: p.id,
        wasteEntryId: p.wasteEntryId,
        requesterId: p.requesterId,
        requesterName: requesterBusiness?.name || p.requester?.name || "Unknown",
        requesterType,
        requesterAddress: requesterBusiness?.address || null,
        requesterPhone: requesterBusiness?.phone || null,
        wasteType: p.wasteEntry?.wasteType || "Unknown",
        itemName: p.wasteEntry?.subType || p.wasteEntry?.wasteType || "Unknown",
        quantity: p.wasteEntry?.quantity || 0,
        cafeName: p.business?.name || "Unknown",
        cafeAddress: p.business?.address || null,
        businessId: p.businessId,
        approvedAt: p.approvedAt?.toISOString() || null,
        notes: p.notes || null,
      }
    })

    return NextResponse.json({
      approvedPickups: items,
      count: items.length,
    })
  } catch (error) {
    console.error("[admin/pickups/approved] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch approved pickups" },
      { status: 500 }
    )
  }
}
















