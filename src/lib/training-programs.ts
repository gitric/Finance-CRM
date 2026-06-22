import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";

export type TrainingProgram = {
  id: string;
  title: string;
  description: string | null;
  duration_hours: number | null;
  status: "active" | "inactive";
  created_at: string | null;
};

type TrainingProgramDocument = {
  title?: unknown;
  description?: unknown;
  duration_hours?: unknown;
  status?: unknown;
  created_at?: unknown;
};

function trainingProgramsCollection() {
  return getFirebaseAdminDb().collection("training_programs");
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function optionalNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function formatCreatedAt(value: unknown) {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }

  return typeof value === "string" ? value : null;
}

export async function listTrainingPrograms() {
  const snapshot = await trainingProgramsCollection()
    .orderBy("created_at", "desc")
    .get();

  return snapshot.docs.map((doc): TrainingProgram => {
    const data = doc.data() as TrainingProgramDocument;

    return {
      id: doc.id,
      title: typeof data.title === "string" ? data.title : "",
      description: optionalString(data.description),
      duration_hours: optionalNumber(data.duration_hours),
      status: data.status === "inactive" ? "inactive" : "active",
      created_at: formatCreatedAt(data.created_at),
    };
  });
}

export async function createTrainingProgram(input: {
  title: string;
  description: string | null;
  duration_hours: number | null;
}) {
  await trainingProgramsCollection().add({
    title: input.title,
    description: input.description,
    duration_hours: input.duration_hours,
    status: "active",
    created_at: FieldValue.serverTimestamp(),
  });
}

export async function deleteTrainingProgram(id: string) {
  await trainingProgramsCollection().doc(id).delete();
}
