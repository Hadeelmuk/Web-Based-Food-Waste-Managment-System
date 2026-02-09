"use client"

import { useState, useEffect, useMemo } from "react"
import { Heart, Calendar, MapPin, CheckCircle, History } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { RoleTopbar } from "@/components/role-topbar"
import { withAuth } from "@/components/with-auth"
import { toast } from "sonner"

function CharityDashboardPage({ user }: { user: any }) {
  const [availableFood, setAvailableFood] = useState<any[]>([])
  const [myRequests, setMyRequests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"approved" | "request" | "history">("approved")
  const [historyFilter, setHistoryFilter] = useState<"all" | "weekly" | "monthly" | "yearly">("all")

  // Fetch available edible food from marketplace
  const fetchAvailableFood = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      if (!storedUser.userId) return

      const response = await fetch("/api/marketplace/waste", {
        headers: {
          "x-user-id": storedUser.userId,
        },
      })

      console.log(`[Charity Dashboard] API Response status:`, response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log(`[Charity Dashboard] Received ${data.length} items from API:`, data)
        console.log(`[Charity Dashboard] Sample items:`, data.slice(0, 3).map((item: any) => ({
          id: item.id,
          itemName: item.itemName,
          status: item.status,
          availableFor: item.availableFor,
          wasteType: item.type,
        })))
        setAvailableFood(data)
      } else {
        // Fallback to old endpoint if marketplace fails
        const fallbackResponse = await fetch("/api/charity/available", {
          headers: {
            "x-user-id": storedUser.userId,
          },
        })
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json()
          setAvailableFood(fallbackData)
        }
      }
    } catch (error) {
      console.error("Error fetching available food:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch my pickup requests
  const fetchMyRequests = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      if (!storedUser.userId) return

      const response = await fetch("/api/charity/requests", {
        headers: {
          "x-user-id": storedUser.userId,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setMyRequests(data)
      }
    } catch (error) {
      console.error("Error fetching my requests:", error)
    }
  }

  useEffect(() => {
    fetchAvailableFood()
    fetchMyRequests()

    // Auto-refresh every 5 seconds
    const interval = setInterval(() => {
      fetchAvailableFood()
      fetchMyRequests()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleRequestPickup = async (wasteId: string, itemName: string) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      if (!storedUser.userId) {
        toast.error("Please log in again")
        return
      }

      const response = await fetch("/api/charity/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": storedUser.userId,
        },
        body: JSON.stringify({
          wasteId,
          requesterId: storedUser.userId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Pickup Requested", {
          description: `Your request for ${itemName} has been submitted. Waiting for admin approval.`,
        })
        // Refresh lists
        fetchAvailableFood()
        fetchMyRequests()
        // Switch to My Requests tab to show the pending request
        setActiveTab("approved")
      } else {
        toast.error(data.error || "Failed to request pickup")
      }
    } catch (error) {
      console.error("Error requesting pickup:", error)
      toast.error("An error occurred. Please try again.")
    }
  }

  const requestedWasteIds = new Set(myRequests.map((r) => r.wasteId))
  
  // Filter out completed requests from active requests
  const activeRequests = useMemo(() => {
    return myRequests.filter((r) => r.status !== "completed")
  }, [myRequests])
  
  // Get completed requests for history
  const completedRequests = useMemo(() => {
    return myRequests.filter((r) => r.status === "completed")
  }, [myRequests])
  
  // Filter history by time period
  const filteredHistory = useMemo(() => {
    if (historyFilter === "all") return completedRequests
    
    const now = new Date()
    let startDate: Date
    
    if (historyFilter === "weekly") {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    } else if (historyFilter === "monthly") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    } else if (historyFilter === "yearly") {
      startDate = new Date(now.getFullYear(), 0, 1)
    } else {
      return completedRequests
    }
    
    return completedRequests.filter((r) => {
      if (!r.completedAt) return false
      const completedDate = new Date(r.completedAt)
      return completedDate >= startDate
    })
  }, [completedRequests, historyFilter])

  return (
    <div className="min-h-screen bg-background">
      <RoleTopbar title="Charity Portal" />

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

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "approved" | "request" | "history")} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="approved" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                My Requests
                {activeRequests.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 text-xs bg-green-500 text-white rounded-full">
                    {activeRequests.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="request" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Request Collection
                {availableFood.filter((f) => !requestedWasteIds.has(f.id)).length > 0 && (
                  <span className="ml-1 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                    {availableFood.filter((f) => !requestedWasteIds.has(f.id)).length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="w-4 h-4" />
                Pickup History
                {completedRequests.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 text-xs bg-blue-500 text-white rounded-full">
                    {completedRequests.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: My Requests (Pending + Approved) */}
            <TabsContent value="approved" className="mt-0">
              <div className="mb-6">
                <h2 className="font-display font-bold text-2xl text-foreground mb-2">My Requests</h2>
                <p className="text-muted-foreground">
                  Track your pickup requests. Pending requests are awaiting approval.
                </p>
              </div>

              {isLoading ? (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">Loading your requests...</p>
                </Card>
              ) : activeRequests.length === 0 ? (
                <Card className="p-12 text-center border-2 border-dashed">
                  <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No active requests yet. Request items below to get started!</p>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {activeRequests.map((request) => {
                    const food = availableFood.find((f) => f.id === request.wasteId)
                    const isApproved = request.status === "approved"
                    const isPending = request.status === "pending"
                    
                    return (
                      <Card 
                        key={request.id} 
                        className={`p-6 border-2 hover:shadow-lg transition-shadow ${
                          isApproved 
                            ? "border-green-500 bg-green-50/50" 
                            : isPending
                            ? "border-amber-500 bg-amber-50/50"
                            : "border-gray-300 bg-gray-50/50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                                isApproved 
                                  ? "bg-green-500/20" 
                                  : isPending
                                  ? "bg-amber-500/20"
                                  : "bg-gray-500/20"
                              }`}>
                                {isApproved ? (
                                  <CheckCircle className="w-6 h-6 text-green-600" />
                                ) : isPending ? (
                                  <Calendar className="w-6 h-6 text-amber-600" />
                                ) : (
                                  <CheckCircle className="w-6 h-6 text-gray-600" />
                                )}
                              </div>
                              <div>
                                <h3 className="font-display font-bold text-xl text-foreground">{request.itemName || food?.itemName}</h3>
                                <p className={`text-sm font-medium ${
                                  isApproved 
                                    ? "text-green-600" 
                                    : isPending
                                    ? "text-amber-600"
                                    : "text-gray-600"
                                }`}>
                                  {isApproved ? "✓ Request Approved" : isPending ? "⏳ Pending Approval" : `Status: ${request.status}`}
                                </p>
                              </div>
                            </div>

                            {isApproved && (
                              <div className="mb-4 p-4 bg-white rounded-lg border border-green-200">
                                <p className="text-sm font-medium text-green-900 mb-3">Please contact the café to arrange pickup:</p>
                                {request.cafe ? (
                                  <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                      <span className="font-semibold text-foreground min-w-[100px]">Café Name:</span>
                                      <span className="text-foreground">{request.cafe.name}</span>
                                    </div>
                                    {request.cafe.contactPerson && (
                                      <div className="flex items-center gap-2">
                                        <span className="font-semibold text-foreground min-w-[100px]">Contact Person:</span>
                                        <span className="text-foreground">{request.cafe.contactPerson}</span>
                                      </div>
                                    )}
                                    {request.cafe.phone && (
                                      <div className="flex items-center gap-2">
                                        <span className="font-semibold text-foreground min-w-[100px]">Phone:</span>
                                        <a href={`tel:${request.cafe.phone}`} className="text-primary hover:underline">
                                          {request.cafe.phone}
                                        </a>
                                      </div>
                                    )}
                                    {request.cafe.email && (
                                      <div className="flex items-center gap-2">
                                        <span className="font-semibold text-foreground min-w-[100px]">Email:</span>
                                        <a href={`mailto:${request.cafe.email}`} className="text-primary hover:underline">
                                          {request.cafe.email}
                                        </a>
                                      </div>
                                    )}
                                    {request.cafe.address && (
                                      <div className="flex items-start gap-2">
                                        <span className="font-semibold text-foreground min-w-[100px]">Address:</span>
                                        <span className="text-foreground flex-1">{request.cafe.address}</span>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-sm text-muted-foreground">Café contact information will be available soon.</p>
                                )}
                              </div>
                            )}

                            {isPending && (
                              <div className="mb-4 p-4 bg-white rounded-lg border border-amber-200">
                                <p className="text-sm font-medium text-amber-900">
                                  Your request is pending approval. You'll be notified once the café admin reviews it.
                                </p>
                              </div>
                            )}

                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>Quantity: <span className="font-medium text-foreground">{request.quantity} kg</span></span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-3">
                            <div className={`flex items-center gap-2 ${
                              isApproved 
                                ? "text-green-600" 
                                : isPending
                                ? "text-amber-600"
                                : "text-gray-600"
                            }`}>
                              {isApproved ? (
                                <>
                                  <CheckCircle className="w-5 h-5" />
                                  <span className="font-medium">Approved</span>
                                </>
                              ) : isPending ? (
                                <>
                                  <Calendar className="w-5 h-5" />
                                  <span className="font-medium">Pending</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-5 h-5" />
                                  <span className="font-medium capitalize">{request.status}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>

            {/* Tab 2: Request Collection */}
            <TabsContent value="request" className="mt-0">
              <div className="mb-6">
                <h2 className="font-display font-bold text-2xl text-foreground mb-2">Request Collection</h2>
                <p className="text-muted-foreground">
                  {isLoading ? "Loading..." : `${availableFood.filter((f) => !requestedWasteIds.has(f.id)).length} item${availableFood.filter((f) => !requestedWasteIds.has(f.id)).length !== 1 ? "s" : ""} available for pickup`}
                </p>
              </div>

              {isLoading ? (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">Loading available food...</p>
                </Card>
              ) : availableFood.filter((f) => !requestedWasteIds.has(f.id)).length === 0 ? (
                <Card className="p-12 text-center border-2 border-dashed">
                  <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No edible food available at the moment. Check back later!</p>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {availableFood
                    .filter((f) => !requestedWasteIds.has(f.id))
                    .map((food) => {
                      return (
                        <Card key={food.id} className="p-6 hover:shadow-lg transition-shadow">
                          <div className="flex items-start justify-between gap-6">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                                  <Heart className="w-6 h-6 text-red-500" />
                                </div>
                                <div>
                                  <h3 className="font-display font-bold text-xl text-foreground">{food.itemName}</h3>
                                  <p className="text-sm text-muted-foreground">Café ID: {food.cafeId}</p>
                                </div>
                              </div>

                              <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Calendar className="w-4 h-4" />
                                  <span className="text-sm">
                                    Expires: <span className="font-medium text-foreground">{food.expiryDate}</span>
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 mb-4">
                                <span className="text-sm text-muted-foreground">Quantity:</span>
                                <span className="font-bold text-lg text-foreground">{food.quantity} kg</span>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-3">
                              <Button
                                onClick={() => handleRequestPickup(food.id, food.itemName)}
                                className="bg-red-500 hover:bg-red-600 text-white"
                              >
                                <Heart className="w-4 h-4 mr-2" />
                                Request Pickup
                              </Button>
                            </div>
                          </div>
                        </Card>
                      )
                    })}
                </div>
              )}
            </TabsContent>

            {/* Tab 3: Pickup History */}
            <TabsContent value="history" className="mt-0">
              <div className="mb-6">
                <h2 className="font-display font-bold text-2xl text-foreground mb-2">Pickup History</h2>
                <p className="text-muted-foreground mb-4">
                  View your completed pickup requests.
                </p>
                
                {/* Filter Buttons */}
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={historyFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setHistoryFilter("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={historyFilter === "weekly" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setHistoryFilter("weekly")}
                  >
                    Weekly
                  </Button>
                  <Button
                    variant={historyFilter === "monthly" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setHistoryFilter("monthly")}
                  >
                    Monthly
                  </Button>
                  <Button
                    variant={historyFilter === "yearly" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setHistoryFilter("yearly")}
                  >
                    Yearly
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">Loading history...</p>
                </Card>
              ) : filteredHistory.length === 0 ? (
                <Card className="p-12 text-center border-2 border-dashed">
                  <History className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">
                    {completedRequests.length === 0 
                      ? "No completed pickups yet. Your completed requests will appear here."
                      : `No completed pickups found for the selected ${historyFilter} period.`}
                  </p>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {filteredHistory.map((request) => {
                    const completedDate = request.completedAt 
                      ? new Date(request.completedAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })
                      : "Unknown date"
                    
                    return (
                      <Card key={request.id} className="p-6 border-2 border-blue-500 bg-blue-50/50 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between gap-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                <History className="w-6 h-6 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-display font-bold text-xl text-foreground">{request.itemName || "Unknown Item"}</h3>
                                <p className="text-sm text-blue-600 font-medium">✓ Completed</p>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">
                                  Café: <span className="font-medium text-foreground">{request.cafeName || "Unknown Café"}</span>
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">
                                  Completed: <span className="font-medium text-foreground">{completedDate}</span>
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                              <span className="text-sm text-muted-foreground">Quantity:</span>
                              <span className="font-bold text-lg text-foreground">{request.quantity} kg</span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-3">
                            <div className="flex items-center gap-2 text-blue-600">
                              <CheckCircle className="w-5 h-5" />
                              <span className="font-medium">Completed</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

export default withAuth(CharityDashboardPage, ["charity"])
