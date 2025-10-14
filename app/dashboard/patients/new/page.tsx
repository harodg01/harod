"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { DashboardNav } from "@/components/dashboard-nav"
import { PatientForm } from "@/components/patient-form"
import { getCurrentUser, type User } from "@/lib/mock-data"

export default function NewPatientPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/auth/login")
      return
    }

    if (currentUser.role !== "admin" && currentUser.role !== "doctor") {
      router.push("/dashboard")
      return
    }

    setUser(currentUser)
  }, [router])

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Add New Patient</h1>
            <p className="text-muted-foreground">Create a new patient record</p>
          </div>

          <PatientForm userId={user.id} />
        </div>
      </main>
    </div>
  )
}