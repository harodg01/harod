"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { DashboardNav } from "@/components/dashboard-nav"
import { PatientForm } from "@/components/patient-form"
import { getCurrentUser, getPatientById, type User, type Patient } from "@/lib/mock-data"

export default function EditPatientPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [patient, setPatient] = useState<Patient | null>(null)

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
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Edit Patient</h1>
            <p className="text-muted-foreground">Update patient record</p>
          </div>

          <PatientForm userId={user.id} patient={patient} />
        </div>
      </main>
    </div>
  )
}