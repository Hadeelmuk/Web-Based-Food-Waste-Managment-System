"use client"

import { DashboardNav } from "@/components/dashboard-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TimePicker } from "@/components/ui/time-picker"
import { Clock, Truck, CheckCircle2, MapPin, Package, Eye, Trash2, Edit, AlertTriangle } from "lucide-react"
import { withAuth } from "@/components/with-auth"
import { useState, useEffect } from "react"
import { toast } from "sonner"

type ApprovedPickup = {
  id: string
  wasteEntryId: string | null
  requesterId: string
  requesterName: string
  requesterType: "charity" | "farmer"
  requesterAddress: string | null
  wasteType: string
  itemName: string
  quantity: number
  cafeName: string
  cafeAddress: string | null
  businessId: string
  approvedAt: string | null
  notes: string | null
}

type TransportItem = {
  id: string
  pickupRequestId: string
  wasteEntryId?: string
  transportType: string
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
  status: string
  destination?: string
  quantity?: number
  wasteType?: string
  requesterId?: string
  formattedRequesterId?: string
  businessName?: string
  pickupRequest?: {
    itemName: string
    quantity: number
    requesterName: string
  }
  assignedToName?: string
}

function TransportationPage() {
  const [transports, setTransports] = useState<TransportItem[]>([])
  const [approvedPickups, setApprovedPickups] = useState<ApprovedPickup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingApproved, setIsLoadingApproved] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTransport, setEditingTransport] = useState<TransportItem | null>(null)
  const [editStatus, setEditStatus] = useState<"SCHEDULED" | "IN_TRANSIT" | "COMPLETED" | "CANCELLED">("SCHEDULED")
  const [selectedPickupId, setSelectedPickupId] = useState<string>("")
  const [isAdminOverride, setIsAdminOverride] = useState(false)
  const [formData, setFormData] = useState({
    requesterId: "",
    wasteType: "",
    quantity: "",
    requesterName: "",
    pickupMethod: "staff" as "staff" | "courier",
    assignedTo: "",
    pickupDate: "",
    pickupWindowFrom: "",
    pickupWindowTo: "",
    status: "scheduled" as "scheduled" | "delivered" | "pending",
    notes: "",
  })

  const mockTransports = [
    {
      id: "T-014",
      cafe: "Green Café",
      destination: "EcoFarm",
      type: "Coffee Grounds",
      quantity: 15.2,
      status: "Scheduled",
      date: "2025-01-10",
      time: "10:00 AM",
    },
    {
      id: "T-015",
      cafe: "BrewHub",
      destination: "FoodBank NGO",
      type: "Food Waste",
      quantity: 22.0,
      status: "In Transit",
      date: "2025-01-09",
      time: "2:30 PM",
    },
    {
      id: "T-016",
      cafe: "Green Café",
      destination: "Urban Farm Co.",
      type: "Organic Waste",
      quantity: 18.5,
      status: "Completed",
      date: "2025-01-08",
      time: "9:00 AM",
    },
    {
      id: "T-017",
      cafe: "Coffee Corner",
      destination: "Community Garden",
      type: "Coffee Grounds",
      quantity: 12.3,
      status: "Scheduled",
      date: "2025-01-11",
      time: "11:30 AM",
    },
    {
      id: "T-018",
      cafe: "Daily Brew",
      destination: "Local Farm",
      type: "Food Waste",
      quantity: 25.8,
      status: "In Transit",
      date: "2025-01-09",
      time: "3:45 PM",
    },
    {
      id: "T-019",
      cafe: "Green Café",
      destination: "EcoFarm",
      type: "Plate Waste",
      quantity: 14.2,
      status: "Completed",
      date: "2025-01-07",
      time: "1:00 PM",
    },
  ]

  // Show all transportation records (scheduled, in-transit, completed, cancelled)
  const displayTransports = transports.filter((t) => {
    const status = t.status.toLowerCase()
    return (
      status === "scheduled" ||
      status === "pickup-scheduled" ||
      status === "completed" ||
      status === "in-transit" ||
      status === "in_transit" ||
      status === "cancelled"
    )
  })

  const scheduledCount = displayTransports.filter(
    (t) => {
      const status = t.status.toLowerCase()
      return status === "scheduled" || status === "pickup-scheduled"
    }
  ).length
  const inTransitCount = displayTransports.filter(
    (t) => {
      const status = t.status.toLowerCase()
      return status === "in-transit" || status === "in_transit" || status === "in transit"
    }
  ).length
  const completedCount = displayTransports.filter(
    (t) => {
      const status = t.status.toLowerCase()
      return status === "completed" || status === "delivered"
    }
  ).length

  // Calculate total waste quantity from all transportation records
  const totalWasteQuantity = displayTransports.reduce((total, transport) => {
    const quantity = transport.quantity || transport.pickupRequest?.quantity || 0
    return total + quantity
  }, 0)

  const getStatusColor = (status: string) => {
    const normalized = status.toLowerCase()
    if (normalized === "scheduled" || normalized === "pickup-scheduled") {
      return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
    }
    if (normalized === "in-transit" || normalized === "in_transit" || normalized === "in transit") {
      return "bg-blue-500/10 text-blue-600 border-blue-500/20"
    }
    if (normalized === "completed" || normalized === "delivered") {
      return "bg-primary/10 text-primary border-primary/20"
    }
    if (normalized === "cancelled") {
      return "bg-red-500/10 text-red-600 border-red-500/20"
    }
    return "bg-muted text-muted-foreground"
  }

  const getStatusIcon = (status: string) => {
    const normalized = status.toLowerCase()
    if (normalized === "scheduled" || normalized === "pickup-scheduled") {
      return <Clock className="w-4 h-4" />
    }
    if (normalized === "in-transit" || normalized === "in_transit" || normalized === "in transit") {
      return <Truck className="w-4 h-4" />
    }
    if (normalized === "completed" || normalized === "delivered") {
      return <CheckCircle2 className="w-4 h-4" />
    }
    return null
  }

  // Fetch transports and approved pickups
  useEffect(() => {
    fetchTransports()
  }, [])

  const fetchTransports = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      if (!storedUser.userId) return

      const response = await fetch("/api/admin/transportations", {
        headers: { "x-user-id": storedUser.userId },
      })

      if (response.ok) {
        const data = await response.json()
        // Transform the data to match TransportItem type
        const transformedTransports = (data.transportations || []).map((t: any) => {
          const wasteType = t.wasteType || t.itemName || "Unknown"
          const quantity = t.quantity || 0
          const destination = t.requesterName || t.destination || "Unknown"
          const businessName = t.requesterName || destination
          
          // Format requester ID to follow business name
          const shortId = (t.pickupRequestId || t.id).substring(0, 6).toUpperCase()
          const formattedRequesterId = `${businessName}-${shortId}`

          return {
            id: t.id,
            pickupRequestId: t.pickupRequestId || "",
            wasteEntryId: t.wasteEntryId || "",
            transportType: t.pickupRequestId ? "internal" : "external",
            assignedTo: t.driverName || undefined,
            pickupDate: t.scheduledDate || "",
            pickupWindow: {
              from: t.scheduledTime?.split("-")[0] || "",
              to: t.scheduledTime?.split("-")[1] || "",
            },
            notes: t.notes || undefined,
            status: t.status || "SCHEDULED",
            destination: destination,
            quantity: quantity,
            wasteType: wasteType,
            requesterId: t.pickupRequestId || t.id,
            formattedRequesterId: formattedRequesterId,
            businessName: businessName,
            pickupRequest: {
              itemName: t.itemName || wasteType,
              quantity: quantity,
              requesterName: businessName,
            },
          }
        })
        setTransports(transformedTransports)
      }
    } catch (error) {
      console.error("Error fetching transports:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch approved pickups that need transportation
  const fetchApprovedPickups = async () => {
    setIsLoadingApproved(true)
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      if (!storedUser.userId) return

      const response = await fetch("/api/admin/pickups/approved", {
        headers: { "x-user-id": storedUser.userId },
      })

      if (response.ok) {
        const data = await response.json()
        setApprovedPickups(data.approvedPickups || [])
      }
    } catch (error) {
      console.error("Error fetching approved pickups:", error)
    } finally {
      setIsLoadingApproved(false)
    }
  }

  const handleCancel = () => {
    // Reset form data
    setFormData({
      requesterId: "",
      wasteType: "",
      quantity: "",
      requesterName: "",
      pickupMethod: "staff",
      assignedTo: "",
      pickupDate: "",
      pickupWindowFrom: "",
      pickupWindowTo: "",
      status: "scheduled",
      notes: "",
    })
    setSelectedPickupId("")
    setIsAdminOverride(false)
    // Close dialog
    setIsDialogOpen(false)
  }

  // Handle opening dialog - fetch approved pickups
  const handleOpenScheduleDialog = () => {
    fetchApprovedPickups()
    setIsDialogOpen(true)
  }

  // Handle pickup selection from dropdown
  const handlePickupSelect = (pickupId: string) => {
    setSelectedPickupId(pickupId)
    
    if (pickupId === "admin-override") {
      setIsAdminOverride(true)
      // Clear auto-filled fields for manual entry
      setFormData(prev => ({
        ...prev,
        requesterId: "",
        wasteType: "",
        quantity: "",
        requesterName: "",
      }))
      return
    }
    
    setIsAdminOverride(false)
    const pickup = approvedPickups.find(p => p.id === pickupId)
    if (pickup) {
      setFormData(prev => ({
        ...prev,
        requesterId: pickup.id,
        wasteType: pickup.wasteType || pickup.itemName,
        quantity: String(pickup.quantity),
        requesterName: pickup.requesterName,
      }))
    }
  }

  const handleSchedulePickup = async () => {
    // Validate pickup selection (unless admin override)
    if (!selectedPickupId && !isAdminOverride) {
      toast.error("Please select an approved pickup request")
      return
    }

    if (!formData.pickupDate || !formData.pickupWindowFrom || !formData.pickupWindowTo) {
      toast.error("Please fill in date and time fields")
      return
    }

    if (!formData.assignedTo) {
      toast.error("Please enter driver/staff name")
      return
    }

    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      if (!storedUser.userId) {
        toast.error("Please log in again")
        return
      }

      // Format scheduled time as "HH:mm-HH:mm"
      const scheduledTime = `${formData.pickupWindowFrom}-${formData.pickupWindowTo}`

      // Build notes
      const transportNotes = [
        `Driver: ${formData.assignedTo}`,
        `Pickup Method: ${formData.pickupMethod === "staff" ? "Café staff" : "External courier (Grab / Lalamove)"}`,
        formData.notes,
      ]
        .filter(Boolean)
        .join("\n")

      // Use the new admin transportations endpoint
      const response = await fetch("/api/admin/transportations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": storedUser.userId,
        },
        body: JSON.stringify({
          pickupRequestId: selectedPickupId === "admin-override" ? formData.requesterId : selectedPickupId,
          scheduledDate: formData.pickupDate,
          scheduledTime: scheduledTime,
          driverName: formData.assignedTo,
          notes: transportNotes,
          isAdminOverride: isAdminOverride,
          manualDestination: isAdminOverride ? formData.requesterName : undefined,
          manualQuantity: isAdminOverride ? parseFloat(formData.quantity) : undefined,
          manualWasteType: isAdminOverride ? formData.wasteType : undefined,
        }),
      })

      if (response.ok) {
        toast.success("Transportation scheduled successfully")
        setIsDialogOpen(false)
        // Reset form
        setFormData({
          requesterId: "",
          wasteType: "",
          quantity: "",
          requesterName: "",
          pickupMethod: "staff",
          assignedTo: "",
          pickupDate: "",
          pickupWindowFrom: "",
          pickupWindowTo: "",
          status: "scheduled",
          notes: "",
        })
        setSelectedPickupId("")
        setIsAdminOverride(false)
        // Refresh data
        fetchTransports()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to schedule transportation")
      }
    } catch (error) {
      console.error("Error scheduling pickup:", error)
      toast.error("An error occurred. Please try again.")
    }
  }

  const handleMarkCompleted = async (transportId: string, pickupRequestId: string) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      if (!storedUser.userId) {
        toast.error("User not found. Please log in again")
        return
      }

      // Use the new complete endpoint which updates:
      // - Transportation.status = COMPLETED
      // - PickupRequest.status = COMPLETED
      // - WasteEntry.status = COMPLETED
      // - Creates PointsHistory (1 kg = 1 point)
      const response = await fetch(`/api/admin/transportations/${transportId}/complete`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": storedUser.userId,
        },
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(`Completed! ${data.data?.pointsAwarded || 0} points awarded`)
        // Refresh data - this triggers dashboard and points page updates via their own polling
        fetchTransports()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to mark as completed")
      }
    } catch (error) {
      console.error("Error marking as completed:", error)
      toast.error("An error occurred. Please try again.")
    }
  }

  const handleDelete = async (transportId: string) => {
    // Confirm before deleting
    if (!confirm("Are you sure you want to delete this transportation record? This action cannot be undone.")) {
      return
    }

    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      if (!storedUser.userId) {
        toast.error("User not found. Please log in again")
        return
      }

      const response = await fetch(`/api/transportation/${transportId}`, {
        method: "DELETE",
        headers: {
          "x-user-id": storedUser.userId,
        },
      })

      if (response.ok) {
        toast.success("Transportation record deleted successfully")
        // Refresh data without page reload
        fetchTransports()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to delete transportation record")
      }
    } catch (error) {
      console.error("Error deleting transportation record:", error)
      toast.error("An error occurred. Please try again.")
    }
  }

  const handleEdit = (transport: TransportItem) => {
    setEditingTransport(transport)
    // Map the current status to the edit status
    const statusMap: Record<string, "SCHEDULED" | "IN_TRANSIT" | "COMPLETED" | "CANCELLED"> = {
      "SCHEDULED": "SCHEDULED",
      "scheduled": "SCHEDULED",
      "Scheduled": "SCHEDULED",
      "IN_TRANSIT": "IN_TRANSIT",
      "in-transit": "IN_TRANSIT",
      "In Transit": "IN_TRANSIT",
      "COMPLETED": "COMPLETED",
      "completed": "COMPLETED",
      "Completed": "COMPLETED",
      "delivered": "COMPLETED",
      "CANCELLED": "CANCELLED",
      "cancelled": "CANCELLED",
    }
    setEditStatus(statusMap[transport.status] || "SCHEDULED")
    setIsEditDialogOpen(true)
  }

  const handleUpdateStatus = async () => {
    if (!editingTransport) return

    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      if (!storedUser.userId) {
        toast.error("User not found. Please log in again")
        return
      }

      // If setting to COMPLETED, use the complete endpoint to update all related records
      if (editStatus === "COMPLETED") {
        const response = await fetch(`/api/admin/transportations/${editingTransport.id}/complete`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": storedUser.userId,
          },
        })

        if (response.ok) {
          const data = await response.json()
          toast.success(`Completed! ${data.data?.pointsAwarded || 0} points awarded`)
          setIsEditDialogOpen(false)
          setEditingTransport(null)
          fetchTransports()
        } else {
          const errorData = await response.json()
          toast.error(errorData.error || "Failed to complete")
        }
        return
      }

      // For other status updates, use the regular transportation endpoint
      const response = await fetch(`/api/transportation/${editingTransport.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": storedUser.userId,
        },
        body: JSON.stringify({
          status: editStatus,
        }),
      })

      if (response.ok) {
        toast.success("Status updated successfully")
        setIsEditDialogOpen(false)
        setEditingTransport(null)
        // Refresh data without page reload
        fetchTransports()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to update status")
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("An error occurred. Please try again.")
    }
  }

  const handleExport = () => {
    if (displayTransports.length === 0) {
      toast.error("No data to export")
      return
    }

    // Prepare CSV data
    const headers = [
      "Requester ID",
      "Café",
      "Destination",
      "Type",
      "Quantity (kg)",
      "Status",
      "Pickup Date",
      "Pickup Time",
      "Assigned To",
    ]

    const csvRows = [
      headers.join(","),
      ...displayTransports.map((transport) => {
        const destination = transport.destination || transport.pickupRequest?.requesterName || "Unknown"
        const itemType = transport.wasteType || transport.pickupRequest?.itemName || "Unknown"
        const quantity = transport.quantity || transport.pickupRequest?.quantity || 0
        const cafe = "Green Café"
        const pickupDate = transport.pickupDate ? new Date(transport.pickupDate).toLocaleDateString() : ""
        const pickupTime = transport.pickupWindow?.from && transport.pickupWindow?.to
          ? `${transport.pickupWindow.from} - ${transport.pickupWindow.to}`
          : ""
        const assignedTo = transport.assignedTo || ""

        return [
          `"${transport.formattedRequesterId || transport.businessName ? `${transport.businessName}-${(transport.requesterId || transport.id).substring(0, 6).toUpperCase()}` : (transport.requesterId || transport.id)}"`,
          `"${cafe}"`,
          `"${destination}"`,
          `"${itemType}"`,
          quantity,
          `"${transport.status}"`,
          `"${pickupDate}"`,
          `"${pickupTime}"`,
          `"${assignedTo}"`,
        ].join(",")
      }),
    ]

    // Create CSV content
    const csvContent = csvRows.join("\n")

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `transportation-records-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success("Transportation records exported successfully")
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="pt-20 px-4 pb-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-6 flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-3xl text-foreground mb-1">Transportation Organizer</h1>
              <p className="text-muted-foreground">Manage food waste pickups and deliveries</p>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-yellow-50 to-background border-2 border-yellow-500/20">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="text-3xl font-display font-bold text-foreground mb-1">{scheduledCount}</div>
              <div className="text-sm text-muted-foreground font-medium">Scheduled Pickups</div>
              <div className="text-xs text-muted-foreground mt-1">Upcoming waste collections</div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-background border-2 border-blue-500/20">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="text-3xl font-display font-bold text-foreground mb-1">{inTransitCount}</div>
              <div className="text-sm text-muted-foreground font-medium">In Transit</div>
              <div className="text-xs text-muted-foreground mt-1">Active deliveries in progress</div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-background border-2 border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="text-3xl font-display font-bold text-foreground mb-1">{completedCount}</div>
              <div className="text-sm text-muted-foreground font-medium">Completed Deliveries</div>
              <div className="text-xs text-muted-foreground mt-1">Total finished transports</div>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleOpenScheduleDialog}
            >
              <Truck className="w-4 h-4 mr-2" />
              Schedule Transportation
            </Button>
            <Button variant="outline" className="border-primary/20 hover:bg-primary/5 bg-transparent">
              Update Status
            </Button>
          </div>

          <div className="mb-8">
            {/* Transport Table */}
            <Card className="p-6 bg-card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-xl text-foreground">Transport Requests</h3>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  Export
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left py-3 px-4 font-display font-semibold text-sm text-muted-foreground">
                        Requester ID
                      </th>
                      <th className="text-left py-3 px-4 font-display font-semibold text-sm text-muted-foreground">
                        Café
                      </th>
                      <th className="text-left py-3 px-4 font-display font-semibold text-sm text-muted-foreground">
                        Destination
                      </th>
                      <th className="text-left py-3 px-4 font-display font-semibold text-sm text-muted-foreground">
                        Type
                      </th>
                      <th className="text-left py-3 px-4 font-display font-semibold text-sm text-muted-foreground">
                        Quantity
                      </th>
                      <th className="text-left py-3 px-4 font-display font-semibold text-sm text-muted-foreground">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-display font-semibold text-sm text-muted-foreground">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayTransports.map((transport) => {
                      // Use direct fields from transport, fallback to pickupRequest
                      const destination = transport.destination || transport.pickupRequest?.requesterName || "Unknown"
                      const itemType = transport.wasteType || transport.pickupRequest?.itemName || "Unknown"
                      const quantity = transport.quantity || transport.pickupRequest?.quantity || 0
                      const cafe = "Green Café" // Could be fetched from waste data

                      return (
                        <tr key={transport.id} className="border-b border-border hover:bg-accent/5 transition-colors">
                          <td className="py-4 px-4 font-medium text-foreground">{transport.formattedRequesterId || transport.businessName ? `${transport.businessName}-${(transport.requesterId || transport.id).substring(0, 6).toUpperCase()}` : (transport.requesterId || transport.id)}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <Package className="w-4 h-4 text-primary" />
                              </div>
                              <span className="text-foreground">{cafe}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span className="text-foreground">{destination}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-muted-foreground">{itemType}</td>
                          <td className="py-4 px-4 font-medium text-foreground">{quantity} kg</td>
                          <td className="py-4 px-4">
                            <Badge variant="outline" className={getStatusColor(transport.status)}>
                              <span className="flex items-center gap-1.5">
                                {getStatusIcon(transport.status)}
                                {transport.status}
                              </span>
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              {(transport.status === "pickup-scheduled" || transport.status === "scheduled" || transport.status === "Scheduled") ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleMarkCompleted(transport.id, transport.pickupRequestId)}
                                  className="hover:bg-green-500/10 hover:text-green-600"
                                >
                                  <CheckCircle2 className="w-4 h-4 mr-1" />
                                  Mark as Completed
                                </Button>
                              ) : (
                                <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary">
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(transport)}
                                className="hover:bg-blue-500/10 hover:text-blue-600"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(transport.id)}
                                className="hover:bg-red-500/10 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Additional Stats */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 bg-card border-2 border-border hover:border-primary/20 transition-colors">
              <div className="text-2xl font-display font-bold text-foreground mb-1">48.5 km</div>
              <div className="text-sm text-muted-foreground">Total Distance Today</div>
            </Card>
            <Card className="p-6 bg-card border-2 border-border hover:border-primary/20 transition-colors">
              <div className="text-2xl font-display font-bold text-foreground mb-1">{totalWasteQuantity.toFixed(1)} kg</div>
              <div className="text-sm text-muted-foreground">Total Waste Transported</div>
            </Card>
            <Card className="p-6 bg-card border-2 border-border hover:border-primary/20 transition-colors">
              <div className="text-2xl font-display font-bold text-foreground mb-1">8</div>
              <div className="text-sm text-muted-foreground">Active Partners</div>
            </Card>
            <Card className="p-6 bg-card border-2 border-border hover:border-primary/20 transition-colors">
              <div className="text-2xl font-display font-bold text-foreground mb-1">98%</div>
              <div className="text-sm text-muted-foreground">On-Time Delivery Rate</div>
            </Card>
          </div>
        </div>
      </main>

      {/* Schedule Transportation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule Transportation</DialogTitle>
            <DialogDescription>
              Select an approved pickup request and schedule transportation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Warning if no approved pickups */}
            {!isLoadingApproved && approvedPickups.length === 0 && (
              <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">No Approved Pickups</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    There are no approved pickup requests available. You can still create transportation manually using Admin Override below.
                  </p>
                </div>
              </div>
            )}

            {/* Approved Pickup Selection */}
            <div className="space-y-2">
              <Label htmlFor="pickupSelect">Select Approved Pickup Request *</Label>
              <Select
                value={selectedPickupId}
                onValueChange={handlePickupSelect}
                disabled={isLoadingApproved}
              >
                <SelectTrigger id="pickupSelect">
                  <SelectValue placeholder={isLoadingApproved ? "Loading..." : "Select a pickup request"} />
                </SelectTrigger>
                <SelectContent>
                  {approvedPickups.map((pickup) => (
                    <SelectItem key={pickup.id} value={pickup.id}>
                      <span className="flex flex-col">
                        <span className="font-medium">{pickup.requesterName}</span>
                        <span className="text-xs text-muted-foreground">
                          {pickup.quantity} kg {pickup.wasteType} • {pickup.requesterType === "charity" ? "Charity" : "Farmer"}
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                  <SelectItem value="admin-override" className="border-t mt-2 pt-2">
                    <span className="flex items-center gap-2 text-yellow-600">
                      <AlertTriangle className="w-4 h-4" />
                      Admin Override (Manual Entry)
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Selected Pickup Details */}
            {selectedPickupId && selectedPickupId !== "admin-override" && (
              <Card className="p-4 bg-muted/50">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Requester:</span>
                    <p className="font-medium">{formData.requesterName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <p className="font-medium">{formData.wasteType}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Quantity:</span>
                    <p className="font-medium">{formData.quantity} kg</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Request ID:</span>
                    <p className="font-medium text-xs">{selectedPickupId}</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Manual Entry Fields (for Admin Override) */}
            {isAdminOverride && (
              <>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-700">
                    ⚠️ Admin Override Mode: Enter pickup details manually
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="requesterId">Pickup Request ID *</Label>
                    <Input
                      id="requesterId"
                      placeholder="Enter pickup request ID"
                      value={formData.requesterId}
                      onChange={(e) => setFormData({ ...formData, requesterId: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wasteType">Waste Type *</Label>
                    <Input
                      id="wasteType"
                      placeholder="e.g., Coffee Grounds"
                      value={formData.wasteType}
                      onChange={(e) => setFormData({ ...formData, wasteType: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity (kg) *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="e.g., 15.5"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requesterName">Requester Name *</Label>
                    <Input
                      id="requesterName"
                      placeholder="e.g., Hope Charity"
                      value={formData.requesterName}
                      onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Transportation Schedule</h4>
              
              <div className="space-y-2">
                <Label htmlFor="pickupMethod">Pickup Method *</Label>
                <Select
                  value={formData.pickupMethod}
                  onValueChange={(value: "staff" | "courier") =>
                    setFormData({ ...formData, pickupMethod: value })
                  }
                >
                  <SelectTrigger id="pickupMethod">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="staff">Café staff</SelectItem>
                    <SelectItem value="courier">External courier (Grab / Lalamove)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="assignedTo">Driver / Staff Name *</Label>
                <Input
                  id="assignedTo"
                  placeholder={formData.pickupMethod === "staff" ? "Staff member name" : "Courier name"}
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="pickupDate">Pickup Date *</Label>
                <Input
                  id="pickupDate"
                  type="date"
                  value={formData.pickupDate}
                  onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label>Pickup Time From *</Label>
                  <TimePicker
                    value={formData.pickupWindowFrom || "12:00"}
                    onChange={(value) => setFormData({ ...formData, pickupWindowFrom: value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pickup Time To *</Label>
                  <TimePicker
                    value={formData.pickupWindowTo || "12:00"}
                    onChange={(value) => setFormData({ ...formData, pickupWindowTo: value })}
                  />
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes or instructions..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleSchedulePickup} 
              className="bg-primary hover:bg-primary/90"
              disabled={!selectedPickupId && !isAdminOverride}
            >
              <Truck className="w-4 h-4 mr-2" />
              Schedule Transportation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Status Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
            <DialogDescription>
              Update the status of this transportation record
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editStatus">Status *</Label>
              <Select
                value={editStatus}
                onValueChange={(value: "SCHEDULED" | "IN_TRANSIT" | "COMPLETED" | "CANCELLED") =>
                  setEditStatus(value)
                }
              >
                <SelectTrigger id="editStatus">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {editingTransport && (
              <div className="text-sm text-muted-foreground">
                <p><strong>Requester ID:</strong> {editingTransport.formattedRequesterId || editingTransport.businessName ? `${editingTransport.businessName}-${(editingTransport.requesterId || editingTransport.id).substring(0, 6).toUpperCase()}` : (editingTransport.requesterId || editingTransport.id)}</p>
                <p><strong>Destination:</strong> {editingTransport.destination || "Unknown"}</p>
                <p><strong>Current Status:</strong> {editingTransport.status}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false)
              setEditingTransport(null)
            }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus} className="bg-primary hover:bg-primary/90">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default withAuth(TransportationPage, ["staff"])
