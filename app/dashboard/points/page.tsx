"use client"

import { DashboardNav } from "@/components/dashboard-nav"
import { Card } from "@/components/ui/card"
import { Award, Leaf, Sprout, TreeDeciduous, Globe } from "lucide-react"
import { withAuth } from "@/components/with-auth"
import { useState, useEffect } from "react"

function PointsPage() {
  const [impactData, setImpactData] = useState<{
    totalPoints: number
    level: string
    nextLevel: number
    nextLevelName: string
    pointsToNextLevel: number
    pointsHistory: Array<{
      date: string
      reason: string
      points: string
      quantity: number
      wasteType: string
      actionType: string
    }>
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch impact stats from unified endpoint
  const fetchImpactStats = async () => {
    try {
      setIsLoading(true)
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      const response = await fetch("/api/stats/impact", {
        headers: {
          "x-user-id": storedUser.userId || "",
        },
      })
      if (response.ok) {
        const data = await response.json()
        setImpactData({
          totalPoints: data.totalPoints || 0,
          level: data.level || "Green Starter",
          nextLevel: data.nextLevel || 50,
          nextLevelName: data.nextLevelName || "Eco Achiever",
          pointsToNextLevel: data.pointsToNextLevel || 50,
          pointsHistory: data.pointsHistory || [],
        })
      }
    } catch (error) {
      console.error("[Points Page] Error fetching impact stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchImpactStats()
    // Refresh every 5 seconds to ensure real-time data
    const interval = setInterval(fetchImpactStats, 5000)
    return () => clearInterval(interval)
  }, [])

  // Use default values while loading
  const currentPoints = impactData?.totalPoints || 0
  const nextLevel = impactData?.nextLevel || 50
  const level = impactData?.level || "Green Starter"
  const nextLevelName = impactData?.nextLevelName || "Eco Achiever"
  const pointsToNextLevel = impactData?.pointsToNextLevel || 50
  const achievements = impactData?.pointsHistory || []

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="pt-20 px-4 pb-8">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8">
            <h1 className="font-display font-bold text-3xl text-foreground mb-2">Sustainability Points</h1>
            <p className="text-muted-foreground">Track your environmental impact and earn rewards</p>
          </div>

          {/* Points Counter */}
          <Card className="p-8 mb-8 text-center bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 border-4 border-primary/30">
              <Award className="w-12 h-12 text-primary" />
            </div>
            <div className="text-6xl font-display font-bold text-primary mb-2">
              {isLoading ? "..." : Math.round(currentPoints)}
            </div>
            <div className="text-lg text-muted-foreground mb-6">Total Eco Points</div>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Current Level: {level}</span>
                <span className="text-muted-foreground">
                  {Math.round(currentPoints)}/{nextLevel}
                </span>
              </div>
              <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                  style={{ 
                    width: `${nextLevel > 0 ? Math.min(100, (currentPoints / nextLevel) * 100) : 0}%` 
                  }}
                />
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                {pointsToNextLevel > 0 
                  ? `${Math.round(pointsToNextLevel)} points to ${nextLevelName}`
                  : `Max level reached!`}
              </div>
            </div>
          </Card>

          {/* Level Badges */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className={`p-6 text-center ${currentPoints >= 0 && currentPoints < 50 ? "border-primary/50 bg-primary/5" : "opacity-50"}`}>
              <div className={`w-16 h-16 rounded-full ${currentPoints >= 0 && currentPoints < 50 ? "bg-primary/10" : "bg-muted"} flex items-center justify-center mx-auto mb-3`}>
                <Sprout className={`w-8 h-8 ${currentPoints >= 0 && currentPoints < 50 ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <h3 className={`font-display font-bold text-lg mb-1 ${currentPoints >= 0 && currentPoints < 50 ? "text-primary" : ""}`}>Green Starter</h3>
              <p className="text-sm text-muted-foreground mb-2">0-49 points</p>
              <div className={`text-xs font-medium ${currentPoints >= 0 && currentPoints < 50 ? "text-primary" : currentPoints >= 50 ? "text-green-600" : "text-muted-foreground"}`}>
                {currentPoints >= 50 ? "Completed" : currentPoints >= 0 && currentPoints < 50 ? "Current Level" : "Locked"}
              </div>
            </Card>

            <Card className={`p-6 text-center ${currentPoints >= 50 && currentPoints < 100 ? "border-primary/50 bg-primary/5" : "opacity-50"}`}>
              <div className={`w-16 h-16 rounded-full ${currentPoints >= 50 && currentPoints < 100 ? "bg-primary/10" : "bg-muted"} flex items-center justify-center mx-auto mb-3`}>
                <Leaf className={`w-8 h-8 ${currentPoints >= 50 && currentPoints < 100 ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <h3 className={`font-display font-bold text-lg mb-1 ${currentPoints >= 50 && currentPoints < 100 ? "text-primary" : ""}`}>Eco Achiever</h3>
              <p className="text-sm text-muted-foreground mb-2">50-99 points</p>
              <div className={`text-xs font-medium ${currentPoints >= 50 && currentPoints < 100 ? "text-primary" : currentPoints >= 100 ? "text-green-600" : "text-muted-foreground"}`}>
                {currentPoints >= 100 ? "Completed" : currentPoints >= 50 && currentPoints < 100 ? "Current Level" : "Locked"}
              </div>
            </Card>

            <Card className={`p-6 text-center ${currentPoints >= 100 && currentPoints < 200 ? "border-primary/50 bg-primary/5" : "opacity-50"}`}>
              <div className={`w-16 h-16 rounded-full ${currentPoints >= 100 && currentPoints < 200 ? "bg-primary/10" : "bg-muted"} flex items-center justify-center mx-auto mb-3`}>
                <TreeDeciduous className={`w-8 h-8 ${currentPoints >= 100 && currentPoints < 200 ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <h3 className={`font-display font-bold text-lg mb-1 ${currentPoints >= 100 && currentPoints < 200 ? "text-primary" : ""}`}>Green Hero</h3>
              <p className="text-sm text-muted-foreground mb-2">100-199 points</p>
              <div className={`text-xs font-medium ${currentPoints >= 100 && currentPoints < 200 ? "text-primary" : currentPoints >= 200 ? "text-green-600" : "text-muted-foreground"}`}>
                {currentPoints >= 200 ? "Completed" : currentPoints >= 100 && currentPoints < 200 ? "Current Level" : "Locked"}
              </div>
            </Card>

            <Card className={`p-6 text-center ${currentPoints >= 200 ? "border-primary/50 bg-primary/5" : "opacity-50"}`}>
              <div className={`w-16 h-16 rounded-full ${currentPoints >= 200 ? "bg-primary/10" : "bg-muted"} flex items-center justify-center mx-auto mb-3`}>
                <Globe className={`w-8 h-8 ${currentPoints >= 200 ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <h3 className={`font-display font-bold text-lg mb-1 ${currentPoints >= 200 ? "text-primary" : ""}`}>Sustainability Champion</h3>
              <p className="text-sm text-muted-foreground mb-2">200+ points</p>
              <div className={`text-xs font-medium ${currentPoints >= 200 ? "text-primary" : "text-muted-foreground"}`}>
                {currentPoints >= 200 ? "Current Level" : "Locked"}
              </div>
            </Card>
          </div>

          {/* Recent Achievements */}
          <Card className="p-6">
            <h3 className="font-display font-bold text-xl text-foreground mb-6">Recent Achievements</h3>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading achievements...</div>
            ) : achievements.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No achievements yet. Start collecting waste to earn points!
              </div>
            ) : (
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <div className="font-medium text-foreground">{achievement.reason}</div>
                      <div className="text-sm text-muted-foreground">{achievement.date}</div>
                    </div>
                    <div className="text-lg font-display font-bold text-primary">{achievement.points}</div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  )
}

export default withAuth(PointsPage, ["staff"])
