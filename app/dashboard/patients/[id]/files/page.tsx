"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { DashboardNav } from "@/components/dashboard-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser, getPatientById, type User, type Patient } from "@/lib/mock-data"

export default function PatientFilesPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [patient, setPatient] = useState<Patient | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/auth/login")
      return
    }
    setUser(currentUser)

    const patientData = getPatientById(params.id)
    if (!patientData) {
      router.push("/dashboard/patients")
      return
    }
    setPatient(patientData)
  }, [router, params.id])

  if (!user || !patient) return null

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Medical Files - {patient.firstName} {patient.lastName}
          </h1>
          <p className="text-muted-foreground">Upload and manage patient documents</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Patient Files</CardTitle>
            <CardDescription>Medical documents for this patient</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">File upload feature coming soon in prototype v2</p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}