import { createClient } from "@/lib/supabase/server";
import { createEntity, deleteEntity } from "@/lib/actions";
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

export default async function EntitiesPage() {
  const supabase = await createClient();
  const { data: entities } = await supabase
    .from("entities")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Entities</h1>
          <p className="text-muted-foreground mt-1">
            Manage the organizations under audit
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Entity</Button>
          </DialogTrigger>
          <DialogContent>
            <form action={createEntity}>
              <DialogHeader>
                <DialogTitle>Add New Entity</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input name="name" placeholder="Entity Name" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Industry</label>
                  <Input name="industry" placeholder="e.g. Financial Services" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input name="location" placeholder="e.g. New York, NY" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Entity</Button>
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
              <TableHead>Industry</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entities && entities.length > 0 ? (
              entities.map((entity) => (
                <TableRow key={entity.id}>
                  <TableCell className="font-medium">{entity.name}</TableCell>
                  <TableCell>{entity.industry || "—"}</TableCell>
                  <TableCell>{entity.location || "—"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        entity.status === "active" ? "default" : "secondary"
                      }
                    >
                      {entity.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <form action={deleteEntity.bind(null, entity.id)}>
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
                  No entities found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}