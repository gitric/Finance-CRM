import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Award, ClipboardCheck, AlertCircle } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { count: entityCount } = await supabase
    .from("entities")
    .select("*", { count: "exact", head: true });

  const { count: managerCount } = await supabase
    .from("finance_managers")
    .select("*", { count: "exact", head: true });

  const { count: certCount } = await supabase
    .from("certifications")
    .select("*", { count: "exact", head: true })
    .eq("status", "valid");

  const currentYear = new Date().getFullYear();
  const { count: auditCount } = await supabase
    .from("audits")
    .select("*", { count: "exact", head: true })
    .eq("audit_year", currentYear);

  const { data: upcomingAudits } = await supabase
    .from("audits")
    .select("*, entities(name), finance_managers(full_name)")
    .in("status", ["scheduled", "in_progress"])
    .order("due_date", { ascending: true })
    .limit(5);

  const { data: expiringCerts } = await supabase
    .from("certifications")
    .select("*, finance_managers(full_name), training_programs(title)")
    .lte("expires_at", new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString())
    .eq("status", "valid")
    .order("expires_at", { ascending: true })
    .limit(5);

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
            <div className="text-2xl font-bold">{entityCount ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Finance Managers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{managerCount ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Certifications</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{certCount ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{currentYear} Audits</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditCount ?? 0}</div>
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
              {upcomingAudits && upcomingAudits.length > 0 ? (
                upcomingAudits.map((audit) => (
                  <div
                    key={audit.id}
                    className="flex items-center justify-between border-b last:border-0 pb-3 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{audit.entities?.name || "Unknown Entity"}</p>
                      <p className="text-sm text-muted-foreground">
                        {audit.finance_managers?.full_name || "Unassigned"} • Due {audit.due_date}
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
              {expiringCerts && expiringCerts.length > 0 ? (
                expiringCerts.map((cert) => (
                  <div
                    key={cert.id}
                    className="flex items-center justify-between border-b last:border-0 pb-3 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">
                        {cert.finance_managers?.full_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {cert.training_programs?.title} • Expires {cert.expires_at?.split("T")[0]}
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