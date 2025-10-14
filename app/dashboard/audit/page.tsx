"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { DashboardNav } from "@/components/dashboard-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getCurrentUser, getAuditLogs, type User, type AuditLog } from "@/lib/mock-data"

export default function AuditPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/auth/login")
      return
    }

    if (currentUser.role !== "admin") {
      router.push("/dashboard")
      return
    }

    setUser(currentUser)
    setAuditLogs(getAuditLogs())
  }, [router])

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Audit Log</h1>
          <p className="text-muted-foreground">Track all system activities for compliance</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Activity History</CardTitle>
            <CardDescription>Complete audit trail of all user actions</CardDescription>
          </CardHeader>
          <CardContent>
            {auditLogs.length > 0 ? (
              <div className="space-y-3">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex items-start justify-between rounded-lg border border-border/50 p-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{log.action.replace(/_/g, " ")}</Badge>
                        <span className="font-medium">{log.userName}</span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{log.details}</p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>{new Date(log.timestamp).toLocaleDateString()}</p>
                      <p>{new Date(log.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">No audit logs found</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}