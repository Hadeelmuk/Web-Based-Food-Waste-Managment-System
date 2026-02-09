import { PrismaClient } from "@prisma/client"

/**
 * Database client singleton.
 * Prevents creating multiple Prisma clients during development hot-reloads.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create or reuse existing Prisma client
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Log queries in development for debugging
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

// Store in global to reuse across hot-reloads (development only)
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db

