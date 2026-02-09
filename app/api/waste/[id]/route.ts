import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const updateWasteEntrySchema = z.object({
  status: z.enum(["PENDING", "COMPLETED", "DROPPED"]).optional(),
  destination: z.string().optional(),
  notes: z.string().optional(),
})

// GET - Get single waste entry
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const entry = await db.wasteEntry.findUnique({
      where: { id },
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
        pickupRequest: {
          include: {
            requester: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        transportation: true,
      },
    })

    if (!entry) {
      return NextResponse.json({ error: "Waste entry not found" }, { status: 404 })
    }

    // Check authorization
    if (session.user.role !== "ADMIN" && entry.businessId !== session.user.businessId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json(entry)
  } catch (error) {
    console.error("Error fetching waste entry:", error)
    return NextResponse.json({ error: "Failed to fetch waste entry" }, { status: 500 })
  }
}

// PATCH - Update waste entry
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const entry = await db.wasteEntry.findUnique({
      where: { id },
    })

    if (!entry) {
      return NextResponse.json({ error: "Waste entry not found" }, { status: 404 })
    }

    // Check authorization
    if (session.user.role !== "ADMIN" && entry.businessId !== session.user.businessId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = updateWasteEntrySchema.parse(body)

    // If status is being changed to DROPPED or COMPLETED, cancel any pending/approved requests
    if (validatedData.status && (validatedData.status === "DROPPED" || validatedData.status === "COMPLETED")) {
      await db.pickupRequest.updateMany({
        where: {
          wasteEntryId: id,
          status: {
            in: ["PENDING", "APPROVED"],
          },
        },
        data: {
          status: "CANCELLED",
          notes: validatedData.notes 
            ? `${validatedData.notes} (Request cancelled: Item marked as ${validatedData.status.toLowerCase()})`
            : `Request cancelled: Item marked as ${validatedData.status.toLowerCase()}`,
        },
      })
    }

    const updatedEntry = await db.wasteEntry.update({
      where: { id },
      data: validatedData,
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

    return NextResponse.json(updatedEntry)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 })
    }

    console.error("Error updating waste entry:", error)
    return NextResponse.json({ error: "Failed to update waste entry" }, { status: 500 })
  }
}

// DELETE - Delete waste entry
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const entry = await db.wasteEntry.findUnique({
      where: { id },
    })

    if (!entry) {
      return NextResponse.json({ error: "Waste entry not found" }, { status: 404 })
    }

    // Only admin can delete entries
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await db.wasteEntry.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Waste entry deleted successfully" })
  } catch (error) {
    console.error("Error deleting waste entry:", error)
    return NextResponse.json({ error: "Failed to delete waste entry" }, { status: 500 })
  }
}

