import { db } from "@/db";
import { regions } from "@/db/schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function createRegion(formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const heroImage = formData.get("heroImage") as string;
  const lat = formData.get("lat") as string;
  const lng = formData.get("lng") as string;
  const status = formData.get("status") as string;

  const slug = slugify(name);

  await db.insert(regions).values({
    siteId: 1,
    name,
    slug,
    description: description || null,
    heroImage: heroImage || null,
    lat: lat ? lat : null,
    lng: lng ? lng : null,
    status: (status as any) || "draft",
  });

  revalidatePath("/admin/content/regions");
  redirect("/admin/content/regions");
}

export default async function NewRegionPage() {
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
        <h1 className="text-2xl font-bold text-gray-900">Add New Region</h1>
        <p className="text-gray-500 mt-1">Create a new region</p>
      </div>

      <form action={createRegion} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Basic Information
          </h2>
          <div className="grid gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent"
                placeholder="e.g., Snowdonia"
              />
              <p className="text-sm text-gray-500 mt-1">Slug will be auto-generated from name</p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent"
                placeholder="Brief description of the region..."
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                id="status"
                name="status"
                defaultValue="draft"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="review">Review</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Media
          </h2>
          <div>
            <label htmlFor="heroImage" className="block text-sm font-medium text-gray-700 mb-1">
              Hero Image URL
            </label>
            <input
              type="url"
              id="heroImage"
              name="heroImage"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Location
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="lat" className="block text-sm font-medium text-gray-700 mb-1">
                Latitude
              </label>
              <input
                type="text"
                id="lat"
                name="lat"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent"
                placeholder="e.g., 53.0685"
              />
            </div>
            <div>
              <label htmlFor="lng" className="block text-sm font-medium text-gray-700 mb-1">
                Longitude
              </label>
              <input
                type="text"
                id="lng"
                name="lng"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent"
                placeholder="e.g., -4.0762"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/content/regions"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2 bg-accent-hover text-white rounded-lg hover:bg-accent-hover transition-colors"
          >
            Create Region
          </button>
        </div>
      </form>
    </div>
  );
}
