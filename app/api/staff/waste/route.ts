import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

type CreateWasteBody = {
  cafeId: string
  staffUserId: string
  type: "edible" | "organic" | "coffee" | "recyclable"
  itemName: string
  quantity: number
  expiryDate: string
  assignedTo: "charity" | "farmer"
  notes?: string
}

// GET /api/staff/waste
// Also allows admin users to access waste entries
// Supports both NextAuth session and x-user-id header for backward compatibility
export async function GET(req: NextRequest) {
  try {
    let user: { id: string; role: string; businessId: string | null } | null = null
    
    // Try NextAuth session first
    const session = await getServerSession(authOptions)
    if (session?.user) {
      user = {
        id: session.user.id,
        role: session.user.role,
        businessId: session.user.businessId,
      }
    } else {
      // Fall back to x-user-id header (backward compatibility)
      const userId = req.headers.get("x-user-id")
      if (userId) {
        let dbUser = await db.user.findUnique({
          where: { id: userId },
          include: { business: true },
        })
        
        // If user doesn't exist, create a default user and business
        if (!dbUser) {
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
          
          // Create user
          dbUser = await db.user.create({
            data: {
              id: userId,
              email: `user-${userId}@example.com`,
              password: "temp",
              role: "STAFF",
              businessId: business.id,
              name: "Staff User",
            },
            include: { business: true },
          })
        }
        
        if (dbUser) {
          user = {
            id: dbUser.id,
            role: dbUser.role,
            businessId: dbUser.businessId,
          }
        }
      }
    }
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (user.role !== "STAFF" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
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

    if (!user.businessId) {
      return NextResponse.json({ error: "User business not found" }, { status: 400 })
    }

    // Ensure businessId is not null before querying
    if (!user.businessId) {
      return NextResponse.json(
        { error: "User business not found" },
        { status: 400 }
      )
    }

    // Get all waste entries for this business, sorted by most recent
    console.log(`[GET /api/staff/waste] Querying database for businessId: ${user.businessId}`)
    
    let wasteEntries
    try {
      wasteEntries = await db.wasteEntry.findMany({
        where: {
          businessId: user.businessId,
        },
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
        orderBy: {
          createdAt: "desc",
        },
      })
      console.log(`[GET /api/staff/waste] Found ${wasteEntries.length} entries`)
    } catch (dbError) {
      console.error("[GET /api/staff/waste] Database error:", dbError)
      throw dbError
    }

    // Transform to match expected format
    const typeMap: Record<string, string> = {
      "EDIBLE": "edible",
      "COFFEE_GROUNDS": "coffee",
      "ORGANIC": "organic",
      "EXPIRED": "expired",
      "RECYCLABLE": "recyclable",
      "PLATE_WASTE": "plate_waste",
    }

    const entries = wasteEntries.map((entry) => {
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
        createdAt: entry.createdAt.toISOString(),
        updatedAt: entry.updatedAt.toISOString(),
        notes: entry.notes || undefined,
      }
    })
    
    const responseData = {
      entries: entries,
      total: entries.length,
    }
    
    console.log(`[GET /api/staff/waste] Returning ${entries.length} entries`)
    
    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("[GET /api/staff/waste] Error:", error)
    console.error("[GET /api/staff/waste] Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorResponse = {
      error: "Internal server error",
      message: errorMessage,
    }
    
    console.log("[GET /api/staff/waste] Sending error response:", errorResponse)
    
    return NextResponse.json(errorResponse, {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}

// POST /api/staff/waste
// Supports both NextAuth session and x-user-id header for backward compatibility
export async function POST(req: NextRequest) {
  try {
    let user: { id: string; role: string; businessId: string | null } | null = null
    
    // Try NextAuth session first
    const session = await getServerSession(authOptions)
    if (session?.user) {
      user = {
        id: session.user.id,
        role: session.user.role,
        businessId: session.user.businessId,
      }
    } else {
      // Fall back to x-user-id header (backward compatibility)
      const userId = req.headers.get("x-user-id")
      if (userId) {
        const dbUser = await db.user.findUnique({
          where: { id: userId },
          include: { business: true },
        })
        if (dbUser) {
          user = {
            id: dbUser.id,
            role: dbUser.role,
            businessId: dbUser.businessId,
          }
        }
      }
    }
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (user.role !== "STAFF" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only staff and admin can create waste entries" }, { status: 403 })
    }

    // If user has no businessId, create or find a default business
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


    const body = await req.json() as Partial<CreateWasteBody>

    // Basic validation
    const required = ["type", "itemName", "quantity", "expiryDate", "assignedTo"] as const
    for (const key of required) {
      if (!body[key]) {
        return NextResponse.json({ error: `Missing field: ${key}` }, { status: 400 })
      }
    }

    // Note: assignedTo is now automatically determined by waste type
    // EDIBLE → CHARITY, all other types → FARMER
    // The assignedTo field in the request body is ignored and set automatically
    
    // Map waste type to database enum
    const wasteTypeMap: Record<string, "EDIBLE" | "ORGANIC" | "COFFEE_GROUNDS" | "EXPIRED" | "RECYCLABLE"> = {
      edible: "EDIBLE",
      organic: "ORGANIC",
      coffee: "COFFEE_GROUNDS",
      expired: "EXPIRED",
      recyclable: "RECYCLABLE",
    }

    // Map assignedTo to actionType
    const actionTypeMap: Record<string, "DONATE" | "FARM" | "COMPOST" | "DROPPED"> = {
      charity: "DONATE",
      farmer: "FARM",
    }

    const wasteType = wasteTypeMap[body.type!] || "ORGANIC"
    const actionType = actionTypeMap[body.assignedTo!] || "FARM"

    // Determine availableFor and status based on waste type
    // Rule: EDIBLE food → CHARITY only, all other types → FARMER only
    // status = PENDING
    let availableFor: "CHARITY" | "FARMER" | null = null
    let status: "PENDING" = "PENDING"
    
    // Automatically assign based on waste type
    if (wasteType === "EDIBLE") {
      // EDIBLE food goes to CHARITY only
      availableFor = "CHARITY"
    } else {
      // All other types (ORGANIC, COFFEE_GROUNDS, EXPIRED, RECYCLABLE, PLATE_WASTE) go to FARMER only
      availableFor = "FARMER"
    }

    // Create waste entry in database
    const wasteEntry = await db.wasteEntry.create({
      data: {
        wasteType,
        subType: body.itemName!,
        quantity: Number(body.quantity),
        actionType,
        status,
        ...(availableFor && { availableFor }),
        expiryDate: body.expiryDate ? new Date(body.expiryDate) : null,
        notes: body.notes || null,
        loggedById: user.id,
        businessId: user.businessId,
      },
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

    return NextResponse.json(
      {
        message: "Waste successfully added",
        wasteId: wasteEntry.id,
        waste: wasteEntry,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[POST /api/staff/waste] Error:", error)
    return NextResponse.json(
      { 
        error: "Internal server error", 
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
