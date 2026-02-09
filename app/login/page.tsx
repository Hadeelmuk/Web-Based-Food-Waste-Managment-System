"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { PublicNav } from "@/components/public-nav"
import { PublicFooter } from "@/components/public-footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Leaf, Sprout } from "lucide-react"
import Link from "next/link"

type LoginResponse = {
  userId: string
  role: "admin" | "staff" | "charity" | "farmer"
  organizationName: string
  cafeId?: string | null
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const search = useSearchParams()
  const intendedRole = search?.get("role")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = (await res.json()) as LoginResponse & { error?: string }
      if (!res.ok || data.error) {
        setError(data.error || "Login failed")
        setLoading(false)
        return
      }

      localStorage.setItem("user", JSON.stringify(data))

      if (data.role === "admin") router.push("/dashboard/admin")
      else if (data.role === "staff") router.push("/dashboard/staff")
      else if (data.role === "charity") router.push("/dashboard/charity")
      else if (data.role === "farmer") router.push("/dashboard/farmer")
      else router.push("/dashboard")
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left side - Illustration */}
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl" />
                <div className="relative p-12">
                  <div className="space-y-6">
                    <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
                      <Sprout className="w-10 h-10 text-primary-foreground" />
                    </div>
                    <h2 className="font-display font-bold text-3xl text-foreground">
                      Transform waste into opportunity
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Join hundreds of businesses making a real environmental impact through intelligent waste
                      management.
                    </p>
                    <div className="space-y-4 pt-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-muted-foreground">Track and reduce food waste</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-muted-foreground">Connect with local farms and NGOs</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-muted-foreground">Earn sustainability points</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Login form */}
            <Card className="p-8 shadow-lg">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-primary" />
                </div>
                <h1 className="font-display font-bold text-3xl text-foreground mb-2">Welcome Back</h1>
                <p className="text-muted-foreground">Log in to your business account</p>
                {intendedRole && (
                  <p className="text-sm text-primary mt-2">
                    You’re signing in as <span className="font-semibold">{intendedRole}</span>.
                  </p>
                )}
                {!intendedRole && <p className="text-sm text-primary mt-2">Demo users are pre-seeded in the mock DB.</p>}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@greencafe.com"
                    className="h-12"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="#" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="h-12"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-lg"
                >
                  {loading ? "Logging in..." : "Log In"}
                </Button>

                {error && <p className="text-sm text-destructive text-center">{error}</p>}

                <p className="text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-primary hover:underline font-medium">
                    Register your business
                  </Link>
                </p>
              </form>
            </Card>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  )
}
