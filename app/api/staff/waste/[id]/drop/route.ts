import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"
export const revalidate = 0

type DropBody = {
  dropReason: string
  notes?: string
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
      console.error(`[staff/waste/[id]/drop] Error looking up user ${userId}:`, error)
    }
  }

  return null
}

// POST /api/staff/waste/[id]/drop
// Marks a waste entry as dropped by staff (e.g., expired or not collected).
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
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
    return NextResponse.json({ error: "User must be associated with a business" }, { status: 400 })
  }

  const resolvedParams = params instanceof Promise ? await params : params
  const wasteId = resolvedParams.id

  const body = (await req.json()) as Partial<DropBody>

  try {
    const wasteEntry = await db.wasteEntry.findUnique({
      where: { id: wasteId },
    })

    if (!wasteEntry) {
      return NextResponse.json({ error: "Waste entry not found" }, { status: 404 })
    }

    // Ensure the waste belongs to the staff's business
    if (wasteEntry.businessId !== businessId) {
      return NextResponse.json({ error: "Forbidden: waste does not belong to your business" }, { status: 403 })
    }

    // Cancel any pending or approved pickup requests for this waste item
    await db.pickupRequest.updateMany({
      where: {
        wasteEntryId: wasteId,
        status: {
          in: ["PENDING", "APPROVED"],
        },
      },
      data: {
        status: "CANCELLED",
        notes: body.notes 
          ? `${body.notes} (Request cancelled: Item marked as dropped)`
          : "Request cancelled: Item marked as dropped by café",
      },
    })

    // Update waste entry status to DROPPED
    const updatedWasteEntry = await db.wasteEntry.update({
      where: { id: wasteId },
      data: {
        status: "DROPPED",
        actionType: "DROPPED",
        notes: body.notes || wasteEntry.notes,
      },
    })

    return NextResponse.json(updatedWasteEntry)
  } catch (error) {
    console.error("[Drop Waste] Error:", error)
    return NextResponse.json(
      { error: "Failed to drop waste entry", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

