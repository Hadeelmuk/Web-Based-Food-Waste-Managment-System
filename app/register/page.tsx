"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PublicNav } from "@/components/public-nav"
import { PublicFooter } from "@/components/public-footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Leaf } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

type RegisterResponse = {
  userId: string
  role: "admin" | "staff" | "charity" | "farmer"
  organizationName: string
  cafeId?: string | null
  message?: string
  error?: string
}

export default function RegisterPage() {
  const [businessName, setBusinessName] = useState("")
  const [businessType, setBusinessType] = useState("")
  const [address, setAddress] = useState("")
  const [contactPerson, setContactPerson] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          businessName,
          businessType,
          address,
          contactPerson,
          phone: phone || undefined, // Only include if provided
          name: contactPerson,
        }),
      })

      const data = (await res.json()) as RegisterResponse
      if (!res.ok || data.error) {
        setError(data.error || "Registration failed")
        setLoading(false)
        return
      }

      // Store user data in localStorage (same format as login)
      localStorage.setItem(
        "user",
        JSON.stringify({
          userId: data.userId,
          role: data.role,
          organizationName: data.organizationName,
          cafeId: data.cafeId,
        })
      )

      toast.success("Registration successful!", {
        description: "Your account has been created.",
      })

      // Redirect based on role
      if (data.role === "admin") router.push("/dashboard/admin")
      else if (data.role === "staff") router.push("/dashboard/staff")
      else if (data.role === "charity") router.push("/dashboard/charity")
      else if (data.role === "farmer") router.push("/dashboard/farmer")
      else router.push("/dashboard")
    } catch (err) {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-xl">
          <Card className="p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-10 h-10 text-primary" />
              </div>
              <h1 className="font-display font-bold text-3xl text-foreground mb-2">Register Your Business</h1>
              <p className="text-muted-foreground">Join the sustainable food waste management network</p>
              <p className="text-sm text-primary mt-2">Demo: Fill out the form to register</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  placeholder="Green Café"
                  className="h-12"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type</Label>
                <Select value={businessType} onValueChange={setBusinessType} required>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cafe">Café</SelectItem>
                    <SelectItem value="ngo">NGO (Charity)</SelectItem>
                    <SelectItem value="farm">Farm</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="123 Green Street"
                  className="h-12"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input
                  id="contactPerson"
                  placeholder="John Doe"
                  className="h-12"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  className="h-12"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

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
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="h-12"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-sm text-destructive text-center">{error}</p>}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-lg"
              >
                {loading ? "Registering..." : "Register"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Log in
                </Link>
              </p>
            </form>
          </Card>
        </div>
      </div>

      <PublicFooter />
    </div>
  )
}
