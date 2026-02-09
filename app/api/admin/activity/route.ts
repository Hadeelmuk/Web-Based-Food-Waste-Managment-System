import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/app/api/_auth"
import { activityLogs, users, wasteLogs } from "@/app/api/_data"

import { pickupRequests } from "@/app/api/_data"

type ActivityDto = {
  userName: string
  userRole: string
  actionType: string
  itemName: string
  requesterType?: "charity" | "farmer"
  date: string
}

// GET /api/admin/activity
// Returns recent activity for the admin's café.
// Shows all activities related to waste items from this cafe, including:
// - Staff logging waste
// - Charity/farmer requesting pickups
// - Admin approving/rejecting/collecting
// - Charity/farmer collecting items themselves
export async function GET(req: NextRequest) {
  const { user, response } = requireAdmin(req)
  if (!user || response) return response!

  // Get all waste IDs from this cafe
  const cafeWasteIds = new Set(wasteLogs.filter((w) => w.cafeId === user.cafeId).map((w) => w.id))

  // Get all pickup request IDs for this cafe's waste
  const cafePickupIds = new Set(
    pickupRequests
      .filter((p) => cafeWasteIds.has(p.wasteId))
      .map((p) => p.id)
  )

  const items: ActivityDto[] = activityLogs
    .filter((log) => {
      // Show activities if:
      // 1. User is from this cafe (staff/admin)
      // 2. OR it's a pickup request for this cafe's waste
      // 3. OR it's a collectedByRequester action (charity/farmer collected)
      const actor = users.find((u) => u.id === log.userId)
      
      if (actor?.cafeId === user.cafeId) {
        return true // Staff/admin from this cafe
      }

      // Check if this is related to a pickup request for this cafe's waste
      if (log.actionType === "pickupRequested" || log.actionType === "collectedByRequester") {
        const relatedPickup = pickupRequests.find(
          (p) => p.requesterId === log.userId && cafeWasteIds.has(p.wasteId)
        )
        return !!relatedPickup
      }

      return false
    })
    .map((log) => {
      const actor = users.find((u) => u.id === log.userId)
      return {
        userName: actor?.name ?? "Unknown",
        userRole: actor?.role ?? "unknown",
        actionType: log.actionType,
        itemName: log.itemName,
        requesterType: log.requesterType,
        date: log.createdAt,
      }
    })
    .sort((a, b) => b.date.localeCompare(a.date)) // Most recent first

  return NextResponse.json(items)
}

