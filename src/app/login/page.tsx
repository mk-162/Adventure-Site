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
  "invalid-state": "Login session expired. Please try again.",
  "no-code": "Google login was cancelled.",
  "token-exchange": "Google login failed. Please try again.",
  "user-info": "Couldn't get your Google account info. Try again.",
  "no-email": "No email found on your Google account.",
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
            <button onClick={() => setSubmitted(false)} className="text-[#ea580c] hover:underline font-medium">
              try again
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1e3a4c]/5 to-white px-4 py-12">
      <div className="max-w-4xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Left Column: Benefits */}
          <div className="bg-gradient-to-br from-[#1e3a4c] to-[#2d5a73] p-8 md:p-10 flex flex-col justify-center">
            <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-6">
              <Mountain className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Your Welsh Adventure Starts Here</h2>
            <p className="text-white/70 mb-8">Create a free account and unlock the best of Adventure Wales.</p>
            <ul className="space-y-4">
              {[
                { icon: "❤️", text: "Save your favourite activities" },
                { icon: "🗺️", text: "Create custom itineraries" },
                { icon: "✨", text: "Get personalised recommendations" },
                { icon: "👥", text: "Share trips with friends" },
              ].map((benefit) => (
                <li key={benefit.text} className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-lg">
                    {benefit.icon}
                  </span>
                  <span className="text-white/90 font-medium">{benefit.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Form */}
          <div className="p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
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

          {/* Google Sign In */}
          <a
            href="/api/user/google"
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-700"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </a>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-400">or use email</span>
            </div>
          </div>

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
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ea580c] focus:border-transparent text-slate-900"
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
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ea580c] focus:border-transparent text-slate-900"
                  />
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newsletter}
                    onChange={(e) => setNewsletter(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#ea580c] border-slate-300 rounded focus:ring-[#ea580c]"
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
              className="w-full bg-[#ea580c] hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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
                <button onClick={() => setIsNewUser(false)} className="text-[#ea580c] font-medium hover:underline">
                  Sign in
                </button>
              </>
            ) : (
              <>
                New here?{" "}
                <button onClick={() => setIsNewUser(true)} className="text-[#ea580c] font-medium hover:underline">
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
    </div>
  );
}
