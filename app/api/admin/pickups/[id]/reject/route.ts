import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// Helper to get user from session or x-user-id header
async function getUserFromRequest(request: NextRequest): Promise<{ id: string; role: string; businessId: string | null } | null> {
  // Try NextAuth session first
  const session = await getServerSession(authOptions)
  if (session?.user) {
    return {
      id: session.user.id,
      role: session.user.role,
      businessId: session.user.businessId,
    }
  }
  
  // Fall back to x-user-id header (backward compatibility)
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
      console.error(`[getUserFromRequest] Database error looking up user ${userId}:`, error)
    }
  }
  
  return null
}

// POST /api/admin/pickups/[id]/reject
// Admin rejects a pickup request.
// When rejected:
// - pickupRequest.status = REJECTED
// - pickupRequest.rejectedAt = new Date()
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  console.log("🔴 [REJECT] Endpoint called")
  
  const user = await getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Allow both ADMIN and STAFF to approve/reject pickup requests
  if (user.role !== "ADMIN" && user.role !== "STAFF") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  // Handle both sync and async params (Next.js 15+ uses async)
  const resolvedParams = params instanceof Promise ? await params : params
  const pickupId = resolvedParams.id

  console.log("🔴 [REJECT] Looking for pickup ID:", pickupId)

  try {
    const pickupRequest = await db.pickupRequest.findUnique({
      where: { id: pickupId },
      include: {
        wasteEntry: true,
      },
    })

    if (!pickupRequest) {
      console.error("❌ [REJECT] Pickup not found:", pickupId)
      return NextResponse.json({ error: "Pickup request not found" }, { status: 404 })
    }

    // Verify admin/staff has access to this business
    if (user.businessId && pickupRequest.businessId !== user.businessId) {
      return NextResponse.json({ error: "Forbidden: waste does not belong to your cafe" }, { status: 403 })
    }

    // Update pickup request status
    const updatedPickupRequest = await db.pickupRequest.update({
      where: { id: pickupId },
      data: {
        status: "REJECTED",
        rejectedAt: new Date(),
      },
    })

    console.log("✅ [REJECT] Updated pickup request:", updatedPickupRequest.id)

    return NextResponse.json({ 
      message: "Request rejected",
      pickupRequest: updatedPickupRequest,
    })
  } catch (error) {
    console.error("❌ [REJECT] Error:", error)
    return NextResponse.json(
      { error: "Failed to reject request", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

