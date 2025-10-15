import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Patient } from "@/lib/mock-data"
import { User, Mail, Phone, MapPin, Calendar, Droplet, AlertCircle } from 'lucide-react'

interface PatientInfoCardProps {
  patient: Patient
}

export function PatientInfoCard({ patient }: PatientInfoCardProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Avatar className="h-24 w-24">
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
              {getInitials(patient.firstName, patient.lastName)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Patient Info */}
        <div className="flex-1 space-y-4">
          {/* Name and Status */}
          <div>
            <h2 className="text-2xl font-bold">
              {patient.firstName} {patient.lastName}
            </h2>
            <p className="text-muted-foreground">Case #: {patient.caseNumber}</p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Age:</span>
              <span className="font-medium">{calculateAge(patient.dateOfBirth)} years</span>
            </div>

            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Gender:</span>
              <span className="font-medium capitalize">{patient.gender}</span>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">{patient.email}</span>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Phone:</span>
              <span className="font-medium">{patient.phone}</span>
            </div>

            {patient.bloodType && (
              <div className="flex items-center gap-2">
                <Droplet className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Blood Type:</span>
                <Badge variant="outline">{patient.bloodType}</Badge>
              </div>
            )}
          </div>

          {/* Allergies */}
          {patient.allergies && patient.allergies !== "None" && (
            <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
              <div>
                <span className="text-sm font-medium text-destructive">Allergies:</span>
                <p className="text-sm text-destructive/90">{patient.allergies}</p>
              </div>
            </div>
          )}

          {/* Address */}
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <span className="text-sm text-muted-foreground">Address:</span>
              <p className="text-sm font-medium">{patient.address}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}