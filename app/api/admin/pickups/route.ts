import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

type PickupDto = {
  id: string
  wasteId: string
  requesterId: string
  requesterName: string
  requesterType: "charity" | "farmer"
  itemName: string
  itemType: string
  quantity: number
  status: string
  dateRequested: string
  preferredTime?: string
  notes?: string
}

// GET /api/admin/pickups
// Lists all pickup requests for waste items belonging to the admin's café.
// Shows full details including requester name and waste item info.
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
        try {
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
        } catch (error) {
          console.error(`[Admin Pickups] Database error looking up user ${userId}:`, error)
        }
      }
    }
    
    if (!user) {
      console.log("[Admin Pickups] No user found - unauthorized")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Allow both ADMIN and STAFF to view pickup requests
    if (user.role !== "ADMIN" && user.role !== "STAFF") {
      console.log(`[Admin Pickups] User ${user.id} is not allowed (role: ${user.role})`)
      return NextResponse.json({ error: "Forbidden - Staff or Admin access required" }, { status: 403 })
    }

    // Debug: Check all pickup requests in DB first with full details
    const allPickupRequests = await db.pickupRequest.findMany({
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
        wasteEntry: {
          select: {
            id: true,
            subType: true,
            wasteType: true,
            quantity: true,
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
      take: 20,
    })
    console.log(`[Admin Pickups] Total pickup requests in DB: ${allPickupRequests.length}`)
    if (allPickupRequests.length > 0) {
      console.log(`[Admin Pickups] Sample pickup requests with details:`, JSON.stringify(allPickupRequests.slice(0, 3).map(p => ({
        id: p.id,
        status: p.status,
        requesterId: p.requesterId,
        requesterName: p.requester?.name,
        requesterBusiness: p.requester?.business?.name,
        requesterBusinessType: p.requester?.business?.type,
        wasteEntryId: p.wasteEntryId,
        wasteItem: p.wasteEntry?.subType || p.wasteEntry?.wasteType,
        wasteQuantity: p.wasteEntry?.quantity,
        businessId: p.businessId,
        businessName: p.business?.name,
      })), null, 2))
    }

    // Get pickup requests for admin's business
    // If admin has no businessId, try to find one from waste entries or show all requests
    let targetBusinessId = user.businessId
    
    if (!targetBusinessId) {
      console.log("[Admin Pickups] Admin user has no businessId - trying to find one...")
      
      try {
        // Try to find businessId from waste entries created by this user
        const wasteEntry = await db.wasteEntry.findFirst({
          where: {
            loggedById: user.id,
          },
          select: {
            businessId: true,
          },
        })
        
        if (wasteEntry?.businessId) {
          targetBusinessId = wasteEntry.businessId
          console.log(`[Admin Pickups] Found businessId from waste entry: ${targetBusinessId}`)
          
          // Try to update admin user with this businessId (don't fail if it doesn't work)
          try {
            await db.user.update({
              where: { id: user.id },
              data: { businessId: targetBusinessId },
            })
            user.businessId = targetBusinessId
          } catch (updateError) {
            console.error("[Admin Pickups] Failed to update user businessId:", updateError)
            // Continue anyway with the found businessId
          }
        } else {
          // Try to find any CAFE business
          try {
            const cafeBusiness = await db.business.findFirst({
              where: { type: "CAFE" },
            })
            
            if (cafeBusiness) {
              targetBusinessId = cafeBusiness.id
              console.log(`[Admin Pickups] Found CAFE business: ${targetBusinessId}`)
              
              // Try to update admin user with this businessId (don't fail if it doesn't work)
              try {
                await db.user.update({
                  where: { id: user.id },
                  data: { businessId: targetBusinessId },
                })
                user.businessId = targetBusinessId
              } catch (updateError) {
                console.error("[Admin Pickups] Failed to update user businessId:", updateError)
                // Continue anyway with the found businessId
              }
            } else {
              console.log("[Admin Pickups] No businessId found - showing ALL requests")
            }
          } catch (businessError) {
            console.error("[Admin Pickups] Error finding CAFE business:", businessError)
            console.log("[Admin Pickups] Showing ALL requests due to error")
          }
        }
      } catch (error) {
        console.error("[Admin Pickups] Error finding businessId:", error)
        console.log("[Admin Pickups] Showing ALL requests due to error")
        // Continue without businessId - will show all requests
      }
    }

    const where: any = {}
    if (targetBusinessId) {
      where.businessId = targetBusinessId
      console.log(`[Admin Pickups] Filtering by businessId: ${targetBusinessId}`)
    } else {
      console.log("[Admin Pickups] Showing ALL requests (no businessId to filter by)")
    }

    let pickupRequests
    try {
      pickupRequests = await db.pickupRequest.findMany({
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
                  address: true,
                  phone: true,
                  email: true,
                },
              },
            },
          },
          wasteEntry: {
            select: {
              id: true,
              subType: true,
              wasteType: true,
              quantity: true,
              status: true,
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
          requestedDate: "desc",
        },
      })

      console.log(`[Admin Pickups] Query returned ${pickupRequests.length} requests with where clause:`, JSON.stringify(where))
    } catch (queryError) {
      console.error("[Admin Pickups] Database query error:", queryError)
      // If query fails, try without where clause (show all)
      try {
        pickupRequests = await db.pickupRequest.findMany({
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
                    address: true,
                    phone: true,
                    email: true,
                  },
                },
              },
            },
            wasteEntry: {
              select: {
                id: true,
                subType: true,
                wasteType: true,
                quantity: true,
                status: true,
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
            requestedDate: "desc",
          },
          take: 50, // Limit to 50 to avoid huge results
        })
        console.log(`[Admin Pickups] Fallback query returned ${pickupRequests.length} requests`)
      } catch (fallbackError) {
        console.error("[Admin Pickups] Fallback query also failed:", fallbackError)
        return NextResponse.json(
          { 
            error: "Database error", 
            message: fallbackError instanceof Error ? fallbackError.message : String(fallbackError),
            requests: []
          },
          { status: 500 }
        )
      }
    }

    const items: PickupDto[] = pickupRequests.map((p) => {
      const waste = p.wasteEntry
      const requester = p.requester
      
      // Determine requester type from requester's business
      let requesterType: "charity" | "farmer" = "farmer"
      if (requester?.business?.type === "NGO") {
        requesterType = "charity"
      } else if (requester?.business?.type === "FARM") {
        requesterType = "farmer"
      }

      // Get requester name - prefer business name if available, otherwise user name
      const requesterName = requester?.business?.name || requester?.name || "Unknown"

      console.log(`[Admin Pickups] Processing request ${p.id}:`, {
        requesterId: p.requesterId,
        requesterName,
        requesterType,
        requesterBusinessType: requester?.business?.type,
        wasteEntryId: p.wasteEntryId,
        businessId: p.businessId,
      })

      return {
        id: p.id, // IMPORTANT: This is the pickupRequest.id, NOT wasteId
        wasteId: p.wasteEntryId || "", // This is the waste ID - included for reference only
        requesterId: p.requesterId,
        requesterName,
        requesterType,
        itemName: waste?.subType || waste?.wasteType || "Unknown",
        itemType: waste?.wasteType?.toLowerCase() || "unknown",
        quantity: waste?.quantity || 0,
        status: p.status.toLowerCase(),
        dateRequested: p.requestedDate.toISOString(),
        notes: p.notes || undefined,
      }
    })

    console.log(`[Admin Pickups] Found ${pickupRequests.length} pickup requests in DB, returning ${items.length} items`)
    console.log(`[Admin Pickups] User businessId: ${user.businessId}`)
    console.log(`[Admin Pickups] Target businessId used for filtering: ${targetBusinessId}`)
    if (pickupRequests.length > 0) {
      console.log(`[Admin Pickups] Request businessIds:`, pickupRequests.map(p => p.businessId))
      console.log(`[Admin Pickups] Request statuses:`, pickupRequests.map(p => p.status))
      console.log(`[Admin Pickups] Request IDs:`, pickupRequests.map(p => p.id))
      console.log(`[Admin Pickups] Request requesterIds:`, pickupRequests.map(p => p.requesterId))
    } else {
      console.log(`[Admin Pickups] No pickup requests found with where clause:`, JSON.stringify(where))
    }
    
    // Return the items as an array
    return NextResponse.json(items, {
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("[Admin Pickups] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch pickup requests", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}


