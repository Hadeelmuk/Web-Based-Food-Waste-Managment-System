import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const pickupRequestSchema = z.object({
  wasteEntryId: z.string().optional(),
  businessId: z.string(),
  notes: z.string().optional(),
})

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

// GET - Fetch pickup requests
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    const skip = (page - 1) * limit

    const where: any = {}

    // Filter by role
    if (user.role === "PARTNER") {
      // Partners see requests they made
      where.requesterId = user.id
    } else if (user.role === "STAFF" || user.role === "ADMIN") {
      // Staff/Admin see requests for their business
      if (user.role === "STAFF") {
        where.businessId = user.businessId
      } else {
        const businessId = searchParams.get("businessId")
        if (businessId) {
          where.businessId = businessId
        }
      }
    }

    if (status && status !== "all") {
      // Handle case-insensitive status matching (database uses uppercase enum)
      const statusUpper = status.toUpperCase()
      if (["PENDING", "APPROVED", "REJECTED", "COMPLETED", "CANCELLED"].includes(statusUpper)) {
        where.status = statusUpper as any
      } else {
        // Fallback: try exact match
        where.status = status as any
      }
    }

    const [requests, total] = await Promise.all([
      db.pickupRequest.findMany({
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
                },
              },
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
            include: {
              loggedBy: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          transportation: true,
        },
        orderBy: {
          requestedDate: "desc",
        },
        skip,
        take: limit,
      }),
      db.pickupRequest.count({ where }),
    ])

    return NextResponse.json({
      requests,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching pickup requests:", error)
    return NextResponse.json({ error: "Failed to fetch pickup requests" }, { status: 500 })
  }
}

// POST - Create pickup request
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // PARTNER, STAFF, and ADMIN can create pickup requests
    // STAFF/ADMIN can create manual pickup requests (auto-approved)
    // PARTNER creates regular requests (need approval)
    const isManualRequest = user.role === "STAFF" || user.role === "ADMIN"

    const body = await request.json()
    const validatedData = pickupRequestSchema.parse(body)

    // Verify business exists
    const business = await db.business.findUnique({
      where: { id: validatedData.businessId },
    })

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 })
    }

    // If wasteEntryId is provided, verify it exists and is available
    if (validatedData.wasteEntryId) {
      const wasteEntry = await db.wasteEntry.findUnique({
        where: { id: validatedData.wasteEntryId },
      })

      if (!wasteEntry) {
        return NextResponse.json({ error: "Waste entry not found" }, { status: 404 })
      }

      if (wasteEntry.businessId !== validatedData.businessId) {
        return NextResponse.json({ error: "Waste entry does not belong to this business" }, { status: 400 })
      }

      // Check if already has a request
      const existingRequest = await db.pickupRequest.findUnique({
        where: { wasteEntryId: validatedData.wasteEntryId },
      })

      if (existingRequest) {
        return NextResponse.json({ error: "This waste entry already has a pickup request" }, { status: 400 })
      }
    }

    // For manual requests by STAFF/ADMIN, auto-approve and set requester to a default partner user
    // Or use the current user if they're creating it manually
    let requesterId = user.id
    let requestStatus: "PENDING" | "APPROVED" = "PENDING"
    
    if (isManualRequest) {
      // For manual requests, auto-approve them
      requestStatus = "APPROVED"
      // Try to find a partner user for this business, or use current user
      const partnerUser = await db.user.findFirst({
        where: {
          businessId: validatedData.businessId,
          role: "PARTNER",
        },
      })
      if (partnerUser) {
        requesterId = partnerUser.id
      }
      // If no partner found, use current user (for manual requests)
    }

    const pickupRequest = await db.pickupRequest.create({
      data: {
        requesterId: requesterId,
        wasteEntryId: validatedData.wasteEntryId || null,
        businessId: validatedData.businessId,
        notes: validatedData.notes,
        status: requestStatus,
        approvedAt: isManualRequest ? new Date() : null,
      },
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
              },
            },
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
          include: {
            loggedBy: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(pickupRequest, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 })
    }

    console.error("Error creating pickup request:", error)
    return NextResponse.json({ error: "Failed to create pickup request" }, { status: 500 })
  }
}


