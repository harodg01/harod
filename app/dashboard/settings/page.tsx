"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { DashboardNav } from "@/components/dashboard-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getCurrentUser, type User } from "@/lib/mock-data"

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/auth/login")
      return
    }
    setUser(currentUser)
  }, [router])

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                <p className="text-lg">{user.fullName}</p>
              </div>
              <div className="grid gap-2">
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-lg">{user.email}</p>
              </div>
              <div className="grid gap-2">
                <p className="text-sm font-medium text-muted-foreground">Role</p>
                <Badge className="w-fit capitalize">{user.role}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Account security information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <p className="text-sm font-medium text-muted-foreground">Account Status</p>
                <Badge variant="outline" className="w-fit">Active</Badge>
              </div>
              <div className="grid gap-2">
                <p className="text-sm font-medium text-muted-foreground">Last Login</p>
                <p className="text-lg">{new Date().toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}