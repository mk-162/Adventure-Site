"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mountain, Mail, ArrowRight } from "lucide-react";

const errorMessages: Record<string, string> = {
  "missing-token": "Invalid sign-in link.",
  "invalid-token": "This link is invalid or has already been used.",
  "token-used": "This link has already been used. Request a new one below.",
  "token-expired": "This link has expired. Request a new one below.",
  "user-not-found": "Account not found. Sign up below.",
  "server-error": "Something went wrong. Please try again.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-slate-400">Loading...</div></div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [newsletter, setNewsletter] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(
    errorParam ? errorMessages[errorParam] || "Something went wrong." : null
  );
  const [isNewUser, setIsNewUser] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: isNewUser ? name : undefined,
          newsletterOptIn: isNewUser ? newsletter : undefined,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to send link");
      }

      setSubmitted(true);
    } catch {
      setError("Failed to send sign-in link. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1e3a4c]/5 to-white px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#1e3a4c] mb-2">Check your email</h2>
          <p className="text-slate-600 mb-6">
            We&apos;ve sent a sign-in link to <strong>{email}</strong>. Click it to access your adventures.
          </p>
          <p className="text-sm text-slate-400">Didn&apos;t get it? Check spam or{" "}
            <button onClick={() => setSubmitted(false)} className="text-[#f97316] hover:underline font-medium">
              try again
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1e3a4c]/5 to-white px-4">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#1e3a4c] rounded-xl flex items-center justify-center mx-auto mb-4">
              <Mountain className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#1e3a4c]">
              {isNewUser ? "Create Your Account" : "Welcome Back"}
            </h1>
            <p className="text-slate-500 mt-1">
              {isNewUser
                ? "Save adventures, get personalised picks"
                : "Sign in with your email — no password needed"}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent text-slate-900"
              />
            </div>

            {isNewUser && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                    Your name <span className="text-slate-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="What should we call you?"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent text-slate-900"
                  />
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newsletter}
                    onChange={(e) => setNewsletter(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#f97316] border-slate-300 rounded focus:ring-[#f97316]"
                  />
                  <span className="text-sm text-slate-600">
                    Send me the best Welsh adventures, events, and deals. No spam, unsubscribe anytime.
                  </span>
                </label>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#f97316] hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                "Sending link..."
              ) : (
                <>
                  {isNewUser ? "Create account" : "Send me a sign-in link"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            {isNewUser ? (
              <>
                Already have an account?{" "}
                <button onClick={() => setIsNewUser(false)} className="text-[#f97316] font-medium hover:underline">
                  Sign in
                </button>
              </>
            ) : (
              <>
                New here?{" "}
                <button onClick={() => setIsNewUser(true)} className="text-[#f97316] font-medium hover:underline">
                  Create an account
                </button>
              </>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-center">
            <Link href="/auth/login" className="text-xs text-slate-400 hover:text-slate-600">
              Are you an operator? Sign in here →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
