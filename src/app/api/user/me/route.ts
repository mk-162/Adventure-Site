import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/user-auth";
import { db } from "@/db";
import { users, userFavourites } from "@/db/schema";
import { eq, count } from "drizzle-orm";

export async function GET() {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ user: null });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.userId),
  });

  if (!user) {
    return NextResponse.json({ user: null });
  }

  const favouriteCount = await db.select({ count: count() })
    .from(userFavourites)
    .where(eq(userFavourites.userId, user.id));

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      regionPreference: user.regionPreference,
      favouriteCount: favouriteCount[0].count,
    },
  });
}
