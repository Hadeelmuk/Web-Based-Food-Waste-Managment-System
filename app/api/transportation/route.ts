import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const transportSchema = z.object({
  wasteEntryId: z.string().optional(),
  pickupRequestId: z.string().optional(),
  destination: z.string(),
  quantity: z.number().positive(),
  scheduledDate: z.string().optional(),
  scheduledTime: z.string().optional(),
  distance: z.number().optional(),
  notes: z.string().optional(),
  assignedToId: z.string().optional(),
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
      let dbUser = await db.user.findUnique({
        where: { id: userId },
        include: { business: true },
      })
      
      // If user doesn't exist, create a default user and business (for backward compatibility with mock users)
      if (!dbUser) {
        console.log(`[getUserFromRequest] User ${userId} not found, creating default user...`)
        
        // Find or create a default business
        let business = await db.business.findFirst({
          where: { type: "CAFE" },
        })
        
        if (!business) {
          business = await db.business.create({
            data: {
              name: "Green Café",
              type: "CAFE",
              email: `cafe-${userId}@example.com`,
            },
          })
        }
        
        // Create user with STAFF role (default for mock users)
        dbUser = await db.user.create({
          data: {
            id: userId,
            email: `user-${userId}@example.com`,
            password: "$2a$10$dummy", // Dummy hash - user won't login via NextAuth
            role: "STAFF",
            businessId: business.id,
            name: "Staff User",
          },
          include: { business: true },
        })
        
        console.log(`[getUserFromRequest] Created default user: ${dbUser.id}`)
      }
      
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
  } else {
    console.log("[getUserFromRequest] No x-user-id header provided")
  }
  
  return null
}

// GET - Fetch transportation records
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // If user has no businessId, find or create a default business
    if (!user.businessId) {
      let business = await db.business.findFirst({
        where: { type: "CAFE" },
      })
      
      if (!business) {
        business = await db.business.create({
          data: {
            name: "Green Café",
            type: "CAFE",
            email: `cafe-${user.id}@example.com`,
          },
        })
      }
      
      // Update user with businessId
      await db.user.update({
        where: { id: user.id },
        data: { businessId: business.id },
      })
      
      user.businessId = business.id
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    const skip = (page - 1) * limit

    const where: any = {}

    // Filter by business if user is not admin
    if (user.role !== "ADMIN") {
      where.businessId = user.businessId
    } else {
      const businessId = searchParams.get("businessId")
      if (businessId) {
        where.businessId = businessId
      }
    }

    if (status && status !== "all") {
      where.status = status
    }

    const [transports, total] = await Promise.all([
      db.transportation.findMany({
        where,
        include: {
          business: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
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
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          scheduledDate: "desc",
        },
        skip,
        take: limit,
      }),
      db.transportation.count({ where }),
    ])

    return NextResponse.json({
      transports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching transportation records:", error)
    return NextResponse.json({ error: "Failed to fetch transportation records" }, { status: 500 })
  }
}

// POST - Create transportation record
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only STAFF and ADMIN can create transportation records
    if (user.role !== "STAFF" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only staff and admin can create transportation records" }, { status: 403 })
    }

    // If user has no businessId, find or create a default business
    if (!user.businessId) {
      let business = await db.business.findFirst({
        where: { type: "CAFE" },
      })
      
      if (!business) {
        business = await db.business.create({
          data: {
            name: "Green Café",
            type: "CAFE",
            email: `cafe-${user.id}@example.com`,
          },
        })
      }
      
      // Update user with businessId
      await db.user.update({
        where: { id: user.id },
        data: { businessId: business.id },
      })
      
      user.businessId = business.id
    }

    const body = await request.json()
    const validatedData = transportSchema.parse(body)

    // Verify waste entry or pickup request exists
    if (validatedData.wasteEntryId) {
      const wasteEntry = await db.wasteEntry.findUnique({
        where: { id: validatedData.wasteEntryId },
      })

      if (!wasteEntry) {
        return NextResponse.json({ error: "Waste entry not found" }, { status: 404 })
      }

      if (wasteEntry.businessId !== user.businessId && user.role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    }

    if (validatedData.pickupRequestId) {
      const pickupRequest = await db.pickupRequest.findUnique({
        where: { id: validatedData.pickupRequestId },
      })

      if (!pickupRequest) {
        return NextResponse.json({ error: "Pickup request not found" }, { status: 404 })
      }

      if (pickupRequest.businessId !== user.businessId && user.role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    }

    const transportation = await db.transportation.create({
      data: {
        wasteEntryId: validatedData.wasteEntryId || null,
        pickupRequestId: validatedData.pickupRequestId || null,
        businessId: user.businessId,
        destination: validatedData.destination,
        quantity: validatedData.quantity,
        scheduledDate: validatedData.scheduledDate ? new Date(validatedData.scheduledDate) : null,
        scheduledTime: validatedData.scheduledTime || null,
        distance: validatedData.distance || null,
        notes: validatedData.notes,
        createdById: user.id,
        assignedToId: validatedData.assignedToId || null,
      },
      include: {
        business: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
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
                  },
                },
              },
            },
          },
        },
      },
    })

    return NextResponse.json(transportation, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 })
    }

    console.error("Error creating transportation record:", error)
    return NextResponse.json({ error: "Failed to create transportation record" }, { status: 500 })
  }
}


