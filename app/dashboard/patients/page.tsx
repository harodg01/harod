"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { DashboardNav } from "@/components/dashboard-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { UserPlus, Search, Stethoscope, Calendar, Phone, Mail, MapPin } from 'lucide-react'
import Link from "next/link"
import { getCurrentUser, getPatients, getPatientsByAssignedUser, getUsers, type Patient, type User } from "@/lib/mock-data"

export default function PatientsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [patients, setPatients] = useState<Patient[]>([])
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/auth/login")
      return
    }
    setUser(currentUser)
    setAllUsers(getUsers())

    if (currentUser.role === "admin") {
      setPatients(getPatients())
    } else {
      setPatients(getPatientsByAssignedUser(currentUser.id))
    }
  }, [router])

  const getDoctorNames = (assignedTo: string[]) => {
    return allUsers
      .filter((u) => assignedTo.includes(u.id) && u.role === "doctor")
      .map((u) => u.fullName)
  }

  const filteredPatients = patients.filter((patient) => {
    const query = searchQuery.toLowerCase()
    return (
      patient.firstName.toLowerCase().includes(query) ||
      patient.lastName.toLowerCase().includes(query) ||
      patient.caseNumber.toLowerCase().includes(query) ||
      patient.email.toLowerCase().includes(query) ||
      patient.phone.toLowerCase().includes(query)
    )
  })

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <DashboardNav user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Patient Directory</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              {user.role === "admin" 
                ? `Managing ${patients.length} patient${patients.length !== 1 ? 's' : ''} across the facility` 
                : `${patients.length} patient${patients.length !== 1 ? 's' : ''} under your care`}
            </p>
          </div>
          {(user.role === "admin" || user.role === "doctor") && (
            <Button asChild size="lg" className="shadow-lg">
              <Link href="/dashboard/patients/new">
                <UserPlus className="mr-2 h-5 w-5" />
                Add New Patient
              </Link>
            </Button>
          )}
        </div>

        <Card className="border-border/50 shadow-xl">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">
                  {user.role === "admin" ? "All Patients" : "Your Assigned Patients"}
                </CardTitle>
                <CardDescription className="mt-1.5 text-base">
                  Complete patient records with treatment information
                </CardDescription>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, case number, email, or phone..."
                className="h-12 pl-12 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {filteredPatients.length > 0 ? (
              <div className="grid gap-4">
                {filteredPatients.map((patient) => {
                  const doctors = getDoctorNames(patient.assignedTo)
                  return (
                    <Link
                      key={patient.id}
                      href={`/dashboard/patients/${patient.id}`}
                      className="group relative overflow-hidden rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-16 w-16 border-2 border-primary/20">
                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-lg font-bold text-primary">
                              {patient.firstName[0]}{patient.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 space-y-3">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-xl font-semibold group-hover:text-primary">
                                  {patient.firstName} {patient.lastName}
                                </h3>
                                <Badge variant="outline" className="font-mono">
                                  #{patient.caseNumber}
                                </Badge>
                                {patient.bloodType && (
                                  <Badge variant="secondary" className="font-mono">
                                    {patient.bloodType}
                                  </Badge>
                                )}
                                <Badge className="capitalize">
                                  {patient.gender}
                                </Badge>
                              </div>
                              
                              {doctors.length > 0 && (
                                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                                  <Stethoscope className="h-4 w-4 text-primary" />
                                  <span className="font-medium">Treating Doctor:</span>
                                  <span className="text-foreground">{doctors.join(", ")}</span>
                                </div>
                              )}
                            </div>

                            <div className="grid gap-2 text-sm md:grid-cols-2 lg:grid-cols-4">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}</span>
                              </div>
                              {patient.phone && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Phone className="h-4 w-4" />
                                  <span>{patient.phone}</span>
                                </div>
                              )}
                              {patient.email && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Mail className="h-4 w-4" />
                                  <span className="truncate">{patient.email}</span>
                                </div>
                              )}
                              {patient.address && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <MapPin className="h-4 w-4" />
                                  <span className="truncate">{patient.address.split(",")[0]}</span>
                                </div>
                              )}
                            </div>

                            {(patient.medicalHistory || patient.allergies) && (
                              <div className="flex flex-wrap gap-4 text-sm">
                                {patient.medicalHistory && (
                                  <div>
                                    <span className="font-medium text-muted-foreground">History: </span>
                                    <span className="text-foreground">{patient.medicalHistory}</span>
                                  </div>
                                )}
                                {patient.allergies && patient.allergies !== "None" && (
                                  <div>
                                    <span className="font-medium text-destructive">Allergies: </span>
                                    <span className="text-destructive">{patient.allergies}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 lg:flex-col lg:items-end">
                          <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-muted p-6">
                  <UserPlus className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  {searchQuery ? "No patients found" : "No patients yet"}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchQuery 
                    ? "Try adjusting your search query" 
                    : "Add your first patient to get started"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}