import { NextRequest, NextResponse } from "next/server"

/**
 * Request body for creating a charity pickup request.
 * Supports both new format (charityId, itemId) and legacy format (requesterId, wasteId).
 */
type CreateRequestBody = {
  // New format
  charityId?: string
  itemId?: string
  cafeId?: string
  status?: string
  note?: string
  // Legacy format (for backward compatibility)
  wasteId?: string
  requesterId?: string
  preferredTime?: string
  notes?: string
}

/**
 * GET /api/charity/requests
 * Returns all pickup requests for the current charity user.
 * 
 * For approved requests, includes café contact information:
 * - Waste item name and quantity
 * - Café name, phone, email, address
 * - Message: "Please contact the café to arrange pickup."
 */
export async function GET(req: NextRequest) {
  try {
    // Get user ID from request header
    const userId = req.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 })
    }

    const { db } = await import("@/lib/db")

    // Verify user is a charity (PARTNER role with NGO business type)
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { business: true },
    })

    if (!user || user.role !== "PARTNER" || user.business?.type !== "NGO") {
      return NextResponse.json({ error: "Invalid charity user" }, { status: 400 })
    }

    // Fetch all pickup requests for this charity
    // Exclude cancelled requests, but include completed ones for history
    const pickupRequests = await db.pickupRequest.findMany({
      where: {
        requesterId: userId,
        status: {
          notIn: ["CANCELLED"],
        },
      },
      include: {
        wasteEntry: {
          include: {
            business: true,
          },
        },
        business: true, // Café information
      },
      orderBy: {
        requestedDate: "desc", // Most recent first
      },
    })

    // Transform database format to frontend format
    const items = pickupRequests.map((request) => {
      const waste = request.wasteEntry
      const cafe = request.business

      return {
        id: request.id,
        wasteId: request.wasteEntryId,
        requesterId: request.requesterId,
        requesterType: "charity",
        status: request.status.toLowerCase(),
        requestedAt: request.requestedDate.toISOString(),
        approvedAt: request.approvedAt?.toISOString(),
        completedAt: request.completedAt?.toISOString(),
        notes: request.notes,
        // Waste item information
        itemName: waste?.subType || "Unknown",
        quantity: waste?.quantity || 0,
        // Café information (only for approved requests)
        cafeName: cafe?.name || "Unknown Café",
        cafeId: cafe?.id,
        cafe: request.status === "APPROVED" && cafe ? {
          name: cafe.name,
          phone: cafe.phone,
          email: cafe.email,
          address: cafe.address,
          contactPerson: cafe.contactPerson,
        } : null,
        message: request.status === "APPROVED" ? "Please contact the café to arrange pickup." : undefined,
      }
    })

    console.log(`[Charity Requests] Returning ${items.length} requests`)
    return NextResponse.json(items)
  } catch (error) {
    console.error("[Charity Requests] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch requests", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

/**
 * POST /api/charity/requests
 * Creates a new pickup request for a charity user.
 * 
 * When a charity clicks "Request Pickup" on a waste item:
 * 1. Validates the charity user
 * 2. Checks if waste item is available
 * 3. Creates a pickup request linked to waste entry, requester, and café
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<CreateRequestBody>
    
    // Support both new and legacy request formats
    const charityId = body.charityId || body.requesterId
    const itemId = body.itemId || body.wasteId
    
    if (!itemId || !charityId) {
      return NextResponse.json({ error: "Missing itemId/wasteId or charityId/requesterId" }, { status: 400 })
    }

    const { db } = await import("@/lib/db")

    // Verify requester is a valid charity user
    const requester = await db.user.findUnique({
      where: { id: charityId },
      include: { business: true },
    })

    if (!requester) {
      return NextResponse.json({ error: "Invalid charityId/requesterId" }, { status: 400 })
    }
    if (requester.role !== "PARTNER" || requester.business?.type !== "NGO") {
      return NextResponse.json({ error: "Requester must be a charity user" }, { status: 403 })
    }

    // Find the waste entry
    const wasteEntry = await db.wasteEntry.findUnique({
      where: { id: itemId },
      include: { business: true },
    })

    if (!wasteEntry) {
      return NextResponse.json({ error: "Waste item not found" }, { status: 404 })
    }

    // Check if waste is available for charity pickup
    if (wasteEntry.status !== "PENDING" || wasteEntry.availableFor !== "CHARITY") {
      return NextResponse.json({ error: "Waste item is not available for charity" }, { status: 400 })
    }

    // Prevent duplicate requests for the same waste item
    const existingRequest = await db.pickupRequest.findUnique({
      where: { wasteEntryId: itemId },
    })

    if (existingRequest) {
      return NextResponse.json({ error: "This waste item already has a pickup request" }, { status: 400 })
    }

    // Create the pickup request
    const pickupRequest = await db.pickupRequest.create({
      data: {
        requesterId: requester.id,
        wasteEntryId: itemId,
        businessId: wasteEntry.businessId, // Café that owns the waste
        notes: body.note || body.notes || null,
        status: "PENDING", // Admin will approve later
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        business: {
          select: {
            id: true,
            name: true,
            type: true,
            address: true,
          },
        },
        wasteEntry: {
          select: {
            id: true,
            subType: true,
            quantity: true,
            status: true,
          },
        },
      },
    })

    console.log(`[Charity Request] ✅ Created pickup request:`, {
      id: pickupRequest.id,
      wasteEntryId: itemId,
      requesterId: requester.id,
      businessId: wasteEntry.businessId,
    })

    return NextResponse.json(pickupRequest, { status: 201 })
  } catch (error) {
    console.error("[Charity Request] Error:", error)
    return NextResponse.json(
      { error: "Failed to create pickup request", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

