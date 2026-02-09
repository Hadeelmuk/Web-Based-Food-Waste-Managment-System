import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

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
      console.error(`[transportations/complete] Error looking up user:`, error)
    }
  }

  return null
}

// PATCH /api/admin/transportations/:id/complete
// Marks transportation as COMPLETED and updates all related records:
// 1. Transportation.status = COMPLETED
// 2. Transportation.completedAt = now()
// 3. PickupRequest.status = COMPLETED
// 4. PickupRequest.completedAt = now()
// 5. WasteEntry.status = COMPLETED
// 6. Create PointsHistory record (1 kg = 1 point)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (user.role !== "STAFF" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id: transportId } = await params

    // Find transportation with all related records
    const transportation = await db.transportation.findUnique({
      where: { id: transportId },
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
                status: true,
                loggedById: true,
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
            loggedById: true,
          },
        },
        business: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!transportation) {
      return NextResponse.json({ error: "Transportation not found" }, { status: 404 })
    }

    // Check if already completed
    if (transportation.status === "COMPLETED") {
      return NextResponse.json(
        { error: "Transportation is already completed" },
        { status: 400 }
      )
    }

    // Get the waste entry (from transportation or pickup request)
    const wasteEntry = transportation.wasteEntry || transportation.pickupRequest?.wasteEntry
    const quantity = transportation.quantity || wasteEntry?.quantity || 0
    const points = Math.floor(quantity) // 1 kg = 1 point

    // Get the user who logged the waste (for points)
    const wasteLoggerId = wasteEntry?.loggedById || user.id

    const now = new Date()

    // Use transaction to update all records atomically
    const result = await db.$transaction(async (tx) => {
      // 1. Update Transportation status
      const updatedTransportation = await tx.transportation.update({
        where: { id: transportId },
        data: {
          status: "COMPLETED",
          completedAt: now,
        },
      })

      // 2. Update PickupRequest status if exists
      let updatedPickupRequest = null
      if (transportation.pickupRequestId) {
        updatedPickupRequest = await tx.pickupRequest.update({
          where: { id: transportation.pickupRequestId },
          data: {
            status: "COMPLETED",
            completedAt: now,
          },
        })
      }

      // 3. Update WasteEntry status if exists
      let updatedWasteEntry = null
      const wasteEntryId = transportation.wasteEntryId || transportation.pickupRequest?.wasteEntry?.id
      if (wasteEntryId) {
        updatedWasteEntry = await tx.wasteEntry.update({
          where: { id: wasteEntryId },
          data: {
            status: "COMPLETED",
          },
        })
      }

      // 4. Create PointsHistory record (1 kg = 1 point)
      let pointsRecord = null
      if (wasteEntryId && points > 0) {
        // Check if points already exist for this waste entry
        const existingPoints = await tx.pointsHistory.findUnique({
          where: { wasteEntryId },
        })

        if (!existingPoints) {
          const requesterName = transportation.pickupRequest?.requester?.business?.name ||
                               transportation.pickupRequest?.requester?.name ||
                               transportation.destination ||
                               "Unknown"
          const wasteType = wasteEntry?.subType || wasteEntry?.wasteType || "waste"
          
          pointsRecord = await tx.pointsHistory.create({
            data: {
              userId: wasteLoggerId,
              wasteEntryId,
              points,
              reason: `Collected ${quantity} kg of ${wasteType} - delivered to ${requesterName}`,
            },
          })
          console.log(`[transportations/complete] Created ${points} points for waste entry ${wasteEntryId}`)
        } else {
          console.log(`[transportations/complete] Points already exist for waste entry ${wasteEntryId}`)
        }
      }

      return {
        transportation: updatedTransportation,
        pickupRequest: updatedPickupRequest,
        wasteEntry: updatedWasteEntry,
        points: pointsRecord,
      }
    })

    console.log(`[transportations/complete] Completed transportation ${transportId}:`, {
      transportationId: result.transportation.id,
      pickupRequestId: result.pickupRequest?.id,
      wasteEntryId: result.wasteEntry?.id,
      pointsAwarded: points,
    })

    return NextResponse.json({
      success: true,
      message: "Transportation completed successfully",
      data: {
        transportationId: result.transportation.id,
        transportationStatus: result.transportation.status,
        pickupRequestId: result.pickupRequest?.id,
        pickupRequestStatus: result.pickupRequest?.status,
        wasteEntryId: result.wasteEntry?.id,
        wasteEntryStatus: result.wasteEntry?.status,
        pointsAwarded: points,
        completedAt: now.toISOString(),
      },
    })
  } catch (error) {
    console.error("[transportations/complete] Error:", error)
    return NextResponse.json(
      { error: "Failed to complete transportation", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
















