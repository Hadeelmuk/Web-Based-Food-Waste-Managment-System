/**
 * User roles in the system.
 * - admin: Cafe administrator
 * - staff: Cafe staff member
 * - charity: Charity/NGO organization
 * - farmer: Farm/agricultural partner
 */
export type UserRole = "admin" | "staff" | "charity" | "farmer"

/**
 * User data structure.
 * Note: In production, passwordHash should contain properly hashed passwords.
 */
export interface User {
  id: string
  name: string
  email: string
  passwordHash: string // Note: Should be hashed in production
  role: UserRole
  organizationName: string
  cafeId: string | null // null for charity/farmer, string for admin/staff
}

/**
 * Types of waste that can be logged.
 * - edible: Food that can be donated to charities
 * - organic: Organic waste for composting/farming
 * - coffee: Coffee grounds for farming
 * - recyclable: Recyclable materials
 */
export type WasteType = "edible" | "organic" | "coffee" | "recyclable"

/**
 * Status of waste items in the system.
 */
export type WasteStatus = "pending" | "approved" | "collected" | "dropped"

/**
 * Reasons why waste was dropped (not collected).
 */
export type DropReason = "expired" | "not_collected" | "damaged" | "other"

/**
 * Waste log entry.
 * Tracks food waste items logged by cafe staff.
 */
export interface WasteLog {
  id: string
  cafeId: string
  type: WasteType
  itemName: string
  quantity: number
  expiryDate: string
  status: WasteStatus
  assignedTo: "charity" | "farmer" | null // Edible goes to charity, organic/coffee goes to farmer
  createdAt: string
  updatedAt: string
  notes?: string
  dropReason?: DropReason
  dropNotes?: string
}

/**
 * Status of pickup/collection requests.
 */
export type RequestStatus = "pending" | "approved" | "rejected" | "collected" | "pickup-scheduled" | "completed"

/**
 * Pickup request from charity or farmer.
 * Created when they request to collect available waste items.
 */
export interface PickupRequest {
  id: string
  wasteId: string // The waste item being requested
  requesterId: string // User ID of charity or farmer
  requesterType: "charity" | "farmer"
  requestedAt: string
  status: RequestStatus
  preferredTime?: string
  notes?: string
  pickupWindow?: {
    date: string
    from: string
    to: string
  }
  transportId?: string // If transportation is scheduled
}

export interface ActivityLog {
  id: string
  userId: string
  actionType:
    | "logged"
    | "dropped"
    | "donationRequested"
    | "farmRequest"
    | "pickupRequested"
    | "approved"
    | "rejected"
    | "collected"
    | "collectedByRequester"
  itemName: string
  createdAt: string
  requesterType?: "charity" | "farmer" // For pickup requests
}

export interface AuthenticatedRequest {
  userId: string
  userRole: UserRole
}

export type TransportType = "internal" | "external" | "manual"
export type TransportStatus = "scheduled" | "in-transit" | "completed" | "cancelled"

export interface Transport {
  id: string
  pickupRequestId: string
  transportType: TransportType
  provider?: string
  assignedTo?: string
  pickupDate: string
  pickupWindow: {
    from: string
    to: string
  }
  cost?: number
  trackingLink?: string
  notes?: string
  status: TransportStatus
  createdAt: string
  updatedAt: string
}

export interface Notification {
  id: string
  userId: string
  type: "request-approved" | "pickup-scheduled" | "pickup-time-changed" | "pickup-completed" | "new-waste-available"
  title: string
  message: string
  read: boolean
  createdAt: string
  relatedRequestId?: string
  relatedWasteId?: string // For new-waste-available notifications
}
