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

// POST /api/admin/pickups/[id]/approve
// STEP 6: Admin approval logic (CRITICAL)
// When admin approves a pickup:
// Backend must:
// - pickupRequest.status = APPROVED
// - wasteEntry.status = APPROVED
// - pickupRequest.approvedAt = new Date()
// Response MUST include café contact info:
// {
//   cafe: {
//     name,
//     phone,
//     email,
//     address,
//     contactPerson
//   }
// }
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  console.log("🔵 [APPROVE] Endpoint called")
  
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

  console.log("🔵 [APPROVE] Looking for pickup ID:", pickupId)

  try {
    // Find pickup request with related data
    const pickupRequest = await db.pickupRequest.findUnique({
      where: { id: pickupId },
      include: {
        wasteEntry: {
          include: {
            business: true,
          },
        },
        business: true,
      },
    })

    if (!pickupRequest) {
      console.error("❌ [APPROVE] Pickup not found:", pickupId)
      return NextResponse.json({ error: "Pickup request not found" }, { status: 404 })
    }

    console.log("✅ [APPROVE] Found pickup:", pickupRequest.id)

    // Verify admin has access to this business
    if (user.businessId && pickupRequest.businessId !== user.businessId) {
      return NextResponse.json({ error: "Forbidden: waste does not belong to your cafe" }, { status: 403 })
    }

    // Update pickup request and waste entry in a transaction
    const [updatedPickupRequest, updatedWasteEntry] = await Promise.all([
      db.pickupRequest.update({
        where: { id: pickupId },
        data: {
          status: "APPROVED",
          approvedAt: new Date(),
        },
      }),
      db.wasteEntry.update({
        where: { id: pickupRequest.wasteEntryId! },
        data: {
          status: "AVAILABLE",
        } as any,
      }),
    ])

    console.log("✅ [APPROVE] Updated pickup request and waste entry")
    console.log("✅ [APPROVE] Pickup request status:", updatedPickupRequest.status)
    console.log("✅ [APPROVE] Pickup request ID:", updatedPickupRequest.id)

    // Get café contact information
    const cafe = pickupRequest.business

    // Response MUST include café contact info
    return NextResponse.json({
      message: "Request approved",
      pickupRequest: updatedPickupRequest,
      waste: updatedWasteEntry,
      cafe: {
        name: cafe.name,
        phone: cafe.phone,
        email: cafe.email,
        address: cafe.address,
        contactPerson: cafe.contactPerson,
      },
    })
  } catch (error) {
    console.error("❌ [APPROVE] Error:", error)
    return NextResponse.json(
      { error: "Failed to approve request", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

