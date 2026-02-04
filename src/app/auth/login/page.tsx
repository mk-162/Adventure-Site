"use client";

import { useState } from "react";

export default function LoginPage() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      setSubmitted(true);
    } catch (err) {
      setError("Failed to send login link. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-slate-200 text-center">
          <div className="text-green-500 text-5xl mb-4">✉️</div>
          <h2 className="text-2xl font-bold mb-2 text-slate-900">Check your email</h2>
          <p className="text-slate-600 mb-6">
            We've sent a sign-in link to <strong>{email}</strong>.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="text-orange-600 font-medium hover:text-orange-700"
          >
            Try another email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Operator Sign In</h1>
          <p className="text-slate-600">
            Enter the email address associated with your listing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded text-sm">{error}</div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="you@company.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {loading ? "Sending Link..." : "Send Sign-In Link"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
            Not listed yet? <a href="/contact" className="text-orange-600 hover:underline">Get in touch</a> to verify your business.
        </div>
      </div>
    </div>
  );
}
