"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { RoleTopbar } from "@/components/role-topbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { withAuth } from "@/components/with-auth"
import { Settings, Save, Loader2, Lock } from "lucide-react"
import { toast } from "sonner"

/**
 * Settings page component.
 * Allows users to update their profile information and change their password.
 */
function SettingsPage({ user }: { user: any }) {
  const router = useRouter()
  
  // Loading and saving states
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  
  // Profile form data
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    businessName: "",
    businessPhone: "",
    businessAddress: "",
  })
  
  // Password change form data
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  /**
   * Fetches user profile data from the API when component loads.
   */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get user ID from localStorage
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
        if (!storedUser.userId) {
          router.push("/login")
          return
        }

        // Fetch profile from API
        const response = await fetch("/api/user/profile", {
          headers: {
            "x-user-id": storedUser.userId,
          },
        })

        if (response.ok) {
          const data = await response.json()
          // Populate form with user data
          setProfile({
            name: data.name || "",
            email: data.email || "",
            businessName: data.business?.name || "",
            businessPhone: data.business?.phone || "",
            businessAddress: data.business?.address || "",
          })
        } else {
          toast.error("Failed to load profile")
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast.error("Failed to load profile")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  /**
   * Handles profile form submission.
   * Updates user and business information via API.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      if (!storedUser.userId) {
        toast.error("Please log in again")
        return
      }

      // Send update request to API
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": storedUser.userId,
        },
        body: JSON.stringify({
          name: profile.name,
          businessName: profile.businessName,
          businessPhone: profile.businessPhone,
          businessAddress: profile.businessAddress,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success("Profile updated successfully")
        
        // Update localStorage with new data
        const updatedUser = {
          ...storedUser,
          name: data.user.name,
          businessName: data.user.business?.name,
        }
        localStorage.setItem("user", JSON.stringify(updatedUser))

        // Notify other components (like RoleTopbar) about the update
        window.dispatchEvent(
          new CustomEvent("profileUpdated", {
            detail: {
              businessName: data.user.business?.name,
            },
          })
        )
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  /**
   * Handles password change form submission.
   * Validates passwords and updates via API.
   */
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields are filled
    if (!password.currentPassword || !password.newPassword || !password.confirmPassword) {
      toast.error("Please fill in all password fields")
      return
    }

    // Validate password length
    if (password.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters")
      return
    }

    // Validate passwords match
    if (password.newPassword !== password.confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    setIsChangingPassword(true)

    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      if (!storedUser.userId) {
        toast.error("Please log in again")
        return
      }

      // Send password change request to API
      const response = await fetch("/api/user/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": storedUser.userId,
        },
        body: JSON.stringify({
          currentPassword: password.currentPassword,
          newPassword: password.newPassword,
        }),
      })

      if (response.ok) {
        toast.success("Password changed successfully")
        // Clear password fields after successful change
        setPassword({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to change password")
      }
    } catch (error) {
      console.error("Error changing password:", error)
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsChangingPassword(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <RoleTopbar title="Settings" />
        <main className="pt-24 px-4 pb-12">
          <div className="container mx-auto max-w-2xl">
            <Card className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Loading profile...</p>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <RoleTopbar title="Settings" />
      
      <main className="pt-24 px-4 pb-12">
        <div className="container mx-auto max-w-2xl">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <h1 className="font-display font-bold text-3xl text-foreground">Settings</h1>
            </div>
            <p className="text-muted-foreground">Manage your account and business information</p>
          </div>

          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Information Section */}
              <div className="space-y-4">
                <h2 className="font-display font-semibold text-xl text-foreground border-b pb-2">
                  Account Information
                </h2>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="bg-muted cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
              </div>

              {/* Business Information Section */}
              <div className="space-y-4 pt-4 border-t">
                <h2 className="font-display font-semibold text-xl text-foreground border-b pb-2">
                  Business Information
                </h2>
                
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={profile.businessName}
                    onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                    placeholder="Your business name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessPhone">Business Phone</Label>
                  <Input
                    id="businessPhone"
                    type="tel"
                    value={profile.businessPhone}
                    onChange={(e) => setProfile({ ...profile, businessPhone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Business Address</Label>
                  <Input
                    id="businessAddress"
                    value={profile.businessAddress}
                    onChange={(e) => setProfile({ ...profile, businessAddress: e.target.value })}
                    placeholder="123 Main Street, City, State, ZIP"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>

          {/* Password Change Section */}
          <Card className="p-6 mt-6">
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    <Lock className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-display font-semibold text-xl text-foreground">
                    Change Password
                  </h2>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={password.currentPassword}
                    onChange={(e) => setPassword({ ...password, currentPassword: e.target.value })}
                    placeholder="Enter your current password"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={password.newPassword}
                    onChange={(e) => setPassword({ ...password, newPassword: e.target.value })}
                    placeholder="Enter your new password (min. 6 characters)"
                    required
                    minLength={6}
                  />
                  <p className="text-xs text-muted-foreground">Password must be at least 6 characters long</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={password.confirmPassword}
                    onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value })}
                    placeholder="Confirm your new password"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPassword({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  })}
                  disabled={isChangingPassword}
                >
                  Clear
                </Button>
                <Button type="submit" disabled={isChangingPassword}>
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Changing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Change Password
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default withAuth(SettingsPage, ["admin", "staff", "charity", "farmer"])