import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";

export type FinanceManager = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  status: "active" | "inactive";
  entity_id: string | null;
  entity_name: string | null;
  created_at: string | null;
};

type FinanceManagerDocument = {
  full_name?: unknown;
  email?: unknown;
  phone?: unknown;
  status?: unknown;
  entity_id?: unknown;
  entity_name?: unknown;
  created_at?: unknown;
};

function financeManagersCollection() {
  return getFirebaseAdminDb().collection("finance_managers");
}

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

export async function listFinanceManagers() {
  const snapshot = await financeManagersCollection()
    .orderBy("created_at", "desc")
    .get();

  return snapshot.docs.map((doc): FinanceManager => {
    const data = doc.data() as FinanceManagerDocument;

    return {
      id: doc.id,
      full_name: typeof data.full_name === "string" ? data.full_name : "",
      email: typeof data.email === "string" ? data.email : "",
      phone: optionalString(data.phone),
      status: data.status === "inactive" ? "inactive" : "active",
      entity_id: optionalString(data.entity_id),
      entity_name: optionalString(data.entity_name),
      created_at: formatCreatedAt(data.created_at),
    };
  });
}

export async function createFinanceManager(input: {
  full_name: string;
  email: string;
  phone: string | null;
  entity_id: string | null;
}) {
  let entityName: string | null = null;

  if (input.entity_id) {
    const entitySnapshot = await entitiesCollection().doc(input.entity_id).get();
    const entity = entitySnapshot.data();

    if (entity?.status === "active" && typeof entity.name === "string") {
      entityName = entity.name;
    }
  }

  await financeManagersCollection().add({
    full_name: input.full_name,
    email: input.email,
    phone: input.phone,
    status: "active",
    created_at: FieldValue.serverTimestamp(),
    entity_id: entityName ? input.entity_id : null,
    entity_name: entityName,
  });
}

export async function deleteFinanceManager(id: string) {
  await financeManagersCollection().doc(id).delete();
}
