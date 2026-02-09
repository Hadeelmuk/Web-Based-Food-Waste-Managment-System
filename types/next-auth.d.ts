import "next-auth"

// Keep string unions here so we don't depend on Prisma enums (SQLite doesn't support enums)
type UserRole = "ADMIN" | "STAFF" | "PARTNER"
type BusinessType = "CAFE" | "RESTAURANT" | "NGO" | "FARM" | "OTHER"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      role: UserRole
      businessId: string | null
      business?: {
        id: string
        name: string
        type: BusinessType
        address: string | null
        email: string
      } | null
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    role: UserRole
    businessId: string | null
    business?: {
      id: string
      name: string
      type: BusinessType
      address: string | null
      email: string
    } | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: UserRole
    businessId: string | null
    business?: {
      id: string
      name: string
      type: BusinessType
      address: string | null
      email: string
    } | null
  }
}
