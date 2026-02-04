import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || undefined;
  const tagSlug = searchParams.get("tagSlug") || undefined;
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit")!)
    : undefined;
  const offset = searchParams.get("offset")
    ? parseInt(searchParams.get("offset")!)
    : undefined;

  try {
    const posts = await getAllPosts({
      category,
      tagSlug,
      limit,
      offset,
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
