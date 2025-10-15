"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardNav } from "@/components/dashboard-nav"
import { StatsCard } from "@/components/stats-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, UserPlus, FileText, Activity, Search, CheckCircle } from "lucide-react"
import Link from "next/link"
import {
  getCurrentUser,
  getPatientsByAssignedUser,
  getCheckInsByPatient,
  type User,
  type Patient,
} from "@/lib/mock-data"
export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [assignedPatients, setAssignedPatients] = useState<Patient[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    
    const currentUser = getCurrentUser()

    if (!currentUser) {
      router.push("/auth/login")
      return
    }
    if (currentUser.role === "patient") {
    router.push("/patient-portal")
    return
  }

  

    setUser(currentUser)

    const patients = getPatientsByAssignedUser(currentUser.id)
    setAssignedPatients(patients)
    setIsLoading(false)
  }, [router])

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Activity className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const filteredPatients = assignedPatients.filter((patient) => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase()
    return fullName.includes(searchQuery.toLowerCase())
  })

  const patientsNeedingCheckIn = assignedPatients.filter((patient) => {
    const checkIns = getCheckInsByPatient(patient.id)
    const todayCheckIns = checkIns.filter((checkIn) => {
      const checkInDate = new Date(checkIn.timestamp).toDateString()
      const today = new Date().toDateString()
      return checkInDate === today && checkIn.userId === user.id
    })
    return todayCheckIns.length === 0
  })

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.fullName}</p>
          </div>
          {(user.role === "admin" || user.role === "doctor") && (
            <Button asChild size="lg">
              <Link href="/dashboard/patients/new">
                <UserPlus className="mr-2 h-5 w-5" />
                Add Patient
              </Link>
            </Button>
          )}
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Assigned Patients"
            value={assignedPatients.length}
            icon={Users}
            description="Patients under your care"
          />
          <StatsCard
            title="Need Check-in"
            value={patientsNeedingCheckIn.length}
            icon={Activity}
            description="Patients to check today"
          />
          <StatsCard title="Your Role" value={user.role} icon={FileText} description="Access level" />
          <StatsCard
            title="Checked Today"
            value={assignedPatients.length - patientsNeedingCheckIn.length}
            icon={CheckCircle}
            description="Completed check-ins"
          />
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My Assigned Patients</CardTitle>
                <CardDescription>Patients assigned to you for care</CardDescription>
              </div>
              <Button asChild variant="outline">
                <Link href="/dashboard/patients">View all</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search patients..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {filteredPatients.length > 0 ? (
              <div className="space-y-3">
                {filteredPatients.map((patient) => {
                  const checkIns = getCheckInsByPatient(patient.id)
                  const todayCheckIn = checkIns.find((checkIn) => {
                    const checkInDate = new Date(checkIn.timestamp).toDateString()
                    const today = new Date().toDateString()
                    return checkInDate === today && checkIn.userId === user.id
                  })

                  return (
                    <Link
                      key={patient.id}
                      href={`/dashboard/patients/${patient.id}`}
                      className="flex items-center justify-between rounded-lg border border-border/50 p-4 transition-colors hover:bg-accent"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                          {patient.firstName[0]}
                          {patient.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium">
                            {patient.firstName} {patient.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {patient.bloodType && <Badge variant="outline">{patient.bloodType}</Badge>}
                        <Badge variant="secondary" className="capitalize">
                          {patient.gender}
                        </Badge>
                        {todayCheckIn ? (
                          <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Checked
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-orange-500/50 text-orange-700">
                            Needs Check-in
                          </Badge>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <h3 className="mb-2 text-lg font-semibold">
                  {searchQuery ? "No patients found" : "No assigned patients"}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {searchQuery ? "Try adjusting your search query" : "You don't have any patients assigned to you yet"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
