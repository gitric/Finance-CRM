import { createTrainingProgram, deleteTrainingProgram } from "@/lib/actions";
import { listTrainingPrograms } from "@/lib/training-programs";
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
import { Clock } from "lucide-react";

export default async function TrainingPage() {
  const programs = await listTrainingPrograms();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Training Programs</h1>
          <p className="text-muted-foreground mt-1">
            Manage required training and certifications
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Program</Button>
          </DialogTrigger>
          <DialogContent>
            <form action={createTrainingProgram}>
              <DialogHeader>
                <DialogTitle>Add Training Program</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input name="title" placeholder="Program Title" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea name="description" placeholder="Brief description of the program" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration (hours)</label>
                  <Input
                    name="duration_hours"
                    type="number"
                    placeholder="e.g. 16"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Program</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {programs && programs.length > 0 ? (
          programs.map((program) => (
            <div key={program.id} className="border rounded-lg p-5 space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold">{program.title}</h3>
                <Badge
                  variant={program.status === "active" ? "default" : "secondary"}
                >
                  {program.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {program.description || "No description provided"}
              </p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {program.duration_hours ? `${program.duration_hours} hours` : "Self-paced"}
              </div>
              <form action={deleteTrainingProgram.bind(null, program.id)}>
                <Button type="submit" variant="ghost" size="sm" className="w-full mt-2">
                  Remove Program
                </Button>
              </form>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-muted-foreground py-12 border rounded-lg">
            No training programs found
          </div>
        )}
      </div>
    </div>
  );
}
