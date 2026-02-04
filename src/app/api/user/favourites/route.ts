import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "@/lib/user-auth";
import { db } from "@/db";
import { userFavourites, events, itineraries, activities, operators } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// Get user's favourites
export async function GET(req: NextRequest) {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const type = req.nextUrl.searchParams.get("type"); // optional filter

  let conditions = [eq(userFavourites.userId, session.userId)];
  if (type) {
    conditions.push(eq(userFavourites.favouriteType, type));
  }

  const favs = await db.select().from(userFavourites)
    .where(and(...conditions))
    .orderBy(userFavourites.createdAt);

  // Hydrate with actual item data
  const hydrated = await Promise.all(
    favs.map(async (fav) => {
      let item = null;
      switch (fav.favouriteType) {
        case "event":
          item = await db.query.events.findFirst({ where: eq(events.id, fav.favouriteId) });
          break;
        case "itinerary":
          item = await db.query.itineraries.findFirst({ where: eq(itineraries.id, fav.favouriteId) });
          break;
        case "activity":
          item = await db.query.activities.findFirst({ where: eq(activities.id, fav.favouriteId) });
          break;
        case "operator":
          item = await db.query.operators.findFirst({ where: eq(operators.id, fav.favouriteId) });
          break;
      }
      return {
        id: fav.id,
        type: fav.favouriteType,
        itemId: fav.favouriteId,
        savedAt: fav.createdAt,
        item: item ? { id: (item as any).id, name: (item as any).name, slug: (item as any).slug } : null,
      };
    })
  );

  return NextResponse.json({ favourites: hydrated });
}

// Toggle favourite
export async function POST(req: NextRequest) {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { type, id } = await req.json();

  if (!type || !id) {
    return NextResponse.json({ error: "type and id are required" }, { status: 400 });
  }

  const validTypes = ["event", "itinerary", "activity", "operator"];
  if (!validTypes.includes(type)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  // Check if already saved
  const existing = await db.select().from(userFavourites)
    .where(and(
      eq(userFavourites.userId, session.userId),
      eq(userFavourites.favouriteType, type),
      eq(userFavourites.favouriteId, id),
    ))
    .limit(1);

  if (existing.length > 0) {
    // Remove
    await db.delete(userFavourites).where(eq(userFavourites.id, existing[0].id));
    return NextResponse.json({ saved: false });
  } else {
    // Add
    await db.insert(userFavourites).values({
      userId: session.userId,
      favouriteType: type,
      favouriteId: id,
    });
    return NextResponse.json({ saved: true });
  }
}
