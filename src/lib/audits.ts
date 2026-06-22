import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";

export type Audit = {
  id: string;
  entity_id: string;
  manager_id: string;
  entity_name: string;
  manager_name: string;
  audit_year: number | null;
  due_date: string | null;
  status: "scheduled" | "in_progress" | "completed";
  completed_at: string | null;
  findings: string | null;
};

type AuditDocument = {
  entity_id?: unknown;
  manager_id?: unknown;
  entity_name?: unknown;
  manager_name?: unknown;
  audit_year?: unknown;
  due_date?: unknown;
  status?: unknown;
  completed_at?: unknown;
  findings?: unknown;
};

function auditsCollection() {
  return getFirebaseAdminDb().collection("audits");
}

function entitiesCollection() {
  return getFirebaseAdminDb().collection("entities");
}

function financeManagersCollection() {
  return getFirebaseAdminDb().collection("finance_managers");
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function formatDate(value: unknown) {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }

  return typeof value === "string" ? value : null;
}

function auditStatus(value: unknown): Audit["status"] {
  if (value === "in_progress" || value === "completed") {
    return value;
  }

  return "scheduled";
}

export async function listAudits() {
  const snapshot = await auditsCollection().orderBy("due_date", "asc").get();

  return snapshot.docs.map((doc): Audit => {
    const data = doc.data() as AuditDocument;

    return {
      id: doc.id,
      entity_id: typeof data.entity_id === "string" ? data.entity_id : "",
      manager_id: typeof data.manager_id === "string" ? data.manager_id : "",
      entity_name: typeof data.entity_name === "string" ? data.entity_name : "",
      manager_name: typeof data.manager_name === "string" ? data.manager_name : "",
      audit_year: typeof data.audit_year === "number" ? data.audit_year : null,
      due_date: optionalString(data.due_date),
      status: auditStatus(data.status),
      completed_at: formatDate(data.completed_at),
      findings: optionalString(data.findings),
    };
  });
}

export async function createAudit(input: {
  entity_id: string;
  manager_id: string;
  audit_year: number;
  due_date: string;
}) {
  const [entitySnapshot, managerSnapshot] = await Promise.all([
    entitiesCollection().doc(input.entity_id).get(),
    financeManagersCollection().doc(input.manager_id).get(),
  ]);
  const entity = entitySnapshot.data();
  const manager = managerSnapshot.data();

  if (entity?.status !== "active" || typeof entity.name !== "string") {
    throw new Error("Active entity is required.");
  }

  if (manager?.status !== "active" || typeof manager.full_name !== "string") {
    throw new Error("Active manager is required.");
  }

  await auditsCollection().add({
    entity_id: input.entity_id,
    manager_id: input.manager_id,
    entity_name: entity.name,
    manager_name: manager.full_name,
    audit_year: input.audit_year,
    due_date: input.due_date,
    status: "scheduled",
    created_at: FieldValue.serverTimestamp(),
  });
}

export async function completeAudit(id: string, findings: string | null) {
  await auditsCollection().doc(id).update({
    status: "completed",
    completed_at: FieldValue.serverTimestamp(),
    findings,
  });
}

export async function deleteAudit(id: string) {
  await auditsCollection().doc(id).delete();
}
