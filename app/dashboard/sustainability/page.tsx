"use client"

import { DashboardNav } from "@/components/dashboard-nav"
import { Card } from "@/components/ui/card"
import { Award, TrendingUp, Leaf, Trees, Sprout, Globe } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { withAuth } from "@/components/with-auth"

function SustainabilityPage() {
  const currentPoints = 127
  const nextLevel = 150

  // Level calculation based on requirements
  const getLevel = (points: number) => {
    if (points >= 200)
      return { name: "Sustainability Champion", icon: Globe, color: "text-blue-600", bg: "bg-blue-500/10" }
    if (points >= 100) return { name: "Green Hero", icon: Trees, color: "text-green-700", bg: "bg-green-700/10" }
    if (points >= 50) return { name: "Eco Achiever", icon: Leaf, color: "text-green-600", bg: "bg-green-600/10" }
    return { name: "Green Starter", icon: Sprout, color: "text-green-500", bg: "bg-green-500/10" }
  }

  const level = getLevel(currentPoints)
  const LevelIcon = level.icon

  const pointsHistory = [
    { date: "2025-01-09", reason: "Donated 5.2 kg of food waste to local NGO", points: "+5" },
    { date: "2025-01-08", reason: "Sent 2.1 kg coffee grounds to composting", points: "+3" },
    { date: "2025-01-08", reason: "Reused 3.8 kg organic waste", points: "+4" },
    { date: "2025-01-07", reason: "Donated 4.5 kg of food waste", points: "+5" },
    { date: "2025-01-06", reason: "Composted 1.9 kg coffee grounds", points: "+2" },
    { date: "2025-01-05", reason: "Weekly consistency bonus", points: "+10" },
    { date: "2025-01-04", reason: "Donated 6.2 kg of food waste", points: "+6" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="pt-20 px-4 pb-8">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="font-display font-bold text-3xl text-foreground mb-2">Your Sustainability Journey 🌿</h1>
            <p className="text-muted-foreground">Track your eco-impact and earn rewards for sustainable actions</p>
          </div>

          {/* Current Level Card */}
          <Card className="p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className={`w-32 h-32 rounded-full ${level.bg} flex items-center justify-center`}>
                <LevelIcon className={`w-16 h-16 ${level.color}`} />
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="text-sm text-muted-foreground mb-2">Current Level</div>
                <h2 className="font-display font-bold text-4xl text-foreground mb-4">{level.name}</h2>

                <div className="max-w-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Progress to next level</span>
                    <span className="text-sm font-medium text-foreground">
                      {currentPoints} / {nextLevel} points
                    </span>
                  </div>
                  <Progress value={(currentPoints / nextLevel) * 100} className="h-3" />
                  <div className="text-sm text-muted-foreground mt-2">
                    {nextLevel - currentPoints} points until{" "}
                    <span className="font-medium text-foreground">Green Hero</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Award className="w-12 h-12 text-primary mx-auto mb-2" />
                <div className="text-5xl font-display font-bold text-primary mb-1">{currentPoints}</div>
                <div className="text-sm text-muted-foreground">Total Points</div>
              </div>
            </div>
          </Card>

          {/* Levels Overview */}
          <Card className="p-8 mb-8">
            <h3 className="font-display font-bold text-2xl text-foreground mb-6">Achievement Levels</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3">
                  <Sprout className="w-8 h-8 text-green-500" />
                </div>
                <h4 className="font-display font-bold text-lg text-foreground mb-1">🌱 Green Starter</h4>
                <p className="text-sm text-muted-foreground">0–49 points</p>
              </div>

              <div className="text-center p-4 rounded-lg bg-green-600/5 border border-green-600/20">
                <div className="w-16 h-16 rounded-full bg-green-600/10 flex items-center justify-center mx-auto mb-3">
                  <Leaf className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-display font-bold text-lg text-foreground mb-1">🌿 Eco Achiever</h4>
                <p className="text-sm text-muted-foreground">50–99 points</p>
              </div>

              <div className="text-center p-4 rounded-lg bg-green-700/5 border border-green-700/20">
                <div className="w-16 h-16 rounded-full bg-green-700/10 flex items-center justify-center mx-auto mb-3">
                  <Trees className="w-8 h-8 text-green-700" />
                </div>
                <h4 className="font-display font-bold text-lg text-foreground mb-1">🌳 Green Hero</h4>
                <p className="text-sm text-muted-foreground">100–199 points</p>
              </div>

              <div className="text-center p-4 rounded-lg bg-blue-600/5 border border-blue-600/20">
                <div className="w-16 h-16 rounded-full bg-blue-600/10 flex items-center justify-center mx-auto mb-3">
                  <Globe className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-display font-bold text-lg text-foreground mb-1">🌎 Sustainability Champion</h4>
                <p className="text-sm text-muted-foreground">200+ points</p>
              </div>
            </div>
          </Card>

          {/* Points History */}
          <Card className="p-6">
            <h3 className="font-display font-bold text-xl text-foreground mb-6">Points History</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-display font-semibold text-sm text-muted-foreground">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-display font-semibold text-sm text-muted-foreground">
                      Reason
                    </th>
                    <th className="text-right py-3 px-4 font-display font-semibold text-sm text-muted-foreground">
                      Points Earned
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pointsHistory.map((entry, index) => (
                    <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-4 text-foreground whitespace-nowrap">{entry.date}</td>
                      <td className="py-4 px-4 text-muted-foreground">{entry.reason}</td>
                      <td className="py-4 px-4 text-right">
                        <span className="inline-flex items-center gap-1 text-primary font-bold">
                          <TrendingUp className="w-4 h-4" />
                          {entry.points}
                        </span>
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

export default withAuth(SustainabilityPage, ["staff"])
