import { db } from "@/db";
import { accommodation, regions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

async function getAccommodation(id: number) {
  const [item] = await db.select().from(accommodation).where(eq(accommodation.id, id));
  return item;
}

async function getRegions() {
  return db.select().from(regions).orderBy(regions.name);
}

async function updateAccommodation(id: number, formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const description = formData.get("description") as string;
  const regionId = formData.get("regionId") as string;
  const address = formData.get("address") as string;
  const website = formData.get("website") as string;
  const priceFrom = formData.get("priceFrom") as string;
  const priceTo = formData.get("priceTo") as string;
  const adventureFeatures = formData.get("adventureFeatures") as string;
  const bookingUrl = formData.get("bookingUrl") as string;
  const airbnbUrl = formData.get("airbnbUrl") as string;
  const lat = formData.get("lat") as string;
  const lng = formData.get("lng") as string;
  const googleRating = formData.get("googleRating") as string;
  const status = formData.get("status") as "draft" | "review" | "published" | "archived";

  await db
    .update(accommodation)
    .set({
      name,
      type: type || null,
      description: description || null,
      regionId: regionId ? parseInt(regionId) : null,
      address: address || null,
      website: website || null,
      priceFrom: priceFrom || null,
      priceTo: priceTo || null,
      adventureFeatures: adventureFeatures || null,
      bookingUrl: bookingUrl || null,
      airbnbUrl: airbnbUrl || null,
      lat: lat || null,
      lng: lng || null,
      googleRating: googleRating || null,
      status: status || "draft",
    })
    .where(eq(accommodation.id, id));

  revalidatePath("/admin/content/accommodation");
  revalidatePath(`/admin/content/accommodation/${id}`);
  redirect("/admin/content/accommodation");
}

export default async function EditAccommodationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const accommodationId = parseInt(id);
  const item = await getAccommodation(accommodationId);

  if (!item) {
    redirect("/admin/content/accommodation");
  }

  const allRegions = await getRegions();

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/content/accommodation"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Accommodation
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Accommodation</h1>
        <p className="text-gray-500 mt-1">{item.name}</p>
      </div>

      <form action={updateAccommodation.bind(null, accommodationId)} className="space-y-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input type="text" id="name" name="name" required defaultValue={item.name}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent" />
              <p className="text-sm text-gray-500 mt-1">Slug (read-only): {item.slug}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select id="type" name="type" defaultValue={item.type || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent">
                  <option value="">Select type</option>
                  <option value="hotel">Hotel</option>
                  <option value="hostel">Hostel</option>
                  <option value="bunkhouse">Bunkhouse</option>
                  <option value="cottage">Cottage</option>
                  <option value="campsite">Campsite</option>
                  <option value="glamping">Glamping</option>
                  <option value="b&b">B&B</option>
                  <option value="apartment">Apartment</option>
                </select>
              </div>
              <div>
                <label htmlFor="regionId" className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                <select id="regionId" name="regionId" defaultValue={item.regionId || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent">
                  <option value="">Select region</option>
                  {allRegions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea id="description" name="description" rows={4} defaultValue={item.description || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent" />
            </div>

            <div>
              <label htmlFor="adventureFeatures" className="block text-sm font-medium text-gray-700 mb-1">Adventure Features</label>
              <textarea id="adventureFeatures" name="adventureFeatures" rows={2} defaultValue={item.adventureFeatures || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent" />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
              <select id="status" name="status" defaultValue={item.status}
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact & Location</h2>
          <div className="grid gap-6">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea id="address" name="address" rows={2} defaultValue={item.address || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="lat" className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                <input type="text" id="lat" name="lat" defaultValue={item.lat || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent" />
              </div>
              <div>
                <label htmlFor="lng" className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                <input type="text" id="lng" name="lng" defaultValue={item.lng || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent" />
              </div>
            </div>
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input type="url" id="website" name="website" defaultValue={item.website || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Booking</h2>
          <div className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="priceFrom" className="block text-sm font-medium text-gray-700 mb-1">Price From (£)</label>
                <input type="number" id="priceFrom" name="priceFrom" step="0.01" defaultValue={item.priceFrom || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent" />
              </div>
              <div>
                <label htmlFor="priceTo" className="block text-sm font-medium text-gray-700 mb-1">Price To (£)</label>
                <input type="number" id="priceTo" name="priceTo" step="0.01" defaultValue={item.priceTo || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent" />
              </div>
            </div>
            <div>
              <label htmlFor="bookingUrl" className="block text-sm font-medium text-gray-700 mb-1">Booking URL</label>
              <input type="url" id="bookingUrl" name="bookingUrl" defaultValue={item.bookingUrl || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent" />
            </div>
            <div>
              <label htmlFor="airbnbUrl" className="block text-sm font-medium text-gray-700 mb-1">Airbnb URL</label>
              <input type="url" id="airbnbUrl" name="airbnbUrl" defaultValue={item.airbnbUrl || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent" />
            </div>
            <div>
              <label htmlFor="googleRating" className="block text-sm font-medium text-gray-700 mb-1">Google Rating</label>
              <input type="number" id="googleRating" name="googleRating" step="0.1" min="0" max="5" defaultValue={item.googleRating || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Link href="/admin/content/accommodation" className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
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
