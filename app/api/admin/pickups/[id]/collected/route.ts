import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// POST /api/admin/pickups/[id]/collected
// Admin marks a pickup request as collected.
// When collected:
// - pickupRequest.status = COMPLETED
// - pickupRequest.completedAt = new Date()
// - wasteEntry.status = COMPLETED
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const resolvedParams = params instanceof Promise ? await params : params
  const pickupId = resolvedParams.id

  try {
    const pickupRequest = await db.pickupRequest.findUnique({
      where: { id: pickupId },
      include: {
        wasteEntry: true,
      },
    })

    if (!pickupRequest) {
      return NextResponse.json({ error: "Pickup request not found" }, { status: 404 })
    }

    // Verify admin has access to this business
    if (session.user.businessId && pickupRequest.businessId !== session.user.businessId) {
      return NextResponse.json({ error: "Forbidden: waste does not belong to your cafe" }, { status: 403 })
    }

    // Update both pickup request and waste entry status
    const [updatedPickupRequest, updatedWasteEntry] = await Promise.all([
      db.pickupRequest.update({
        where: { id: pickupId },
        data: {
          status: "COMPLETED",
          completedAt: new Date(),
        },
      }),
      db.wasteEntry.update({
        where: { id: pickupRequest.wasteEntryId! },
        data: {
          status: "COMPLETED",
        },
      }),
    ])

    return NextResponse.json({ 
      pickupRequest: updatedPickupRequest, 
      wasteEntry: updatedWasteEntry 
    })
  } catch (error) {
    console.error("[Collected] Error:", error)
    return NextResponse.json(
      { error: "Failed to mark as collected", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

