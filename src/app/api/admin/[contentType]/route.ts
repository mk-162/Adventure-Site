import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  regions,
  activities,
  itineraries,
  operators,
  accommodation,
  events,
  locations,
  answers,
  sites,
} from "@/db/schema";
import { eq, ilike, and, desc } from "drizzle-orm";

// Map content types to tables
const tableMap: Record<string, any> = {
  regions,
  activities,
  itineraries,
  operators,
  accommodation,
  events,
  locations,
  answers,
};

// Completeness score calculation
function calculateCompleteness(contentType: string, data: any): number {
  let score = 0;
  let totalPoints = 0;

  const check = (condition: boolean, points: number = 10) => {
    totalPoints += points;
    if (condition) score += points;
  };

  // Common checks
  check(!!data.name, 20);
  check(!!data.slug, 10);
  
  if (['regions', 'activities', 'itineraries', 'accommodation', 'events', 'locations'].includes(contentType)) {
    check(!!data.description, 20);
    check(!!data.lat && !!data.lng, 10);
  }

  switch (contentType) {
    case 'regions':
      check(!!data.heroImage, 20);
      break;
    case 'activities':
      check(!!data.heroImage || (data.activityTypeId && true), 10);
      check(!!data.priceFrom, 10);
      check(!!data.duration, 10);
      check(!!data.difficulty, 5);
      break;
    case 'itineraries':
      check(!!data.heroImage, 20);
      check(!!data.durationDays, 10);
      check(!!data.priceEstimateFrom, 10);
      break;
    case 'operators':
      check(!!data.website, 10);
      check(!!data.email || !!data.phone, 10);
      check(!!data.logoUrl, 10);
      break;
    case 'accommodation':
      check(!!data.website, 10);
      check(!!data.priceFrom, 10);
      break;
    case 'events':
      check(!!data.dateStart, 10);
      check(!!data.location, 10);
      break;
  }

  if (totalPoints === 0) return 0;
  return Math.round((score / totalPoints) * 100);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ contentType: string }> }
) {
  const { contentType } = await params;
  const table = tableMap[contentType];

  if (!table) {
    return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
  }

  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  // Get single item by ID
  if (id) {
    try {
      const result = await db.select().from(table).where(eq(table.id, parseInt(id))).limit(1);
      if (result.length === 0) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json(result[0]);
    } catch {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
  }

  // List with filters, search, pagination
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = parseInt(searchParams.get("offset") || "0");
  const search = searchParams.get("search");
  
  const conditions = [];

  // Basic filters from query params (exclude special params)
  for (const [key, value] of searchParams.entries()) {
    if (['limit', 'offset', 'search', 'sort', 'order', 'id'].includes(key)) continue;
    
    if (key in table) {
      conditions.push(eq(table[key], value));
    }
  }

  // Search
  if (search) {
    if ('name' in table) {
      conditions.push(ilike(table.name, `%${search}%`));
    } else if ('title' in table) {
      conditions.push(ilike(table.title, `%${search}%`));
    } else if ('question' in table) {
      conditions.push(ilike(table.question, `%${search}%`));
    }
  }

  try {
    let query = db.select().from(table);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    // Sorting
    if ('createdAt' in table) {
      query = query.orderBy(desc(table.createdAt)) as any;
    } else if ('id' in table) {
      query = query.orderBy(desc(table.id)) as any;
    }

    query = query.limit(limit).offset(offset) as any;
    
    const results = await query;
    return NextResponse.json(results);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ contentType: string }> }
) {
  const { contentType } = await params;
  const table = tableMap[contentType];

  if (!table) {
    return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
  }

  try {
    const body = await request.json();
    
    // Calculate completeness score if applicable
    if ('completenessScore' in table) {
      body.completenessScore = calculateCompleteness(contentType, body);
    }

    // Ensure siteId is present
    if (!body.siteId && 'siteId' in table) {
      const defaultSite = await db.select().from(sites).limit(1);
      if (defaultSite.length > 0) {
        body.siteId = defaultSite[0].id;
      }
    }

    const result = await db.insert(table).values(body).returning() as any[];
    return NextResponse.json(result[0]);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ contentType: string }> }
) {
  const { contentType } = await params;
  const table = tableMap[contentType];

  if (!table) {
    return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "ID required in body" }, { status: 400 });
    }

    // Calculate completeness score if applicable
    if ('completenessScore' in table) {
      const current = await db.select().from(table).where(eq(table.id, id)).limit(1);
      if (current.length > 0) {
        const merged = { ...current[0], ...updates };
        updates.completenessScore = calculateCompleteness(contentType, merged);
      }
    }
    
    if ('updatedAt' in table) {
      updates.updatedAt = new Date();
    }

    const result = await db.update(table)
      .set(updates)
      .where(eq(table.id, id))
      .returning() as any[];

    return NextResponse.json(result[0]);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ contentType: string }> }
) {
  const { contentType } = await params;
  const table = tableMap[contentType];

  if (!table) {
    return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
  }

  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID required in search params" }, { status: 400 });
  }

  try {
    // Soft delete if possible
    if ('status' in table) {
      const result = await db.update(table)
        .set({ status: 'archived' })
        .where(eq(table.id, parseInt(id)))
        .returning() as any[];
      return NextResponse.json(result[0]);
    } else {
      // Hard delete
      const result = await db.delete(table)
        .where(eq(table.id, parseInt(id)))
        .returning() as any[];
      return NextResponse.json(result[0]);
    }
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
