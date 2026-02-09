import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

export const dynamic = "force-dynamic"

const createTransportSchema = z.object({
  pickupRequestId: z.string().min(1, "Pickup request ID is required"),
  scheduledDate: z.string().min(1, "Scheduled date is required"),
  scheduledTime: z.string().optional(),
  driverName: z.string().optional(),
  notes: z.string().optional(),
  // For admin override (when no approved pickups exist)
  isAdminOverride: z.boolean().optional(),
  manualDestination: z.string().optional(),
  manualQuantity: z.number().optional(),
  manualWasteType: z.string().optional(),
})

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
      console.error(`[admin/transportations] Error looking up user ${userId}:`, error)
    }
  }

  return null
}

// GET /api/admin/transportations
// Returns all transportation records
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (user.role !== "STAFF" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const where: any = {}

    // Filter by business for non-admin
    if (user.role !== "ADMIN" && user.businessId) {
      where.businessId = user.businessId
    }

    if (status && status !== "all") {
      where.status = status.toUpperCase()
    }

    const transportations = await db.transportation.findMany({
      where,
      include: {
        pickupRequest: {
          include: {
            requester: {
              select: {
                id: true,
                name: true,
                business: {
                  select: {
                    id: true,
                    name: true,
                    type: true,
                    address: true,
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
          },
        },
        business: {
          select: {
            id: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Transform for frontend
    const items = transportations.map((t) => {
      const pickupReq = t.pickupRequest
      const requesterBusiness = pickupReq?.requester?.business
      const wasteEntry = t.wasteEntry || pickupReq?.wasteEntry
      
      return {
        id: t.id,
        pickupRequestId: t.pickupRequestId,
        wasteEntryId: t.wasteEntryId || pickupReq?.wasteEntry?.id,
        requesterName: requesterBusiness?.name || pickupReq?.requester?.name || t.destination || "Unknown",
        requesterType: requesterBusiness?.type === "NGO" ? "charity" : "farmer",
        requesterAddress: requesterBusiness?.address || null,
        wasteType: wasteEntry?.wasteType || "Unknown",
        itemName: wasteEntry?.subType || wasteEntry?.wasteType || "Unknown",
        quantity: t.quantity || wasteEntry?.quantity || 0,
        cafeName: t.business?.name || "Unknown",
        destination: t.destination,
        scheduledDate: t.scheduledDate?.toISOString() || null,
        scheduledTime: t.scheduledTime || null,
        driverName: t.assignedTo?.name || null,
        status: t.status,
        completedAt: t.completedAt?.toISOString() || null,
        notes: t.notes || null,
        createdAt: t.createdAt.toISOString(),
      }
    })

    return NextResponse.json({
      transportations: items,
      count: items.length,
    })
  } catch (error) {
    console.error("[admin/transportations] GET Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch transportations" },
      { status: 500 }
    )
  }
}

// POST /api/admin/transportations
// Create transportation from an APPROVED pickup request
// Rules:
// 1. Pickup request must be APPROVED
// 2. Transportation links to both pickupRequestId and wasteEntryId
// 3. Admin can override if no approved pickups exist
export async function POST(request: NextRequest) {
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
      return NextResponse.json({ error: "Business not found" }, { status: 400 })
    }

    const body = await request.json()
    const validatedData = createTransportSchema.parse(body)

    // Find the pickup request
    const pickupRequest = await db.pickupRequest.findUnique({
      where: { id: validatedData.pickupRequestId },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            business: {
              select: {
                id: true,
                name: true,
                type: true,
                address: true,
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
            businessId: true,
          },
        },
        transportation: true,
      },
    })

    if (!pickupRequest) {
      return NextResponse.json({ error: "Pickup request not found" }, { status: 404 })
    }

    // Check if transportation already exists
    if (pickupRequest.transportation) {
      return NextResponse.json(
        { error: "Transportation already exists for this pickup request" },
        { status: 400 }
      )
    }

    // Verify pickup is APPROVED (unless admin override)
    if (pickupRequest.status !== "APPROVED" && !validatedData.isAdminOverride) {
      return NextResponse.json(
        { 
          error: "Pickup request must be APPROVED before creating transportation",
          currentStatus: pickupRequest.status,
        },
        { status: 400 }
      )
    }

    // Get destination from requester's business
    const destination = pickupRequest.requester?.business?.name || 
                       pickupRequest.requester?.name || 
                       validatedData.manualDestination ||
                       "Unknown"

    // Get quantity from waste entry
    const quantity = pickupRequest.wasteEntry?.quantity || 
                    validatedData.manualQuantity || 
                    0

    // Create transportation record
    const transportation = await db.transportation.create({
      data: {
        pickupRequestId: pickupRequest.id,
        wasteEntryId: pickupRequest.wasteEntryId,
        businessId: pickupRequest.wasteEntry?.businessId || businessId,
        destination,
        quantity,
        scheduledDate: new Date(validatedData.scheduledDate),
        scheduledTime: validatedData.scheduledTime || null,
        status: "SCHEDULED",
        notes: validatedData.notes || `Driver: ${validatedData.driverName || "Not assigned"}`,
        createdById: user.id,
      },
      include: {
        pickupRequest: {
          include: {
            requester: {
              select: {
                id: true,
                name: true,
                business: {
                  select: {
                    name: true,
                    type: true,
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
              },
            },
          },
        },
        business: {
          select: {
            name: true,
          },
        },
      },
    })

    console.log(`[admin/transportations] Created transportation ${transportation.id} for pickup ${pickupRequest.id}`)

    return NextResponse.json({
      success: true,
      transportation: {
        id: transportation.id,
        pickupRequestId: transportation.pickupRequestId,
        wasteEntryId: transportation.wasteEntryId,
        destination: transportation.destination,
        quantity: transportation.quantity,
        scheduledDate: transportation.scheduledDate?.toISOString(),
        scheduledTime: transportation.scheduledTime,
        status: transportation.status,
      },
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("[admin/transportations] POST Error:", error)
    return NextResponse.json(
      { error: "Failed to create transportation" },
      { status: 500 }
    )
  }
}
















