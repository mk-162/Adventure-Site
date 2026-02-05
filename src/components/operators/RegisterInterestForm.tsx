"use client";

import { useState } from "react";
import { Send, CheckCircle, Loader2 } from "lucide-react";

interface RegisterInterestFormProps {
  preselectedPlan?: string;
}

export function RegisterInterestForm({ preselectedPlan }: RegisterInterestFormProps) {
  const [formData, setFormData] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    numLocations: 1,
    planInterest: preselectedPlan || "free",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/operator-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-12 px-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-primary mb-3">Thank you!</h3>
        <p className="text-slate-600 max-w-md mx-auto">
          We&apos;ve received your details and will be in touch within 24 hours.
          In the meantime, you can{" "}
          <a href="/directory" className="text-accent-hover hover:underline font-medium">
            browse our directory
          </a>{" "}
          to find your listing.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-slate-700 mb-1.5">
            Business Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="businessName"
            required
            value={formData.businessName}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-accent-hover focus:ring-2 focus:ring-accent-hover/20 outline-none transition-all text-slate-900"
            placeholder="e.g. Zip World"
          />
        </div>
        <div>
          <label htmlFor="contactName" className="block text-sm font-medium text-slate-700 mb-1.5">
            Contact Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="contactName"
            required
            value={formData.contactName}
            onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-accent-hover focus:ring-2 focus:ring-accent-hover/20 outline-none transition-all text-slate-900"
            placeholder="Your name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-accent-hover focus:ring-2 focus:ring-accent-hover/20 outline-none transition-all text-slate-900"
            placeholder="you@business.co.uk"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">
            Phone <span className="text-slate-400">(optional)</span>
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-accent-hover focus:ring-2 focus:ring-accent-hover/20 outline-none transition-all text-slate-900"
            placeholder="01234 567890"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="numLocations" className="block text-sm font-medium text-slate-700 mb-1.5">
            Number of Locations
          </label>
          <input
            type="number"
            id="numLocations"
            min={1}
            max={50}
            value={formData.numLocations}
            onChange={(e) => setFormData({ ...formData, numLocations: parseInt(e.target.value) || 1 })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-accent-hover focus:ring-2 focus:ring-accent-hover/20 outline-none transition-all text-slate-900"
          />
        </div>
        <div>
          <label htmlFor="planInterest" className="block text-sm font-medium text-slate-700 mb-1.5">
            Plan Interest
          </label>
          <select
            id="planInterest"
            value={formData.planInterest}
            onChange={(e) => setFormData({ ...formData, planInterest: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-accent-hover focus:ring-2 focus:ring-accent-hover/20 outline-none transition-all text-slate-900 bg-white"
          >
            <option value="free">Free</option>
            <option value="verified">Verified (£9.99/mo)</option>
            <option value="premium">Premium (£29.99/mo)</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1.5">
          Message <span className="text-slate-400">(optional)</span>
        </label>
        <textarea
          id="message"
          rows={3}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-accent-hover focus:ring-2 focus:ring-accent-hover/20 outline-none transition-all text-slate-900 resize-none"
          placeholder="Tell us about your business or any questions..."
        />
      </div>

      {status === "error" && (
        <p className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-accent-hover text-white font-semibold rounded-full hover:bg-accent-hover focus:ring-2 focus:ring-accent-hover focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            Register Interest
          </>
        )}
      </button>
    </form>
  );
}
