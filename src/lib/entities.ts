import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";

export type Entity = {
  id: string;
  name: string;
  industry: string | null;
  location: string | null;
  status: "active" | "inactive";
  created_at: string | null;
};

type EntityDocument = {
  name?: unknown;
  industry?: unknown;
  location?: unknown;
  status?: unknown;
  created_at?: unknown;
};

function entitiesCollection() {
  return getFirebaseAdminDb().collection("entities");
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function formatCreatedAt(value: unknown) {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }

  return typeof value === "string" ? value : null;
}

export async function listEntities() {
  const snapshot = await entitiesCollection().orderBy("created_at", "desc").get();

  return snapshot.docs.map((doc): Entity => {
    const data = doc.data() as EntityDocument;

    return {
      id: doc.id,
      name: typeof data.name === "string" ? data.name : "",
      industry: optionalString(data.industry),
      location: optionalString(data.location),
      status: data.status === "inactive" ? "inactive" : "active",
      created_at: formatCreatedAt(data.created_at),
    };
  });
}

export async function createEntity(input: {
  name: string;
  industry: string | null;
  location: string | null;
}) {
  await entitiesCollection().add({
    name: input.name,
    industry: input.industry,
    location: input.location,
    status: "active",
    created_at: FieldValue.serverTimestamp(),
  });
}

export async function deleteEntity(id: string) {
  await entitiesCollection().doc(id).delete();
}
