"use client"

import { DashboardNav } from "@/components/dashboard-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Trash2,
  CalendarIcon,
  Droplets,
  Sprout,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Heart,
  BarChart3,
  List,
  Download,
} from "lucide-react"
import Link from "next/link"
import { WasteChart } from "@/components/waste-chart"
import { ActionsPieChart } from "@/components/actions-pie-chart"
import { WhereitWentFunnel } from "@/components/whereitwent-funnel"
import { useState, useEffect, useCallback } from "react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { withAuth } from "@/components/with-auth"
import { toast } from "sonner"
import { Bell } from "lucide-react"
import * as XLSX from "xlsx"

function DashboardPage() {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(2025, 0, 1))
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [isMetric, setIsMetric] = useState(true)
  const [view, setView] = useState<"trends" | "lineItems">("trends")
  const [isLoadingPickups, setIsLoadingPickups] = useState(true)
  const [seenPickupIds, setSeenPickupIds] = useState<Set<string>>(new Set())
  const [unreadPickupCount, setUnreadPickupCount] = useState(0)
  const [newPickupNotices, setNewPickupNotices] = useState<any[]>([])
  const [reportPeriod, setReportPeriod] = useState("monthly")
  const [isExporting, setIsExporting] = useState(false)

  // Live data state
  const [stats, setStats] = useState({
    totalWaste: 0,
    donated: 0,
    composted: 0,
    dropped: 0,
  })
  const [dropAlerts, setDropAlerts] = useState<Array<{
    id: string
    item: string
    quantity: string
    expiryDate: string
    daysLeft: number
  }>>([])
  const [wasteBreakdown, setWasteBreakdown] = useState<Array<{
    name: string
    value: number
    fill: string
  }>>([])
  const [actionsBreakdown, setActionsBreakdown] = useState<Array<{
    name: string
    value: number
    fill: string
    icon: string
  }>>([])
  const [recentLogs, setRecentLogs] = useState<Array<{
    date: string
    type: string
    quantity: string
    action: string
    status: string
  }>>([])

  const [pickupRequests, setPickupRequests] = useState<any[]>([])

  // State for line item entries (fetched from database)
  const [lineItemEntries, setLineItemEntries] = useState<Array<{
    id: string
    date: string
    time: string
    type: string
    subType: string
    quantity: string
    quantityKg: number // Store original kg value for conversion
    action: string
    destination: string
    status: string
    loggedBy: string
    notes: string
    rawWasteType?: string // Store raw waste type for filtering
    rawActionType?: string // Store raw action type for filtering
  }>>([])
  
  // Store all entries (unfiltered) for client-side filtering
  const [allLineItemEntries, setAllLineItemEntries] = useState<Array<{
    id: string
    date: string
    time: string
    type: string
    subType: string
    quantity: string
    quantityKg: number
    action: string
    destination: string
    status: string
    loggedBy: string
    notes: string
    rawWasteType?: string
    rawActionType?: string
  }>>([])


  // Load seen pickup IDs from localStorage
  useEffect(() => {
    const storedSeen = localStorage.getItem("admin-seen-pickups")
    if (storedSeen) {
      try {
        setSeenPickupIds(new Set(JSON.parse(storedSeen)))
      } catch (e) {
        console.error("Error loading seen pickups:", e)
      }
    }
  }, [])

  // Fetch line item entries when view changes to lineItems
  useEffect(() => {
    if (view === "lineItems") {
      fetchLineItemEntries()
    }
  }, [view])
  
  // Update quantities when unit changes
  useEffect(() => {
    if (view === "lineItems" && allLineItemEntries.length > 0) {
      const converted = allLineItemEntries.map(entry => {
        let quantity = entry.quantity
        if (!isMetric && entry.quantityKg) {
          // Convert kg to lbs (1 kg = 2.20462 lbs)
          const lbs = entry.quantityKg * 2.20462
          quantity = `${lbs.toFixed(2)} lbs`
        } else if (entry.quantityKg) {
          quantity = `${entry.quantityKg} kg`
        }
        return { ...entry, quantity }
      })
      setLineItemEntries(converted)
    }
  }, [isMetric, view, allLineItemEntries])

  // Fetch pickup requests from API
  const fetchPickupRequests = async () => {
    try {
      setIsLoadingPickups(true)
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      
      // Try to fetch from admin pickups API
      const response = await fetch("/api/admin/pickups", {
        headers: {
          "Content-Type": "application/json",
          "x-user-id": storedUser.userId || "",
        },
      })

      if (response.ok) {
        let data = await response.json()
        console.log("[Admin Dashboard] Raw API response:", data)
        console.log("[Admin Dashboard] Response type:", typeof data)
        console.log("[Admin Dashboard] Is array?", Array.isArray(data))
        
        // Handle case where API returns { requests: [] } format
        if (data.requests && Array.isArray(data.requests)) {
          data = data.requests
        } else if (!Array.isArray(data)) {
          console.error("[Admin Dashboard] Unexpected response format:", data)
          data = []
        }
        
        console.log("[Admin Dashboard] Number of requests after processing:", data.length)
        console.log("[Admin Dashboard] Requests data:", JSON.stringify(data, null, 2))
        
        // Transform API data to match display format
        const transformed = data.map((req: any) => {
          // Format request ID to follow business name
          const businessName = req.requesterName || "Unknown"
          // Create a short ID from the original request ID (first 6 characters)
          const shortId = req.id.substring(0, 6).toUpperCase()
          // Format: BusinessName-ShortID (e.g., "Hope Charity-A1B2C3")
          const formattedRequestId = `${businessName}-${shortId}`
          
          return {
            id: req.id,
            formattedId: formattedRequestId, // New formatted ID for display
            requester: businessName,
            type: req.requesterType === "charity" ? "Charity" : "Farm",
            wasteType: `${req.itemName} (${req.itemType})`,
            quantity: `${req.quantity} kg`,
            requestedDate: new Date(req.dateRequested).toLocaleDateString(),
            status: req.status.charAt(0).toUpperCase() + req.status.slice(1), // Capitalize first letter
            rawStatus: req.status, // Keep lowercase for API calls
            requesterId: req.requesterId,
            wasteId: req.wasteId,
          }
        })

        setPickupRequests(transformed)

        // Check for new pickup requests (not in seenPickupIds)
        const newPickups = transformed.filter((req: any) => 
          !seenPickupIds.has(req.id) && req.rawStatus === "pending"
        )

        // Calculate unread count (pending requests not yet seen)
        const unreadPickups = transformed.filter((req: any) => 
          req.rawStatus === "pending" && !seenPickupIds.has(req.id)
        )
        setUnreadPickupCount(unreadPickups.length)

        if (newPickups.length > 0) {
          // Update seen pickups
          const updatedSeen = new Set([...seenPickupIds, ...newPickups.map((p: any) => p.id)])
          setSeenPickupIds(updatedSeen)
          localStorage.setItem("admin-seen-pickups", JSON.stringify(Array.from(updatedSeen)))

          // Store inline notifications (inside Pickup Requests box)
          setNewPickupNotices((prev) => {
            // Avoid duplicates if already stored
            const existingIds = new Set(prev.map((n) => n.id))
            const fresh = newPickups.filter((p: any) => !existingIds.has(p.id))
            return [...fresh.map((p: any) => ({
              id: p.id,
              requester: p.requester,
              wasteType: p.wasteType,
              quantity: p.quantity,
            })), ...prev].slice(0, 10) // keep recent up to 10
          })

          // Update unread count after marking as seen
          const remainingUnread = transformed.filter((req: any) => 
            req.rawStatus === "pending" && !updatedSeen.has(req.id)
          ).length
          setUnreadPickupCount(remainingUnread)
        }
      } else {
        const errorText = await response.text()
        let errorMessage = "Failed to load pickup requests"
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.error || errorData.message || errorMessage
        } catch (e) {
          errorMessage = errorText || errorMessage
        }
        
        console.error("[Admin Dashboard] Failed to fetch pickup requests:", response.status, errorMessage)
        console.error("[Admin Dashboard] User from localStorage:", storedUser)
        
        // Only show error toast for non-network errors (401, 403, 500, etc.)
        // Don't clear existing data - keep showing what we have
        if (response.status !== 0) {
          toast.error("Error Loading Pickup Requests", {
            description: errorMessage,
            duration: 6000,
          })
        }
        
        // Don't clear state on error - keep existing data visible
        // Only clear if we get a 401/403 (auth error) or 500 (server error)
        if (response.status === 401 || response.status === 403) {
          setPickupRequests([])
        }
        // For other errors, keep the existing data
      }
    } catch (error) {
      // Network errors (server stopped, connection lost, etc.)
      // Don't clear the data - keep showing what we have
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        console.warn("[Admin Dashboard] Network error (server may be restarting):", error)
        // Don't clear state - keep existing data visible
      } else {
        console.error("[Admin Dashboard] Error fetching pickup requests:", error)
        // Only clear on unexpected errors, not network failures
      }
    } finally {
      setIsLoadingPickups(false)
    }
  }

  // Fetch dashboard stats from unified impact endpoint
  const fetchStats = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      const response = await fetch("/api/stats/impact", {
        headers: {
          "x-user-id": storedUser.userId || "",
        },
      })
      if (response.ok) {
        const data = await response.json()
        // Extract waste stats from unified endpoint
        setStats({
          totalWaste: data.totalWaste || 0,
          donated: data.donated || 0,
          composted: data.composted || 0,
          dropped: data.dropped || 0,
        })
      }
    } catch (error) {
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        console.warn("[Dashboard] Network error fetching stats:", error)
      } else {
        console.error("[Dashboard] Error fetching stats:", error)
      }
    }
  }

  // Fetch drop alerts
  const fetchDropAlerts = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      const response = await fetch("/api/staff/drop-alerts", {
        headers: {
          "x-user-id": storedUser.userId || "",
        },
      })
      if (response.ok) {
        const data = await response.json()
        setDropAlerts(data.alerts || [])
      }
    } catch (error) {
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        console.warn("[Dashboard] Network error fetching drop alerts:", error)
      } else {
        console.error("[Dashboard] Error fetching drop alerts:", error)
      }
    }
  }

  // Fetch waste breakdown for chart
  const fetchWasteBreakdown = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      const response = await fetch("/api/staff/waste-breakdown", {
        headers: {
          "x-user-id": storedUser.userId || "",
        },
      })
      if (response.ok) {
        const data = await response.json()
        setWasteBreakdown(data.data || [])
      }
    } catch (error) {
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        console.warn("[Dashboard] Network error fetching waste breakdown:", error)
      } else {
        console.error("[Dashboard] Error fetching waste breakdown:", error)
      }
    }
  }

  // Fetch actions breakdown for chart
  const fetchActionsBreakdown = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      const response = await fetch("/api/staff/actions-breakdown", {
        headers: {
          "x-user-id": storedUser.userId || "",
        },
      })
      if (response.ok) {
        const data = await response.json()
        setActionsBreakdown(data.data || [])
      }
    } catch (error) {
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        console.warn("[Dashboard] Network error fetching actions breakdown:", error)
      } else {
        console.error("[Dashboard] Error fetching actions breakdown:", error)
      }
    }
  }

  // Fetch recent logs for Recent Activity section
  const fetchRecentLogs = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      const response = await fetch("/api/staff/waste?recent=true", {
        headers: {
          "x-user-id": storedUser.userId || "",
        },
      })
      if (response.ok) {
        const data = await response.json()
        const entries = (data.entries || []).slice(0, 5).map((entry: any) => {
          const actionMap: Record<string, string> = {
            DONATE: "Donated",
            COMPOST: "Composted",
            FARM: "Farm",
            REUSE: "Reuse",
            DROPPED: "Dropped",
          }
          const statusMap: Record<string, string> = {
            PENDING: "Pending",
            COMPLETED: "Completed",
            AVAILABLE: "Pending",
            DROPPED: "Dropped",
          }
          const typeMap: Record<string, string> = {
            EDIBLE: "Food Waste",
            COFFEE_GROUNDS: "Coffee Grounds",
            ORGANIC: "Organic Waste",
            PLATE_WASTE: "Plate Waste",
            EXPIRED: "Expired Food",
            RECYCLABLE: "Recyclable",
          }
          
          return {
            date: entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : "",
            type: typeMap[entry.type?.toUpperCase()] || entry.type || "Unknown",
            quantity: `${entry.quantity} kg`,
            action: actionMap[entry.actionType?.toUpperCase()] || entry.actionType || "Unknown",
            status: statusMap[entry.status?.toUpperCase()] || entry.status || "Pending",
          }
        })
        setRecentLogs(entries)
      }
    } catch (error) {
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        console.warn("[Dashboard] Network error fetching recent logs:", error)
      } else {
        console.error("[Dashboard] Error fetching recent logs:", error)
      }
    }
  }

  // Fetch all dashboard data on mount and set up auto-refresh
  useEffect(() => {
    const fetchAll = () => {
      fetchStats()
      fetchDropAlerts()
      fetchWasteBreakdown()
      fetchActionsBreakdown()
      fetchRecentLogs()
      fetchPickupRequests()
      fetchLineItemEntries()
    }
    
    fetchAll()
    // Refresh every 5 seconds to ensure real-time data
    const interval = setInterval(fetchAll, 5000)
    return () => clearInterval(interval)
  }, [])

  // Download Report (Excel) - Main export with period selection
  const handleDownloadReport = async () => {
    setIsExporting(true)
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      if (!storedUser.userId) {
        toast.error("Please log in again")
        setIsExporting(false)
        return
      }

      // Fetch waste entries data
      const wasteResponse = await fetch("/api/waste?limit=1000", {
        headers: { "x-user-id": storedUser.userId },
      })

      if (!wasteResponse.ok) {
        toast.error("Failed to fetch waste data")
        setIsExporting(false)
        return
      }

      const wasteData = await wasteResponse.json()
      const entries = wasteData.entries || []

      // Get period label
      const periodLabel = reportPeriod.charAt(0).toUpperCase() + reportPeriod.slice(1)

      // Create summary sheet data
      const summaryData = [
        ["REPORTS SUMMARY"],
        ["Period", periodLabel],
        ["Generated", format(new Date(), "yyyy-MM-dd HH:mm")],
        [],
        ["Total Waste (kg)", stats.totalWaste],
        ["Total Donated (kg)", stats.donated],
        ["Total Composted (kg)", stats.composted],
        ["Total Dropped (kg)", stats.dropped],
        [],
        ["WASTE BREAKDOWN BY TYPE"],
        ["Type", "Quantity (kg)"],
        ...wasteBreakdown.map(item => [item.name, item.value]),
        [],
        ["ACTIONS BREAKDOWN"],
        ["Action", "Quantity (kg)"],
        ...actionsBreakdown.map(item => [item.name, item.value]),
      ]

      // Create entries sheet data
      const entriesData = entries.map((entry: any, index: number) => ({
        "Entry ID": `WE-${String(index + 1).padStart(3, "0")}`,
        "Date": entry.date ? format(new Date(entry.date), "yyyy-MM-dd") : "",
        "Waste Type": entry.wasteType || "",
        "Sub-Type": entry.subType || "",
        "Quantity (kg)": entry.quantity || 0,
        "Action": entry.actionType || "",
        "Destination": entry.destination || "",
        "Status": entry.status || "",
        "Notes": entry.notes || "",
      }))

      // Create workbook with multiple sheets
      const wb = XLSX.utils.book_new()
      
      // Summary sheet
      const wsSummary = XLSX.utils.aoa_to_sheet(summaryData)
      wsSummary["!cols"] = [{ wch: 25 }, { wch: 20 }]
      XLSX.utils.book_append_sheet(wb, wsSummary, "Summary")
      
      // Entries sheet
      if (entriesData.length > 0) {
        const wsEntries = XLSX.utils.json_to_sheet(entriesData)
        wsEntries["!cols"] = [
          { wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 15 },
          { wch: 12 }, { wch: 12 }, { wch: 20 }, { wch: 12 }, { wch: 30 }
        ]
        XLSX.utils.book_append_sheet(wb, wsEntries, "Waste Entries")
      }
      
      // Generate filename
      const dateStr = format(new Date(), "yyyy-MM-dd")
      const filename = `waste-report-${reportPeriod}-${dateStr}.xlsx`
      XLSX.writeFile(wb, filename)
      
      toast.success("Report downloaded successfully!")
    } catch (error) {
      console.error("Error exporting report:", error)
      toast.error("Failed to export report")
    } finally {
      setIsExporting(false)
    }
  }

  // Export to Excel - Detailed Line Items
  const handleExportLineItems = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      
      // Fetch all waste entries from API
      const response = await fetch("/api/waste?limit=1000", {
        headers: {
          "x-user-id": storedUser.userId || "",
        },
      })

      if (!response.ok) {
        toast.error("Failed to fetch waste entries for export")
        return
      }

      const data = await response.json()
      const entries = data.entries || []

      if (entries.length === 0) {
        toast.warning("No waste entries to export")
        return
      }

      // Transform entries for Excel
      const excelData = entries.map((entry: any, index: number) => ({
        "Entry ID": `WE-${String(index + 1).padStart(3, "0")}`,
        "Date": entry.date ? format(new Date(entry.date), "yyyy-MM-dd") : "",
        "Time": entry.date ? format(new Date(entry.date), "HH:mm") : "",
        "Waste Type": entry.wasteType || "",
        "Sub-Type": entry.subType || "",
        "Quantity (kg)": entry.quantity || 0,
        "Action": entry.actionType || "",
        "Destination": entry.destination || "",
        "Status": entry.status || "",
        "Notes": entry.notes || "",
      }))

      // Create workbook
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(excelData)
      
      // Set column widths
      ws["!cols"] = [
        { wch: 12 }, // Entry ID
        { wch: 12 }, // Date
        { wch: 8 },  // Time
        { wch: 15 }, // Waste Type
        { wch: 15 }, // Sub-Type
        { wch: 12 }, // Quantity
        { wch: 12 }, // Action
        { wch: 20 }, // Destination
        { wch: 12 }, // Status
        { wch: 30 }, // Notes
      ]
      
      XLSX.utils.book_append_sheet(wb, ws, "Waste Entries")
      
      // Generate filename
      const filename = `waste-entries-${format(new Date(), "yyyy-MM-dd")}.xlsx`
      XLSX.writeFile(wb, filename)
      
      toast.success(`Exported ${entries.length} entries to Excel!`)
    } catch (error) {
      console.error("Error exporting line items:", error)
      toast.error("Failed to export waste entries")
    }
  }

  const handleApprove = async (requestId: string) => {
    const request = pickupRequests.find((r) => r.id === requestId)
    if (!request) return

    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      const response = await fetch(`/api/admin/pickups/${requestId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": storedUser.userId || "",
        },
      })

      if (response.ok) {
        const data = await response.json()
        
        // Update local state
        setPickupRequests((prev) =>
          prev.map((req) =>
            req.id === requestId 
              ? { ...req, status: "Approved", rawStatus: "approved" } 
              : req
          )
        )
        // Remove inline notice for this request
        setNewPickupNotices((prev) => prev.filter((n) => n.id !== requestId))

        // Remove from unread count if it was pending
        if (request.rawStatus === "pending") {
          setUnreadPickupCount((prev) => Math.max(0, prev - 1))
        }

        toast.success("✅ Pickup Request Approved!", {
          description: `The pickup request from "${request.requester}" for "${request.wasteType}" has been approved successfully.`,
          duration: 6000,
          position: "top-center",
        })
      } else {
        const errorData = await response.json()
        toast.error("❌ Approval Failed", {
          description: errorData.error || "Failed to approve pickup request. Please try again.",
          duration: 6000,
          position: "top-center",
        })
      }
    } catch (error) {
      console.error("[Admin Dashboard] Error approving request:", error)
      toast.error("❌ Error", {
        description: "An error occurred while approving the request. Please try again.",
        duration: 6000,
        position: "top-center",
      })
    }
  }

  const handleReject = async (requestId: string) => {
    const request = pickupRequests.find((r) => r.id === requestId)
    if (!request) return

    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      const response = await fetch(`/api/admin/pickups/${requestId}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": storedUser.userId || "",
        },
      })

      if (response.ok) {
        // Update local state
        setPickupRequests((prev) =>
          prev.map((req) =>
            req.id === requestId 
              ? { ...req, status: "Rejected", rawStatus: "rejected" } 
              : req
          )
        )
        // Remove inline notice for this request
        setNewPickupNotices((prev) => prev.filter((n) => n.id !== requestId))

        // Remove from unread count if it was pending
        if (request.rawStatus === "pending") {
          setUnreadPickupCount((prev) => Math.max(0, prev - 1))
        }

        toast.error("❌ Pickup Request Rejected", {
          description: `The pickup request from "${request.requester}" for "${request.wasteType}" has been rejected.`,
          duration: 6000,
          position: "top-center",
        })
      } else {
        const errorData = await response.json()
        toast.error("❌ Rejection Failed", {
          description: errorData.error || "Failed to reject pickup request. Please try again.",
          duration: 6000,
          position: "top-center",
        })
      }
    } catch (error) {
      console.error("[Admin Dashboard] Error rejecting request:", error)
      toast.error("❌ Error", {
        description: "An error occurred while rejecting the request. Please try again.",
        duration: 6000,
        position: "top-center",
      })
    }
  }


  const handleMarkAsDropped = async (itemName: string, quantity: string, alertId: string) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      const userId = storedUser.userId || storedUser.id
      
      if (!userId) {
        toast.error("❌ Error", {
          description: "User not found. Please log in again.",
          duration: 6000,
        })
        return
      }
      
      // Use the drop endpoint
      const response = await fetch(`/api/staff/waste/${alertId}/drop`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({
          dropReason: "expired",
          notes: "Marked as dropped from dashboard drop alerts",
        }),
      })
      
      if (response.ok) {
        // Refresh drop alerts
        fetchDropAlerts()
        // Refresh stats
        fetchStats()
        
        toast.success("✅ Item Marked as Dropped", {
          description: `${itemName} (${quantity}) has been marked as dropped.`,
          duration: 6000,
          position: "top-center",
        })
      } else {
        const errorData = await response.json().catch(() => ({}))
        toast.error("❌ Error", {
          description: errorData.error || "Failed to mark item as dropped. Please try again.",
          duration: 6000,
        })
      }
    } catch (error) {
      console.error("[Dashboard] Error marking as dropped:", error)
      toast.error("❌ Error", {
        description: "Failed to mark item as dropped. Please try again.",
        duration: 6000,
      })
    }
  }

  // Fetch line item entries for the table - fetch ALL entries without filters
  const fetchLineItemEntries = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      
      // Fetch all entries without any filters
      const response = await fetch(`/api/waste?limit=1000`, {
        headers: {
          "x-user-id": storedUser.userId || "",
        },
      })
      if (response.ok) {
        const data = await response.json()
        const entries = (data.entries || []).map((entry: any, index: number) => {
          const wasteTypeMap: Record<string, string> = {
            "EDIBLE": "Food Waste",
            "COFFEE_GROUNDS": "Coffee Grounds",
            "ORGANIC": "Organic Waste",
            "EXPIRED": "Expired Food",
            "RECYCLABLE": "Recyclable",
            "PLATE_WASTE": "Plate Waste",
          }
          const actionMap: Record<string, string> = {
            "DONATE": "Donated",
            "COMPOST": "Composted",
            "FARM": "Farm",
            "REUSE": "Reuse",
            "DROPPED": "Dropped",
          }
          const statusMap: Record<string, string> = {
            "PENDING": "Pending",
            "AVAILABLE": "Available",
            "COMPLETED": "Completed",
            "DROPPED": "Dropped",
          }
          
          const entryDate = entry.date ? new Date(entry.date) : new Date()
          
          // For WASTE TYPE column: prefer mapped waste type, then raw waste type, then item name/subType
          const wasteTypeDisplay = wasteTypeMap[entry.wasteType?.toUpperCase()] 
            || entry.wasteType 
            || entry.itemName 
            || entry.subType 
            || "Unknown"
          
          // For ACTION column: map actionType properly, fallback to action field, then show action type or default
          const rawActionType = entry.actionType || entry.action || ""
          const actionDisplay = rawActionType 
            ? (actionMap[rawActionType.toUpperCase()] || rawActionType.charAt(0).toUpperCase() + rawActionType.slice(1).toLowerCase())
            : "Unknown"
          
          const quantityKg = entry.quantity || 0
          const quantity = isMetric ? `${quantityKg} kg` : `${(quantityKg * 2.20462).toFixed(2)} lbs`
          
          return {
            id: `WE-${String(index + 1).padStart(3, "0")}`,
            date: format(entryDate, "yyyy-MM-dd"),
            time: format(entryDate, "HH:mm"),
            type: wasteTypeDisplay,
            subType: entry.subType || "-",
            quantity: quantity,
            quantityKg: typeof quantityKg === 'number' ? quantityKg : parseFloat(quantityKg) || 0,
            action: actionDisplay,
            destination: entry.destination || "-",
            status: statusMap[entry.status?.toUpperCase()] || entry.status || "Pending",
            loggedBy: entry.loggedByName || "Staff",
            notes: entry.notes || "-",
            rawWasteType: entry.wasteType,
            rawActionType: entry.actionType,
          }
        })
        // Set both filtered and unfiltered entries to the same data (no filtering)
        setAllLineItemEntries(entries)
        setLineItemEntries(entries)
      }
    } catch (error) {
      console.error("[Dashboard] Error fetching line item entries:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="pt-20 px-4 pb-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="font-display font-bold text-3xl text-foreground mb-2">Café Dashboard</h1>
              <p className="text-muted-foreground">Track your waste impact and sustainability efforts</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setView("trends")}
                variant={view === "trends" ? "default" : "outline"}
                className={cn("gap-2", view === "trends" && "bg-primary text-primary-foreground")}
              >
                <BarChart3 className="w-4 h-4" />
                TRACK TRENDS
              </Button>
              <Button
                onClick={() => setView("lineItems")}
                variant={view === "lineItems" ? "default" : "outline"}
                className={cn("gap-2", view === "lineItems" && "bg-primary text-primary-foreground")}
              >
                <List className="w-4 h-4" />
                LINE ITEM ENTRIES
              </Button>
            </div>
          </div>

          {dropAlerts.length > 0 && (
            <Card className="p-6 mb-6 bg-amber-50 border-2 border-amber-200">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-display font-bold text-lg text-amber-900 mb-2">Drop Alerts</h3>
                  <p className="text-sm text-amber-800 mb-3">
                    These items haven't been collected and are approaching expiry. Mark as "Dropped" if needed.
                  </p>
                  <div className="space-y-2">
                    {dropAlerts.map((alert, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white p-3 rounded-lg border border-amber-200"
                      >
                        <div>
                          <span className="font-medium text-foreground">
                            {alert.item} - {alert.quantity}
                          </span>
                          <span className="text-sm text-muted-foreground ml-3">
                            Expires: {alert.expiryDate} ({alert.daysLeft} day{alert.daysLeft > 1 ? "s" : ""} left)
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-amber-300 bg-transparent hover:bg-amber-100"
                          onClick={() => handleMarkAsDropped(alert.item, alert.quantity, alert.id)}
                        >
                          Mark as Dropped
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}


          {view === "trends" ? (
            // Track Trends View - Charts and Analytics
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="p-6 hover:shadow-lg transition-shadow bg-card border-2 border-primary/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                      <Trash2 className="w-6 h-6 text-destructive" />
                    </div>
                  </div>
                  <div className="text-3xl font-display font-bold text-foreground mb-1">{stats.totalWaste.toFixed(1)} kg</div>
                  <div className="text-sm text-muted-foreground font-medium">Total Waste</div>
                  <div className="text-xs text-muted-foreground mt-1">Total waste tracked</div>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow bg-card border-2 border-red-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                      <Heart className="w-6 h-6 text-red-500" />
                    </div>
                  </div>
                  <div className="text-3xl font-display font-bold text-foreground mb-1">{stats.donated.toFixed(1)} kg</div>
                  <div className="text-sm text-muted-foreground font-medium">Donated</div>
                  <div className="text-xs text-muted-foreground mt-1">Edible food to charities</div>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow bg-card border-2 border-secondary/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                      <Sprout className="w-6 h-6 text-secondary" />
                    </div>
                  </div>
                  <div className="text-3xl font-display font-bold text-foreground mb-1">{stats.composted.toFixed(1)} kg</div>
                  <div className="text-sm text-muted-foreground font-medium">Composted</div>
                  <div className="text-xs text-muted-foreground mt-1">Organic waste to farms</div>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow bg-card border-2 border-gray-300/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-500/10 flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-gray-500" />
                    </div>
                  </div>
                  <div className="text-3xl font-display font-bold text-foreground mb-1">{stats.dropped.toFixed(1)} kg</div>
                  <div className="text-sm text-muted-foreground font-medium">Dropped</div>
                  <div className="text-xs text-muted-foreground mt-1">Expired / not collected</div>
                </Card>
              </div>

              <div className="grid lg:grid-cols-3 gap-6 mb-8">
                {/* Waste Impact */}
                <Card className="p-6 bg-card">
                  <h3 className="font-display font-bold text-xl text-foreground mb-6">WASTE IMPACT</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                        <Trash2 className="w-6 h-6 text-destructive" />
                      </div>
                      <div>
                        <div className="text-2xl font-display font-bold text-foreground">{stats.totalWaste.toFixed(1)} kg</div>
                        <div className="text-sm text-muted-foreground">Total Waste</div>
                        <div className="text-xs text-muted-foreground mt-1">Total waste tracked</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                        <Droplets className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <div className="text-2xl font-display font-bold text-foreground">52,400 L</div>
                        <div className="text-sm text-muted-foreground">Water Footprint</div>
                        <div className="text-xs text-muted-foreground mt-1">1.2 Million liters saved</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                        <Sprout className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <div className="text-2xl font-display font-bold text-foreground">215 kg CO₂</div>
                        <div className="text-sm text-muted-foreground">Carbon Footprint</div>
                        <div className="text-xs text-muted-foreground mt-1">0.5 standard carbon units</div>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground pt-4 border-t border-border">
                      These calculations are based on data from the Real Food Impact Calculator
                    </div>
                  </div>
                </Card>

                {/* Kind of Waste Pie Chart */}
                <Card className="p-6 bg-card">
                  <h3 className="font-display font-bold text-xl text-foreground mb-6">KIND OF WASTE</h3>
                  <ActionsPieChart data={actionsBreakdown} />
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Food Waste</span>
                      <span className="font-medium">52% | 15 kg</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Coffee Grounds</span>
                      <span className="font-medium">47% | 69 tons</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Plate Waste</span>
                      <span className="font-medium">2% | 284 kg</span>
                    </div>
                  </div>
                </Card>

                {/* Where It Went Funnel */}
                <Card className="p-6 bg-card">
                  <h3 className="font-display font-bold text-xl text-foreground mb-6">WHERE IT WENT</h3>
                  <WhereitWentFunnel />
                </Card>
              </div>

              {/* Bar Chart - Full Width */}
              <Card className="p-6 mb-8 bg-card">
                <h3 className="font-display font-bold text-xl text-foreground mb-6">Waste Type Breakdown</h3>
                <WasteChart data={wasteBreakdown} />
              </Card>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap gap-3 mb-8">
                {/* Period selector and Download Report button */}
                <Select value={reportPeriod} onValueChange={setReportPeriod}>
                  <SelectTrigger className="w-32 h-10 bg-card">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-10"
                  onClick={handleDownloadReport}
                  disabled={isExporting}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isExporting ? "Exporting..." : "Download Report (Excel)"}
                </Button>
              </div>

              {/* Pickup Requests Table */}
              <Card className="p-6 mb-8 bg-card">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <h3 className="font-display font-bold text-xl text-foreground">Pickup Requests</h3>
                    {unreadPickupCount > 0 && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-600 rounded-full text-sm font-medium">
                        <Bell className="w-4 h-4" />
                        <span>{unreadPickupCount} new</span>
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {isLoadingPickups 
                      ? "Loading..." 
                      : `${pickupRequests.filter((req) => req.rawStatus === "pending").length} pending requests`}
                  </span>
                </div>

                {/* Inline notifications for new pickup requests */}
                {newPickupNotices.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {newPickupNotices.map((n) => (
                      <div
                        key={n.id}
                        className="flex items-center gap-3 rounded-lg border border-border bg-muted/60 px-3 py-2"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                          <Bell className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-foreground">
                            New Pickup Request from {n.requester || "unknown"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Requested pickup for {n.wasteType} ({n.quantity})
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left py-3 px-4 font-display font-semibold text-sm text-muted-foreground">
                          Request ID
                        </th>
                        <th className="text-left py-3 px-4 font-display font-semibold text-sm text-muted-foreground">
                          Requester
                        </th>
                        <th className="text-left py-3 px-4 font-display font-semibold text-sm text-muted-foreground">
                          Type
                        </th>
                        <th className="text-left py-3 px-4 font-display font-semibold text-sm text-muted-foreground">
                          Waste Type
                        </th>
                        <th className="text-left py-3 px-4 font-display font-semibold text-sm text-muted-foreground">
                          Quantity
                        </th>
                        <th className="text-left py-3 px-4 font-display font-semibold text-sm text-muted-foreground">
                          Date
                        </th>
                        <th className="text-left py-3 px-4 font-display font-semibold text-sm text-muted-foreground">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-display font-semibold text-sm text-muted-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoadingPickups ? (
                        <tr>
                          <td colSpan={8} className="py-8 px-4 text-center text-muted-foreground">
                            Loading pickup requests...
                          </td>
                        </tr>
                      ) : pickupRequests.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-8 px-4 text-center text-muted-foreground">
                            No pickup requests at the moment. Requests from farmers and charities will appear here.
                          </td>
                        </tr>
                      ) : (
                        pickupRequests.map((request, index) => (
                          <tr key={request.id || index} className="border-b border-border hover:bg-accent/5 transition-colors">
                            <td className="py-4 px-4 font-medium text-foreground">{request.formattedId || `${request.requester}-${request.id.substring(0, 6).toUpperCase()}`}</td>
                            <td className="py-4 px-4 text-foreground">{request.requester}</td>
                            <td className="py-4 px-4">
                              <span
                                className={cn(
                                  "inline-flex px-3 py-1 rounded-full text-xs font-medium",
                                  request.type === "Charity" && "bg-red-500/10 text-red-600",
                                  request.type === "Farm" && "bg-secondary/10 text-secondary",
                                )}
                              >
                                {request.type}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-foreground">{request.wasteType}</td>
                            <td className="py-4 px-4 font-medium text-foreground">{request.quantity}</td>
                            <td className="py-4 px-4 text-muted-foreground">{request.requestedDate}</td>
                            <td className="py-4 px-4">
                              <span
                                className={cn(
                                  "inline-flex px-3 py-1 rounded-full text-xs font-medium",
                                  request.rawStatus === "pending" && "bg-orange-500/10 text-orange-600",
                                  request.rawStatus === "approved" && "bg-green-500/10 text-green-600",
                                  request.rawStatus === "rejected" && "bg-red-500/10 text-red-600",
                                )}
                              >
                                {request.status}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              {request.rawStatus === "pending" ? (
                              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                <Button
                                  size="sm"
                                  className="bg-primary hover:bg-primary/90 h-8"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleApprove(request.id)
                                  }}
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 bg-transparent border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleReject(request.id)
                                  }}
                                >
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Reject
                                </Button>
                              </div>
                              ) : request.rawStatus === "approved" ? (
                                <Button
                                  size="sm"
                                  disabled
                                  className="bg-green-500/10 text-green-600 border border-green-500/20 h-8 cursor-default"
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Approved
                                </Button>
                              ) : request.rawStatus === "rejected" ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled
                                  className="bg-red-500/10 text-red-600 border border-red-500/20 h-8 cursor-default"
                                >
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Rejected
                                </Button>
                              ) : (
                                <span className="text-sm text-muted-foreground">-</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Recent Activity Table */}
              <Card className="p-6 bg-card">
                <h3 className="font-display font-bold text-xl text-foreground mb-6">Recent Activity</h3>
                <div className="space-y-3">
                  {recentLogs.slice(0, 5).map((log, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            log.action === "Donated"
                              ? "bg-red-100"
                              : log.action === "Composted"
                                ? "bg-green-100"
                                : log.action === "Farm"
                                  ? "bg-secondary/20"
                                  : "bg-gray-100",
                          )}
                        >
                          {log.action === "Donated" ? (
                            <Heart className="w-5 h-5 text-red-600" />
                          ) : log.action === "Composted" || log.action === "Farm" ? (
                            <Sprout className="w-5 h-5 text-secondary" />
                          ) : (
                            <XCircle className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{log.type}</div>
                          <div className="text-sm text-muted-foreground">
                            {log.quantity} • {log.action}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-foreground">{log.date}</div>
                        <div>
                          <span
                            className={cn(
                              "inline-block px-2 py-1 rounded-full text-xs font-medium",
                              log.status === "Completed"
                                ? "bg-green-100 text-green-700"
                                : log.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-100 text-gray-700",
                            )}
                          >
                            {log.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          ) : (
            <>
              <Card className="p-6 mb-6 bg-card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-display font-bold text-xl text-foreground">All Waste Entry Records</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Detailed transaction log of all waste entries with full audit trail
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleExportLineItems}>
                      <Download className="w-4 h-4 mr-2" />
                      Export to Excel
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4 text-sm text-muted-foreground">
                  <span>Showing {lineItemEntries.length} entries</span>
                  <span>•</span>
                  <span>
                    From {format(startDate || new Date(), "dd MMM yyyy")} to{" "}
                    {format(endDate || new Date(), "dd MMM yyyy")}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-y-2 border-border bg-muted/50">
                        <th className="text-left py-3 px-3 font-display font-semibold text-xs text-muted-foreground uppercase">
                          Entry ID
                        </th>
                        <th className="text-left py-3 px-3 font-display font-semibold text-xs text-muted-foreground uppercase">
                          Date & Time
                        </th>
                        <th className="text-left py-3 px-3 font-display font-semibold text-xs text-muted-foreground uppercase">
                          Waste Type
                        </th>
                        <th className="text-left py-3 px-3 font-display font-semibold text-xs text-muted-foreground uppercase">
                          Sub-Type
                        </th>
                        <th className="text-right py-3 px-3 font-display font-semibold text-xs text-muted-foreground uppercase">
                          Quantity
                        </th>
                        <th className="text-left py-3 px-3 font-display font-semibold text-xs text-muted-foreground uppercase">
                          Action
                        </th>
                        <th className="text-left py-3 px-3 font-display font-semibold text-xs text-muted-foreground uppercase">
                          Destination
                        </th>
                        <th className="text-left py-3 px-3 font-display font-semibold text-xs text-muted-foreground uppercase">
                          Status
                        </th>
                        <th className="text-left py-3 px-3 font-display font-semibold text-xs text-muted-foreground uppercase">
                          Logged By
                        </th>
                        <th className="text-left py-3 px-3 font-display font-semibold text-xs text-muted-foreground uppercase">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {lineItemEntries.map((entry, index) => (
                        <tr key={index} className="border-b border-border hover:bg-accent/10 transition-colors">
                          <td className="py-4 px-3 text-sm font-mono font-medium text-primary">{entry.id}</td>
                          <td className="py-4 px-3 text-sm text-foreground whitespace-nowrap">
                            <div>{entry.date}</div>
                            <div className="text-xs text-muted-foreground">{entry.time}</div>
                          </td>
                          <td className="py-4 px-3 text-sm text-foreground">{entry.type}</td>
                          <td className="py-4 px-3 text-sm text-muted-foreground">{entry.subType}</td>
                          <td className="py-4 px-3 text-sm text-foreground text-right font-medium">{entry.quantity}</td>
                          <td className="py-4 px-3 text-sm">
                            <span
                              className={cn(
                                "inline-block px-2 py-1 rounded-md text-xs font-medium",
                                entry.action === "Donated"
                                  ? "bg-red-100 text-red-700"
                                  : entry.action === "Composted"
                                    ? "bg-green-100 text-green-700"
                                    : entry.action === "Farm"
                                      ? "bg-secondary/20 text-secondary"
                                      : "bg-gray-100 text-gray-700",
                              )}
                            >
                              {entry.action}
                            </span>
                          </td>
                          <td className="py-4 px-3 text-sm text-foreground">{entry.destination}</td>
                          <td className="py-4 px-3 text-sm">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                                entry.status === "Completed"
                                  ? "bg-green-100 text-green-700"
                                  : entry.status === "Pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-gray-100 text-gray-700",
                              )}
                            >
                              {entry.status === "Completed" && <CheckCircle className="w-3 h-3" />}
                              {entry.status === "Pending" && <AlertTriangle className="w-3 h-3" />}
                              {entry.status === "Dropped" && <XCircle className="w-3 h-3" />}
                              {entry.status}
                            </span>
                          </td>
                          <td className="py-4 px-3 text-sm text-muted-foreground">{entry.loggedBy}</td>
                          <td className="py-4 px-3 text-sm text-muted-foreground max-w-xs truncate">{entry.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 flex items-center justify-between pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    Page 1 of 1 • Total entries: {lineItemEntries.length}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      Next
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Summary Stats for Line Items View */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 bg-card border-l-4 border-l-primary">
                  <div className="text-2xl font-display font-bold text-foreground">10</div>
                  <div className="text-sm text-muted-foreground">Total Entries</div>
                </Card>
                <Card className="p-4 bg-card border-l-4 border-l-green-500">
                  <div className="text-2xl font-display font-bold text-foreground">7</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </Card>
                <Card className="p-4 bg-card border-l-4 border-l-yellow-500">
                  <div className="text-2xl font-display font-bold text-foreground">2</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </Card>
                <Card className="p-4 bg-card border-l-4 border-l-gray-500">
                  <div className="text-2xl font-display font-bold text-foreground">1</div>
                  <div className="text-sm text-muted-foreground">Dropped</div>
                </Card>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default withAuth(DashboardPage, ["staff"])
