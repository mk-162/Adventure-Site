import { db } from "@/db";
import {
  guidePages,
  guidePageSpots,
  regions,
  activityTypes,
  operators,
} from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import GuidePageForm from "./GuidePageForm";

async function getGuidePage(id: number) {
  const [page] = await db
    .select()
    .from(guidePages)
    .where(eq(guidePages.id, id));
  return page;
}

async function getSpots(guidePageId: number) {
  return db
    .select()
    .from(guidePageSpots)
    .where(eq(guidePageSpots.guidePageId, guidePageId))
    .orderBy(asc(guidePageSpots.rank));
}

async function getFormData() {
  const [allRegions, allActivityTypes, allOperators] = await Promise.all([
    db.select().from(regions).orderBy(regions.name),
    db.select().from(activityTypes).orderBy(activityTypes.name),
    db.select({ id: operators.id, name: operators.name }).from(operators).orderBy(operators.name),
  ]);
  return { allRegions, allActivityTypes, allOperators };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function updateGuidePage(id: number, formData: FormData) {
  "use server";

  const title = formData.get("title") as string;
  const type = formData.get("type") as "combo" | "best_of";
  const siteId = parseInt(formData.get("siteId") as string) || 1;
  const regionId = parseInt(formData.get("regionId") as string);
  const activityTypeId = parseInt(formData.get("activityTypeId") as string);
  const slug = (formData.get("slug") as string) || slugify(title);
  const urlPath = formData.get("urlPath") as string;
  const h1 = formData.get("h1") as string;
  const strapline = formData.get("strapline") as string;
  const metaTitle = formData.get("metaTitle") as string;
  const metaDescription = formData.get("metaDescription") as string;
  const heroImage = formData.get("heroImage") as string;
  const heroAlt = formData.get("heroAlt") as string;
  const introduction = formData.get("introduction") as string;
  const bestSeason = formData.get("bestSeason") as string;
  const difficultyRange = formData.get("difficultyRange") as string;
  const priceRange = formData.get("priceRange") as string;
  const dataFile = formData.get("dataFile") as string;
  const keywordsRaw = formData.get("keywords") as string;
  const contentStatus = formData.get("contentStatus") as "draft" | "review" | "published" | "archived";
  const priority = parseInt(formData.get("priority") as string) || 0;
  const targetKeyword = formData.get("targetKeyword") as string;
  const searchVolume = parseInt(formData.get("searchVolume") as string) || null;
  const currentRanking = parseInt(formData.get("currentRanking") as string) || null;

  // Commercial fields
  const sponsorOperatorId = parseInt(formData.get("sponsorOperatorId") as string) || null;
  const sponsorDisplayName = formData.get("sponsorDisplayName") as string;
  const sponsorTagline = formData.get("sponsorTagline") as string;
  const sponsorCtaText = formData.get("sponsorCtaText") as string;
  const sponsorCtaUrl = formData.get("sponsorCtaUrl") as string;
  const sponsorExpiresAtRaw = formData.get("sponsorExpiresAt") as string;
  const featuredOperatorIdsRaw = formData.get("featuredOperatorIds") as string;

  let keywords = null;
  if (keywordsRaw) {
    try {
      keywords = JSON.parse(keywordsRaw);
    } catch {
      keywords = null;
    }
  }

  let featuredOperatorIds = null;
  if (featuredOperatorIdsRaw) {
    try {
      featuredOperatorIds = JSON.parse(featuredOperatorIdsRaw);
    } catch {
      featuredOperatorIds = null;
    }
  }

  await db
    .update(guidePages)
    .set({
      title,
      type,
      siteId,
      regionId,
      activityTypeId,
      slug,
      urlPath: urlPath || null,
      h1: h1 || null,
      strapline: strapline || null,
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      heroImage: heroImage || null,
      heroAlt: heroAlt || null,
      introduction: introduction || null,
      bestSeason: bestSeason || null,
      difficultyRange: difficultyRange || null,
      priceRange: priceRange || null,
      dataFile: dataFile || null,
      keywords,
      contentStatus,
      priority,
      targetKeyword: targetKeyword || null,
      searchVolume,
      currentRanking,
      sponsorOperatorId,
      sponsorDisplayName: sponsorDisplayName || null,
      sponsorTagline: sponsorTagline || null,
      sponsorCtaText: sponsorCtaText || null,
      sponsorCtaUrl: sponsorCtaUrl || null,
      sponsorExpiresAt: sponsorExpiresAtRaw ? new Date(sponsorExpiresAtRaw) : null,
      featuredOperatorIds,
      updatedAt: new Date(),
    })
    .where(eq(guidePages.id, id));

  revalidatePath("/admin/content/guide-pages");
  revalidatePath(`/admin/content/guide-pages/${id}`);
  redirect("/admin/content/guide-pages");
}

async function createSpot(guidePageId: number, formData: FormData) {
  "use server";

  const name = formData.get("spotName") as string;
  const rank = parseInt(formData.get("spotRank") as string) || 1;
  const description = formData.get("spotDescription") as string;
  const verdict = formData.get("spotVerdict") as string;
  const difficulty = formData.get("spotDifficulty") as string;
  const duration = formData.get("spotDuration") as string;
  const distance = formData.get("spotDistance") as string;
  const elevationGain = formData.get("spotElevationGain") as string;
  const bestFor = formData.get("spotBestFor") as string;
  const bestSeason = formData.get("spotBestSeason") as string;
  const parking = formData.get("spotParking") as string;
  const estimatedCost = formData.get("spotEstimatedCost") as string;
  const insiderTip = formData.get("spotInsiderTip") as string;
  const image = formData.get("spotImage") as string;
  const imageAlt = formData.get("spotImageAlt") as string;

  if (!name) return;

  await db.insert(guidePageSpots).values({
    guidePageId,
    rank,
    name,
    slug: slugify(name),
    description: description || null,
    verdict: verdict || null,
    difficulty: difficulty || null,
    duration: duration || null,
    distance: distance || null,
    elevationGain: elevationGain || null,
    bestFor: bestFor || null,
    bestSeason: bestSeason || null,
    parking: parking || null,
    estimatedCost: estimatedCost || null,
    insiderTip: insiderTip || null,
    image: image || null,
    imageAlt: imageAlt || null,
  });

  revalidatePath(`/admin/content/guide-pages/${guidePageId}`);
}

async function deleteSpot(spotId: number, guidePageId: number) {
  "use server";

  await db.delete(guidePageSpots).where(eq(guidePageSpots.id, spotId));
  revalidatePath(`/admin/content/guide-pages/${guidePageId}`);
}

export default async function EditGuidePagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Handle "new" page creation
  if (id === "new") {
    const { allRegions, allActivityTypes, allOperators } = await getFormData();

    return (
      <div>
        <div className="mb-8">
          <Link
            href="/admin/content/guide-pages"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Guide Pages
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Create Guide Page
          </h1>
        </div>

        <GuidePageForm
          guidePage={null}
          spots={[]}
          allRegions={allRegions}
          allActivityTypes={allActivityTypes}
          allOperators={allOperators}
          saveAction={createGuidePage}
          createSpotAction={null}
          deleteSpotAction={null}
        />
      </div>
    );
  }

  const pageId = parseInt(id);
  const guidePage = await getGuidePage(pageId);

  if (!guidePage) {
    redirect("/admin/content/guide-pages");
  }

  const spots = await getSpots(pageId);
  const { allRegions, allActivityTypes, allOperators } = await getFormData();

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/content/guide-pages"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Guide Pages
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Edit Guide Page
            </h1>
            <p className="text-gray-500 mt-1">{guidePage.title}</p>
          </div>
          {guidePage.urlPath && (
            <Link
              href={guidePage.urlPath}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Preview Page →
            </Link>
          )}
        </div>
      </div>

      <GuidePageForm
        guidePage={guidePage}
        spots={spots}
        allRegions={allRegions}
        allActivityTypes={allActivityTypes}
        allOperators={allOperators}
        saveAction={updateGuidePage.bind(null, pageId)}
        createSpotAction={createSpot.bind(null, pageId)}
        deleteSpotAction={deleteSpot}
      />
    </div>
  );
}

async function createGuidePage(formData: FormData) {
  "use server";

  const title = formData.get("title") as string;
  const type = formData.get("type") as "combo" | "best_of";
  const siteId = parseInt(formData.get("siteId") as string) || 1;
  const regionId = parseInt(formData.get("regionId") as string);
  const activityTypeId = parseInt(formData.get("activityTypeId") as string);
  const slug = (formData.get("slug") as string) || slugify(title);
  const urlPath = formData.get("urlPath") as string;
  const contentStatus = formData.get("contentStatus") as "draft" | "review" | "published" | "archived";
  const priority = parseInt(formData.get("priority") as string) || 0;

  const [created] = await db
    .insert(guidePages)
    .values({
      title,
      type,
      siteId,
      regionId,
      activityTypeId,
      slug,
      urlPath: urlPath || `/${slug}`,
      contentStatus: contentStatus || "draft",
      priority,
    })
    .returning({ id: guidePages.id });

  revalidatePath("/admin/content/guide-pages");
  redirect(`/admin/content/guide-pages/${created.id}`);
}
