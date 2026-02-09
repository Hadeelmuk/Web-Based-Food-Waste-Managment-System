"use client"

import { DashboardNav } from "@/components/dashboard-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Trash2, Heart, Award, TrendingUp, CheckCircle, XCircle } from "lucide-react"
import { AdminWasteChart } from "@/components/admin-waste-chart"
import { AdminActionsChart } from "@/components/admin-actions-chart"
import { withAuth } from "@/components/with-auth"
import { useState, useEffect } from "react"
import { toast } from "sonner"

function AdminDashboardPage({ user }: { user: any }) {
  const [stats, setStats] = useState({
    totalWaste: 0,
    donated: 0,
    compost: 0,
    dropped: 0,
    pendingRequests: 0,
    collectedRequests: 0,
  })
  const [recentEntries, setRecentEntries] = useState<any[]>([])
  const [pickupRequests, setPickupRequests] = useState<any[]>([])
  const [processingRequest, setProcessingRequest] = useState<string | null>(null)

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      if (!storedUser.userId) {
        console.warn("No user ID found, skipping fetchStats")
        return
      }

      const response = await fetch("/api/admin/stats", {
        headers: {
          "x-user-id": storedUser.userId,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        console.error("Error fetching stats:", response.status, errorData)
      }
    } catch (error) {
      // Only log network errors, don't show toast for background refresh failures
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        console.warn("Network error fetching stats (this is normal if server is restarting):", error)
      } else {
        console.error("Error fetching stats:", error)
      }
    }
  }

  // Fetch recent waste entries
  const fetchRecentEntries = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      if (!storedUser.userId) {
        console.warn("No user ID found, skipping fetchRecentEntries")
        return
      }

      const response = await fetch("/api/staff/waste", {
        headers: {
          "x-user-id": storedUser.userId,
        },
      })

      if (response.ok) {
        const data = await response.json()
        const entries = (data.entries || []).slice(0, 5).map((entry: any) => ({
          id: entry.id,
          itemName: entry.itemName,
          type: entry.type,
          quantity: entry.quantity,
          assignedTo: entry.assignedTo,
          status: entry.status,
          createdAt: new Date(entry.createdAt).toLocaleString(),
        }))
        setRecentEntries(entries)
      } else {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        console.error("Error fetching recent entries:", response.status, errorData)
      }
    } catch (error) {
      // Only log network errors, don't show toast for background refresh failures
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        console.warn("Network error fetching recent entries (this is normal if server is restarting):", error)
      } else {
        console.error("Error fetching recent entries:", error)
      }
    }
  }

  // Fetch pickup requests
  const fetchPickupRequests = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      if (!storedUser.userId) {
        console.warn("No user ID found, skipping fetchPickupRequests")
        return
      }

      const response = await fetch("/api/admin/pickups", {
        headers: {
          "x-user-id": storedUser.userId,
        },
      })

      if (response.ok) {
        const data = await response.json()
        // The API returns id as pickupRequest.id (e.g., "p1"), NOT wasteId
        // Validate that we're getting pickup request IDs
        const validatedData = data.map((req: any) => {
          // Safety check: log warning if we somehow get wasteId instead
          if (req.id && req.id.startsWith("w")) {
            console.error("WARNING: API returned wasteId as id:", req.id, "This should be a pickup request ID!")
          }
          return req
        })
        setPickupRequests(validatedData.slice(0, 5)) // Show latest 5
      } else {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        console.error("Error fetching pickup requests:", response.status, errorData)
      }
    } catch (error) {
      // Only log network errors, don't show toast for background refresh failures
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        console.warn("Network error fetching pickup requests (this is normal if server is restarting):", error)
      } else {
        console.error("Error fetching pickup requests:", error)
      }
    }
  }

  // Handle approve pickup request
  const handleApprove = async (pickupRequestId: string) => {
    console.log("🔵 Approve button clicked! ID:", pickupRequestId)
    
    if (!pickupRequestId) {
      console.error("❌ No pickup request ID provided")
      toast.error("Error: Missing request ID")
      return
    }

    if (processingRequest) {
      console.log("⏳ Already processing a request, skipping...")
      return
    }
    
    setProcessingRequest(pickupRequestId)
    
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      if (!storedUser.userId) {
        toast.error("Please log in again")
        setProcessingRequest(null)
        return
      }

      console.log("📤 Sending approve request for ID:", pickupRequestId)
      const response = await fetch(`/api/admin/pickups/${pickupRequestId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": storedUser.userId,
        },
      })

      console.log("📥 Response status:", response.status)
      const data = await response.json()
      console.log("📥 Response data:", data)

      if (response.ok) {
        // Optimistic update: Update the UI immediately
        setPickupRequests((prev) =>
          prev.map((req) =>
            req.id === pickupRequestId
              ? { ...req, status: "approved" }
              : req
          )
        )
        
        // Update stats
        setStats((prev) => ({
          ...prev,
          pendingRequests: Math.max(0, prev.pendingRequests - 1),
        }))

        // Find the item name for the notification
        const approvedRequest = pickupRequests.find((r: any) => r.id === pickupRequestId)
        const itemName = approvedRequest?.itemName || data.waste?.itemName || "item"
        
        // Show success notification with prominent styling
        toast.success("✅ Pickup Request Approved!", {
          description: `The pickup request for "${itemName}" has been approved successfully. The requester will be notified.`,
          duration: 6000,
          position: "top-center",
        })
        
        // Refresh data to ensure consistency
        setTimeout(() => {
          fetchPickupRequests()
          fetchStats()
        }, 1000)
      } else {
        console.error("❌ Approve failed:", data)
        toast.error("❌ Approval Failed", {
          description: data.error || "Failed to approve request. Please try again.",
          duration: 6000,
          position: "top-center",
        })
      }
    } catch (error) {
      console.error("❌ Error approving request:", error)
      toast.error("❌ Error", {
        description: "Something went wrong while approving the request. Please try again.",
        duration: 6000,
        position: "top-center",
      })
    } finally {
      setProcessingRequest(null)
    }
  }

  // Handle reject pickup request
  const handleReject = async (pickupRequestId: string) => {
    console.log("🔴 Reject button clicked! ID:", pickupRequestId)
    
    if (!pickupRequestId) {
      console.error("❌ No pickup request ID provided")
      toast.error("Error: Missing request ID")
      return
    }

    if (processingRequest) {
      console.log("⏳ Already processing a request, skipping...")
      return
    }
    
    setProcessingRequest(pickupRequestId)
    
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      if (!storedUser.userId) {
        toast.error("Please log in again")
        setProcessingRequest(null)
        return
      }

      console.log("📤 Sending reject request for ID:", pickupRequestId)
      const response = await fetch(`/api/admin/pickups/${pickupRequestId}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": storedUser.userId,
        },
      })

      console.log("📥 Response status:", response.status)
      const data = await response.json()
      console.log("📥 Response data:", data)

      if (response.ok) {
        // Optimistic update: Update the UI immediately
        setPickupRequests((prev) =>
          prev.map((req) =>
            req.id === pickupRequestId
              ? { ...req, status: "rejected" }
              : req
          )
        )
        
        // Update stats
        setStats((prev) => ({
          ...prev,
          pendingRequests: Math.max(0, prev.pendingRequests - 1),
        }))

        // Find the item name for the notification
        const rejectedRequest = pickupRequests.find((r: any) => r.id === pickupRequestId)
        const itemName = rejectedRequest?.itemName || "item"
        
        // Show rejection notification with prominent styling
        toast.error("❌ Pickup Request Rejected", {
          description: `The pickup request for "${itemName}" has been rejected. The requester will be notified.`,
          duration: 6000,
          position: "top-center",
        })
        
        // Refresh data to ensure consistency
        setTimeout(() => {
          fetchPickupRequests()
          fetchStats()
        }, 1000)
      } else {
        console.error("❌ Reject failed:", data)
        toast.error("❌ Rejection Failed", {
          description: data.error || "Failed to reject request. Please try again.",
          duration: 6000,
          position: "top-center",
        })
      }
    } catch (error) {
      console.error("❌ Error rejecting request:", error)
      toast.error("❌ Error", {
        description: "Something went wrong while rejecting the request. Please try again.",
        duration: 6000,
        position: "top-center",
      })
    } finally {
      setProcessingRequest(null)
    }
  }

  useEffect(() => {
    fetchStats()
    fetchRecentEntries()
    fetchPickupRequests()

    // Auto-refresh every 5 seconds
    const interval = setInterval(() => {
      fetchStats()
      fetchRecentEntries()
      fetchPickupRequests()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const businesses = [
    { name: "Green Café", type: "Café", email: "contact@greencafe.com", joined: "2024-11-15" },
    { name: "Eco Restaurant", type: "Restaurant", email: "hello@ecorestaurant.com", joined: "2024-12-01" },
    { name: "Food Bank NGO", type: "NGO", email: "info@foodbank.org", joined: "2024-10-20" },
    { name: "Sustainable Farm Co.", type: "Farm", email: "support@sustainablefarm.com", joined: "2024-09-10" },
    { name: "Daily Brew Coffee", type: "Café", email: "team@dailybrew.com", joined: "2024-12-15" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="pt-20 px-4 pb-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header with dark green accent */}
          <div className="mb-8 p-6 rounded-lg bg-primary/5 border-l-4 border-primary">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Award className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="font-display font-bold text-3xl text-foreground">Admin Dashboard</h1>
            </div>
            <p className="text-muted-foreground">System-wide sustainability metrics and user management</p>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-primary">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-primary" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-3xl font-display font-bold text-foreground mb-1">{stats.totalWaste} kg</div>
              <div className="text-sm text-muted-foreground">Total Waste Logged</div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-red-500" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-3xl font-display font-bold text-foreground mb-1">{stats.donated} kg</div>
              <div className="text-sm text-muted-foreground">Total Donations</div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-secondary">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-secondary" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-3xl font-display font-bold text-foreground mb-1">{stats.compost} kg</div>
              <div className="text-sm text-muted-foreground">Composted</div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-amber-500">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-amber-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-3xl font-display font-bold text-foreground mb-1">{stats.pendingRequests}</div>
              <div className="text-sm text-muted-foreground">Pending Requests</div>
            </Card>
          </div>

          {/* Recent Entries and Pickup Requests Row */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Waste Entries */}
            <Card className="p-6">
              <h3 className="font-display font-bold text-xl text-foreground mb-6">Recent Waste Entries</h3>
              {recentEntries.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No waste entries yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Item</th>
                        <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Type</th>
                        <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Qty</th>
                        <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Assigned</th>
                        <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentEntries.map((entry) => (
                        <tr key={entry.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                          <td className="py-2 px-3 text-sm text-foreground">{entry.itemName}</td>
                          <td className="py-2 px-3 text-sm text-muted-foreground">{entry.type}</td>
                          <td className="py-2 px-3 text-sm text-foreground">{entry.quantity} kg</td>
                          <td className="py-2 px-3">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                                entry.assignedTo === "charity"
                                  ? "bg-red-500/10 text-red-600"
                                  : "bg-green-500/10 text-green-600"
                              }`}
                            >
                              {entry.assignedTo === "charity" ? "Charity" : "Farmer"}
                            </span>
                          </td>
                          <td className="py-2 px-3">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                                entry.status === "collected"
                                  ? "bg-primary/10 text-primary"
                                  : entry.status === "dropped"
                                    ? "bg-gray-500/10 text-gray-600"
                                    : "bg-amber-500/10 text-amber-600"
                              }`}
                            >
                              {entry.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            {/* Recent Pickup Requests */}
            <Card className="p-6">
              <h3 className="font-display font-bold text-xl text-foreground mb-6">Recent Pickup Requests</h3>
              {pickupRequests.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No pickup requests yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Requester</th>
                        <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Item</th>
                        <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Qty</th>
                        <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Preferred Time</th>
                        <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Status</th>
                        <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pickupRequests.map((request) => {
                        // CRITICAL: request.id MUST be the pickup request ID (e.g., "p1"), NOT wasteId
                        // The API endpoint /api/admin/pickups returns id: p.id (pickupRequest.id)
                        const pickupRequestId = request.id
                        
                        // Log for debugging
                        console.log("📋 Rendering request:", {
                          id: request.id,
                          pickupRequestId,
                          wasteId: request.wasteId,
                          status: request.status,
                          itemName: request.itemName
                        })
                        
                        // Safety validation: log warning if we somehow get wasteId instead
                        if (pickupRequestId && pickupRequestId.startsWith("w")) {
                          console.warn("⚠️ WARNING: Received wasteId instead of pickupRequestId:", pickupRequestId)
                          // Still render but log the issue
                        }
                        
                        if (!pickupRequestId) {
                          console.error("❌ ERROR: No ID found for request:", request)
                          return null
                        }
                        
                        return (
                          <tr key={pickupRequestId} className="border-b border-border hover:bg-muted/50 transition-colors" onClick={(e) => e.stopPropagation()}>
                            <td className="py-2 px-3 text-sm text-foreground">
                              <span
                                className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                                  request.requesterType === "charity"
                                    ? "bg-red-500/10 text-red-600"
                                    : "bg-green-500/10 text-green-600"
                                }`}
                              >
                                {request.requesterName}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-sm text-foreground">{request.itemName}</td>
                            <td className="py-2 px-3 text-sm text-foreground">{request.quantity} kg</td>
                            <td className="py-2 px-3 text-sm text-muted-foreground">
                              {request.preferredTime ? (
                                <div className="flex flex-col">
                                  <span className="font-medium text-foreground text-xs">{request.preferredTime}</span>
                                  {request.notes && (
                                    <span className="text-xs text-muted-foreground mt-1" title={request.notes}>
                                      📝 {request.notes.length > 25 ? request.notes.substring(0, 25) + "..." : request.notes}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground">Not specified</span>
                              )}
                            </td>
                            <td className="py-2 px-3">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-all ${
                                  request.status === "collected"
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : request.status === "approved"
                                      ? "bg-green-500/10 text-green-600 border border-green-500/20"
                                      : request.status === "rejected"
                                        ? "bg-red-500/10 text-red-600 border border-red-500/20"
                                        : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                                }`}
                              >
                                {request.status === "approved" && <CheckCircle className="w-3 h-3" />}
                                {request.status === "rejected" && <XCircle className="w-3 h-3" />}
                                <span className="capitalize">{request.status}</span>
                              </span>
                            </td>
                            <td className="py-2 px-3">
                              {request.status === "pending" ? (
                                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                  <Button
                                    type="button"
                                    size="sm"
                                    disabled={processingRequest === pickupRequestId}
                                    className="bg-primary hover:bg-primary/90 h-8 text-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto z-10 relative"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      if (processingRequest === pickupRequestId) {
                                        console.log("⏳ Already processing this request, ignoring click")
                                        return
                                      }
                                      console.log("✅ Approve button clicked for request:", request)
                                      console.log("✅ Using pickupRequestId:", pickupRequestId)
                                      handleApprove(pickupRequestId)
                                    }}
                                  >
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    {processingRequest === pickupRequestId ? "Processing..." : "Approve"}
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    disabled={processingRequest === pickupRequestId}
                                    className="h-8 text-xs bg-transparent border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto z-10 relative"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      if (processingRequest === pickupRequestId) {
                                        console.log("⏳ Already processing this request, ignoring click")
                                        return
                                      }
                                      console.log("❌ Reject button clicked for request:", request)
                                      console.log("❌ Using pickupRequestId:", pickupRequestId)
                                      handleReject(pickupRequestId)
                                    }}
                                  >
                                    <XCircle className="w-3 h-3 mr-1" />
                                    {processingRequest === pickupRequestId ? "Processing..." : "Reject"}
                                  </Button>
                                </div>
                              ) : request.status === "approved" ? (
                                <Button
                                  size="sm"
                                  disabled
                                  className="bg-green-500/10 text-green-600 border border-green-500/20 h-8 text-xs cursor-default"
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Approved
                                </Button>
                              ) : request.status === "rejected" ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled
                                  className="bg-red-500/10 text-red-600 border border-red-500/20 h-8 text-xs cursor-default"
                                >
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Rejected
                                </Button>
                              ) : (
                                <span className="text-sm text-muted-foreground capitalize">{request.status}</span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="font-display font-bold text-xl text-foreground mb-6">Waste by Business Type</h3>
              <AdminWasteChart />
            </Card>

            <Card className="p-6">
              <h3 className="font-display font-bold text-xl text-foreground mb-6">Action Type Distribution</h3>
              <AdminActionsChart />
            </Card>
          </div>

          {/* All Businesses Table */}
          <Card className="p-6">
            <h3 className="font-display font-bold text-xl text-foreground mb-6">All Registered Businesses</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-display font-semibold text-sm text-muted-foreground">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 font-display font-semibold text-sm text-muted-foreground">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 font-display font-semibold text-sm text-muted-foreground">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-display font-semibold text-sm text-muted-foreground">
                      Joined Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {businesses.map((business, index) => (
                    <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-4 text-foreground font-medium">{business.name}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            business.type === "Café"
                              ? "bg-primary/10 text-primary"
                              : business.type === "NGO"
                                ? "bg-red-500/10 text-red-600"
                                : business.type === "Farm"
                                  ? "bg-secondary/10 text-secondary"
                                  : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {business.type}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">{business.email}</td>
                      <td className="py-4 px-4 text-muted-foreground">{business.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default withAuth(AdminDashboardPage, ["admin"])
