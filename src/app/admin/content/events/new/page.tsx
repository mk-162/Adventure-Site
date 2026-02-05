import { db } from "@/db";
import { events, regions } from "@/db/schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

async function getRegions() {
  return db.select().from(regions).orderBy(regions.name);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function createEvent(formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const description = formData.get("description") as string;
  const regionId = formData.get("regionId") as string;
  const dateStart = formData.get("dateStart") as string;
  const dateEnd = formData.get("dateEnd") as string;
  const monthTypical = formData.get("monthTypical") as string;
  const location = formData.get("location") as string;
  const website = formData.get("website") as string;
  const registrationCost = formData.get("registrationCost") as string;
  const capacity = formData.get("capacity") as string;
  const lat = formData.get("lat") as string;
  const lng = formData.get("lng") as string;
  const status = formData.get("status") as string;

  const slug = slugify(name);

  await db.insert(events).values({
    siteId: 1,
    name,
    slug,
    type: type || null,
    description: description || null,
    regionId: regionId ? parseInt(regionId) : null,
    dateStart: dateStart ? new Date(dateStart) : null,
    dateEnd: dateEnd ? new Date(dateEnd) : null,
    monthTypical: monthTypical || null,
    location: location || null,
    website: website || null,
    registrationCost: registrationCost ? registrationCost : null,
    capacity: capacity ? parseInt(capacity) : null,
    lat: lat ? lat : null,
    lng: lng ? lng : null,
    status: (status as any) || "draft",
  });

  revalidatePath("/admin/content/events");
  redirect("/admin/content/events");
}

export default async function NewEventPage() {
  const allRegions = await getRegions();

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/content/events"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add New Event</h1>
        <p className="text-gray-500 mt-1">Create a new event</p>
      </div>

      <form action={createEvent} className="space-y-8">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                placeholder="e.g., Snowdonia Trail Marathon"
              />
              <p className="text-sm text-gray-500 mt-1">Slug will be auto-generated from name</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                >
                  <option value="">Select type</option>
                  <option value="race">Race</option>
                  <option value="festival">Festival</option>
                  <option value="competition">Competition</option>
                  <option value="workshop">Workshop</option>
                  <option value="exhibition">Exhibition</option>
                  <option value="meetup">Meetup</option>
                  <option value="conference">Conference</option>
                </select>
              </div>

              <div>
                <label htmlFor="regionId" className="block text-sm font-medium text-gray-700 mb-1">
                  Region
                </label>
                <select
                  id="regionId"
                  name="regionId"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                >
                  <option value="">Select region</option>
                  {allRegions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                placeholder="Brief description of the event..."
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="review">Review</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dates & Location */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Dates & Location
          </h2>
          <div className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="dateStart" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  id="dateStart"
                  name="dateStart"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="dateEnd" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="datetime-local"
                  id="dateEnd"
                  name="dateEnd"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="monthTypical" className="block text-sm font-medium text-gray-700 mb-1">
                Typical Month (for recurring events)
              </label>
              <select
                id="monthTypical"
                name="monthTypical"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
              >
                <option value="">Select month</option>
                <option value="january">January</option>
                <option value="february">February</option>
                <option value="march">March</option>
                <option value="april">April</option>
                <option value="may">May</option>
                <option value="june">June</option>
                <option value="july">July</option>
                <option value="august">August</option>
                <option value="september">September</option>
                <option value="october">October</option>
                <option value="november">November</option>
                <option value="december">December</option>
              </select>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                placeholder="e.g., Llanberis, Snowdonia"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="lat" className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude
                </label>
                <input
                  type="text"
                  id="lat"
                  name="lat"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                  placeholder="e.g., -4.0762"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Registration & Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Registration & Details
          </h2>
          <div className="grid gap-6">
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                placeholder="https://example.com"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="registrationCost" className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Cost (£)
                </label>
                <input
                  type="number"
                  id="registrationCost"
                  name="registrationCost"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                  placeholder="e.g., 35.00"
                />
              </div>

              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity
                </label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                  placeholder="e.g., 500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/content/events"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2 bg-[#ea580c] text-white rounded-lg hover:bg-[#ea580c] transition-colors"
          >
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
}
