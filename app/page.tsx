import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Activity, Shield, FileText, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">MediCare Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost">
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 text-center">
          <div className="mx-auto max-w-3xl space-y-6">
            <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-6xl">
              Modern Patient Management for Healthcare Professionals
            </h1>
            <p className="text-balance text-xl text-muted-foreground">
              Secure, efficient, and HIPAA-compliant digital patient records system. Replace paper-based workflows with
              a modern solution.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button asChild size="lg" className="h-12 px-8">
                <Link href="/auth/signup">Start free trial</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 bg-transparent">
                <Link href="/auth/login">Sign in</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-t border-border/40 bg-secondary/30 py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">HIPAA Compliant</h3>
                <p className="text-sm text-muted-foreground">
                  Enterprise-grade security with full audit logging and encryption
                </p>
              </div>
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Role-Based Access</h3>
                <p className="text-sm text-muted-foreground">Granular permissions for admins, doctors, and nurses</p>
              </div>
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <FileText className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Digital Records</h3>
                <p className="text-sm text-muted-foreground">
                  Store patient data, medical files, and documents securely
                </p>
              </div>
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Activity className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Real-Time Updates</h3>
                <p className="text-sm text-muted-foreground">Instant synchronization across all devices and users</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 MediCare Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
