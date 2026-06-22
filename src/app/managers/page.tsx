import { createManager, deleteManager } from "@/lib/actions";
import { listEntities } from "@/lib/entities";
import { listFinanceManagers } from "@/lib/finance-managers";
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

export const dynamic = "force-dynamic";

export default async function ManagersPage() {
  const [managers, entities] = await Promise.all([
    listFinanceManagers(),
    listEntities(),
  ]);
  const activeEntities = entities
    .filter((entity) => entity.status === "active")
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finance Managers</h1>
          <p className="text-muted-foreground mt-1">
            Track managers across all entities
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Manager</Button>
          </DialogTrigger>
          <DialogContent>
            <form action={createManager}>
              <DialogHeader>
                <DialogTitle>Add New Manager</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input name="full_name" placeholder="Full Name" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input name="email" type="email" placeholder="email@company.com" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input name="phone" placeholder="+1-555-0000" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Entity</label>
                  <select
                    name="entity_id"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">Select Entity</option>
                    {activeEntities.map((entity) => (
                      <option key={entity.id} value={entity.id}>
                        {entity.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Manager</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {managers.length > 0 ? (
              managers.map((manager) => (
                <TableRow key={manager.id}>
                  <TableCell className="font-medium">
                    {manager.full_name}
                  </TableCell>
                  <TableCell>{manager.email}</TableCell>
                  <TableCell>{manager.entity_name || "—"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        manager.status === "active" ? "default" : "secondary"
                      }
                    >
                      {manager.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <form action={deleteManager.bind(null, manager.id)}>
                      <Button type="submit" variant="ghost" size="sm">
                        Delete
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground h-24"
                >
                  No managers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
