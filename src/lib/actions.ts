"use server";

import { revalidatePath } from "next/cache";
import {
  createEntity as createEntityRecord,
  deleteEntity as deleteEntityRecord,
} from "@/lib/entities";
import {
  createTrainingProgram as createTrainingProgramRecord,
  deleteTrainingProgram as deleteTrainingProgramRecord,
} from "@/lib/training-programs";
import {
  createFinanceManager as createFinanceManagerRecord,
  deleteFinanceManager as deleteFinanceManagerRecord,
} from "@/lib/finance-managers";
import {
  createCertification as createCertificationRecord,
  revokeCertification as revokeCertificationRecord,
} from "@/lib/certifications";
import {
  completeAudit as completeAuditRecord,
  createAudit as createAuditRecord,
  deleteAudit as deleteAuditRecord,
} from "@/lib/audits";

export async function createEntity(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
    throw new Error("Entity name is required.");
  }

  await createEntityRecord({
    name,
    industry: String(formData.get("industry") ?? "").trim() || null,
    location: String(formData.get("location") ?? "").trim() || null,
  });
  revalidatePath("/entities");
}

export async function deleteEntity(id: string, formData?: FormData) {
  await deleteEntityRecord(id);
  revalidatePath("/entities");
}

export async function createManager(formData: FormData) {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!fullName) {
    throw new Error("Manager full name is required.");
  }

  if (!email) {
    throw new Error("Manager email is required.");
  }

  await createFinanceManagerRecord({
    full_name: fullName,
    email,
    phone: String(formData.get("phone") ?? "").trim() || null,
    entity_id: String(formData.get("entity_id") ?? "").trim() || null,
  });
  revalidatePath("/managers");
}

export async function deleteManager(id: string, formData?: FormData) {
  await deleteFinanceManagerRecord(id);
  revalidatePath("/managers");
}

export async function createTrainingProgram(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();

  if (!title) {
    throw new Error("Training program title is required.");
  }

  const durationHours = String(formData.get("duration_hours") ?? "").trim();

  await createTrainingProgramRecord({
    title,
    description: String(formData.get("description") ?? "").trim() || null,
    duration_hours: durationHours ? parseInt(durationHours) : null,
  });
  revalidatePath("/training");
}

export async function deleteTrainingProgram(id: string, formData?: FormData) {
  await deleteTrainingProgramRecord(id);
  revalidatePath("/training");
}

export async function createCertification(formData: FormData) {
  const managerId = String(formData.get("manager_id") ?? "").trim();
  const programId = String(formData.get("program_id") ?? "").trim();

  if (!managerId) {
    throw new Error("Manager is required.");
  }

  if (!programId) {
    throw new Error("Training program is required.");
  }

  await createCertificationRecord({
    manager_id: managerId,
    program_id: programId,
    expires_at: String(formData.get("expires_at") ?? "").trim() || null,
  });
  revalidatePath("/certifications");
}

export async function revokeCertification(id: string, formData?: FormData) {
  await revokeCertificationRecord(id);
  revalidatePath("/certifications");
}

export async function createAudit(formData: FormData) {
  const entityId = String(formData.get("entity_id") ?? "").trim();
  const managerId = String(formData.get("manager_id") ?? "").trim();
  const auditYear = parseInt(String(formData.get("audit_year") ?? ""));
  const dueDate = String(formData.get("due_date") ?? "").trim();

  if (!entityId) {
    throw new Error("Entity is required.");
  }

  if (!managerId) {
    throw new Error("Manager is required.");
  }

  if (!Number.isInteger(auditYear)) {
    throw new Error("Audit year is required.");
  }

  if (!dueDate) {
    throw new Error("Due date is required.");
  }

  await createAuditRecord({
    entity_id: entityId,
    manager_id: managerId,
    audit_year: auditYear,
    due_date: dueDate,
  });
  revalidatePath("/audits");
}

export async function completeAudit(id: string, formData?: FormData) {
  const findings = String(formData?.get("findings") ?? "").trim() || null;

  await completeAuditRecord(id, findings);
  revalidatePath("/audits");
}

export async function deleteAudit(id: string, formData?: FormData) {
  await deleteAuditRecord(id);
  revalidatePath("/audits");
}
