import { db } from "@/db";
import { activities, regions, operators, activityTypes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

async function getActivity(id: number) {
  const [activity] = await db.select().from(activities).where(eq(activities.id, id));
  return activity;
}

async function getFormData() {
  const [allRegions, allOperators, allActivityTypes] = await Promise.all([
    db.select().from(regions).orderBy(regions.name),
    db.select().from(operators).orderBy(operators.name),
    db.select().from(activityTypes).orderBy(activityTypes.name),
  ]);
  return { allRegions, allOperators, allActivityTypes };
}

async function updateActivity(id: number, formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const regionId = formData.get("regionId") as string;
  const operatorId = formData.get("operatorId") as string;
  const activityTypeId = formData.get("activityTypeId") as string;
  const priceFrom = formData.get("priceFrom") as string;
  const priceTo = formData.get("priceTo") as string;
  const duration = formData.get("duration") as string;
  const difficulty = formData.get("difficulty") as string;
  const minAge = formData.get("minAge") as string;
  const season = formData.get("season") as string;
  const bookingUrl = formData.get("bookingUrl") as string;
  const status = formData.get("status") as "draft" | "review" | "published" | "archived";

  await db
    .update(activities)
    .set({
      name,
      description: description || null,
      regionId: regionId ? parseInt(regionId) : null,
      operatorId: operatorId ? parseInt(operatorId) : null,
      activityTypeId: activityTypeId ? parseInt(activityTypeId) : null,
      priceFrom: priceFrom || null,
      priceTo: priceTo || null,
      duration: duration || null,
      difficulty: difficulty || null,
      minAge: minAge ? parseInt(minAge) : null,
      season: season || null,
      bookingUrl: bookingUrl || null,
      status: status || "draft",
      updatedAt: new Date(),
    })
    .where(eq(activities.id, id));

  revalidatePath("/admin/content/activities");
  revalidatePath(`/admin/content/activities/${id}`);
  redirect("/admin/content/activities");
}

export default async function EditActivityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const activityId = parseInt(id);
  const activity = await getActivity(activityId);

  if (!activity) {
    redirect("/admin/content/activities");
  }

  const { allRegions, allOperators, allActivityTypes } = await getFormData();

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/content/activities"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Activities
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Activity</h1>
        <p className="text-gray-500 mt-1">{activity.name}</p>
      </div>

      <form action={updateActivity.bind(null, activityId)} className="space-y-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input type="text" id="name" name="name" required defaultValue={activity.name}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent" />
              <p className="text-sm text-gray-500 mt-1">Slug (read-only): {activity.slug}</p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea id="description" name="description" rows={4} defaultValue={activity.description || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent" />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="regionId" className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                <select id="regionId" name="regionId" defaultValue={activity.regionId || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent">
                  <option value="">Select region</option>
                  {allRegions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="operatorId" className="block text-sm font-medium text-gray-700 mb-1">Operator</label>
                <select id="operatorId" name="operatorId" defaultValue={activity.operatorId || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent">
                  <option value="">Select operator</option>
                  {allOperators.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="activityTypeId" className="block text-sm font-medium text-gray-700 mb-1">Activity Type</label>
                <select id="activityTypeId" name="activityTypeId" defaultValue={activity.activityTypeId || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent">
                  <option value="">Select type</option>
                  {allActivityTypes.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
              <select id="status" name="status" defaultValue={activity.status}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent">
                <option value="draft">Draft</option>
                <option value="review">Review</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Duration</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="priceFrom" className="block text-sm font-medium text-gray-700 mb-1">Price From (£)</label>
              <input type="number" id="priceFrom" name="priceFrom" step="0.01" defaultValue={activity.priceFrom || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent" />
            </div>
            <div>
              <label htmlFor="priceTo" className="block text-sm font-medium text-gray-700 mb-1">Price To (£)</label>
              <input type="number" id="priceTo" name="priceTo" step="0.01" defaultValue={activity.priceTo || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent" />
            </div>
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input type="text" id="duration" name="duration" defaultValue={activity.duration || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent" />
            </div>
            <div>
              <label htmlFor="bookingUrl" className="block text-sm font-medium text-gray-700 mb-1">Booking URL</label>
              <input type="url" id="bookingUrl" name="bookingUrl" defaultValue={activity.bookingUrl || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Details</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select id="difficulty" name="difficulty" defaultValue={activity.difficulty || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent">
                <option value="">Select difficulty</option>
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="challenging">Challenging</option>
                <option value="difficult">Difficult</option>
                <option value="expert">Expert</option>
              </select>
            </div>
            <div>
              <label htmlFor="minAge" className="block text-sm font-medium text-gray-700 mb-1">Minimum Age</label>
              <input type="number" id="minAge" name="minAge" defaultValue={activity.minAge || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent" />
            </div>
            <div>
              <label htmlFor="season" className="block text-sm font-medium text-gray-700 mb-1">Season</label>
              <input type="text" id="season" name="season" defaultValue={activity.season || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Link href="/admin/content/activities" className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </Link>
          <button type="submit" className="px-6 py-2 bg-accent-hover text-white rounded-lg hover:bg-accent-hover transition-colors">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
