import { db } from "@/db";
import { regions, events } from "@/db/schema";
import { eq, and, ilike, desc, asc, sql, gte } from "drizzle-orm";

// =====================
// EVENT QUERIES
// =====================

export async function getEvents(options?: {
  regionId?: number;
  type?: string;
  month?: string;
  limit?: number;
  offset?: number;
  includePast?: boolean;
}) {
  const conditions = [eq(events.status, "published")];

  // By default, only show future events (from start of current month)
  if (!options?.includePast) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    conditions.push(gte(events.dateStart, startOfMonth));
  }

  if (options?.regionId) {
    conditions.push(eq(events.regionId, options.regionId));
  }
  if (options?.type) {
    conditions.push(ilike(events.type, `%${options.type}%`));
  }
  if (options?.month) {
    // options.month is 'YYYY-MM'
    const startDate = new Date(`${options.month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const dateFilter = and(
      gte(events.dateStart, startDate),
      sql`${events.dateStart} < ${endDate.toISOString()}`
    );
    if (dateFilter) {
      conditions.push(dateFilter);
    }
  }

  // Count + data are independent — run in parallel.
  let query = db
    .select({
      event: events,
      region: regions,
    })
    .from(events)
    .leftJoin(regions, eq(events.regionId, regions.id))
    .where(and(...conditions))
    .orderBy(asc(events.dateStart), asc(events.name));

  if (options?.limit) {
    query = query.limit(options.limit) as typeof query;
  }
  if (options?.offset) {
    query = query.offset(options.offset) as typeof query;
  }

  const [countResult, data] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(events)
      .where(and(...conditions)),
    query,
  ]);
  const total = Number(countResult[0]?.count || 0);

  return { events: data, total };
}

export async function getEventMonths() {
  const result = await db
    .select({
      month: sql<string>`to_char(${events.dateStart}, 'YYYY-MM')`,
      label: sql<string>`to_char(${events.dateStart}, 'Month YYYY')`,
    })
    .from(events)
    .where(eq(events.status, "published"))
    .groupBy(sql`to_char(${events.dateStart}, 'YYYY-MM')`, sql`to_char(${events.dateStart}, 'Month YYYY')`)
    .orderBy(desc(sql`to_char(${events.dateStart}, 'YYYY-MM')`));

  return result.map(r => ({ value: r.month, label: r.label }));
}

export async function getEventBySlug(slug: string) {
  const result = await db
    .select({
      event: events,
      region: regions,
    })
    .from(events)
    .leftJoin(regions, eq(events.regionId, regions.id))
    .where(and(eq(events.slug, slug), eq(events.status, "published")))
    .limit(1);
  return result[0] || null;
}

// =====================
// SLUG QUERIES FOR STATIC GENERATION
// =====================

export async function getAllEventSlugs() {
  const result = await db
    .select({ slug: events.slug })
    .from(events)
    .where(eq(events.status, "published"));
  return result.map((r) => r.slug);
}
