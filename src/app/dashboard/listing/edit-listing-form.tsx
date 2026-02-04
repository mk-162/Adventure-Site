"use client";

import { updateListing } from "./actions";
import { useState } from "react";

export function EditListingForm({ operator }: { operator: any }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setSuccess(false);
    try {
      await updateListing(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      alert("Failed to update listing");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6 max-w-3xl">
       {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded border border-green-200">
          Listing updated successfully!
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <div>
           <label className="block text-sm font-medium text-slate-700 mb-1">Tagline</label>
           <input type="text" name="tagline" defaultValue={operator.tagline || ""} className="w-full px-3 py-2 border rounded-md" />
           <p className="text-xs text-slate-500 mt-1">A short, catchy phrase (e.g. "Wales' Premier Surf School")</p>
        </div>

        <div>
           <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
           <textarea name="description" rows={5} defaultValue={operator.description || ""} className="w-full px-3 py-2 border rounded-md" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Public Email</label>
                <input type="email" name="email" defaultValue={operator.email || ""} className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input type="text" name="phone" defaultValue={operator.phone || ""} className="w-full px-3 py-2 border rounded-md" />
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Website URL</label>
            <input type="url" name="website" defaultValue={operator.website || ""} className="w-full px-3 py-2 border rounded-md" />
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
            <textarea name="address" rows={3} defaultValue={operator.address || ""} className="w-full px-3 py-2 border rounded-md" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Logo URL</label>
                <input type="text" name="logoUrl" defaultValue={operator.logoUrl || ""} className="w-full px-3 py-2 border rounded-md" />
            </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cover Image URL</label>
                <input type="text" name="coverImage" defaultValue={operator.coverImage || ""} className="w-full px-3 py-2 border rounded-md" />
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Unique Selling Point</label>
            <input type="text" name="uniqueSellingPoint" defaultValue={operator.uniqueSellingPoint || ""} className="w-full px-3 py-2 border rounded-md" />
            <p className="text-xs text-slate-500 mt-1">What makes you different? (e.g. "Small groups guaranteed")</p>
        </div>
      </div>

      <div className="flex justify-end pt-6">
          <button type="submit" disabled={loading} className="bg-orange-500 text-white font-bold py-2 px-6 rounded hover:bg-orange-600 disabled:opacity-50">
              {loading ? "Saving..." : "Save Changes"}
          </button>
      </div>
    </form>
  );
}
