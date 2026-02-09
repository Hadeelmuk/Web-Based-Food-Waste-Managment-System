import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Get analytics and reports
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const reportType = searchParams.get("type") || "summary"
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const businessId = searchParams.get("businessId")

    // Build filter object
    const filter: any = {}

    // Filter by business
    if (session.user.role !== "ADMIN") {
      filter.businessId = session.user.businessId
    } else if (businessId) {
      filter.businessId = businessId
    }

    // Filter by date range
    if (startDate || endDate) {
      filter.date = {}
      if (startDate) {
        filter.date.gte = new Date(startDate)
      }
      if (endDate) {
        filter.date.lte = new Date(endDate)
      }
    }

    if (reportType === "summary") {
      // Get all waste entries for calculations
      const allEntries = await db.wasteEntry.findMany({
        where: filter,
      })

      // Calculate totals
      let totalWaste = 0
      let totalDonated = 0
      let totalComposted = 0
      let totalDropped = 0

      for (const entry of allEntries) {
        totalWaste += entry.quantity
        if (entry.actionType === "DONATE") {
          totalDonated += entry.quantity
        }
        if (entry.actionType === "COMPOST" || entry.actionType === "FARM") {
          totalComposted += entry.quantity
        }
        if (entry.actionType === "DROPPED") {
          totalDropped += entry.quantity
        }
      }

      // Group by waste type
      const wasteByType: any = {}
      for (const entry of allEntries) {
        if (!wasteByType[entry.wasteType]) {
          wasteByType[entry.wasteType] = { quantity: 0, count: 0 }
        }
        wasteByType[entry.wasteType].quantity += entry.quantity
        wasteByType[entry.wasteType].count += 1
      }

      // Group by action type
      const wasteByAction: any = {}
      for (const entry of allEntries) {
        if (!wasteByAction[entry.actionType]) {
          wasteByAction[entry.actionType] = { quantity: 0, count: 0 }
        }
        wasteByAction[entry.actionType].quantity += entry.quantity
        wasteByAction[entry.actionType].count += 1
      }

      return NextResponse.json({
        summary: {
          totalWaste,
          totalDonated,
          totalComposted,
          totalDropped,
        },
        wasteByType,
        wasteByAction,
      })
    }

    if (reportType === "admin") {
      // Only admin can access this
      if (session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }

      // Get all data
      const totalUsers = await db.user.count()
      const totalBusinesses = await db.business.count()

      const allWasteEntries = await db.wasteEntry.findMany()
      let totalWaste = 0
      let totalDonations = 0

      for (const entry of allWasteEntries) {
        totalWaste += entry.quantity
        if (entry.actionType === "DONATE") {
          totalDonations += entry.quantity
        }
      }

      // Count businesses by type
      const allBusinesses = await db.business.findMany()
      const businessesByType: any = {}
      for (const business of allBusinesses) {
        if (!businessesByType[business.type]) {
          businessesByType[business.type] = 0
        }
        businessesByType[business.type] += 1
      }

      // Get top businesses by waste quantity
      const wasteByBusiness: any = {}
      for (const entry of allWasteEntries) {
        if (!wasteByBusiness[entry.businessId]) {
          wasteByBusiness[entry.businessId] = { quantity: 0, count: 0 }
        }
        wasteByBusiness[entry.businessId].quantity += entry.quantity
        wasteByBusiness[entry.businessId].count += 1
      }

      // Sort and get top 10
      const topBusinessesArray = Object.entries(wasteByBusiness)
        .sort((a: any, b: any) => b[1].quantity - a[1].quantity)
        .slice(0, 10)

      // Get business details
      const topBusinesses = []
      for (const [businessId, data] of topBusinessesArray) {
        const business = await db.business.findUnique({
          where: { id: businessId },
          select: { id: true, name: true, type: true },
        })
        topBusinesses.push({
          businessId,
          business,
          quantity: (data as any).quantity,
          count: (data as any).count,
        })
      }

      return NextResponse.json({
        totalUsers,
        totalBusinesses,
        totalWaste,
        totalDonations,
        businessesByType,
        topBusinesses,
      })
    }

    return NextResponse.json({ error: "Invalid report type" }, { status: 400 })
  } catch (error) {
    console.error("Error generating report:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


