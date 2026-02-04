"use server";

import { db } from "@/db";
import { advertiserAccounts, operators } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}

export async function createAccount(formData: FormData) {
  const name = formData.get("name") as string;
  if (!name) throw new Error("Name required");

  await db.insert(advertiserAccounts).values({
    name,
    slug: slugify(name),
    primaryEmail: (formData.get("primaryEmail") as string) || null,
    primaryPhone: (formData.get("primaryPhone") as string) || null,
    contactName: (formData.get("contactName") as string) || null,
    billingEmail: (formData.get("billingEmail") as string) || null,
    adminNotes: (formData.get("adminNotes") as string) || null,
    billingNotes: (formData.get("billingNotes") as string) || null,
    billingCustomAmount: (formData.get("billingCustomAmount") as string) || null,
  });

  revalidatePath("/admin/commercial/accounts");
}

export async function updateAccount(id: number, formData: FormData) {
  await db.update(advertiserAccounts).set({
    name: formData.get("name") as string,
    primaryEmail: (formData.get("primaryEmail") as string) || null,
    primaryPhone: (formData.get("primaryPhone") as string) || null,
    contactName: (formData.get("contactName") as string) || null,
    billingEmail: (formData.get("billingEmail") as string) || null,
    adminNotes: (formData.get("adminNotes") as string) || null,
    billingNotes: (formData.get("billingNotes") as string) || null,
    billingCustomAmount: (formData.get("billingCustomAmount") as string) || null,
    updatedAt: new Date(),
  }).where(eq(advertiserAccounts.id, id));

  revalidatePath("/admin/commercial/accounts");
}

export async function deleteAccount(id: number) {
  // Unlink operators first
  await db.update(operators).set({ accountId: null }).where(eq(operators.accountId, id));
  await db.delete(advertiserAccounts).where(eq(advertiserAccounts.id, id));
  revalidatePath("/admin/commercial/accounts");
}

export async function linkOperatorToAccount(operatorId: number, accountId: number | null) {
  await db.update(operators).set({ accountId }).where(eq(operators.id, operatorId));
  revalidatePath("/admin/commercial/accounts");
  revalidatePath("/admin/commercial/claims");
}

export async function updateOperatorBilling(operatorId: number, formData: FormData) {
  await db.update(operators).set({
    billingCustomAmount: (formData.get("billingCustomAmount") as string) || null,
    billingNotes: (formData.get("billingNotes") as string) || null,
    adminNotes: (formData.get("adminNotes") as string) || null,
    updatedAt: new Date(),
  }).where(eq(operators.id, operatorId));

  revalidatePath("/admin/commercial/accounts");
  revalidatePath("/admin/commercial/claims");
}
