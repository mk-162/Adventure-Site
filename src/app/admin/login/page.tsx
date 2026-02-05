"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(email ? { email, password } : { password }),
      });

      if (res.ok) {
        router.push(from);
        router.refresh();
      } else {
        setError("Invalid credentials");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent outline-none"
          placeholder="admin@adventurewales.co.uk"
          autoComplete="email"
          autoFocus
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-hover focus:border-transparent outline-none"
          placeholder="Enter password"
          required
          autoComplete="current-password"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-[#2a4f66] transition-colors disabled:opacity-50 font-medium"
      >
        {loading ? "Signing in…" : "Sign In"}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Leave email blank for shared admin access
      </p>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-primary text-center mb-2">
            Adventure Admin
          </h1>
          <p className="text-gray-500 text-center text-sm mb-6">
            Sign in to manage your site
          </p>
          <Suspense fallback={<div className="h-32" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
