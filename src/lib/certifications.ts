import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";

export type Certification = {
  id: string;
  manager_id: string;
  program_id: string;
  manager_name: string;
  program_title: string;
  issued_at: string | null;
  expires_at: string | null;
  status: "valid" | "expired" | "revoked";
};

type CertificationDocument = {
  manager_id?: unknown;
  program_id?: unknown;
  manager_name?: unknown;
  program_title?: unknown;
  issued_at?: unknown;
  expires_at?: unknown;
  status?: unknown;
};

function certificationsCollection() {
  return getFirebaseAdminDb().collection("certifications");
}

function financeManagersCollection() {
  return getFirebaseAdminDb().collection("finance_managers");
}

function trainingProgramsCollection() {
  return getFirebaseAdminDb().collection("training_programs");
}

function formatDate(value: unknown) {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }

  return typeof value === "string" ? value : null;
}

function certificationStatus(value: unknown): Certification["status"] {
  if (value === "expired" || value === "revoked") {
    return value;
  }

  return "valid";
}

export async function listCertifications() {
  const snapshot = await certificationsCollection()
    .orderBy("issued_at", "desc")
    .get();

  return snapshot.docs.map((doc): Certification => {
    const data = doc.data() as CertificationDocument;

    return {
      id: doc.id,
      manager_id: typeof data.manager_id === "string" ? data.manager_id : "",
      program_id: typeof data.program_id === "string" ? data.program_id : "",
      manager_name: typeof data.manager_name === "string" ? data.manager_name : "",
      program_title: typeof data.program_title === "string" ? data.program_title : "",
      issued_at: formatDate(data.issued_at),
      expires_at: formatDate(data.expires_at),
      status: certificationStatus(data.status),
    };
  });
}

export async function createCertification(input: {
  manager_id: string;
  program_id: string;
  expires_at: string | null;
}) {
  const [managerSnapshot, programSnapshot] = await Promise.all([
    financeManagersCollection().doc(input.manager_id).get(),
    trainingProgramsCollection().doc(input.program_id).get(),
  ]);
  const manager = managerSnapshot.data();
  const program = programSnapshot.data();

  if (manager?.status !== "active" || typeof manager.full_name !== "string") {
    throw new Error("Active manager is required.");
  }

  if (program?.status !== "active" || typeof program.title !== "string") {
    throw new Error("Active training program is required.");
  }

  await certificationsCollection().add({
    manager_id: input.manager_id,
    program_id: input.program_id,
    manager_name: manager.full_name,
    program_title: program.title,
    issued_at: FieldValue.serverTimestamp(),
    expires_at: input.expires_at,
    status: "valid",
  });
}

export async function revokeCertification(id: string) {
  await certificationsCollection().doc(id).update({ status: "revoked" });
}
