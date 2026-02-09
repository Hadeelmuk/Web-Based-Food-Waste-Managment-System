import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Get points history and summary
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    const skip = (page - 1) * limit

    // Determine which user's points to fetch
    let targetUserId = session.user.id

    // Admin can view any user's points
    if (session.user.role === "ADMIN" && userId) {
      targetUserId = userId
    }

    // Get total points
    const totalPointsResult = await db.pointsHistory.aggregate({
      where: {
        userId: targetUserId,
      },
      _sum: {
        points: true,
      },
    })

    const totalPoints = totalPointsResult._sum.points || 0

    // Get points history
    const [pointsHistory, total] = await Promise.all([
      db.pointsHistory.findMany({
        where: {
          userId: targetUserId,
        },
        include: {
          wasteEntry: {
            select: {
              id: true,
              wasteType: true,
              quantity: true,
              actionType: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      db.pointsHistory.count({
        where: {
          userId: targetUserId,
        },
      }),
    ])

    // Determine level based on points
    let level = "Green Starter"
    let nextLevel = 50
    let nextLevelName = "Eco Achiever"

    if (totalPoints >= 200) {
      level = "Sustainability Champion"
      nextLevel = null
      nextLevelName = null
    } else if (totalPoints >= 100) {
      level = "Green Hero"
      nextLevel = 200
      nextLevelName = "Sustainability Champion"
    } else if (totalPoints >= 50) {
      level = "Eco Achiever"
      nextLevel = 100
      nextLevelName = "Green Hero"
    } else {
      nextLevel = 50
      nextLevelName = "Eco Achiever"
    }

    return NextResponse.json({
      totalPoints,
      level,
      nextLevel,
      nextLevelName,
      pointsHistory,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching points:", error)
    return NextResponse.json({ error: "Failed to fetch points" }, { status: 500 })
  }
}


