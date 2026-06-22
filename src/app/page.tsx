import { listAudits } from "@/lib/audits";
import { listCertifications } from "@/lib/certifications";
import { listEntities } from "@/lib/entities";
import { listFinanceManagers } from "@/lib/finance-managers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Award, ClipboardCheck, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const currentYear = new Date().getFullYear();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiresBefore = new Date(today);
  expiresBefore.setDate(expiresBefore.getDate() + 30);

  const [entities, managers, certifications, audits] = await Promise.all([
    listEntities(),
    listFinanceManagers(),
    listCertifications(),
    listAudits(),
  ]);

  const activeCertifications = certifications.filter(
    (cert) => cert.status === "valid",
  );
  const currentYearAudits = audits.filter(
    (audit) => audit.audit_year === currentYear,
  );
  const upcomingAudits = audits
    .filter(
      (audit) => audit.status === "scheduled" || audit.status === "in_progress",
    )
    .slice(0, 5);
  const expiringCerts = activeCertifications
    .filter((cert) => {
      if (!cert.expires_at) {
        return false;
      }

      const expiresAt = new Date(cert.expires_at);

      return expiresAt >= today && expiresAt <= expiresBefore;
    })
    .sort((a, b) => (a.expires_at ?? "").localeCompare(b.expires_at ?? ""))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your audit portfolio
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entities</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{entities.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Finance Managers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{managers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Certifications</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCertifications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{currentYear} Audits</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentYearAudits.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Audits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAudits.length > 0 ? (
                upcomingAudits.map((audit) => (
                  <div
                    key={audit.id}
                    className="flex items-center justify-between border-b last:border-0 pb-3 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{audit.entity_name || "Unknown Entity"}</p>
                      <p className="text-sm text-muted-foreground">
                        {audit.manager_name || "Unassigned"} • Due {audit.due_date}
                      </p>
                    </div>
                    <Badge
                      variant={
                        audit.status === "in_progress" ? "default" : "secondary"
                      }
                    >
                      {audit.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No upcoming audits</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <CardTitle>Certifications Expiring Soon</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expiringCerts.length > 0 ? (
                expiringCerts.map((cert) => (
                  <div
                    key={cert.id}
                    className="flex items-center justify-between border-b last:border-0 pb-3 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">
                        {cert.manager_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {cert.program_title} • Expires {cert.expires_at?.split("T")[0]}
                      </p>
                    </div>
                    <Badge variant="destructive">Expiring</Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No certifications expiring in the next 30 days
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
