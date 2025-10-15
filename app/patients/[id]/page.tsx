"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { DashboardNav } from "@/components/dashboard-nav"
import { PatientInfoCard } from "@/components/patient-info-card"
import { PatientDocumentation } from "@/components/patient-documentation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Activity, Calendar, FolderOpen } from 'lucide-react'
import Link from "next/link"
import {
  getCurrentUser,
  getPatientById,
  getCheckInsByPatient,
  getPatientDocuments,
  type User,
  type Patient,
  type PatientDocument,
} from "@/lib/mock-data"

export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [patient, setPatient] = useState<Patient | null>(null)
  const [documents, setDocuments] = useState<PatientDocument[]>([])
  const [checkIns, setCheckIns] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/auth/login")
      return
    }

    const patientData = getPatientById(id)
    if (!patientData) {
      router.push("/dashboard")
      return
    }

    setUser(currentUser)
    setPatient(patientData)
    setDocuments(getPatientDocuments(id))
    setCheckIns(getCheckInsByPatient(id))
    setIsLoading(false)
  }, [id, router])

  if (isLoading || !patient || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading patient data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNav user={user} />

      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>

          <PatientInfoCard patient={patient} />

          <Tabs defaultValue="documentation" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto">
              <TabsTrigger value="documentation" className="gap-2">
                <FolderOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Documentation</span>
              </TabsTrigger>
              <TabsTrigger value="check-ins" className="gap-2">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">Check-ins</span>
              </TabsTrigger>
              <TabsTrigger value="medical" className="gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Medical Info</span>
              </TabsTrigger>
              <TabsTrigger value="timeline" className="gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Timeline</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="documentation">
              <PatientDocumentation
                patientId={id}
                documents={documents}
                onDocumentsChange={setDocuments}
              />
            </TabsContent>

            <TabsContent value="check-ins">
              <Card>
                <CardHeader>
                  <CardTitle>Check-in History</CardTitle>
                  <CardDescription>Recent check-ins for this patient</CardDescription>
                </CardHeader>
                <CardContent>
                  {checkIns.length > 0 ? (
                    <div className="space-y-4">
                      {checkIns.map((checkIn) => (
                        <div key={checkIn.id} className="border-l-2 border-primary pl-4 pb-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">{checkIn.userName}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(checkIn.timestamp).toLocaleString()}
                              </p>
                              <Badge variant="outline" className="mt-1">
                                {checkIn.userRole}
                              </Badge>
                            </div>
                          </div>
                          {checkIn.notes && (
                            <p className="mt-2 text-sm text-muted-foreground">{checkIn.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No check-ins recorded yet</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="medical">
              <Card>
                <CardHeader>
                  <CardTitle>Medical Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Medical History</h4>
                    <p className="text-sm text-muted-foreground">
                      {patient.medicalHistory || "No medical history recorded"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Allergies</h4>
                    <p className="text-sm text-muted-foreground">
                      {patient.allergies || "No known allergies"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Current Medications</h4>
                    <p className="text-sm text-muted-foreground">
                      {patient.currentMedications || "No current medications"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline">
              <Card>
                <CardHeader>
                  <CardTitle>Patient Timeline</CardTitle>
                  <CardDescription>Chronological view of all patient activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-8">Timeline view coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}