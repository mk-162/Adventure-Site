"use server";

import { db } from "@/db";
import { operators } from "@/db/schema";
import { eq, sql, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type BookingPlatform = "none" | "beyonk" | "rezdy" | "fareharbor" | "direct";

export async function getPartnersData() {
  const allOperators = await db
    .select({
      id: operators.id,
      name: operators.name,
      slug: operators.slug,
      category: operators.category,
      claimStatus: operators.claimStatus,
      bookingPlatform: operators.bookingPlatform,
      bookingPartnerRef: operators.bookingPartnerRef,
      bookingAffiliateId: operators.bookingAffiliateId,
      bookingWidgetUrl: operators.bookingWidgetUrl,
    })
    .from(operators)
    .where(eq(operators.siteId, 1))
    .orderBy(operators.name);

  const stats = {
    beyonk: 0,
    rezdy: 0,
    fareharbor: 0,
    direct: 0,
    none: 0,
    total: allOperators.length,
  };

  for (const op of allOperators) {
    const platform = op.bookingPlatform as BookingPlatform;
    if (platform in stats) {
      stats[platform as keyof typeof stats]++;
    }
  }

  return { operators: allOperators, stats };
}

export async function updateOperatorBooking(
  operatorId: number,
  data: {
    bookingPlatform: BookingPlatform;
    bookingPartnerRef: string;
    bookingAffiliateId: string;
    bookingWidgetUrl: string;
  }
) {
  await db
    .update(operators)
    .set({
      bookingPlatform: data.bookingPlatform,
      bookingPartnerRef: data.bookingPartnerRef || null,
      bookingAffiliateId: data.bookingAffiliateId || null,
      bookingWidgetUrl: data.bookingWidgetUrl || null,
      updatedAt: new Date(),
    })
    .where(eq(operators.id, operatorId));

  revalidatePath("/admin/commercial/partners");
  revalidatePath("/directory");
}

export async function bulkUpdateBookingPlatform(
  operatorIds: number[],
  platform: BookingPlatform
) {
  if (operatorIds.length === 0) return;

  await db
    .update(operators)
    .set({
      bookingPlatform: platform,
      updatedAt: new Date(),
    })
    .where(inArray(operators.id, operatorIds));

  revalidatePath("/admin/commercial/partners");
  revalidatePath("/directory");
}
