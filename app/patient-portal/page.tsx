"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { DashboardNav } from "@/components/dashboard-nav"
import { PatientDocumentation } from "@/components/patient-documentation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser, getPatientById, getPatientDocuments, type User, type Patient, type PatientDocument } from "@/lib/mock-data"

export default function PatientPortalPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [patient, setPatient] = useState<Patient | null>(null)
  const [documents, setDocuments] = useState<PatientDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/auth/login")
      return
    }

    if (currentUser.role !== "patient") {
      router.push("/dashboard")
      return
    }

    if (!currentUser.patientId) {
      alert("Your account is not linked to a patient record. Please contact support.")
      router.push("/")
      return
    }

    const patientData = getPatientById(currentUser.patientId)
    if (!patientData) {
      alert("Patient record not found. Please contact support.")
      router.push("/")
      return
    }

    setUser(currentUser)
    setPatient(patientData)
    setDocuments(getPatientDocuments(currentUser.patientId))
    setIsLoading(false)
  }, [router])

  if (isLoading || !patient || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your portal...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNav user={user} />

      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {patient.firstName} {patient.lastName}</CardTitle>
              <CardDescription>Manage your medical documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Case Number:</span>
                  <p className="font-medium">{patient.caseNumber}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <p className="font-medium">{patient.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <PatientDocumentation
            patientId={patient.id}
            documents={documents}
            onDocumentsChange={setDocuments}
          />
        </div>
      </main>
    </div>
  )
}