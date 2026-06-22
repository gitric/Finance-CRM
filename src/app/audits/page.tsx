import { createClient } from "@/lib/supabase/server";
import { createAudit, completeAudit, deleteAudit } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

export const dynamic = "force-dynamic";

export default async function AuditsPage() {
  const supabase = await createClient();
  const { data: audits } = await supabase
    .from("audits")
    .select("*, entities(name), finance_managers(full_name)")
    .order("due_date", { ascending: true });

  const { data: entities } = await supabase
    .from("entities")
    .select("id, name")
    .eq("status", "active")
    .order("name");

  const { data: managers } = await supabase
    .from("finance_managers")
    .select("id, full_name")
    .eq("status", "active")
    .order("full_name");

  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Annual Audits</h1>
          <p className="text-muted-foreground mt-1">
            Schedule and track audits across entities
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Schedule Audit</Button>
          </DialogTrigger>
          <DialogContent>
            <form action={createAudit}>
              <DialogHeader>
                <DialogTitle>Schedule New Audit</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Entity</label>
                  <select
                    name="entity_id"
                    required
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">Select Entity</option>
                    {entities?.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                </div>
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
                  <label className="text-sm font-medium">Audit Year</label>
                  <Input
                    name="audit_year"
                    type="number"
                    defaultValue={currentYear}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Due Date</label>
                  <Input name="due_date" type="date" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Schedule Audit</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Entity</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[160px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {audits && audits.length > 0 ? (
              audits.map((audit) => (
                <TableRow key={audit.id}>
                  <TableCell className="font-medium">
                    {audit.entities?.name || "—"}
                  </TableCell>
                  <TableCell>
                    {audit.finance_managers?.full_name || "—"}
                  </TableCell>
                  <TableCell>{audit.audit_year}</TableCell>
                  <TableCell>{audit.due_date || "—"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        audit.status === "completed"
                          ? "default"
                          : audit.status === "in_progress"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {audit.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {audit.status !== "completed" && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              Complete
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <form action={completeAudit.bind(null, audit.id)}>
                              <DialogHeader>
                                <DialogTitle>Complete Audit</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Findings</label>
                                  <Textarea
                                    name="findings"
                                    placeholder="Enter audit findings..."
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button type="submit">Mark Complete</Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                      )}
                      <form action={deleteAudit.bind(null, audit.id)}>
                        <Button type="submit" variant="ghost" size="sm">
                          Delete
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground h-24"
                >
                  No audits scheduled
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
