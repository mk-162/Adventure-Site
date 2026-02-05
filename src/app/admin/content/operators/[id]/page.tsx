import { db } from "@/db";
import { operators, regions, activityTypes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { upgradeToPremium, downgradeToClaimed } from "@/app/admin/commercial/claims/actions";
import ImageUpload from "@/components/admin/ImageUpload";

async function getOperator(id: number) {
  const [operator] = await db.select().from(operators).where(eq(operators.id, id));
  return operator;
}

async function getFormData() {
  const [allRegions, allActivityTypes] = await Promise.all([
    db.select().from(regions).orderBy(regions.name),
    db.select().from(activityTypes).orderBy(activityTypes.name),
  ]);

  return { allRegions, allActivityTypes };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function updateOperator(id: number, formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const website = formData.get("website") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const description = formData.get("description") as string;
  const priceRange = formData.get("priceRange") as string;
  const logoUrl = formData.get("logoUrl") as string;
  const coverImage = formData.get("coverImage") as string;
  const selectedRegions = formData.getAll("regions") as string[];
  const selectedActivityTypes = formData.getAll("activityTypes") as string[];

  const slug = slugify(name);

  await db
    .update(operators)
    .set({
      name,
      slug,
      category: category as any,
      website: website || null,
      email: email || null,
      phone: phone || null,
      address: address || null,
      description: description || null,
      priceRange: priceRange || null,
      logoUrl: logoUrl || null,
      coverImage: coverImage || null,
      regions: selectedRegions.length > 0 ? selectedRegions : null,
      activityTypes: selectedActivityTypes.length > 0 ? selectedActivityTypes : null,
      updatedAt: new Date(),
    })
    .where(eq(operators.id, id));

  revalidatePath("/admin/content/operators");
  revalidatePath(`/admin/content/operators/${id}`);
  revalidatePath(`/directory/${slug}`);
  redirect("/admin/content/operators");
}

export default async function EditOperatorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const operatorId = parseInt(id);
  const operator = await getOperator(operatorId);

  if (!operator) {
    redirect("/admin/content/operators");
  }

  const { allRegions, allActivityTypes } = await getFormData();

  const operatorRegions = operator.regions || [];
  const operatorActivityTypes = operator.activityTypes || [];

  const claimStatusColors: Record<string, string> = {
    stub: "bg-gray-100 text-gray-800",
    claimed: "bg-blue-100 text-blue-800",
    premium: "bg-yellow-100 text-yellow-800",
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/content/operators"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Operators
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Operator</h1>
            <p className="text-gray-500 mt-1">{operator.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                claimStatusColors[operator.claimStatus || "stub"]
              }`}
            >
              {operator.claimStatus}
            </span>
            {operator.claimStatus !== "premium" && (
              <form action={upgradeToPremium.bind(null, operatorId)}>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                >
                  ⬆️ Upgrade to Premium
                </button>
              </form>
            )}
            {operator.claimStatus === "premium" && (
              <form action={downgradeToClaimed.bind(null, operatorId)}>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  ⬇️ Downgrade to Claimed
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <form action={updateOperator.bind(null, operatorId)} className="space-y-8">
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
                defaultValue={operator.name}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                placeholder="e.g., Snowdonia Adventures"
              />
              <p className="text-sm text-gray-500 mt-1">Current slug: {operator.slug}</p>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                defaultValue={operator.category || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
              >
                <option value="">Select a category</option>
                <option value="activity_provider">Activity Provider</option>
                <option value="gear_rental">Gear Rental</option>
                <option value="food_drink">Food & Drink</option>
                <option value="transport">Transport</option>
                <option value="accommodation">Accommodation</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={operator.description || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                placeholder="Brief description of the operator..."
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Images
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <ImageUpload
              name="logoUrl"
              label="Logo"
              currentUrl={operator.logoUrl}
              aspectHint="square"
            />
            <ImageUpload
              name="coverImage"
              label="Cover Image"
              currentUrl={operator.coverImage}
              aspectHint="landscape"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Contact Information
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
                defaultValue={operator.website || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                placeholder="https://example.com"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  defaultValue={operator.email || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                  placeholder="contact@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  defaultValue={operator.phone || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                  placeholder="+44 1234 567890"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                rows={2}
                defaultValue={operator.address || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                placeholder="Full address..."
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Pricing
          </h2>
          <div>
            <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 mb-1">
              Price Range
            </label>
            <select
              id="priceRange"
              name="priceRange"
              defaultValue={operator.priceRange || ""}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
            >
              <option value="">Select price range</option>
              <option value="£">£ - Budget</option>
              <option value="££">££ - Moderate</option>
              <option value="£££">£££ - Premium</option>
              <option value="££££">££££ - Luxury</option>
            </select>
          </div>
        </div>

        {/* Regions & Activity Types */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Regions & Activity Types
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Regions
              </label>
              <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto">
                {allRegions.map((region) => (
                  <div key={region.id} className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      id={`region-${region.id}`}
                      name="regions"
                      value={region.slug}
                      defaultChecked={operatorRegions.includes(region.slug)}
                      className="rounded text-[#ea580c] focus:ring-[#ea580c]"
                    />
                    <label htmlFor={`region-${region.id}`} className="text-sm text-gray-700">
                      {region.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity Types
              </label>
              <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto">
                {allActivityTypes.map((activityType) => (
                  <div key={activityType.id} className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      id={`activity-${activityType.id}`}
                      name="activityTypes"
                      value={activityType.slug}
                      defaultChecked={operatorActivityTypes.includes(activityType.slug)}
                      className="rounded text-[#ea580c] focus:ring-[#ea580c]"
                    />
                    <label htmlFor={`activity-${activityType.id}`} className="text-sm text-gray-700">
                      {activityType.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/content/operators"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2 bg-[#ea580c] text-white rounded-lg hover:bg-[#ea580c] transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
