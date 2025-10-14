"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { DashboardNav } from "@/components/dashboard-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser, type User } from "@/lib/mock-data"

export default function FilesPage() {
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
          <h1 className="text-3xl font-bold tracking-tight">Medical Files</h1>
          <p className="text-muted-foreground">View all medical documents</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Files</CardTitle>
            <CardDescription>Medical documents across all patients</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">No files uploaded yet. Visit individual patient pages to upload files.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}