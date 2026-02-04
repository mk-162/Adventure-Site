"use server";

import { revalidatePath } from "next/cache";

export async function ingestEvents() {
  const secret = process.env.ADMIN_SECRET;
  // If no secret configured, we can't authenticate with the API route safely unless we bypass it or use a shared secret.
  // For this task, we'll assume ADMIN_SECRET is set in env.

  if (!secret) {
      // Fallback for dev environment if not set
      if (process.env.NODE_ENV === 'development') {
          console.warn("ADMIN_SECRET not set, import might fail if API requires it.");
      }
  }

  // Determine base URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/events/ingest`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "x-admin-secret": secret || "",
        },
        body: JSON.stringify({ source: "eventbrite" }),
    });

    if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Ingestion failed");
    }

    const data = await res.json();
    revalidatePath("/admin/content/events");
    return data;
  } catch (error) {
      console.error("Ingestion action error:", error);
      throw error;
  }
}
