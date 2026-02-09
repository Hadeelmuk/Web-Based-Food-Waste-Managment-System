import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// POST /api/charity/requests/[id]/collected
// Charity marks their pickup request as collected (they picked it up themselves).
// When collected:
// - pickupRequest.status = COMPLETED
// - pickupRequest.completedAt = new Date()
// - wasteEntry.status = COMPLETED
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const userId = req.headers.get("x-user-id")
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const resolvedParams = params instanceof Promise ? await params : params
  const pickupId = resolvedParams.id

  try {
    // Verify user is a charity (PARTNER with NGO business)
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { business: true },
    })

    if (!user || user.role !== "PARTNER" || user.business?.type !== "NGO") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const pickupRequest = await db.pickupRequest.findUnique({
      where: { id: pickupId },
      include: {
        wasteEntry: true,
      },
    })

    if (!pickupRequest) {
      return NextResponse.json({ error: "Pickup request not found" }, { status: 404 })
    }

    // Ensure this pickup belongs to the authenticated charity
    if (pickupRequest.requesterId !== userId) {
      return NextResponse.json({ error: "Forbidden: this pickup request does not belong to you" }, { status: 403 })
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
    console.error("[Charity Collected] Error:", error)
    return NextResponse.json(
      { error: "Failed to mark as collected", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

