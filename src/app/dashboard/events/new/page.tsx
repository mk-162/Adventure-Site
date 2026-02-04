"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Calendar, MapPin, Globe, Ticket, Info, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Convert checkbox to boolean
    const promote = formData.get("promote") === "on";
    const payload = { ...data, promote };

    try {
      const res = await fetch("/api/events/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to submit event");
      }

      setSuccess(true);
      // Optional: redirect after delay
      setTimeout(() => router.push("/dashboard/events"), 2000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
          <Calendar className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-[#1e3a4c] mb-4">Event Submitted!</h1>
        <p className="text-gray-600 mb-8">
          Your event has been submitted for review. We'll verify the details and publish it shortly.
        </p>
        <Link
          href="/dashboard/events"
          className="inline-block bg-[#1e3a4c] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#152a38]"
        >
          Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link
          href="/dashboard/events"
          className="text-sm font-medium text-gray-500 hover:text-[#1e3a4c] flex items-center gap-1 mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Events
        </Link>
        <h1 className="text-3xl font-bold text-[#1e3a4c]">Add New Event</h1>
        <p className="text-gray-500 mt-1">Fill in the details below to list your event on Adventure Wales.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Basic Info */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-[#1e3a4c] mb-6 flex items-center gap-2">
            <Info className="w-5 h-5 text-[#f97316]" /> Basic Information
          </h2>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Event Name *</label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none"
                placeholder="e.g. Snowdonia Trail Marathon"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none"
                placeholder="Describe your event..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Type / Category</label>
                <select
                  name="type"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none bg-white"
                >
                  <option value="Running">Running</option>
                  <option value="Cycling">Cycling</option>
                  <option value="Triathlon">Triathlon</option>
                  <option value="Festival">Festival</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Competition">Competition</option>
                  <option value="Social">Social</option>
                  <option value="Walking">Walking</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Hero Image URL</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="url"
                    name="heroImage"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Date & Location */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-[#1e3a4c] mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#f97316]" /> Date & Location
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Start Date *</label>
              <input
                type="datetime-local"
                name="dateStart"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">End Date</label>
              <input
                type="datetime-local"
                name="dateEnd"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Location Name</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  name="location"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none"
                  placeholder="e.g. Llanberis, Snowdonia"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Latitude</label>
              <input
                type="number"
                step="any"
                name="lat"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none"
                placeholder="53.1234"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Longitude</label>
              <input
                type="number"
                step="any"
                name="lng"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none"
                placeholder="-4.1234"
              />
            </div>
          </div>
        </section>

        {/* Details */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-[#1e3a4c] mb-6 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-[#f97316]" /> Event Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Website URL</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="url"
                  name="website"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Ticket URL</label>
              <div className="relative">
                <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="url"
                  name="ticketUrl"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Entry Fee (£)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                name="registrationCost"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Capacity</label>
              <input
                type="number"
                min="0"
                name="capacity"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none"
                placeholder="e.g. 500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Difficulty</label>
              <select
                name="difficulty"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none bg-white"
              >
                <option value="">Select difficulty...</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="elite">Elite</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Age Range</label>
              <select
                name="ageRange"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none bg-white"
              >
                <option value="">Select age range...</option>
                <option value="all-ages">All Ages</option>
                <option value="family-friendly">Family Friendly</option>
                <option value="18+">18+</option>
                <option value="juniors">Juniors</option>
              </select>
            </div>
          </div>
        </section>

        {/* Promotion */}
        <section className="bg-[#1e3a4c] rounded-xl shadow-sm p-6 sm:p-8 text-white">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-white/10 rounded-lg">
              <Star className="w-6 h-6 text-[#f97316] fill-[#f97316]" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Promote this Event?</h2>
              <p className="text-gray-300 text-sm mb-4">
                Boost visibility by featuring this event on the calendar and homepage.
                <span className="opacity-70 ml-1">(Requires Verified or Premium plan)</span>
              </p>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="promote" className="w-5 h-5 rounded border-gray-500 text-[#f97316] focus:ring-[#f97316]" />
                <span className="font-bold group-hover:text-[#f97316] transition-colors">Yes, promote this event</span>
              </label>
            </div>
          </div>
        </section>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Link
            href="/dashboard/events"
            className="px-6 py-3 rounded-lg font-bold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#f97316] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#ea580c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Submit Event
          </button>
        </div>
      </form>
    </div>
  );
}
