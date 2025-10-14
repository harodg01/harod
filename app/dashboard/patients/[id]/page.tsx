"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardNav } from "@/components/dashboard-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Edit, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import {
  getCurrentUser,
  getPatientById,
  getCheckInsByPatient,
  createCheckIn,
  createAuditLog,
  type User,
  type Patient,
  type CheckIn,
} from "@/lib/mock-data"
import { Activity } from "lucide-react"

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [patient, setPatient] = useState<Patient | null>(null)
  const [checkIns, setCheckIns] = useState<CheckIn[]>([])
  const [checkInNotes, setCheckInNotes] = useState("")
  const [isCheckingIn, setIsCheckingIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()

    if (!currentUser) {
      router.push("/auth/login")
      return
    }

    setUser(currentUser)

    const patientData = getPatientById(params.id)

    if (!patientData) {
      router.push("/dashboard")
      return
    }

    setPatient(patientData)

    const patientCheckIns = getCheckInsByPatient(params.id)
    setCheckIns(patientCheckIns)

    setIsLoading(false)
  }, [params.id, router])

  const handleCheckIn = () => {
    if (!user || !patient) return

    setIsCheckingIn(true)

    const newCheckIn = createCheckIn({
      patientId: patient.id,
      userId: user.id,
      userName: user.fullName,
      userRole: user.role,
      notes: checkInNotes,
    })

    // Create audit log
    createAuditLog({
      userId: user.id,
      userName: user.fullName,
      action: "CHECK_IN",
      details: `${user.fullName} checked on patient ${patient.firstName} ${patient.lastName}`,
    })

    setCheckIns([newCheckIn, ...checkIns])
    setCheckInNotes("")
    setIsCheckingIn(false)
  }

  if (isLoading || !user || !patient) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Activity className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const todayCheckIn = checkIns.find((checkIn) => {
    const checkInDate = new Date(checkIn.timestamp).toDateString()
    const today = new Date().toDateString()
    return checkInDate === today && checkIn.userId === user.id
  })

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="icon">
                <Link href="/dashboard">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {patient.firstName} {patient.lastName}
                </h1>
                <p className="text-muted-foreground">Patient Record</p>
              </div>
            </div>
            <div className="flex gap-2">
              {(user.role === "admin" || user.role === "doctor") && (
                <Button asChild variant="outline">
                  <Link href={`/dashboard/patients/${patient.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Patient Check-in</CardTitle>
                      <CardDescription>Confirm you have checked on this patient</CardDescription>
                    </div>
                    {todayCheckIn ? (
                      <Badge className="bg-green-500/10 text-green-700">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Checked Today
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-orange-500/50 text-orange-700">
                        <Clock className="mr-1 h-3 w-3" />
                        Needs Check-in
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!todayCheckIn ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Check-in Notes (Optional)</Label>
                        <Textarea
                          id="notes"
                          placeholder="Add any observations or notes about the patient..."
                          value={checkInNotes}
                          onChange={(e) => setCheckInNotes(e.target.value)}
                          rows={3}
                        />
                      </div>
                      <Button onClick={handleCheckIn} disabled={isCheckingIn} className="w-full">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {isCheckingIn ? "Checking in..." : "Confirm Check-in"}
                      </Button>
                    </>
                  ) : (
                    <div className="rounded-lg bg-green-500/10 p-4">
                      <p className="text-sm font-medium text-green-700">
                        You checked on this patient today at {new Date(todayCheckIn.timestamp).toLocaleTimeString()}
                      </p>
                      {todayCheckIn.notes && <p className="mt-2 text-sm text-muted-foreground">{todayCheckIn.notes}</p>}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                      <p className="text-base">{new Date(patient.dateOfBirth).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Gender</p>
                      <Badge variant="secondary" className="capitalize">
                        {patient.gender}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Blood Type</p>
                      <p className="text-base font-mono">{patient.bloodType || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Phone</p>
                      <p className="text-base">{patient.phone || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="text-base">{patient.email || "Not provided"}</p>
                    </div>
                  </div>
                  {patient.address && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Address</p>
                        <p className="text-base">{patient.address}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Medical Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Medical History</p>
                    <p className="text-base whitespace-pre-wrap">{patient.medicalHistory || "No history recorded"}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Allergies</p>
                    <p className="text-base whitespace-pre-wrap">{patient.allergies || "No known allergies"}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Current Medications</p>
                    <p className="text-base whitespace-pre-wrap">
                      {patient.currentMedications || "No current medications"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Check-in History</CardTitle>
                  <CardDescription>{checkIns.length} total check-ins</CardDescription>
                </CardHeader>
                <CardContent>
                  {checkIns.length > 0 ? (
                    <div className="space-y-3">
                      {checkIns.slice(0, 5).map((checkIn) => (
                        <div key={checkIn.id} className="rounded-lg border border-border/50 p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{checkIn.userName}</p>
                              <p className="text-xs text-muted-foreground capitalize">{checkIn.userRole}</p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {new Date(checkIn.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                          {checkIn.notes && <p className="mt-2 text-xs text-muted-foreground">{checkIn.notes}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No check-ins yet</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Record Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-muted-foreground">Created</p>
                    <p>{new Date(patient.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Last Updated</p>
                    <p>{new Date(patient.updatedAt).toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
