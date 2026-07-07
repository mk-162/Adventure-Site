import { db } from "@/db";
import { regions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

async function getRegion(id: number) {
  const [region] = await db.select().from(regions).where(eq(regions.id, id));
  return region;
}

async function updateRegion(id: number, formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const heroImage = formData.get("heroImage") as string;
  const lat = formData.get("lat") as string;
  const lng = formData.get("lng") as string;
  const status = formData.get("status") as "draft" | "review" | "published" | "archived";

  await db
    .update(regions)
    .set({
      name,
      description: description || null,
      heroImage: heroImage || null,
      lat: lat || null,
      lng: lng || null,
      status: status || "draft",
      updatedAt: new Date(),
    })
    .where(eq(regions.id, id));

  revalidatePath("/admin/content/regions");
  revalidatePath(`/admin/content/regions/${id}`);
  redirect("/admin/content/regions");
}

export default async function EditRegionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const regionId = parseInt(id);
  const region = await getRegion(regionId);

  if (!region) {
    redirect("/admin/content/regions");
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/content/regions"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Regions
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Region</h1>
        <p className="text-gray-500 mt-1">{region.name}</p>
      </div>

      <form action={updateRegion.bind(null, regionId)} className="space-y-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input type="text" id="name" name="name" required defaultValue={region.name}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent" />
              <p className="text-sm text-gray-500 mt-1">Slug (read-only): {region.slug}</p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea id="description" name="description" rows={4} defaultValue={region.description || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent" />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
              <select id="status" name="status" defaultValue={region.status}
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Media</h2>
          <div>
            <label htmlFor="heroImage" className="block text-sm font-medium text-gray-700 mb-1">Hero Image URL</label>
            <input type="url" id="heroImage" name="heroImage" defaultValue={region.heroImage || ""}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="lat" className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
              <input type="text" id="lat" name="lat" defaultValue={region.lat || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent" />
            </div>
            <div>
              <label htmlFor="lng" className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
              <input type="text" id="lng" name="lng" defaultValue={region.lng || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Link href="/admin/content/regions" className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
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
