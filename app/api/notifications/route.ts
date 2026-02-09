import { NextRequest, NextResponse } from "next/server"
import { notifications } from "@/app/api/_data"

// GET /api/notifications
// Returns notifications for the logged-in user
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all notifications for this user, sorted by most recent
    const userNotifications = notifications
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json(userNotifications)
  } catch (error) {
    console.error("[GET /api/notifications] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    )
  }
}

// PATCH /api/notifications/[id]/read
// Marks a notification as read
export async function PATCH(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { notificationId } = body

    if (!notificationId) {
      return NextResponse.json({ error: "Missing notificationId" }, { status: 400 })
    }

    const notification = notifications.find(
      (n) => n.id === notificationId && n.userId === userId
    )

    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 })
    }

    notification.read = true

    return NextResponse.json({ message: "Notification marked as read", notification })
  } catch (error) {
    console.error("[PATCH /api/notifications] Error:", error)
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    )
  }
}
