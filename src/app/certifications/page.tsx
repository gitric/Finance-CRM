import { createClient } from "@/lib/supabase/server";
import { createCertification, revokeCertification } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export default async function CertificationsPage() {
  const supabase = await createClient();
  const { data: certifications } = await supabase
    .from("certifications")
    .select("*, finance_managers(full_name), training_programs(title)")
    .order("issued_at", { ascending: false });

  const { data: managers } = await supabase
    .from("finance_managers")
    .select("id, full_name")
    .eq("status", "active")
    .order("full_name");

  const { data: programs } = await supabase
    .from("training_programs")
    .select("id, title")
    .eq("status", "active")
    .order("title");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Certifications</h1>
          <p className="text-muted-foreground mt-1">
            Track and issue manager certifications
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Issue Certification</Button>
          </DialogTrigger>
          <DialogContent>
            <form action={createCertification}>
              <DialogHeader>
                <DialogTitle>Issue New Certification</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Manager</label>
                  <select
                    name="manager_id"
                    required
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">Select Manager</option>
                    {managers?.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.full_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Program</label>
                  <select
                    name="program_id"
                    required
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">Select Program</option>
                    {programs?.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Expiration Date</label>
                  <Input name="expires_at" type="date" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Issue Certification</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Manager</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Issued</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {certifications && certifications.length > 0 ? (
              certifications.map((cert) => (
                <TableRow key={cert.id}>
                  <TableCell className="font-medium">
                    {cert.finance_managers?.full_name || "—"}
                  </TableCell>
                  <TableCell>
                    {cert.training_programs?.title || "—"}
                  </TableCell>
                  <TableCell>
                    {cert.issued_at ? cert.issued_at.split("T")[0] : "—"}
                  </TableCell>
                  <TableCell>
                    {cert.expires_at ? cert.expires_at.split("T")[0] : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        cert.status === "valid"
                          ? "default"
                          : cert.status === "expired"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {cert.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {cert.status === "valid" && (
                      <form
                        action={revokeCertification.bind(null, cert.id)}
                      >
                        <Button type="submit" variant="ghost" size="sm">
                          Revoke
                        </Button>
                      </form>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground h-24"
                >
                  No certifications found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}