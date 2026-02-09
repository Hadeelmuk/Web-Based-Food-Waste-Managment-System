import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

/**
 * POST /api/auth/register
 * Handles new user registration.
 * 
 * Creates both a Business record and a User record in the database.
 * Uses a transaction to ensure both are created together or not at all.
 */
export async function POST(req: NextRequest) {
  try {
    // Parse and validate request body
    const body = (await req.json().catch(() => null)) as {
      email?: string
      password?: string
      businessName?: string
      businessType?: string
      address?: string
      contactPerson?: string
      phone?: string
      name?: string
    } | null

    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      )
    }

    // Check required fields
    if (!body.email || !body.password || !body.businessName || !body.businessType) {
      return NextResponse.json(
        { 
          error: "Missing required fields", 
          message: "Email, password, business name, and business type are required" 
        },
        { status: 400 },
      )
    }

    const email = body.email.toLowerCase()

    // Check if user already exists
    let existingUser
    try {
      existingUser = await db.user.findUnique({
        where: { email },
      })
    } catch (dbError) {
      console.error("[POST /api/auth/register] Error checking existing user:", dbError)
      return NextResponse.json(
        { 
          error: "Database error", 
          message: "Failed to check if user exists. Please try again." 
        },
        { status: 500 }
      )
    }

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }
    
    // Check if business with this email already exists
    let existingBusiness
    try {
      existingBusiness = await db.business.findUnique({
        where: { email },
      })
    } catch (dbError) {
      console.error("[POST /api/auth/register] Error checking existing business:", dbError)
      // Continue registration even if check fails
    }
    
    // Generate unique business email if needed
    // Business.email must be unique, so if user email is taken, modify it
    let businessEmail = email
    if (existingBusiness) {
      const emailParts = email.split('@')
      businessEmail = `${emailParts[0]}+business@${emailParts[1]}`
      console.log(`[POST /api/auth/register] Business email conflict, using: ${businessEmail}`)
      
      // Check if alternative email also exists
      const altBusinessExists = await db.business.findUnique({
        where: { email: businessEmail },
      })
      
      if (altBusinessExists) {
        // Use timestamp to make it unique
        businessEmail = `${emailParts[0]}+business-${Date.now()}@${emailParts[1]}`
        console.log(`[POST /api/auth/register] Alternative email also exists, using: ${businessEmail}`)
      }
    }

    // Convert form business type to database format
    const businessTypeInput = (body.businessType || "").toLowerCase()
    let businessType: string | null = null
    if (businessTypeInput === "cafe") businessType = "CAFE"
    else if (businessTypeInput === "ngo") businessType = "NGO"
    else if (businessTypeInput === "farm") businessType = "FARM"
    
    if (!businessType) {
      return NextResponse.json(
        { 
          error: "Invalid business type", 
          message: "Business type must be one of: cafe, ngo, or farm" 
        },
        { status: 400 },
      )
    }

    // Determine frontend role based on business type
    // This is used for routing and localStorage on the frontend
    let appRole: "admin" | "staff" | "charity" | "farmer" = "staff"
    if (businessType === "NGO") appRole = "charity"
    else if (businessType === "FARM") appRole = "farmer"

    // Map to database user role
    // Database has three roles: ADMIN, STAFF, PARTNER
    let dbRole: string = "STAFF"
    if (appRole === "charity" || appRole === "farmer") {
      dbRole = "PARTNER"
    }

    // Create Business and User in a transaction
    // This ensures both are created together or neither is created
    console.log("[POST /api/auth/register] Creating business and user...")
    
    let result
    try {
      result = await db.$transaction(async (tx) => {
        // Create business first
        const business = await tx.business.create({
          data: {
            name: body.businessName!,
            type: businessType,
            address: body.address || null,
            contactPerson: body.contactPerson || null,
            phone: body.phone || null, // Optional phone number
            email: businessEmail,
          },
        })

        console.log("[POST /api/auth/register] Business created:", business.id)

        // Create user linked to the business
        const user = await tx.user.create({
          data: {
            email,
            password: body.password!, // Note: stored as plain text for demo compatibility
            name: body.name || body.contactPerson || "New User",
            role: dbRole,
            businessId: business.id,
          },
        })

        console.log("[POST /api/auth/register] User created:", user.id)

        return { business, user }
      })
    } catch (transactionError) {
      console.error("[POST /api/auth/register] Transaction error:", transactionError)
      throw transactionError
    }

    // Return success response with user info
    return NextResponse.json(
      {
        message: "Registration successful",
        userId: result.user.id,
        role: appRole, // Frontend expects lowercase role
        organizationName: result.business.name,
        cafeId: result.business.id, // businessId used as cafeId for routing
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[POST /api/auth/register] Error:", error)
    
    // Provide user-friendly error messages
    let errorMessage = "Failed to register user"
    if (error instanceof Error) {
      const errorStr = error.message.toLowerCase()
      
      if (errorStr.includes("unique constraint") || errorStr.includes("unique")) {
        errorMessage = "Email already exists. Please use a different email."
      } else if (errorStr.includes("foreign key") || errorStr.includes("constraint")) {
        errorMessage = "Database constraint error. Please check your input."
      } else if (errorStr.includes("sqlite") || errorStr.includes("database")) {
        errorMessage = "Database error. Please try again or contact support."
      } else {
        errorMessage = error.message
      }
    }
    
    return NextResponse.json(
      {
        error: "Failed to register user",
        message: errorMessage,
        // Include details in development mode for debugging
        details: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.message : String(error)) : undefined,
      },
      { status: 500 },
    )
  }
}

