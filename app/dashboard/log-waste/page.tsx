"use client"

import { DashboardNav } from "@/components/dashboard-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Trash2, AlertCircle, CheckCircle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { withAuth } from "@/components/with-auth"
import { toast } from "sonner"

function LogWastePage({ user }: { user: any }) {
  const [wasteType, setWasteType] = useState("")
  const [itemName, setItemName] = useState("")
  const [quantity, setQuantity] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [recentEntries, setRecentEntries] = useState<any[]>([])
  const [isLoadingEntries, setIsLoadingEntries] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string>("")
  const [refreshKey, setRefreshKey] = useState(0)

  // Determine assignedTo based on waste type
  // Rule: Edible food → CHARITY only, ALL other types → FARMER only
  const getAssignedTo = () => {
    if (wasteType === "edible") return "charity"
    // All other types go to farmer (coffee, organic, expired, recyclable)
    if (wasteType === "coffee" || wasteType === "organic" || wasteType === "expired" || wasteType === "recyclable") {
      return "farmer"
    }
    return null
  }

  // Fetch recent entries from API
  const fetchRecentEntries = async () => {
    setIsLoadingEntries(true)
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      if (!storedUser.userId) {
        console.warn("[Frontend] No userId in localStorage:", storedUser)
        setIsLoadingEntries(false)
        return
      }

      console.log("[Frontend] Fetching entries for user:", storedUser.userId)

      const response = await fetch("/api/waste?recent=true", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": storedUser.userId,
        },
      })

      console.log("[Frontend] Response status:", response.status, response.statusText)

      // Check content type first
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("Response is not JSON:", contentType, text.substring(0, 200))
        setDebugInfo(`Error: Server returned ${contentType} instead of JSON`)
        setIsLoadingEntries(false)
        return
      }

      if (!response.ok) {
        let errorData: any = null
        let errorText = ""
        
        // Try to get the response text first
        try {
          errorText = await response.text()
          
          // Only log if we have actual text
          if (errorText) {
            console.log("[Frontend] Error response text:", errorText.substring(0, 200))
            
            // Try to parse as JSON
            if (errorText.trim().startsWith("{")) {
              try {
                errorData = JSON.parse(errorText)
              } catch (parseError) {
                console.error("[Frontend] Failed to parse error JSON:", parseError)
                errorData = { message: errorText }
              }
            } else {
              errorData = { message: errorText }
            }
          }
        } catch (e) {
          console.error("[Frontend] Failed to read error response:", e)
          errorText = `Failed to read response: ${e instanceof Error ? e.message : String(e)}`
          errorData = { message: errorText }
        }
        
        // Only log if we have meaningful error data
        if (errorData && Object.keys(errorData).length > 0) {
          console.error("[Frontend] API Error Response:", {
            status: response.status,
            statusText: response.statusText,
            error: errorData.error || errorData.message,
            message: errorData.message,
          })
        } else {
          console.error("[Frontend] API Error Response:", {
            status: response.status,
            statusText: response.statusText,
            message: "No error details available",
          })
        }
        
        const errorMsg = errorData?.error || errorData?.message || errorText || response.statusText || `Server error (${response.status})`
        setDebugInfo(`Error: ${errorMsg} (Status: ${response.status})`)
        setIsLoadingEntries(false)
        return
      }

      let data
      try {
        data = await response.json()
        console.log("[Frontend] API Response data:", JSON.stringify(data, null, 2))
      } catch (e) {
        console.error("[Frontend] Failed to parse JSON:", e)
        setDebugInfo(`Error: Failed to parse JSON response`)
        setIsLoadingEntries(false)
        return
      }
      
      // Check if we got entries - but still set empty array if no entries
      if (!data.entries) {
        console.warn("[Frontend] No entries array in response. Response:", JSON.stringify(data))
        setDebugInfo(`No entries array in response. Response: ${JSON.stringify(data)}`)
        setRecentEntries([])
        setIsLoadingEntries(false)
        return
      }
      
      // If entries array exists but is empty, that's OK - just show empty state
      if (data.entries.length === 0) {
        console.log("[Frontend] Empty entries array - this is OK if no entries exist yet")
        setDebugInfo(`No entries found yet. Start logging waste above!`)
        setRecentEntries([])
        setIsLoadingEntries(false)
        return
      }
      
      console.log(`[Frontend] Found ${data.entries.length} entries from API`)
      setDebugInfo(`Found ${data.entries.length} entries`)
      
      // Transform API data to match display format - entries are already sorted by createdAt DESC
      // Format should match: "itemName (type)" like "coffee (coffee)", "Fresh Bread (edible)"
      const entries = data.entries
        .map((entry: any) => {
          if (!entry.id || !entry.itemName) {
            console.warn("[Frontend] Invalid entry:", entry)
            return null
          }
          
          // Format: "itemName (type)" - exactly like the image shows
          const typeDisplay = entry.itemName && entry.type
            ? `${entry.itemName} (${entry.type})`
            : entry.itemName || entry.type || "Unknown"
          
          return {
            id: entry.id,
            date: new Date(entry.createdAt).toLocaleDateString(),
            type: typeDisplay,
            quantity: `${entry.quantity} kg`,
            assignedTo: entry.assignedTo || "N/A",
            status: entry.status?.toLowerCase() || "pending",
            createdAt: entry.createdAt,
          }
        })
        .filter((e: any) => e !== null) // Remove invalid entries
      
      console.log(`[Frontend] Displaying ${entries.length} transformed entries`)
      setDebugInfo(`Displaying ${entries.length} entries`)
      // Force React to update by setting state with a new array reference
      setRecentEntries([...entries])
      // Also trigger a re-render
      setRefreshKey(prev => prev + 1)
    } catch (error) {
      console.error("[Frontend] Error fetching recent entries:", error)
      console.error("[Frontend] Error details:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      })
      setDebugInfo(`Error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsLoadingEntries(false)
    }
  }

  useEffect(() => {
    // Fetch immediately on mount
    fetchRecentEntries()
    // Refresh every 5 seconds to show new entries
    const interval = setInterval(() => {
      console.log("Auto-refreshing entries...")
      fetchRecentEntries()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!wasteType || !itemName || !quantity || !expiryDate) {
      toast.error("Please fill in all required fields")
      return
    }

    const assignedTo = getAssignedTo()
    if (!assignedTo) {
      toast.error("Please select a valid waste type")
      return
    }

    setIsSubmitting(true)

    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      if (!storedUser.userId) {
        toast.error("Please log in again")
        setIsSubmitting(false)
        return
      }

      // Map frontend wasteType to API enum
      const wasteTypeMap: Record<string, string> = {
        edible: "EDIBLE",
        coffee: "COFFEE_GROUNDS",
        organic: "ORGANIC",
        expired: "EXPIRED",
        recyclable: "RECYCLABLE",
      }
      
      // Map frontend actionType based on wasteType and assignedTo
      // Rule: Edible → DONATE (charity), All others → FARM or COMPOST (farmer)
      const actionTypeMap: Record<string, string> = {
        charity: "DONATE",
        farmer: wasteType === "coffee" ? "COMPOST" : "FARM",
      }
      
      const requestBody = {
        wasteType: wasteTypeMap[wasteType] || "ORGANIC",
        subType: itemName,
        quantity: parseFloat(quantity),
        actionType: actionTypeMap[assignedTo] || "FARM",
        expiryDate: expiryDate,
        notes: notes || undefined,
      }

      console.log("[Frontend] POST /api/waste - Request body:", requestBody)

      const response = await fetch("/api/waste", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": storedUser.userId,
        },
        body: JSON.stringify(requestBody),
      })

      // Check response status
      if (!response.ok) {
        // Error response - try to parse error message
        let errorData
        try {
          errorData = await response.json()
        } catch (e) {
          toast.error(`Server error: ${response.status} ${response.statusText}`)
          setIsSubmitting(false)
          return
        }
        const errorMsg = errorData?.error || errorData?.message || `Failed to add waste log (${response.status})`
        toast.error(errorMsg)
        setIsSubmitting(false)
        return
      }

      // Success response (200-299) - try to parse JSON, but don't fail if it doesn't parse
      let data
      try {
        data = await response.json()
      } catch (e) {
        // JSON parsing failed but status is ok - still treat as success
        console.warn("Response OK but JSON parsing failed:", e)
        data = null
      }

      // Show success message
      toast.success("Waste Log Added", {
        description: data?.message || "Your food waste entry has been successfully recorded.",
        duration: 5000,
      })

      // Clear form
      setWasteType("")
      setItemName("")
      setQuantity("")
      setExpiryDate("")
      setNotes("")

      // Immediately refresh entries - MUST await to ensure data is fetched
      console.log("[Frontend] POST success, fetching latest entries...")
      try {
        await fetchRecentEntries()
        console.log("[Frontend] Entries refreshed successfully")
      } catch (fetchError) {
        console.error("[Frontend] Error refreshing entries after POST:", fetchError)
        // Don't show error to user - POST was successful, just refresh failed
        // User can manually refresh if needed
      }
    } catch (error) {
      console.error("[Frontend] Error submitting waste log:", error)
      console.error("[Frontend] Error details:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      })
      toast.error(`An error occurred: ${error instanceof Error ? error.message : "Please try again."}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getAvailableActions = () => {
    if (wasteType === "edible") {
      return [{ value: "donate", label: "Donate to Charity" }]
    } else if (wasteType === "organic" || wasteType === "coffee" || wasteType === "expired" || wasteType === "recyclable") {
      return [
        { value: "farm", label: "Send to Farm" },
        { value: "compost", label: "Compost" },
      ]
    }
    return []
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="pt-20 px-4 pb-8">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="font-display font-bold text-3xl text-foreground mb-2">Log New Waste</h1>
            <p className="text-muted-foreground">
              Track your daily food waste - system will automatically classify for donation, composting, or drop
            </p>
          </div>

          <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Waste Classification Guide:</p>
                <ul className="space-y-1 text-blue-800">
                  <li>
                    <strong>Edible Food:</strong> Goes to <span className="text-red-600 font-semibold">Charity ONLY</span> (pastries, bread, etc.)
                  </li>
                  <li>
                    <strong>All Other Types:</strong> Go to <span className="text-green-600 font-semibold">Farm ONLY</span> (coffee grounds, organic waste, expired, recyclable)
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-8 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="itemName">Item Name *</Label>
                  <Input
                    id="itemName"
                    type="text"
                    placeholder="e.g., Pastries, Coffee Grounds"
                    className="h-12"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wasteType">Waste Type *</Label>
                  <Select value={wasteType} onValueChange={setWasteType} required>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select waste type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="edible">Edible Food (Pastries, Bread, etc.)</SelectItem>
                      <SelectItem value="coffee">Coffee Grounds</SelectItem>
                      <SelectItem value="organic">Organic Waste (Vegetables, Fruits)</SelectItem>
                      <SelectItem value="expired">Expired / Not Edible</SelectItem>
                      <SelectItem value="recyclable">Recyclable (Packaged Snacks)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity (kg) *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.1"
                    placeholder="5.2"
                    className="h-12"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date *</Label>
                  <Input
                    id="expiry"
                    type="date"
                    className="h-12"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              {wasteType && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    <p className="text-sm font-medium">
                      {wasteType === "edible" &&
                        "✓ Edible Food → Will be assigned to CHARITY and appear in their marketplace"}
                      {(wasteType === "organic" || wasteType === "coffee" || wasteType === "expired" || wasteType === "recyclable") &&
                        "✓ This waste type → Will be assigned to FARM and appear in their marketplace"}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes..."
                  className="min-h-24"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 h-12 bg-primary hover:bg-primary/90 text-lg"
                  disabled={isSubmitting}
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  {isSubmitting ? "Saving..." : "Save Waste Log"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 px-8 bg-transparent"
                  onClick={() => {
                    setWasteType("")
                    setItemName("")
                    setQuantity("")
                    setExpiryDate("")
                    setNotes("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>

          {/* Recent Entries */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-xl text-foreground">
                Recent Entries {recentEntries.length > 0 && `(${recentEntries.length})`}
              </h3>
              <div className="flex items-center gap-2">
                {isLoadingEntries && (
                  <span className="text-sm text-muted-foreground">Refreshing...</span>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    console.log("Manual refresh clicked")
                    fetchRecentEntries()
                  }}
                  disabled={isLoadingEntries}
                >
                  Refresh
                </Button>
              </div>
            </div>
            {isLoadingEntries && recentEntries.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Loading entries...</p>
            ) : recentEntries.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-2">No entries yet. Start logging waste above!</p>
                <p className="text-xs text-muted-foreground">Debug: Check browser console (F12) for API response</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-display font-semibold text-sm text-muted-foreground">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 font-display font-semibold text-sm text-muted-foreground">
                        Type
                      </th>
                      <th className="text-left py-3 px-4 font-display font-semibold text-sm text-muted-foreground">
                        Quantity
                      </th>
                      <th className="text-left py-3 px-4 font-display font-semibold text-sm text-muted-foreground">
                        Assigned To
                      </th>
                      <th className="text-left py-3 px-4 font-display font-semibold text-sm text-muted-foreground">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody key={refreshKey}>
                    {recentEntries.map((entry, idx) => (
                      <tr key={`${entry.id}-${refreshKey}`} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-4 px-4 text-foreground">{entry.date}</td>
                        <td className="py-4 px-4 text-foreground">{entry.type}</td>
                        <td className="py-4 px-4 text-foreground">{entry.quantity}</td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                              entry.assignedTo === "charity"
                                ? "bg-red-500/10 text-red-600"
                                : entry.assignedTo === "farmer"
                                  ? "bg-green-500/10 text-green-600"
                                  : "bg-gray-500/10 text-gray-600"
                            }`}
                          >
                            {entry.assignedTo === "charity" ? "Charity" : entry.assignedTo === "farmer" ? "Farmer" : "N/A"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                              entry.status === "completed" || entry.status === "collected"
                                ? "bg-primary/10 text-primary"
                                : entry.status === "dropped"
                                  ? "bg-gray-500/10 text-gray-600"
                                  : "bg-amber-500/10 text-amber-600"
                            }`}
                          >
                            {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  )
}

export default withAuth(LogWastePage, ["staff"])
