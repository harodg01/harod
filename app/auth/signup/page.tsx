"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Activity } from "lucide-react"
import { createUser, getUserByEmail, createAuditLog, createPatient } from "@/lib/mock-data"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [role, setRole] = useState<string>("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [showPatientFields, setShowPatientFields] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()


  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!role) {
      setError("Please select a role")
      setIsLoading(false)
      return
    }

    try {
      const existingUser = getUserByEmail(email)
      if (existingUser) {
        throw new Error("User with this email already exists")
      }

      let patientId: string | undefined = undefined

// If role is patient, create patient record first
if (role === "patient") {
  if (!dateOfBirth || !phone || !address) {
    throw new Error("Please fill in all patient information")
  }

  const nameParts = fullName.split(" ")
  const firstName = nameParts[0]
  const lastName = nameParts.slice(1).join(" ") || nameParts[0]

  const newPatient = createPatient({
  firstName,
  lastName,
  dateOfBirth,
  email,
  phone,
  address,
  gender: "other",
  bloodType: "",
  medicalHistory: "",
  allergies: "",
  currentMedications: "",
  assignedTo: [],
})

  patientId = newPatient.id
}

const newUser = createUser({
  email,
  password,
  fullName,
  role: role as "admin" | "doctor" | "nurse" | "patient",
  patientId,
})  

      // Create audit log
      createAuditLog({
        userId: newUser.id,
        userName: newUser.fullName,
        action: "SIGNUP",
        details: `New user ${newUser.fullName} registered as ${role}`,
      })

      router.push("/auth/signup-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <Activity className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">MediCare Portal</h1>
          <p className="mt-2 text-sm text-muted-foreground">Secure patient management system</p>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold">Create account</CardTitle>
            <CardDescription>Register as a healthcare professional</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Dr. John Smith"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="doctor@hospital.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11"
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={(value) => {
  setRole(value)
  setShowPatientFields(value === "patient")
}}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="nurse">Nurse</SelectItem>
                    <SelectItem value="patient">Patient</SelectItem>
                  </SelectContent>
                </Select>
                
              </div>
              {showPatientFields && (
  <>
    <div className="space-y-2">
      <Label htmlFor="dateOfBirth">Date of Birth</Label>
      <Input
        id="dateOfBirth"
        type="date"
        value={dateOfBirth}
        onChange={(e) => setDateOfBirth(e.target.value)}
        required
        className="h-11"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="phone">Phone Number</Label>
      <Input
        id="phone"
        type="tel"
        placeholder="+1 (555) 000-0000"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
        className="h-11"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="address">Address</Label>
      <Input
        id="address"
        type="text"
        placeholder="123 Main St, City, State"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
        className="h-11"
      />
    </div>
  </>
)}
              {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
              <Button type="submit" className="h-11 w-full font-medium" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
