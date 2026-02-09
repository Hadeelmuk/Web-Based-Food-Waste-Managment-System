import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET /api/marketplace/waste
// Returns available waste entries for the logged-in user based on their role.
// - Filters by status = PENDING
// - Filters by availableFor matching user's role (CHARITY or FARMER)
// - Shows waste from all businesses
export async function GET(request: NextRequest) {
  try {
    // Get user ID from header
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find user in database
    let user = await db.user.findUnique({
      where: { id: userId },
      include: { business: true },
    })

    // If user doesn't exist and it's a demo charity user, create a temporary one
    if (!user && (userId.includes("charity") || userId === "u-charity-1")) {
      console.log(`[Marketplace] Demo charity user ${userId} not found, allowing access for public portal`)
      // For demo purposes, allow access without creating a user
      // The filtering will work based on userId pattern
      user = {
        id: userId,
        role: "PARTNER",
        business: null,
      } as any
    } else if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Determine availableFor based on user's business type
    let availableFor: "CHARITY" | "FARMER" | null = null
    if (user.business?.type === "NGO") {
      availableFor = "CHARITY"
    } else if (user.business?.type === "FARM") {
      availableFor = "FARMER"
    } else {
      // Fallback: Check if user ID matches charity/farmer pattern (for demo/testing)
      // Or check user role - PARTNER users might be charity or farmer
      if (userId.includes("charity") || userId.includes("ngo")) {
        // Demo fallback: if userId contains "charity" or "ngo", treat as charity
        console.log(`[Marketplace] User ${userId} matches charity pattern, defaulting to CHARITY`)
        availableFor = "CHARITY"
      } else if (userId.includes("farmer") || userId.includes("farm")) {
        // Demo fallback: if userId contains "farmer" or "farm", treat as farmer
        console.log(`[Marketplace] User ${userId} matches farmer pattern, defaulting to FARMER`)
        availableFor = "FARMER"
      } else if (user.role === "PARTNER" && !user.business) {
        // If user is PARTNER but no business, check userId pattern
        if (userId.includes("charity") || userId.includes("ngo")) {
          availableFor = "CHARITY"
        } else {
          availableFor = "FARMER"
        }
        console.log(`[Marketplace] User ${userId} is PARTNER without business, defaulting to ${availableFor}`)
      } else {
        console.log(`[Marketplace] User ${userId} has business type: ${user.business?.type || "null"}, role: ${user.role}, cannot access marketplace`)
        return NextResponse.json(
          { 
            error: "Only charity and farmer users can access marketplace",
            details: `Your business type is: ${user.business?.type || "not set"}. Please register as a FARM or NGO business.`
          },
          { status: 403 }
        )
      }
    }

    console.log(`[Marketplace] User ${userId} (business type: ${user.business?.type || "none"}, role: ${user.role}) looking for items with availableFor: ${availableFor}`)

    // Get all waste entries that are PENDING and match the user's role
    // Exclude items that already have active pickup requests
    const activeRequestWasteIds = await db.pickupRequest.findMany({
      where: {
        status: {
          in: ["PENDING", "APPROVED"],
        },
      },
      select: {
        wasteEntryId: true,
      },
    })

    const requestedWasteIds = new Set(
      activeRequestWasteIds
        .map((r) => r.wasteEntryId)
        .filter((id): id is string => id !== null)
    )

    console.log(`[Marketplace] Found ${requestedWasteIds.size} waste items with active pickup requests (excluded from results)`)

    // Debug: Check all waste entries to see what's available
    const allWasteEntries = await db.wasteEntry.findMany({
      select: {
        id: true,
        status: true,
        availableFor: true,
        wasteType: true,
        subType: true,
        quantity: true,
      },
      take: 20, // Get more entries for debugging
      orderBy: {
        createdAt: "desc",
      },
    })
    console.log(`[Marketplace] Recent waste entries in DB (${allWasteEntries.length}):`, allWasteEntries.map(e => ({
      id: e.id,
      status: e.status,
      availableFor: e.availableFor,
      wasteType: e.wasteType,
      subType: e.subType,
      quantity: e.quantity,
    })))

    // Build where clause with wasteType-based filtering
    // Rule: EDIBLE → CHARITY only, all other types → FARMER only
    // Only show items that are PENDING and not DROPPED
    
    // Prepare expiry date filter
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Start of today
    
    // Build base where clause
    // All conditions are ANDed together by default in Prisma
    const whereClause: any = {
      status: "PENDING",
      id: {
        notIn: Array.from(requestedWasteIds),
      },
      // Explicitly exclude dropped items
      actionType: {
        not: "DROPPED",
      },
      // Expiry date filter - show items that haven't expired yet
      // If expiryDate is null, show it (no expiry means it's still good)
      // If expiryDate exists, only show if it's today or in the future
      AND: [
        {
          OR: [
            { expiryDate: null },
            { expiryDate: { gte: today } },
          ],
        },
      ],
    }
    
    // Add wasteType and availableFor filters based on user type
    // This is the primary filter - wasteType determines who can see it
    if (availableFor === "CHARITY") {
      // Charity users only see EDIBLE items
      whereClause.wasteType = "EDIBLE"
      // Filter by availableFor - allow both explicit CHARITY and null (for legacy/inferred records)
      // Since wasteType=EDIBLE implies CHARITY, we accept null availableFor
      whereClause.AND.push({
        OR: [
          { availableFor: "CHARITY" },
          { availableFor: null },
        ],
      })
    } else if (availableFor === "FARMER") {
      // Farmer users see all types EXCEPT EDIBLE
      whereClause.wasteType = {
        not: "EDIBLE"
      }
      // Filter by availableFor - allow both explicit FARMER and null (for legacy/inferred records)
      whereClause.AND.push({
        OR: [
          { availableFor: "FARMER" },
          { availableFor: null },
        ],
      })
    }
    
    console.log(`[Marketplace] Querying with where clause:`, JSON.stringify(whereClause, null, 2))
    console.log(`[Marketplace] Looking for items with wasteType=${availableFor === "CHARITY" ? "EDIBLE" : "NOT EDIBLE"} AND (availableFor=${availableFor} OR availableFor=null)`)

    // First, let's do a simple test query to verify database connection
    const testQuery = await db.wasteEntry.findFirst({
      where: {
        wasteType: "EDIBLE",
        status: "PENDING",
      },
      select: {
        id: true,
        subType: true,
        status: true,
        availableFor: true,
        wasteType: true,
        actionType: true,
        expiryDate: true,
      },
    })
    console.log(`[Marketplace] Test query - Found one EDIBLE PENDING entry:`, testQuery)

    const wasteEntries = await db.wasteEntry.findMany({
      where: whereClause,
      include: {
        business: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            contactPerson: true,
            type: true,
          },
        },
        loggedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Use createdAt instead of date for more reliable sorting
      },
    })

    console.log(`[Marketplace] Found ${wasteEntries.length} waste entries matching filter criteria`)
    
    // Log details of found entries for debugging
    if (wasteEntries.length > 0) {
      console.log(`[Marketplace] Sample entries found:`, wasteEntries.slice(0, 3).map(e => ({
        id: e.id,
        subType: e.subType,
        wasteType: e.wasteType,
        status: e.status,
        availableFor: e.availableFor,
        actionType: e.actionType,
        quantity: e.quantity,
        expiryDate: e.expiryDate,
      })))
    } else {
      console.log(`[Marketplace] No entries found. Checking if any matching entries exist...`)
      // Debug query - check if any entries exist with the expected criteria
      const debugQuery = {
        wasteType: availableFor === "CHARITY" ? "EDIBLE" : { not: "EDIBLE" },
        availableFor: availableFor,
        status: "PENDING",
      }
      console.log(`[Marketplace] Debug query:`, JSON.stringify(debugQuery, null, 2))
      
      const debugEntries = await db.wasteEntry.findMany({
        where: debugQuery,
        select: {
          id: true,
          subType: true,
          status: true,
          availableFor: true,
          wasteType: true,
          expiryDate: true,
          actionType: true,
        },
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
      })
      console.log(`[Marketplace] Debug entries matching criteria:`, debugEntries)
      
      // Also check all EDIBLE entries regardless of availableFor
      if (availableFor === "CHARITY") {
        const allEdible = await db.wasteEntry.findMany({
          where: {
            wasteType: "EDIBLE",
            status: "PENDING",
          },
          select: {
            id: true,
            subType: true,
            status: true,
            availableFor: true,
            expiryDate: true,
            actionType: true,
          },
          take: 10,
          orderBy: {
            createdAt: "desc",
          },
        })
        console.log(`[Marketplace] All PENDING EDIBLE entries in DB (regardless of availableFor):`, allEdible)
      }
    }

    // Transform to match expected format
    const mappedItems = wasteEntries.map((entry) => ({
      id: entry.id,
      cafeId: entry.businessId,
      cafeName: entry.business.name || "Unknown Café",
      itemName: entry.subType || entry.wasteType,
      type: entry.wasteType.toLowerCase(),
      quantity: entry.quantity,
      expiryDate: entry.expiryDate?.toISOString().split("T")[0] || "",
      status: entry.status.toLowerCase(),
      description: entry.notes || undefined,
      createdAt: entry.createdAt.toISOString(), // Include createdAt for notification tracking
      // Compute effective availableFor from wasteType to correct legacy data
      availableFor: entry.wasteType === "EDIBLE" ? "CHARITY" : "FARMER",
      business: {
        id: entry.businessId,
        name: entry.business.name || "Unknown Café",
        type: entry.business.type,
        address: entry.business.address,
      },
      cafeContact: {
        name: entry.business.contactPerson || entry.loggedBy.name || "Café Admin",
        email: entry.business.email || entry.loggedBy.email || null,
        organizationName: entry.business.name || "Unknown Café",
        phone: entry.business.phone || null,
        address: entry.business.address || null,
      },
    }))

    console.log(`[Marketplace] Returning ${mappedItems.length} items for ${availableFor}`)
    console.log(`[Marketplace] Mapped items details:`, mappedItems.map(item => ({
      id: item.id,
      itemName: item.itemName,
      wasteType: item.type,
      availableFor: item.availableFor,
      status: item.status,
      expiryDate: item.expiryDate,
    })))

    // Filter out any mismatched legacy records just in case
    const filteredItems = mappedItems.filter((item) => {
      if (availableFor === "CHARITY") {
        return item.availableFor === "CHARITY"
      }
      if (availableFor === "FARMER") {
        return item.availableFor === "FARMER"
      }
      return false
    })

    console.log(`[Marketplace] Final filtered items count: ${filteredItems.length} (after filtering by availableFor)`)
    if (filteredItems.length !== mappedItems.length) {
      console.log(`[Marketplace] Filtered out ${mappedItems.length - filteredItems.length} items due to availableFor mismatch`)
    }

    return NextResponse.json(filteredItems)
  } catch (error) {
    console.error("[Marketplace Waste] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch marketplace waste" },
      { status: 500 }
    )
  }
}
