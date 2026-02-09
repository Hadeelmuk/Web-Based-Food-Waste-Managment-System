import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const wasteEntrySchema = z.object({
  date: z.string().optional(),
  wasteType: z.enum(["EDIBLE", "COFFEE_GROUNDS", "ORGANIC", "EXPIRED", "RECYCLABLE", "PLATE_WASTE"]),
  subType: z.string().optional(),
  quantity: z.number().positive(),
  actionType: z.enum(["DONATE", "COMPOST", "FARM", "REUSE", "DROPPED"]),
  destination: z.string().optional(),
  expiryDate: z.string().optional(),
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
      let dbUser = await db.user.findUnique({
        where: { id: userId },
        include: { business: true },
      })
      
      // If user doesn't exist, create a default user and business (for backward compatibility with mock users)
      if (!dbUser) {
        console.log(`[getUserFromRequest] User ${userId} not found, creating default user...`)
        
        // Try to find existing business for this user (by email pattern)
        // This ensures consistency - if user was created before, use same business
        let business = await db.business.findFirst({
          where: { 
            email: `cafe-${userId}@example.com`,
          },
        })
        
        // If no business found, create a new one with unique email based on userId
        if (!business) {
          business = await db.business.create({
            data: {
              name: "Green Café",
              type: "CAFE",
              email: `cafe-${userId}@example.com`,
            },
          })
          console.log(`[getUserFromRequest] Created new business: ${business.id} for user ${userId}`)
        } else {
          console.log(`[getUserFromRequest] Found existing business: ${business.id} for user ${userId}`)
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
        
        console.log(`[getUserFromRequest] Created default user: ${dbUser.id} with businessId: ${business.id}`)
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

// GET - Fetch waste entries
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // If user has no businessId, find or create a default business
    // Use same email pattern as getUserFromRequest for consistency
    if (!user.businessId) {
      // Try to find existing business for this user (by email pattern)
      let business = await db.business.findFirst({
        where: { 
          email: `cafe-${user.id}@example.com`,
        },
      })
      
      // If no business found, create a new one with unique email based on userId
      if (!business) {
        business = await db.business.create({
          data: {
            name: "Green Café",
            type: "CAFE",
            email: `cafe-${user.id}@example.com`,
          },
        })
        console.log(`[GET /api/waste] Created new business: ${business.id} for user ${user.id}`)
      } else {
        console.log(`[GET /api/waste] Found existing business: ${business.id} for user ${user.id}`)
      }
      
      // Update user with businessId
      await db.user.update({
        where: { id: user.id },
        data: { businessId: business.id },
      })
      
      user.businessId = business.id
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const wasteType = searchParams.get("wasteType")
    const actionType = searchParams.get("actionType")
    const status = searchParams.get("status")
    const recent = searchParams.get("recent") === "true" // Special flag for recent entries
    const page = parseInt(searchParams.get("page") || "1")
    const limit = recent ? 50 : parseInt(searchParams.get("limit") || "50") // Show all recent entries, not just 5
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

    if (startDate || endDate) {
      where.date = {}
      if (startDate) {
        where.date.gte = new Date(startDate)
      }
      if (endDate) {
        where.date.lte = new Date(endDate)
      }
    }

    if (wasteType && wasteType !== "all") {
      where.wasteType = wasteType
    }

    if (actionType && actionType !== "all") {
      where.actionType = actionType
    }

    if (status && status !== "all") {
      where.status = status
    }

    console.log(`[GET /api/waste] Querying with where clause:`, JSON.stringify(where, null, 2))
    
    let entries, total
    try {
      [entries, total] = await Promise.all([
        db.wasteEntry.findMany({
          where,
          include: {
            loggedBy: {
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
              },
            },
          },
          orderBy: recent ? {
            createdAt: "desc",
          } : {
            date: "desc",
          },
          skip,
          take: limit,
        }),
        db.wasteEntry.count({ where }),
      ])
      console.log(`[GET /api/waste] Found ${entries.length} entries (total: ${total})`)
    } catch (dbError) {
      console.error("[GET /api/waste] Database error:", dbError)
      const errorMessage = dbError instanceof Error ? dbError.message : String(dbError)
      return NextResponse.json(
        { 
          error: "Database error", 
          message: errorMessage,
          details: process.env.NODE_ENV === "development" ? String(dbError) : undefined
        },
        { status: 500 }
      )
    }

    // Transform to match /api/staff/waste format for compatibility
    const typeMap: Record<string, string> = {
      "EDIBLE": "edible",
      "COFFEE_GROUNDS": "coffee",
      "ORGANIC": "organic",
      "EXPIRED": "expired",
      "RECYCLABLE": "recyclable",
      "PLATE_WASTE": "plate_waste",
    }

    const transformedEntries = entries.map((entry) => {
      const wasteType = String(entry.wasteType)
      const displayType = typeMap[wasteType] || wasteType.toLowerCase()
      const status = String(entry.status).toLowerCase()
      const assignedTo = entry.availableFor ? String(entry.availableFor).toLowerCase() : null
      
      return {
        id: entry.id,
        cafeId: entry.businessId,
        type: displayType,
        itemName: entry.subType || displayType || "Unknown",
        quantity: entry.quantity,
        expiryDate: entry.expiryDate ? entry.expiryDate.toISOString().split("T")[0] : "",
        status: status,
        assignedTo: assignedTo,
        actionType: entry.actionType, // Include actionType for ACTION column
        wasteType: entry.wasteType, // Include wasteType for filtering
        subType: entry.subType, // Include subType
        destination: entry.destination, // Include destination
        date: entry.date, // Include date
        loggedByName: entry.loggedBy?.name || "Staff", // Include logged by name
        createdAt: entry.createdAt.toISOString(),
        updatedAt: entry.updatedAt.toISOString(),
        notes: entry.notes || undefined,
      }
    })

    // For recent entries, return simplified format matching /api/staff/waste
    if (recent) {
      return NextResponse.json({
        entries: transformedEntries,
        total: transformedEntries.length,
      })
    }

    return NextResponse.json({
      entries: transformedEntries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("[GET /api/waste] Error fetching waste entries:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { 
        error: "Failed to fetch waste entries",
        message: errorMessage,
        entries: [], // Always return entries array even on error
        total: 0,
      },
      { status: 500 }
    )
  }
}

// POST - Create new waste entry
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      console.error("[POST /api/waste] Unauthorized - no user found")
      return NextResponse.json({ error: "Unauthorized - please log in again" }, { status: 401 })
    }
    
    console.log("[POST /api/waste] User authenticated:", { id: user.id, role: user.role, businessId: user.businessId })

    // Only STAFF (café) users can create waste entries
    if (user.role !== "STAFF" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only staff members can log waste" }, { status: 403 })
    }

    // If user has no businessId, find or create a default business
    // Use same email pattern as getUserFromRequest for consistency
    if (!user.businessId) {
      // Try to find existing business for this user (by email pattern)
      let business = await db.business.findFirst({
        where: { 
          email: `cafe-${user.id}@example.com`,
        },
      })
      
      // If no business found, create a new one with unique email based on userId
      if (!business) {
        business = await db.business.create({
          data: {
            name: "Green Café",
            type: "CAFE",
            email: `cafe-${user.id}@example.com`,
          },
        })
        console.log(`[POST /api/waste] Created new business: ${business.id} for user ${user.id}`)
      } else {
        console.log(`[POST /api/waste] Found existing business: ${business.id} for user ${user.id}`)
      }
      
      // Update user with businessId
      await db.user.update({
        where: { id: user.id },
        data: { businessId: business.id },
      })
      
      user.businessId = business.id
    }

    const body = await request.json()
    const validatedData = wasteEntrySchema.parse(body)

    // Determine status and availableFor based on waste type
    // Rule: EDIBLE food → CHARITY only, all other types → FARMER only
    // WasteEntry is the source of truth - all entries start with PENDING status
    let status: "PENDING" | "AVAILABLE" | "APPROVED" | "COMPLETED" | "DROPPED" = "PENDING"
    let availableFor: "CHARITY" | "FARMER" | null = null
    
    if (validatedData.actionType === "DROPPED") {
      status = "DROPPED"
    } else {
      // Automatically assign based on waste type
      if (validatedData.wasteType === "EDIBLE") {
        // EDIBLE food goes to CHARITY only
        availableFor = "CHARITY"
        status = "PENDING"
      } else {
        // All other types (COFFEE_GROUNDS, ORGANIC, EXPIRED, RECYCLABLE, PLATE_WASTE) go to FARMER only
        availableFor = "FARMER"
        status = "PENDING"
      }
    }

    // Validate required fields before creating
    if (!user.businessId) {
      console.error("[POST /api/waste] ERROR: user.businessId is null")
      return NextResponse.json(
        { 
          error: "Database error", 
          message: "Unable to associate waste entry with a business. Please try again." 
        },
        { status: 500 }
      )
    }

    if (!user.id) {
      console.error("[POST /api/waste] ERROR: user.id is null")
      return NextResponse.json(
        { 
          error: "Database error", 
          message: "User ID is missing. Please log in again." 
        },
        { status: 500 }
      )
    }

    // Verify user exists in database
    try {
      const userExists = await db.user.findUnique({
        where: { id: user.id },
      })
      if (!userExists) {
        console.error("[POST /api/waste] ERROR: User does not exist in database:", user.id)
        return NextResponse.json(
          { 
            error: "Database error", 
            message: "User not found. Please log in again." 
          },
          { status: 500 }
        )
      }
    } catch (userCheckError) {
      console.error("[POST /api/waste] ERROR checking user:", userCheckError)
    }

    // Verify business exists in database
    try {
      const businessExists = await db.business.findUnique({
        where: { id: user.businessId },
      })
      if (!businessExists) {
        console.error("[POST /api/waste] ERROR: Business does not exist in database:", user.businessId)
        return NextResponse.json(
          { 
            error: "Database error", 
            message: "Business not found. Please contact support." 
          },
          { status: 500 }
        )
      }
    } catch (businessCheckError) {
      console.error("[POST /api/waste] ERROR checking business:", businessCheckError)
    }

    console.log("[POST /api/waste] BEFORE db.wasteEntry.create() - Data:", {
      wasteType: validatedData.wasteType,
      quantity: validatedData.quantity,
      actionType: validatedData.actionType,
      status,
      availableFor,
      businessId: user.businessId,
      loggedById: user.id,
    })

    let wasteEntry
    try {
      // Build data object - only include availableFor if it's not null
      // Handle dates carefully for SQLite
      let entryDate = new Date()
      if (validatedData.date) {
        try {
          entryDate = new Date(validatedData.date)
          if (isNaN(entryDate.getTime())) {
            entryDate = new Date() // Fallback to now if invalid
          }
        } catch (e) {
          entryDate = new Date() // Fallback to now if parsing fails
        }
      }

      const wasteEntryData: any = {
        date: entryDate,
        wasteType: validatedData.wasteType,
        quantity: validatedData.quantity,
        actionType: validatedData.actionType,
        status,
        loggedById: user.id,
        businessId: user.businessId,
      }

      // Add optional fields
      if (validatedData.subType) {
        wasteEntryData.subType = validatedData.subType
      }
      if (validatedData.destination) {
        wasteEntryData.destination = validatedData.destination
      }
      if (validatedData.expiryDate) {
        try {
          const expiry = new Date(validatedData.expiryDate)
          if (!isNaN(expiry.getTime())) {
            wasteEntryData.expiryDate = expiry
          }
        } catch (e) {
          console.warn("[POST /api/waste] Invalid expiry date, skipping:", validatedData.expiryDate)
        }
      }
      if (validatedData.notes) {
        wasteEntryData.notes = validatedData.notes
      }
      // Only add availableFor if it's not null
      if (availableFor) {
        wasteEntryData.availableFor = availableFor
      }

      console.log("[POST /api/waste] Creating with data:", JSON.stringify(wasteEntryData, null, 2))

      wasteEntry = await db.wasteEntry.create({
        data: wasteEntryData,
      include: {
        loggedBy: {
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
          },
        },
      },
    })

    console.log("[POST /api/waste] AFTER db.wasteEntry.create() - Success! Entry ID:", wasteEntry.id)
    console.log("[POST /api/waste] Created entry details:", {
      id: wasteEntry.id,
      wasteType: wasteEntry.wasteType,
      subType: wasteEntry.subType,
      quantity: wasteEntry.quantity,
      actionType: wasteEntry.actionType,
      status: wasteEntry.status,
      availableFor: wasteEntry.availableFor,
      businessId: wasteEntry.businessId,
    })

    // Award points based on action type (don't fail if this doesn't work)
    try {
      let points = 0
      if (validatedData.actionType === "DONATE") {
        points = Math.floor(validatedData.quantity) // 1 point per kg donated
      } else if (validatedData.actionType === "COMPOST" || validatedData.actionType === "FARM") {
        points = Math.floor(validatedData.quantity * 0.5) // 0.5 points per kg composted
      } else if (validatedData.actionType === "REUSE") {
        points = Math.floor(validatedData.quantity * 0.8) // 0.8 points per kg reused
      }

      if (points > 0) {
        await db.pointsHistory.create({
          data: {
            userId: user.id,
            wasteEntryId: wasteEntry.id,
            points,
            reason: `Logged ${validatedData.quantity} kg of ${validatedData.wasteType.toLowerCase()} - ${validatedData.actionType.toLowerCase()}`,
          },
        })
        console.log("[POST /api/waste] Points awarded:", points)
      }
    } catch (pointsError) {
      // Don't fail the entire request if points creation fails
      console.error("[POST /api/waste] Failed to create points history (non-critical):", pointsError)
    }

    return NextResponse.json(wasteEntry, { status: 201 })
    } catch (dbError) {
      console.error("[POST /api/waste] Database error during create:", dbError)
      console.error("[POST /api/waste] Error details:", {
        message: dbError instanceof Error ? dbError.message : String(dbError),
        stack: dbError instanceof Error ? dbError.stack : undefined,
        name: dbError instanceof Error ? dbError.name : undefined,
      })
      
      const errorMessage = dbError instanceof Error ? dbError.message : String(dbError)
      
      // Check for specific database errors
      let userFriendlyMessage = "Failed to create waste entry"
      if (errorMessage.includes("Foreign key constraint") || errorMessage.includes("foreign key")) {
        userFriendlyMessage = "Invalid user or business. Please log in again."
      } else if (errorMessage.includes("NOT NULL constraint") || errorMessage.includes("null")) {
        userFriendlyMessage = "Missing required information. Please fill in all fields."
      } else if (errorMessage.includes("SQLite") || errorMessage.includes("database")) {
        userFriendlyMessage = "Database error. Please try again."
      }
      
      return NextResponse.json(
        { 
          error: "Database error", 
          message: userFriendlyMessage,
          details: process.env.NODE_ENV === "development" ? errorMessage : undefined
        },
        { status: 500 }
      )
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input data", details: error.errors }, { status: 400 })
    }

    console.error("[POST /api/waste] Error creating waste entry:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { 
        error: "Failed to create waste entry", 
        message: errorMessage,
        details: process.env.NODE_ENV === "development" ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}

