"use client";

import { useState } from "react";
import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface NewsletterProps {
  source?: string;
  className?: string;
}

export function Newsletter({ source = "website", className }: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [gdprConsent, setGdprConsent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!gdprConsent) {
      setStatus("error");
      setMessage("Please accept the privacy policy to subscribe.");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      if (response.ok) {
        setStatus("success");
        setMessage("Thanks for subscribing! Check your inbox soon.");
        setEmail("");
        setGdprConsent(false);
      } else {
        const data = await response.json();
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className={`bg-green-50 rounded-xl p-6 ${className}`}>
        <div className="flex items-center gap-3 text-green-700">
          <CheckCircle className="h-6 w-6" />
          <p className="font-medium">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-primary rounded-xl p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-accent-hover p-2 rounded-lg">
          <Mail className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-white">
          Adventure Updates
        </h3>
      </div>

      <p className="text-gray-300 mb-4">
        Get the latest adventures, tips, and exclusive offers straight to your inbox.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          required
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-hover"
        />

        <label className="flex items-start gap-2 text-sm text-gray-300">
          <input
            type="checkbox"
            checked={gdprConsent}
            onChange={(e) => setGdprConsent(e.target.checked)}
            className="mt-1 rounded border-white/30 bg-white/10 text-accent-hover focus:ring-accent-hover"
          />
          <span>
            I agree to receive emails and accept the{" "}
            <a href="/privacy" className="text-accent-hover hover:underline">
              privacy policy
            </a>
          </span>
        </label>

        {status === "error" && (
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="h-4 w-4" />
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full py-3 bg-accent-hover text-white font-medium rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Subscribing...
            </>
          ) : (
            "Subscribe"
          )}
        </button>
      </form>
    </div>
  );
}
