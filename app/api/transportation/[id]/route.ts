import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const updateTransportSchema = z.object({
  status: z.enum(["SCHEDULED", "IN_TRANSIT", "COMPLETED", "CANCELLED"]).optional(),
  scheduledDate: z.string().optional(),
  scheduledTime: z.string().optional(),
  distance: z.number().optional(),
  assignedToId: z.string().optional(),
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
      console.error(`[getUserFromRequest] Database error looking up user ${userId}:`, error)
    }
  }
  
  return null
}

// GET - Get single transportation record
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const transport = await db.transportation.findUnique({
      where: { id },
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
            business: {
              select: {
                id: true,
                name: true,
                type: true,
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

    if (!transport) {
      return NextResponse.json({ error: "Transportation record not found" }, { status: 404 })
    }

    // Check authorization
    if (user.role !== "ADMIN" && transport.businessId !== user.businessId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json(transport)
  } catch (error) {
    console.error("Error fetching transportation record:", error)
    return NextResponse.json({ error: "Failed to fetch transportation record" }, { status: 500 })
  }
}

// PATCH - Update transportation record
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const transport = await db.transportation.findUnique({
      where: { id },
    })

    if (!transport) {
      return NextResponse.json({ error: "Transportation record not found" }, { status: 404 })
    }

    // Check authorization
    if (user.role !== "ADMIN" && transport.businessId !== user.businessId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = updateTransportSchema.parse(body)

    const updateData: any = {
      ...validatedData,
    }

    if (validatedData.scheduledDate) {
      updateData.scheduledDate = new Date(validatedData.scheduledDate)
    }

    if (validatedData.status === "COMPLETED") {
      updateData.completedAt = new Date()
    }

    const updatedTransport = await db.transportation.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(updatedTransport)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 })
    }

    console.error("Error updating transportation record:", error)
    return NextResponse.json({ error: "Failed to update transportation record" }, { status: 500 })
  }
}

// DELETE - Delete transportation record
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const transport = await db.transportation.findUnique({
      where: { id },
    })

    if (!transport) {
      return NextResponse.json({ error: "Transportation record not found" }, { status: 404 })
    }

    // Check authorization
    if (user.role !== "ADMIN" && transport.businessId !== user.businessId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await db.transportation.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Transportation record deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting transportation record:", error)
    return NextResponse.json({ error: "Failed to delete transportation record" }, { status: 500 })
  }
}


