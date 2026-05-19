"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createEntity(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("entities").insert({
    name: formData.get("name") as string,
    industry: (formData.get("industry") as string) || null,
    location: (formData.get("location") as string) || null,
  });
  revalidatePath("/entities");
}

export async function deleteEntity(id: string, formData?: FormData) {
  const supabase = await createClient();
  await supabase.from("entities").delete().eq("id", id);
  revalidatePath("/entities");
}

export async function createManager(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("finance_managers").insert({
    full_name: formData.get("full_name") as string,
    email: formData.get("email") as string,
    phone: (formData.get("phone") as string) || null,
    entity_id: (formData.get("entity_id") as string) || null,
  });
  revalidatePath("/managers");
}

export async function deleteManager(id: string, formData?: FormData) {
  const supabase = await createClient();
  await supabase.from("finance_managers").delete().eq("id", id);
  revalidatePath("/managers");
}

export async function createTrainingProgram(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("training_programs").insert({
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || null,
    duration_hours: formData.get("duration_hours")
      ? parseInt(formData.get("duration_hours") as string)
      : null,
  });
  revalidatePath("/training");
}

export async function deleteTrainingProgram(id: string, formData?: FormData) {
  const supabase = await createClient();
  await supabase.from("training_programs").delete().eq("id", id);
  revalidatePath("/training");
}

export async function createCertification(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("certifications").insert({
    manager_id: formData.get("manager_id") as string,
    program_id: formData.get("program_id") as string,
    expires_at: (formData.get("expires_at") as string) || null,
    status: "valid",
  });
  revalidatePath("/certifications");
}

export async function revokeCertification(id: string, formData?: FormData) {
  const supabase = await createClient();
  await supabase.from("certifications").update({ status: "revoked" }).eq("id", id);
  revalidatePath("/certifications");
}

export async function createAudit(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("audits").insert({
    entity_id: (formData.get("entity_id") as string) || null,
    manager_id: (formData.get("manager_id") as string) || null,
    audit_year: parseInt(formData.get("audit_year") as string),
    due_date: (formData.get("due_date") as string) || null,
    status: "scheduled",
  });
  revalidatePath("/audits");
}

export async function completeAudit(id: string, formData?: FormData) {
  const supabase = await createClient();
  await supabase
    .from("audits")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
      findings: (formData?.get("findings") as string) || null,
    })
    .eq("id", id);
  revalidatePath("/audits");
}

export async function deleteAudit(id: string, formData?: FormData) {
  const supabase = await createClient();
  await supabase.from("audits").delete().eq("id", id);
  revalidatePath("/audits");
}