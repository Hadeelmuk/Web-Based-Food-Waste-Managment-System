"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Calendar, Clock, Phone } from "lucide-react"
import { PublicNav } from "@/components/public-nav"

type RequestItem = {
  id: string
  itemName?: string
  cafeName?: string
  quantity?: number
  status: string
  requestedAt: string
  preferredTime?: string
  notes?: string
  cafeId?: string
  pickupWindow?: {
    date: string
    from: string
    to: string
  }
}

const statusStyles: Record<string, string> = {
  approved: "bg-green-500/10 text-green-600 border border-green-500/20",
  rejected: "bg-red-500/10 text-red-600 border border-red-500/20",
  collected: "bg-primary/10 text-primary border border-primary/20",
  scheduled: "bg-blue-500/10 text-blue-600 border border-blue-500/20",
  pending: "bg-amber-500/10 text-amber-600 border border-amber-500/20",
}

export default function CharityRequestsPage() {
  const [requests, setRequests] = useState<RequestItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRequests = async () => {
    try {
      setIsLoading(true)
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      const requesterId = storedUser.userId || "u-charity-1"

      const response = await fetch("/api/charity/requests", {
        headers: { "x-user-id": requesterId },
      })

      if (response.ok) {
        const data = await response.json()
        setRequests(data)
        setError(null)
      } else {
        const text = await response.text()
        console.error("Failed to fetch requests", response.status, text)
        setError("Could not load your requests. Please try again.")
      }
    } catch (err) {
      console.error("Error fetching requests", err)
      const isNetwork = err instanceof TypeError && err.message === "Failed to fetch"
      setError(isNetwork ? "Cannot reach the server. Is it running?" : "Unexpected error loading requests.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
    // Refresh every 15 seconds for real-time updates
    const interval = setInterval(fetchRequests, 15000)
    return () => clearInterval(interval)
  }, [])

  // Default phone number for cafes (in real app, this would come from the API)
  const getCafePhone = (cafeName?: string) => {
    // In a real app, this would be fetched from the API
    return "+1-555-0123"
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <main className="pt-24 px-4 pb-12">
        <div className="container mx-auto max-w-5xl space-y-6">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-3">
              <Heart className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="font-display font-bold text-3xl text-foreground">My Pickup Requests</h1>
            <p className="text-muted-foreground mt-2">Track the status of your pickup requests and preferred times.</p>
          </div>

          {error && (
            <Card className="p-6">
              <p className="text-center text-muted-foreground">{error}</p>
            </Card>
          )}

          {!error && isLoading && (
            <Card className="p-6">
              <p className="text-center text-muted-foreground">Loading your requests...</p>
            </Card>
          )}

          {!error && !isLoading && requests.length === 0 && (
            <Card className="p-6">
              <p className="text-center text-muted-foreground">You haven’t made any pickup requests yet.</p>
            </Card>
          )}

          {!error && !isLoading && requests.length > 0 && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold text-sm text-muted-foreground">Item Name</th>
                      <th className="text-left p-3 font-semibold text-sm text-muted-foreground">Café Name</th>
                      <th className="text-left p-3 font-semibold text-sm text-muted-foreground">Status</th>
                      <th className="text-left p-3 font-semibold text-sm text-muted-foreground">Note</th>
                      <th className="text-left p-3 font-semibold text-sm text-muted-foreground">Pickup Window</th>
                      <th className="text-left p-3 font-semibold text-sm text-muted-foreground">Created Date</th>
                      <th className="text-left p-3 font-semibold text-sm text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <tr key={req.id} className="border-b hover:bg-muted/50">
                        <td className="p-3">
                          <div className="font-medium">{req.itemName || "Unknown item"}</div>
                          <div className="text-sm text-muted-foreground">Quantity: {req.quantity ?? "N/A"} kg</div>
                        </td>
                        <td className="p-3">{req.cafeName || "Café"}</td>
                        <td className="p-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[req.status] || "bg-amber-500/10 text-amber-600 border border-amber-500/20"}`}>
                            {req.status}
                          </span>
                          {req.status === "approved" && (
                            <div className="mt-2 text-xs text-green-700 bg-green-50 px-2 py-1 rounded border border-green-200">
                              Your request is approved. Café will provide a pickup time soon.
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">{req.notes || "—"}</td>
                        <td className="p-3 text-sm text-muted-foreground">
                          {req.status === "scheduled" && req.pickupWindow ? (
                            <div className="space-y-1">
                              <div className="font-medium text-foreground">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                {new Date(req.pickupWindow.date).toLocaleDateString()}
                              </div>
                              <div className="text-xs">
                                <Clock className="w-3 h-3 inline mr-1" />
                                {req.pickupWindow.from} - {req.pickupWindow.to}
                              </div>
                            </div>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">
                          {new Date(req.requestedAt).toLocaleDateString()} {new Date(req.requestedAt).toLocaleTimeString()}
                        </td>
                        <td className="p-3">
                          {req.status === "scheduled" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.location.href = `tel:${getCafePhone(req.cafeName)}`}
                            >
                              <Phone className="w-4 h-4 mr-1" />
                              Call Café
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

