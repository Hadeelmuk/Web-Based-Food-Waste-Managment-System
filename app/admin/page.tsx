import { DashboardNav } from "@/components/dashboard-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Trash2, Heart, Award, Download } from "lucide-react"
import { AdminWasteChart } from "@/components/admin-waste-chart"

export default function AdminDashboard() {
  const businesses = [
    { name: "Green Café", type: "Café", email: "contact@greencafe.com", joinDate: "2024-08-15", status: "Active" },
    { name: "Fresh Farm Co.", type: "Farm", email: "hello@freshfarm.com", joinDate: "2024-09-02", status: "Active" },
    { name: "City NGO", type: "NGO", email: "info@cityngo.org", joinDate: "2024-10-10", status: "Active" },
    {
      name: "Urban Kitchen",
      type: "Restaurant",
      email: "team@urbankitchen.com",
      joinDate: "2024-11-20",
      status: "Active",
    },
    { name: "Eco Bistro", type: "Café", email: "hi@ecobistro.com", joinDate: "2025-01-05", status: "Pending" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="pt-20 px-4 pb-8">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display font-bold text-3xl text-foreground mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">System-wide overview and management</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Download className="w-4 h-4 mr-2" />
              Export System Report
            </Button>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="text-3xl font-display font-bold text-foreground mb-1">524</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-destructive" />
                </div>
              </div>
              <div className="text-3xl font-display font-bold text-foreground mb-1">12.8 T</div>
              <div className="text-sm text-muted-foreground">Total Waste Logged</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-red-500" />
                </div>
              </div>
              <div className="text-3xl font-display font-bold text-foreground mb-1">4.2 T</div>
              <div className="text-sm text-muted-foreground">Total Donations</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="text-3xl font-display font-bold text-foreground mb-1">28.5K</div>
              <div className="text-sm text-muted-foreground">Total Points Earned</div>
            </Card>
          </div>

          {/* Chart */}
          <Card className="p-6 mb-8">
            <h3 className="font-display font-bold text-xl text-foreground mb-6">System-Wide Waste by Type</h3>
            <AdminWasteChart />
          </Card>

          {/* Registered Businesses Table */}
          <Card className="p-6">
            <h3 className="font-display font-bold text-xl text-foreground mb-6">Registered Businesses</h3>
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
                      Join Date
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
                  {businesses.map((business, index) => (
                    <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-4 font-medium text-foreground">{business.name}</td>
                      <td className="py-4 px-4 text-foreground">{business.type}</td>
                      <td className="py-4 px-4 text-foreground">{business.email}</td>
                      <td className="py-4 px-4 text-foreground">{business.joinDate}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            business.status === "Active"
                              ? "bg-primary/10 text-primary"
                              : "bg-amber-500/10 text-amber-600"
                          }`}
                        >
                          {business.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                          View Details
                        </Button>
                      </td>
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
