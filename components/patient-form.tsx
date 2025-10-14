"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createPatient, updatePatient, createAuditLog, getUsers, type Patient } from "@/lib/mock-data"

interface PatientFormProps {
  userId: string
  patient?: Patient
}

export function PatientForm({ userId, patient }: PatientFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: patient?.firstName || "",
    lastName: patient?.lastName || "",
    dateOfBirth: patient?.dateOfBirth || "",
    gender: (patient?.gender || "male") as "male" | "female" | "other",
    bloodType: patient?.bloodType || "",
    phone: patient?.phone || "",
    email: patient?.email || "",
    address: patient?.address || "",
    medicalHistory: patient?.medicalHistory || "",
    allergies: patient?.allergies || "",
    currentMedications: patient?.currentMedications || "",
  })

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log("[v0] Starting patient save...")
      console.log("[v0] Form data:", formData)
      
      const users = getUsers()
      console.log("[v0] Users found:", users.length)
      
      const currentUser = users.find((u) => u.id === userId)
      console.log("[v0] Current user:", currentUser)

      if (patient) {
        // Update existing patient
        console.log("[v0] Updating patient:", patient.id)
        updatePatient(patient.id, formData)

        if (currentUser) {
          createAuditLog({
            userId: currentUser.id,
            userName: currentUser.fullName,
            action: "UPDATE_PATIENT",
            details: `Updated patient record for ${formData.firstName} ${formData.lastName}`,
          })
        }

        router.push(`/dashboard/patients/${patient.id}`)
      } else {
        // Create new patient - assign to all doctors and nurses
        const assignedTo = users.filter((u) => u.role === "doctor" || u.role === "nurse").map((u) => u.id)
        console.log("[v0] Assigned to:", assignedTo)

        const newPatient = createPatient({
          ...formData,
          assignedTo,
        })
        console.log("[v0] New patient created:", newPatient)

        if (currentUser) {
          createAuditLog({
            userId: currentUser.id,
            userName: currentUser.fullName,
            action: "CREATE_PATIENT",
            details: `Created patient record for ${formData.firstName} ${formData.lastName} (Case: ${newPatient.caseNumber})`,
          })
        }

        console.log("[v0] Redirecting to patients list...")
        router.push("/dashboard/patients")
      }
    } catch (error) {
      console.error("[v0] Error saving patient:", error)
      alert(`Failed to save patient: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value: any) => setFormData({ ...formData, gender: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bloodType">Blood Type</Label>
              <Input
                id="bloodType"
                placeholder="e.g., A+, O-, B+"
                value={formData.bloodType}
                onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicalHistory">Medical History</Label>
            <Textarea
              id="medicalHistory"
              placeholder="Previous conditions, surgeries, etc."
              value={formData.medicalHistory}
              onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies</Label>
            <Textarea
              id="allergies"
              placeholder="Known allergies"
              value={formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentMedications">Current Medications</Label>
            <Textarea
              id="currentMedications"
              placeholder="Current medications and dosages"
              value={formData.currentMedications}
              onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? (patient ? "Updating..." : "Creating...") : (patient ? "Update Patient" : "Create Patient")}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}