"use client"

import { PublicNav } from "@/components/public-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Calendar, MapPin, CheckCircle, Mail, Bell, X } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"

export default function CharityPortalPage() {
  const [requestedItems, setRequestedItems] = useState<string[]>([])
  const [availableFood, setAvailableFood] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [note, setNote] = useState("")
  const [myRequests, setMyRequests] = useState<any[]>([])
  const [showMyRequests, setShowMyRequests] = useState(false)
  const [myRequestsError, setMyRequestsError] = useState<string | null>(null)
  const [sortOption, setSortOption] = useState<"none" | "expiry" | "quantity">("none")
  const [showPickupCoordination, setShowPickupCoordination] = useState<Record<string, boolean>>({})
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [seenItemIds, setSeenItemIds] = useState<Set<string>>(new Set())

  // Load seen items from localStorage on mount
  useEffect(() => {
    const storedSeen = localStorage.getItem("charity-seen-items")
    if (storedSeen) {
      try {
        setSeenItemIds(new Set(JSON.parse(storedSeen)))
      } catch (e) {
        console.error("Error loading seen items:", e)
      }
    }
  }, [])

  // Mark notification as read
  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    )
  }

  // Update unread count when notifications change
  useEffect(() => {
    const unread = notifications.filter((n) => !n.read).length
    setUnreadCount(unread)
  }, [notifications])

  useEffect(() => {
    const fetchAvailableFood = async () => {
      try {
        setIsLoading(true)
        
        // Use marketplace endpoint ONLY
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
        const userId = storedUser.userId || "u-charity-1" // Default charity user for public portal
        
        const response = await fetch("/api/marketplace/waste", {
          headers: {
            "x-user-id": userId,
          },
        })
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error("Failed to fetch available food:", response.status, errorText)
          setFetchError("Could not load available food. Please try again.")
          setIsLoading(false)
          return
        }
        
        const data = await response.json()
        console.log("[Charity Portal] Received data from API:", data)
        console.log("[Charity Portal] Number of items received:", data.length)
        
        // Transform API data to match display format
        let transformed = data.map((item: any) => {
          // Parse expiry date - handle both ISO strings and date strings
          let expiryDate = "N/A"
          if (item.expiryDate) {
            try {
              // If it's already a date string (YYYY-MM-DD), use it directly
              if (item.expiryDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
                expiryDate = item.expiryDate
              } else {
                // Otherwise parse it
                expiryDate = new Date(item.expiryDate).toISOString().split("T")[0]
              }
            } catch (e) {
              expiryDate = item.expiryDate
            }
          }
          
          return {
            id: item.id,
            cafeId: item.cafeId || item.business?.id,
            cafe: item.cafeName || item.business?.name || "Green Café",
            item: item.itemName,
            quantity: typeof item.quantity === "number" ? `${item.quantity} kg` : item.quantity,
            expiry: expiryDate,
            rawExpiry: item.expiryDate,
            description: item.description || item.notes,
            location: item.business?.address || "123 Main St, Downtown",
            distance: "2.3 km", // Default distance
            cafeContact: item.cafeContact || null,
          }
        })

        // Apply client-side sorting
        transformed = transformed.sort((a: any, b: any) => {
          if (sortOption === "expiry") {
            const aDate = a.rawExpiry ? new Date(a.rawExpiry).getTime() : Number.MAX_SAFE_INTEGER
            const bDate = b.rawExpiry ? new Date(b.rawExpiry).getTime() : Number.MAX_SAFE_INTEGER
            return aDate - bDate
          }
          if (sortOption === "quantity") {
            const aQty = Number(a.quantity.replace(" kg", "")) || 0
            const bQty = Number(b.quantity.replace(" kg", "")) || 0
            return bQty - aQty
          }
          return 0
        })

        console.log("[Charity Portal] Transformed items:", transformed)
        console.log("[Charity Portal] Setting availableFood with", transformed.length, "items")
        
        // Check for new items (items not in seenItemIds)
        const newItems = transformed.filter((item: any) => !seenItemIds.has(item.id))
        
        if (newItems.length > 0) {
          // Create notifications for new items
          const newNotifications = newItems.map((item: any) => ({
            id: `notif-${item.id}`,
            title: `New ${item.item} Available`,
            message: `${item.quantity} of ${item.item} from ${item.cafe} is now available for pickup`,
            wasteId: item.id,
            read: false,
            createdAt: new Date().toISOString(),
          }))
          
          setNotifications((prev) => {
            // Add new notifications, avoiding duplicates
            const existingIds = new Set(prev.map((n) => n.id))
            const uniqueNew = newNotifications.filter((n: { id: string }) => !existingIds.has(n.id))
            return [...uniqueNew, ...prev]
          })
          
          // Update seen items
          const updatedSeen = new Set([...seenItemIds, ...newItems.map((item: any) => item.id)])
          setSeenItemIds(updatedSeen)
          localStorage.setItem("charity-seen-items", JSON.stringify(Array.from(updatedSeen)))
          
          console.log(`[Charity Portal] Found ${newItems.length} new items, created notifications`)
        }
        
        setAvailableFood(transformed)
        setFetchError(null)
      } catch (error) {
        console.error("Error fetching available food:", error)
        const isNetwork = error instanceof TypeError && error.message === "Failed to fetch"
        setFetchError(
          isNetwork
            ? "Cannot reach the server. Is the dev server running?"
            : "Unexpected error while loading food items."
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchAvailableFood()
    // Refresh every 5 seconds to show new items
    const interval = setInterval(fetchAvailableFood, 5000)
    return () => clearInterval(interval)
  }, [sortOption, seenItemIds])

  // Fetch user's requests
  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
        const requesterId = storedUser.userId || "u-charity-1"
        
        const response = await fetch("/api/charity/requests", {
          headers: {
            "x-user-id": requesterId,
          },
        })
        
        if (response.ok) {
          const data = await response.json()
          // API now includes waste details in the response
          setMyRequests(data)
          setMyRequestsError(null)
        } else {
          const errorText = await response.text()
          console.error("Failed to fetch my requests:", response.status, errorText)
          setMyRequestsError("Could not load your requests. Please try again.")
        }
      } catch (error) {
        console.error("Error fetching my requests:", error)
        const isNetwork = error instanceof TypeError && error.message === "Failed to fetch"
        setMyRequestsError(
          isNetwork
            ? "Cannot reach the server. Is the dev server running?"
            : "Unexpected error while loading your requests."
        )
      }
    }

    fetchMyRequests()
    // Refresh every 5 seconds
    const interval = setInterval(fetchMyRequests, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleRequestClick = (food: any) => {
    setSelectedItem(food)
    setIsDialogOpen(true)
  }

  const handleSubmitRequest = async () => {
    if (!selectedItem) return

    try {
      // Get user from localStorage (if available) or use a default charity user
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      const charityId = storedUser.userId || "u-charity-1" // Default charity user for demo

      const response = await fetch("/api/charity/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": charityId,
        },
        body: JSON.stringify({
          charityId: charityId,
          itemId: selectedItem.id,
          cafeId: selectedItem.cafeId,
          status: "pending",
          note: note || undefined,
        }),
      })

      if (response.ok) {
        toast.success("Pickup request submitted successfully", {
          description: `Your request for "${selectedItem.item}" has been sent. The café will review and coordinate the pickup time with you.`,
          duration: 6000,
          position: "top-center",
        })
        // Update the specific item in the list to show "Pending Approval" status
        // DO NOT refresh the list - keep all items visible
        setAvailableFood((prev) =>
          prev.map((item) =>
            item.id === selectedItem.id
              ? { ...item, requestStatus: "pending" }
              : item
          )
        )
        
        setRequestedItems([...requestedItems, selectedItem.id])
        setIsDialogOpen(false)
        setNote("")
        setSelectedItem(null)
        // DO NOT refresh available items - this would remove the item from the list
      } else {
        const errorData = await response.json()
        toast.error("❌ Request Failed", {
          description: errorData.error || "Failed to send pickup request. Please try again.",
          duration: 6000,
          position: "top-center",
        })
      }
    } catch (error) {
      console.error("Error submitting request:", error)
      toast.error("❌ Error", {
        description: "Something went wrong. Please try again.",
        duration: 6000,
        position: "top-center",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      <main className="pt-24 px-4 pb-12">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
              <Heart className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="font-display font-bold text-4xl text-foreground mb-3">Charity Portal</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse available edible food from local cafés and request pickups to help your community
            </p>
          </div>

          <Card className="p-6 mb-8 bg-blue-50 border-blue-200">
            <h3 className="font-display font-bold text-lg text-blue-900 mb-2">How It Works</h3>
            <ol className="space-y-2 text-sm text-blue-800">
              <li>1. Browse edible food available from cafés below</li>
              <li>2. Click "Request Pickup" for items your organization needs</li>
              <li>3. Wait for café admin approval (usually within 24 hours)</li>
              <li>4. Once approved, coordinate pickup time with the café</li>
            </ol>
          </Card>

          {/* Notifications Banner */}
          {unreadCount > 0 && (
            <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-blue-900">
                      {unreadCount} New Notification{unreadCount !== 1 ? "s" : ""}
                    </h3>
                    <p className="text-sm text-blue-700">
                      New edible food items are available for pickup!
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Mark all as read
                    notifications
                      .filter((n) => !n.read)
                      .forEach((n) => markAsRead(n.id))
                  }}
                >
                  Mark all as read
                </Button>
              </div>
              {/* Show latest notifications */}
              <div className="mt-4 space-y-2">
                {notifications
                  .filter((n) => !n.read)
                  .slice(0, 3)
                  .map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start justify-between p-3 bg-white rounded-lg border border-blue-100"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="ml-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
              </div>
            </Card>
          )}

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-2xl text-foreground mb-4">
                {showMyRequests ? "My Pickup Requests" : "Available Edible Food"}
              </h2>
              <p className="text-muted-foreground">
                {showMyRequests
                  ? `${myRequests.length} request${myRequests.length !== 1 ? "s" : ""}`
                  : isLoading
                    ? "Loading..."
                    : `${availableFood.length} item${availableFood.length !== 1 ? "s" : ""} available for pickup`}
              </p>
            </div>
            <div className="flex gap-3">
              {!showMyRequests && (
                <Select
                  value={sortOption}
                  onValueChange={(value) => setSortOption(value as typeof sortOption)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sort: None</SelectItem>
                    <SelectItem value="expiry">Sort: Closest Expiry</SelectItem>
                    <SelectItem value="quantity">Sort: Largest Quantity</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <Button
                variant={showMyRequests ? "default" : "outline"}
                onClick={() => setShowMyRequests(!showMyRequests)}
              >
                {showMyRequests ? "Browse Available Food" : "View My Requests"}
              </Button>
            </div>
          </div>

          {fetchError ? (
            <Card className="p-6">
              <p className="text-center text-muted-foreground">{fetchError}</p>
            </Card>
          ) : showMyRequests ? (
            // My Requests View
            myRequestsError ? (
              <Card className="p-6">
                <p className="text-center text-muted-foreground">{myRequestsError}</p>
              </Card>
            ) : myRequests.length === 0 ? (
              <Card className="p-6">
                <p className="text-center text-muted-foreground">You haven't made any pickup requests yet.</p>
              </Card>
            ) : (
              <div className="grid gap-6">
                {myRequests.map((request) => (
                  <Card key={request.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                            <Heart className="w-6 h-6 text-red-500" />
                          </div>
                          <div>
                            <h3 className="font-display font-bold text-xl text-foreground">{request.itemName || "Unknown Item"}</h3>
                            <p className="text-sm text-muted-foreground">{request.cafeName || "Green Café"}</p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <span className="text-sm">
                              Quantity: <span className="font-medium text-foreground">{request.quantity || 0} kg</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">
                              Requested: <span className="font-medium text-foreground">
                                {new Date(request.requestedAt).toLocaleDateString()}
                              </span>
                            </span>
                          </div>
                        </div>

                        {request.preferredTime && (
                          <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm font-medium text-blue-900 mb-1">Preferred Pickup Time:</p>
                            <p className="text-sm text-blue-800">{request.preferredTime}</p>
                          </div>
                        )}

                        {request.notes && (
                          <div className="mb-3">
                            <p className="text-sm text-muted-foreground">Notes: {request.notes}</p>
                          </div>
                        )}

                        <div className="mt-4 flex items-center gap-3 flex-wrap">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                              request.status === "approved"
                                ? "bg-green-500/10 text-green-600 border border-green-500/20"
                                : request.status === "rejected"
                                  ? "bg-red-500/10 text-red-600 border border-red-500/20"
                                  : request.status === "collected"
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                            }`}
                          >
                            {request.status === "approved" && <CheckCircle className="w-3 h-3" />}
                            <span className="capitalize">{request.status}</span>
                          </span>
                          
                          {/* Show café contact beside approved status */}
                          {request.status === "approved" && request.cafeContact && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="text-muted-foreground">•</span>
                              <span className="font-medium text-foreground">Contact:</span>
                              <span>{request.cafeContact.name || "Café Admin"}</span>
                              {request.cafeContact.email && (
                                <>
                                  <span className="text-muted-foreground">•</span>
                                  <a 
                                    href={`mailto:${request.cafeContact.email}`} 
                                    className="text-primary hover:underline"
                                  >
                                    {request.cafeContact.email}
                                  </a>
                                </>
                              )}
                            </div>
                          )}
                        </div>

                        {request.status === "approved" && !request.pickupWindow && (
                          <div className="mt-4 space-y-3">
                            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                              <p className="text-sm font-medium text-green-900 mb-1">✅ Request Approved!</p>
                              <p className="text-sm text-green-800">
                                Please coordinate the final pickup time with the café. Your preferred time was: {request.preferredTime || "Not specified"}
                              </p>
                            </div>
                            
                            {/* Button to show Pickup Coordination */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowPickupCoordination(prev => ({
                                ...prev,
                                [request.id]: !prev[request.id]
                              }))}
                              className="w-full sm:w-auto"
                            >
                              <MapPin className="w-4 h-4 mr-2" />
                              {showPickupCoordination[request.id] ? "Hide" : "Show"} Pickup Coordination
                            </Button>
                            
                            {/* Pickup Coordination Section */}
                            {showPickupCoordination[request.id] && (
                            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                              <div className="flex items-center gap-2 mb-4">
                                <MapPin className="w-5 h-5 text-amber-700" />
                                <p className="text-base font-bold text-amber-900">Pickup Coordination</p>
                              </div>
                              <div className="space-y-3 text-sm">
                                <div className="flex items-start gap-2">
                                  <span className="text-amber-700">📍</span>
                                  <div>
                                    <span className="font-medium text-amber-900">Café: </span>
                                    <span className="text-amber-800">{request.cafeName || "Green Café"}</span>
                                  </div>
                                </div>
                                <div className="flex items-start gap-2">
                                  <span className="text-amber-700">⏰</span>
                                  <div>
                                    <span className="font-medium text-amber-900">Pickup Window: </span>
                                    <span className="text-amber-800">Within 24 hours of approval</span>
                                  </div>
                                </div>
                                {request.cafeContact ? (
                                  <div className="space-y-2">
                                    <div className="flex items-start gap-2">
                                      <span className="text-amber-700">📞</span>
                                      <div>
                                        <span className="font-medium text-amber-900">Contact Person: </span>
                                        <span className="text-amber-800">{request.cafeContact.name || "Café Admin"}</span>
                                      </div>
                                    </div>
                                    {request.cafeContact.email && (
                                      <div className="flex items-start gap-2">
                                        <span className="text-amber-700">✉️</span>
                                        <div>
                                          <span className="font-medium text-amber-900">Email: </span>
                                          <a 
                                            href={`mailto:${request.cafeContact.email}`} 
                                            className="text-amber-700 hover:underline font-medium"
                                          >
                                            {request.cafeContact.email}
                                          </a>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="flex items-start gap-2">
                                    <span className="text-amber-700">📞</span>
                                    <div>
                                      <span className="font-medium text-amber-900">Contact Person: </span>
                                      <span className="text-amber-800">Café Admin</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="mt-4 pt-3 border-t border-amber-200">
                                <p className="text-sm text-amber-800 italic">
                                  Please contact the café to arrange pickup time.
                                </p>
                              </div>
                            </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )
          ) : isLoading ? (
            <Card className="p-6">
              <p className="text-center text-muted-foreground">Loading available food items...</p>
            </Card>
          ) : availableFood.length === 0 ? (
            <div className="space-y-6">
              <Card className="p-12 text-center">
                <p className="text-muted-foreground mb-6">No edible food items available at the moment. Check back later!</p>
              </Card>
              
              {/* Show requesting collection items */}
              {myRequests.length > 0 && (
                <div>
                  <h3 className="font-display font-bold text-xl text-foreground mb-4">
                    Requesting Collection ({myRequests.filter((r: any) => r.status === "pending" || r.status === "approved").length})
                  </h3>
                  <div className="grid gap-6">
                    {myRequests
                      .filter((request: any) => request.status === "pending" || request.status === "approved")
                      .map((request: any) => (
                        <Card key={request.id} className="p-6 hover:shadow-lg transition-shadow">
                          <div className="flex items-start justify-between gap-6">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                                  <Heart className="w-6 h-6 text-red-500" />
                                </div>
                                <div>
                                  <h3 className="font-display font-bold text-xl text-foreground">{request.itemName || "Unknown Item"}</h3>
                                  <p className="text-sm text-muted-foreground">{request.cafeName || "Green Café"}</p>
                                </div>
                              </div>

                              <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <span className="text-sm">
                                    Quantity: <span className="font-medium text-foreground">{request.quantity || 0} kg</span>
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Calendar className="w-4 h-4" />
                                  <span className="text-sm">
                                    Requested: <span className="font-medium text-foreground">
                                      {new Date(request.requestedAt).toLocaleDateString()}
                                    </span>
                                  </span>
                                </div>
                              </div>

                              {request.preferredTime && (
                                <div className="mb-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                  <p className="text-sm font-medium text-green-900 mb-1">Preferred Collection Time:</p>
                                  <p className="text-sm text-green-800">{request.preferredTime}</p>
                                </div>
                              )}

                              {request.notes && (
                                <div className="mb-3">
                                  <p className="text-sm text-muted-foreground">Notes: {request.notes}</p>
                                </div>
                              )}

                              <div className="mt-4 flex items-center gap-3 flex-wrap">
                                <span
                                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                                    request.status === "approved"
                                      ? "bg-green-500/10 text-green-600 border border-green-500/20"
                                      : request.status === "rejected"
                                        ? "bg-red-500/10 text-red-600 border border-red-500/20"
                                        : request.status === "collected"
                                          ? "bg-primary/10 text-primary border border-primary/20"
                                          : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                                  }`}
                                >
                                  {request.status === "approved" && <CheckCircle className="w-3 h-3" />}
                                  <span className="capitalize">{request.status}</span>
                                </span>
                                
                                {/* Show café contact beside approved status */}
                                {request.status === "approved" && request.cafeContact && (
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span className="text-muted-foreground">•</span>
                                    <span className="font-medium text-foreground">Contact:</span>
                                    <span>{request.cafeContact.name || "Café Admin"}</span>
                                    {request.cafeContact.email && (
                                      <>
                                        <span className="text-muted-foreground">•</span>
                                        <a 
                                          href={`mailto:${request.cafeContact.email}`} 
                                          className="text-primary hover:underline"
                                        >
                                          {request.cafeContact.email}
                                        </a>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>

                              {request.status === "approved" && !request.pickupWindow && (
                                <div className="mt-4 space-y-3">
                                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                    <p className="text-sm font-medium text-green-900 mb-1">✅ Request Approved!</p>
                                    <p className="text-sm text-green-800">
                                      Please coordinate the final collection time with the café. Your preferred time was: {request.preferredTime || "Not specified"}
                                    </p>
                                  </div>
                                  
                                  {/* Button to show Pickup Coordination */}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowPickupCoordination(prev => ({
                                      ...prev,
                                      [request.id]: !prev[request.id]
                                    }))}
                                    className="w-full sm:w-auto"
                                  >
                                    <MapPin className="w-4 h-4 mr-2" />
                                    {showPickupCoordination[request.id] ? "Hide" : "Show"} Pickup Coordination
                                  </Button>
                                  
                                  {/* Pickup Coordination Section */}
                                  {showPickupCoordination[request.id] && (
                                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                                    <div className="flex items-center gap-2 mb-3">
                                      <MapPin className="w-5 h-5 text-amber-700" />
                                      <p className="text-sm font-bold text-amber-900">Pickup Instructions</p>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                      <div>
                                        <span className="font-medium text-amber-900">Location:</span>
                                        <span className="text-amber-800 ml-2">{request.cafeName || "Green Café"}</span>
                                      </div>
                                      <div>
                                        <span className="font-medium text-amber-900">Pickup Window:</span>
                                        <span className="text-amber-800 ml-2">Within 24 hours of approval</span>
                                      </div>
                                      {request.cafeContact && (
                                        <div>
                                          <span className="font-medium text-amber-900">Contact Person:</span>
                                          <div className="text-amber-800 ml-2 mt-1">
                                            <p>{request.cafeContact.name || "Café Staff"}</p>
                                            {request.cafeContact.email && (
                                              <p className="text-xs flex items-center gap-1">
                                                <Mail className="w-3 h-3" />
                                                <a href={`mailto:${request.cafeContact.email}`} className="text-amber-700 hover:underline">
                                                  {request.cafeContact.email}
                                                </a>
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                      {!request.cafeContact && (
                                        <div>
                                          <span className="font-medium text-amber-900">Contact Person:</span>
                                          <span className="text-amber-800 ml-2">Please contact the café directly</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  )}
                                </div>
                              )}

                              {request.status === "scheduled" && request.pickupWindow && (
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                  <p className="text-sm font-medium text-blue-900 mb-1">📅 Pickup Scheduled!</p>
                                  <p className="text-sm text-blue-800">
                                    Date: {request.pickupWindow.date}
                                  </p>
                                  <p className="text-sm text-blue-800">
                                    Time: {request.pickupWindow.from} - {request.pickupWindow.to}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-6">
              {availableFood.map((food) => (
              <Card key={food.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                        <Heart className="w-6 h-6 text-red-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display font-bold text-xl text-foreground">{food.item}</h3>
                        <p className="text-sm text-muted-foreground">{food.cafe}</p>
                        {food.cafeContact && (
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="font-medium">📞 Contact:</span>
                              <span>{food.cafeContact.name || "Café Admin"}</span>
                            </div>
                            {food.cafeContact.email && (
                              <div className="flex items-center gap-2 text-xs">
                                <span className="text-muted-foreground">✉️ Email:</span>
                                <a 
                                  href={`mailto:${food.cafeContact.email}`} 
                                  className="text-primary hover:underline"
                                >
                                  {food.cafeContact.email}
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          Expires: <span className="font-medium text-foreground">{food.expiry}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">
                          <span className="font-medium text-foreground">{food.distance}</span> away
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm text-muted-foreground">Quantity:</span>
                      <span className="font-bold text-lg text-foreground">{food.quantity}</span>
                    </div>

                    {food.description && (
                      <p className="text-sm text-muted-foreground mb-2">{food.description}</p>
                    )}
                    <p className="text-sm text-muted-foreground">{food.location}</p>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    {food.requestStatus === "pending" || requestedItems.includes(food.id) ? (
                      <Button disabled className="bg-gray-400 text-white cursor-not-allowed">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Pending Approval
                      </Button>
                    ) : (
                      <Button onClick={() => handleRequestClick(food)} className="bg-red-500 hover:bg-red-600 text-white">
                        <Heart className="w-4 h-4 mr-2" />
                        Request Pickup
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
              ))}
            </div>
          )}

          {/* Pickup Request Confirmation Modal */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Confirm Pickup Request</DialogTitle>
                <DialogDescription>
                  Request pickup for {selectedItem?.item} from {selectedItem?.cafe}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="note">Note (Optional)</Label>
                  <Textarea
                    id="note"
                    placeholder="e.g., Please pack separately"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitRequest} className="bg-red-500 hover:bg-red-600 text-white">
                  <Heart className="w-4 h-4 mr-2" />
                  Confirm Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  )
}
