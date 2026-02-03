"use client";

import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    // TODO: Implement newsletter signup
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus("success");
    setEmail("");
  };

  return (
    <section className="py-20 px-4 bg-[#1e3a4c]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Get Inspired for Your Next Adventure
        </h2>
        <p className="text-white/80 mb-8 max-w-xl mx-auto">
          Subscribe to our newsletter for exclusive deals, travel tips, and hidden gems.
        </p>

        {status === "success" ? (
          <div className="bg-green-500/20 text-green-100 px-6 py-4 rounded-lg inline-block">
            ✓ Thanks for subscribing! Check your inbox for confirmation.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="px-6 py-4 rounded-full text-gray-900 w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-[#f97316]"
              required
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-8 py-4 bg-[#f97316] text-white font-semibold rounded-full hover:bg-[#ea580c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        )}

        <p className="text-white/50 text-sm mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
