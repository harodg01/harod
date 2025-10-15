// Mock data storage using localStorage

export interface User {
  id: string
  email: string
  fullName: string
  role: "admin" | "doctor" | "nurse" | "patient"
  patientId?: string
  password: string
}

export interface Patient {
  id: string
  caseNumber: string // <-- THIS LINE FIXES THE ERROR
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: "male" | "female" | "other"
  bloodType: string
  phone: string
  email: string
  address: string
  medicalHistory: string
  allergies: string
  currentMedications: string
  assignedTo: string[]
  createdAt: string
  updatedAt: string
}

export interface CheckIn {
  id: string
  patientId: string
  userId: string
  userName: string
  userRole: string
  notes: string
  timestamp: string
}

export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  details: string
  timestamp: string
}

// Initialize default data
function initializeData() {
  if (!localStorage.getItem("patientDocuments")) {
  localStorage.setItem("patientDocuments", JSON.stringify([]))
}
  if (typeof window === "undefined") return

  if (!localStorage.getItem("users")) {
    const defaultUsers: User[] = [
      {
        id: "1",
        email: "admin@hospital.com",
        fullName: "Admin User",
        role: "admin",
        password: "admin123",
      },
      {
        id: "2",
        email: "doctor@hospital.com",
        fullName: "Dr. Sarah Johnson",
        role: "doctor",
        password: "doctor123",
      },
      {
        id: "3",
        email: "nurse@hospital.com",
        fullName: "Nurse Mike Chen",
        role: "nurse",
        password: "nurse123",
      },
    ]
    localStorage.setItem("users", JSON.stringify(defaultUsers))
  }

  if (!localStorage.getItem("patients")) {
    const defaultPatients: Patient[] = [
      {
        id: "1",
        caseNumber: "001-A",
        firstName: "James",
        lastName: "Wilson",
        dateOfBirth: "1985-03-15",
        gender: "male",
        bloodType: "A+",
        phone: "+1-555-0101",
        email: "james.wilson@email.com",
        address: "123 Main St, New York, NY 10001",
        medicalHistory: "Hypertension, Type 2 Diabetes",
        allergies: "Penicillin",
        currentMedications: "Metformin 500mg, Lisinopril 10mg",
        assignedTo: ["2", "3"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        caseNumber: "002-B",
        firstName: "Emily",
        lastName: "Davis",
        dateOfBirth: "1992-07-22",
        gender: "female",
        bloodType: "O-",
        phone: "+1-555-0102",
        email: "emily.davis@email.com",
        address: "456 Oak Ave, Los Angeles, CA 90001",
        medicalHistory: "Asthma",
        allergies: "None",
        currentMedications: "Albuterol inhaler as needed",
        assignedTo: ["2", "3"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "3",
        caseNumber: "003-C",
        firstName: "Michael",
        lastName: "Brown",
        dateOfBirth: "1978-11-30",
        gender: "male",
        bloodType: "B+",
        phone: "+1-555-0103",
        email: "michael.brown@email.com",
        address: "789 Pine Rd, Chicago, IL 60601",
        medicalHistory: "Previous heart surgery (2019)",
        allergies: "Latex",
        currentMedications: "Aspirin 81mg, Atorvastatin 20mg",
        assignedTo: ["2", "3"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
    localStorage.setItem("patients", JSON.stringify(defaultPatients))
  }

  if (!localStorage.getItem("checkIns")) {
    localStorage.setItem("checkIns", JSON.stringify([]))
  }

  if (!localStorage.getItem("auditLogs")) {
    localStorage.setItem("auditLogs", JSON.stringify([]))
  }
}

if (typeof window !== "undefined") {
  initializeData()
}

// User functions
export function getUsers(): User[] {
  if (typeof window === "undefined") return []
  const users = localStorage.getItem("users")
  return users ? JSON.parse(users) : []
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email === email)
}

export function createUser(user: Omit<User, "id">): User {
  const users = getUsers()
  const newUser: User = {
    ...user,
    id: Date.now().toString(),
  }
  users.push(newUser)
  localStorage.setItem("users", JSON.stringify(users))
  return newUser
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const currentUserId = localStorage.getItem("currentUserId")
  if (!currentUserId) return null
  return getUsers().find((u) => u.id === currentUserId) || null
}

export function setCurrentUser(userId: string) {
  localStorage.setItem("currentUserId", userId)
}

export function logout() {
  localStorage.removeItem("currentUserId")
}

// Patient functions
export function getPatients(): Patient[] {
  if (typeof window === "undefined") return []
  const patients = localStorage.getItem("patients")
  return patients ? JSON.parse(patients) : []
}

export function getPatientById(id: string): Patient | undefined {
  return getPatients().find((p) => p.id === id)
}

export function getPatientsByAssignedUser(userId: string): Patient[] {
  return getPatients().filter((p) => p.assignedTo.includes(userId))
}

function generateCaseNumber(): string {
  const patients = getPatients()
  const numbers = patients
    .filter((p) => p.caseNumber) // <-- ADD THIS LINE to filter out undefined
    .map((p) => parseInt(p.caseNumber.split("-")[0]))
    .filter((n) => !isNaN(n))
  const nextNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : 1
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const letter = letters[Math.floor(Math.random() * letters.length)]
  return `${String(nextNumber).padStart(3, "0")}-${letter}`
}

export function createPatient(
  patient: Omit<Patient, "id" | "caseNumber" | "createdAt" | "updatedAt">
): Patient {
  const patients = getPatients()
  const newPatient: Patient = {
    ...patient,
    id: Date.now().toString(),
    caseNumber: generateCaseNumber(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  patients.push(newPatient)
  localStorage.setItem("patients", JSON.stringify(patients))
  return newPatient
}

export function updatePatient(
  id: string,
  updates: Partial<Omit<Patient, "id" | "caseNumber" | "createdAt">>
): Patient | undefined {
  const patients = getPatients()
  const index = patients.findIndex((p) => p.id === id)
  if (index === -1) return undefined

  patients[index] = {
    ...patients[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  localStorage.setItem("patients", JSON.stringify(patients))
  return patients[index]
}

// Check-in functions
export function getCheckIns(): CheckIn[] {
  if (typeof window === "undefined") return []
  const checkIns = localStorage.getItem("checkIns")
  return checkIns ? JSON.parse(checkIns) : []
}

export function getCheckInsByPatient(patientId: string): CheckIn[] {
  return getCheckIns().filter((c) => c.patientId === patientId)
}

export function createCheckIn(
  checkIn: Omit<CheckIn, "id" | "timestamp">
): CheckIn {
  const checkIns = getCheckIns()
  const newCheckIn: CheckIn = {
    ...checkIn,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
  }
  checkIns.push(newCheckIn)
  localStorage.setItem("checkIns", JSON.stringify(checkIns))
  return newCheckIn
}

// Audit log functions
export function getAuditLogs(): AuditLog[] {
  if (typeof window === "undefined") return []
  const logs = localStorage.getItem("auditLogs")
  return logs ? JSON.parse(logs) : []
}

export function createAuditLog(
  log: Omit<AuditLog, "id" | "timestamp">
): AuditLog {
  const logs = getAuditLogs()
  const newLog: AuditLog = {
    ...log,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
  }
  logs.push(newLog)
  localStorage.setItem("auditLogs", JSON.stringify(logs))
  return newLog
}

// ADD THIS INTERFACE after the CheckIn interface
export interface PatientDocument {
  id: string
  patientId: string
  fileName: string
  fileType: "image" | "pdf" | "document" | "lab-result" | "prescription" | "letter" | "other"
  fileUrl: string
  fileSize: number
  uploadedBy: string
  uploadedAt: string
  description?: string
  tags?: string[]
}

// ADD THIS to the initializeData function (after the auditLogs initialization)
if (!localStorage.getItem("patientDocuments")) {
  localStorage.setItem("patientDocuments", JSON.stringify([]))
}
// Patient Documents
export interface PatientDocument {
  id: string
  patientId: string
  fileName: string
  fileType: "image" | "pdf" | "document" | "lab-result" | "prescription" | "letter" | "other"
  fileUrl: string
  fileSize: number
  uploadedBy: string
  uploadedAt: string
  description?: string
  tags?: string[]
}

export function getPatientDocuments(patientId: string): PatientDocument[] {
  if (typeof window === "undefined") return []
  const documents = localStorage.getItem("patientDocuments")
  const allDocuments: PatientDocument[] = documents ? JSON.parse(documents) : []
  return allDocuments.filter((doc) => doc.patientId === patientId)
}

export function createPatientDocument(
  document: Omit<PatientDocument, "id" | "fileUrl" | "uploadedAt">
): PatientDocument {
  const documents = getAllPatientDocuments()
  const newDocument: PatientDocument = {
    ...document,
    id: Date.now().toString(),
    fileUrl: `/documents/${document.fileName}`,
    uploadedAt: new Date().toISOString(),
  }
  documents.push(newDocument)
  localStorage.setItem("patientDocuments", JSON.stringify(documents))
  return newDocument
}

export function deletePatientDocument(documentId: string) {
  const documents = getAllPatientDocuments()
  const filtered = documents.filter((doc) => doc.id !== documentId)
  localStorage.setItem("patientDocuments", JSON.stringify(filtered))
}

function getAllPatientDocuments(): PatientDocument[] {
  if (typeof window === "undefined") return []
  const documents = localStorage.getItem("patientDocuments")
  return documents ? JSON.parse(documents) : []
}