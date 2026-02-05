"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Trash2, MapPin } from "lucide-react";
import clsx from "clsx";

interface GuidePageFormProps {
  guidePage: any | null;
  spots: any[];
  allRegions: any[];
  allActivityTypes: any[];
  allOperators: any[];
  saveAction: (formData: FormData) => Promise<void>;
  createSpotAction: ((formData: FormData) => Promise<void>) | null;
  deleteSpotAction: ((spotId: number, guidePageId: number) => Promise<void>) | null;
}

export default function GuidePageForm({
  guidePage,
  spots,
  allRegions,
  allActivityTypes,
  allOperators,
  saveAction,
  createSpotAction,
  deleteSpotAction,
}: GuidePageFormProps) {
  const [keywordsText, setKeywordsText] = useState(
    guidePage?.keywords ? JSON.stringify(guidePage.keywords, null, 2) : ""
  );
  const [featuredIdsText, setFeaturedIdsText] = useState(
    guidePage?.featuredOperatorIds
      ? JSON.stringify(guidePage.featuredOperatorIds, null, 2)
      : ""
  );
  const [showSpotForm, setShowSpotForm] = useState(false);

  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800",
    review: "bg-yellow-100 text-yellow-800",
    published: "bg-green-100 text-green-800",
    archived: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-8">
      <form action={saveAction} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Basic Information
          </h2>
          <div className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  defaultValue={guidePage?.title || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                  placeholder="e.g., Hiking in Snowdonia"
                />
              </div>

              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Type *
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  defaultValue={guidePage?.type || "combo"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                >
                  <option value="combo">Combo Page</option>
                  <option value="best_of">Best-Of Page</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="regionId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Region *
                </label>
                <select
                  id="regionId"
                  name="regionId"
                  required
                  defaultValue={guidePage?.regionId || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                >
                  <option value="">Select a region</option>
                  {allRegions.map((r: any) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="activityTypeId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Activity Type *
                </label>
                <select
                  id="activityTypeId"
                  name="activityTypeId"
                  required
                  defaultValue={guidePage?.activityTypeId || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                >
                  <option value="">Select an activity type</option>
                  {allActivityTypes.map((at: any) => (
                    <option key={at.id} value={at.id}>
                      {at.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="slug"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Slug
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  defaultValue={guidePage?.slug || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                  placeholder="e.g., snowdonia--hiking"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Auto-generated from title if blank
                </p>
              </div>

              <div>
                <label
                  htmlFor="urlPath"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  URL Path
                </label>
                <input
                  type="text"
                  id="urlPath"
                  name="urlPath"
                  defaultValue={guidePage?.urlPath || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                  placeholder="e.g., /snowdonia/things-to-do/hiking"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="h1"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                H1 Heading
              </label>
              <input
                type="text"
                id="h1"
                name="h1"
                defaultValue={guidePage?.h1 || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                placeholder="e.g., 10 Best Hikes in Snowdonia (2025)"
              />
            </div>

            <div>
              <label
                htmlFor="strapline"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Strapline
              </label>
              <input
                type="text"
                id="strapline"
                name="strapline"
                defaultValue={guidePage?.strapline || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                placeholder="Short strapline for the page"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="contentStatus"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status
                </label>
                <select
                  id="contentStatus"
                  name="contentStatus"
                  defaultValue={guidePage?.contentStatus || "draft"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="review">Review</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="priority"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Priority
                </label>
                <input
                  type="number"
                  id="priority"
                  name="priority"
                  defaultValue={guidePage?.priority || 0}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                  placeholder="0"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Tier 1=10, Tier 2=5, Tier 3=1
                </p>
              </div>

              <div>
                <label
                  htmlFor="siteId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Site ID
                </label>
                <input
                  type="number"
                  id="siteId"
                  name="siteId"
                  defaultValue={guidePage?.siteId || 1}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SEO & Keywords */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            SEO & Keywords
          </h2>
          <div className="grid gap-6">
            <div>
              <label
                htmlFor="metaTitle"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Meta Title
              </label>
              <input
                type="text"
                id="metaTitle"
                name="metaTitle"
                defaultValue={guidePage?.metaTitle || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                placeholder="SEO title (max 60 chars)"
              />
            </div>

            <div>
              <label
                htmlFor="metaDescription"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Meta Description
              </label>
              <textarea
                id="metaDescription"
                name="metaDescription"
                rows={2}
                defaultValue={guidePage?.metaDescription || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                placeholder="SEO description (max 160 chars)"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="targetKeyword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Target Keyword
                </label>
                <input
                  type="text"
                  id="targetKeyword"
                  name="targetKeyword"
                  defaultValue={guidePage?.targetKeyword || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                  placeholder="e.g., hiking in snowdonia"
                />
              </div>

              <div>
                <label
                  htmlFor="searchVolume"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Search Volume
                </label>
                <input
                  type="number"
                  id="searchVolume"
                  name="searchVolume"
                  defaultValue={guidePage?.searchVolume || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                  placeholder="Monthly searches"
                />
              </div>

              <div>
                <label
                  htmlFor="currentRanking"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Current Ranking
                </label>
                <input
                  type="number"
                  id="currentRanking"
                  name="currentRanking"
                  defaultValue={guidePage?.currentRanking || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                  placeholder="Google position"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="keywords"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Keywords (JSON)
              </label>
              <textarea
                id="keywords"
                name="keywords"
                rows={6}
                value={keywordsText}
                onChange={(e) => setKeywordsText(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent font-mono text-sm"
                placeholder={`{
  "primary": "hiking in snowdonia",
  "secondary": ["snowdonia walks", "walks in snowdonia"],
  "longTail": ["best hikes in snowdonia for beginners"],
  "localIntent": ["hiking near snowdon"],
  "commercialIntent": ["guided hikes snowdonia"]
}`}
              />
            </div>
          </div>
        </div>

        {/* Commercial / Sponsorship */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Commercial / Sponsorship
          </h2>
          <div className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="sponsorOperatorId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Sponsor Operator
                </label>
                <select
                  id="sponsorOperatorId"
                  name="sponsorOperatorId"
                  defaultValue={guidePage?.sponsorOperatorId || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                >
                  <option value="">No sponsor</option>
                  {allOperators.map((op: any) => (
                    <option key={op.id} value={op.id}>
                      {op.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="sponsorDisplayName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Sponsor Display Name
                </label>
                <input
                  type="text"
                  id="sponsorDisplayName"
                  name="sponsorDisplayName"
                  defaultValue={guidePage?.sponsorDisplayName || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                  placeholder="Name shown on the page"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="sponsorTagline"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Sponsor Tagline
              </label>
              <input
                type="text"
                id="sponsorTagline"
                name="sponsorTagline"
                defaultValue={guidePage?.sponsorTagline || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                placeholder="Sponsor tagline text"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="sponsorCtaText"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  CTA Text
                </label>
                <input
                  type="text"
                  id="sponsorCtaText"
                  name="sponsorCtaText"
                  defaultValue={guidePage?.sponsorCtaText || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                  placeholder="e.g., Book Now"
                />
              </div>

              <div>
                <label
                  htmlFor="sponsorCtaUrl"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  CTA URL
                </label>
                <input
                  type="url"
                  id="sponsorCtaUrl"
                  name="sponsorCtaUrl"
                  defaultValue={guidePage?.sponsorCtaUrl || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label
                  htmlFor="sponsorExpiresAt"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Sponsor Expires
                </label>
                <input
                  type="date"
                  id="sponsorExpiresAt"
                  name="sponsorExpiresAt"
                  defaultValue={
                    guidePage?.sponsorExpiresAt
                      ? new Date(guidePage.sponsorExpiresAt)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="featuredOperatorIds"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Featured Operator IDs (JSON array)
              </label>
              <textarea
                id="featuredOperatorIds"
                name="featuredOperatorIds"
                rows={2}
                value={featuredIdsText}
                onChange={(e) => setFeaturedIdsText(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent font-mono text-sm"
                placeholder='[1, 5, 12]'
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Content</h2>
          <div className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="heroImage"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Hero Image URL
                </label>
                <input
                  type="text"
                  id="heroImage"
                  name="heroImage"
                  defaultValue={guidePage?.heroImage || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label
                  htmlFor="heroAlt"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Hero Alt Text
                </label>
                <input
                  type="text"
                  id="heroAlt"
                  name="heroAlt"
                  defaultValue={guidePage?.heroAlt || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                  placeholder="Descriptive alt text"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="introduction"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Introduction (Markdown)
              </label>
              <textarea
                id="introduction"
                name="introduction"
                rows={8}
                defaultValue={guidePage?.introduction || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                placeholder="Write the introduction in markdown..."
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="bestSeason"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Best Season
                </label>
                <input
                  type="text"
                  id="bestSeason"
                  name="bestSeason"
                  defaultValue={guidePage?.bestSeason || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                  placeholder="e.g., Spring to Autumn"
                />
              </div>

              <div>
                <label
                  htmlFor="difficultyRange"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Difficulty Range
                </label>
                <input
                  type="text"
                  id="difficultyRange"
                  name="difficultyRange"
                  defaultValue={guidePage?.difficultyRange || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                  placeholder="e.g., Easy to Challenging"
                />
              </div>

              <div>
                <label
                  htmlFor="priceRange"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Price Range
                </label>
                <input
                  type="text"
                  id="priceRange"
                  name="priceRange"
                  defaultValue={guidePage?.priceRange || ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                  placeholder="e.g., Free to £50"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="dataFile"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Data File Path
              </label>
              <input
                type="text"
                id="dataFile"
                name="dataFile"
                defaultValue={guidePage?.dataFile || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent"
                placeholder="e.g., data/combo-pages/snowdonia--hiking.json"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/content/guide-pages"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2 bg-[#ea580c] text-white rounded-lg hover:bg-[#ea580c] transition-colors"
          >
            {guidePage ? "Save Changes" : "Create Guide Page"}
          </button>
        </div>
      </form>

      {/* Spots Section (only shown for existing pages) */}
      {guidePage && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Spots ({spots.length})
            </h2>
            <button
              type="button"
              onClick={() => setShowSpotForm(!showSpotForm)}
              className="flex items-center gap-2 px-4 py-2 bg-[#ea580c] text-white rounded-lg hover:bg-[#ea580c] transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Spot
            </button>
          </div>

          {/* Add Spot Form */}
          {showSpotForm && createSpotAction && (
            <form
              action={async (formData: FormData) => {
                await createSpotAction(formData);
                setShowSpotForm(false);
              }}
              className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <h3 className="font-medium text-gray-900 mb-4">New Spot</h3>
              <div className="grid gap-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="spotName"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent text-sm"
                      placeholder="Spot name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rank *
                    </label>
                    <input
                      type="number"
                      name="spotRank"
                      required
                      defaultValue={spots.length + 1}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Difficulty
                    </label>
                    <input
                      type="text"
                      name="spotDifficulty"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent text-sm"
                      placeholder="e.g., Moderate"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="spotDescription"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent text-sm"
                    placeholder="Describe this spot..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Verdict
                  </label>
                  <input
                    type="text"
                    name="spotVerdict"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent text-sm"
                    placeholder="One-line verdict (for best-of lists)"
                  />
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      name="spotDuration"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent text-sm"
                      placeholder="e.g., 3-4 hours"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Distance
                    </label>
                    <input
                      type="text"
                      name="spotDistance"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent text-sm"
                      placeholder="e.g., 8km"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Elevation Gain
                    </label>
                    <input
                      type="text"
                      name="spotElevationGain"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent text-sm"
                      placeholder="e.g., 500m"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Est. Cost
                    </label>
                    <input
                      type="text"
                      name="spotEstimatedCost"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent text-sm"
                      placeholder="e.g., Free"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Best For
                    </label>
                    <input
                      type="text"
                      name="spotBestFor"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent text-sm"
                      placeholder="e.g., Experienced hikers, photographers"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Best Season
                    </label>
                    <input
                      type="text"
                      name="spotBestSeason"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent text-sm"
                      placeholder="e.g., May-September"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Insider Tip
                  </label>
                  <textarea
                    name="spotInsiderTip"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent text-sm"
                    placeholder="A local tip that most guides don't mention..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parking
                  </label>
                  <input
                    type="text"
                    name="spotParking"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent text-sm"
                    placeholder="Parking info..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="text"
                      name="spotImage"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent text-sm"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image Alt
                    </label>
                    <input
                      type="text"
                      name="spotImageAlt"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ea580c] focus:border-transparent text-sm"
                      placeholder="Alt text"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowSpotForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#ea580c] text-white rounded-lg hover:bg-[#ea580c] transition-colors text-sm"
                >
                  Add Spot
                </button>
              </div>
            </form>
          )}

          {/* Spots List */}
          {spots.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {spots.map((spot) => (
                <div
                  key={spot.id}
                  className="py-4 flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-indigo-100 p-2 rounded-lg flex-shrink-0">
                      <span className="text-sm font-bold text-indigo-700">
                        #{spot.rank}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{spot.name}</p>
                      {spot.verdict && (
                        <p className="text-sm text-indigo-600 italic mt-0.5">
                          {spot.verdict}
                        </p>
                      )}
                      {spot.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {spot.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                        {spot.difficulty && (
                          <span>Difficulty: {spot.difficulty}</span>
                        )}
                        {spot.duration && (
                          <span>Duration: {spot.duration}</span>
                        )}
                        {spot.distance && (
                          <span>Distance: {spot.distance}</span>
                        )}
                        {spot.estimatedCost && (
                          <span>Cost: {spot.estimatedCost}</span>
                        )}
                        {(spot.lat || spot.lng) && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {spot.lat}, {spot.lng}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {deleteSpotAction && (
                    <form
                      action={deleteSpotAction.bind(null, spot.id, guidePage.id)}
                    >
                      <button
                        type="submit"
                        className="p-2 text-gray-400 hover:text-red-500"
                        title="Delete spot"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No spots added yet. Click &quot;Add Spot&quot; to create the first
              entry.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
