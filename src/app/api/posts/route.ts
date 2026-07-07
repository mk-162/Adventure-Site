import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/queries";
import { parseIntQueryParam } from "@/lib/api/validate";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || undefined;
  const tagSlug = searchParams.get("tagSlug") || undefined;

  const limitParam = parseIntQueryParam(searchParams, "limit", { max: 100 });
  if (!limitParam.ok) return limitParam.response;
  const offsetParam = parseIntQueryParam(searchParams, "offset");
  if (!offsetParam.ok) return offsetParam.response;

  const limit = limitParam.value;
  const offset = offsetParam.value;

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
