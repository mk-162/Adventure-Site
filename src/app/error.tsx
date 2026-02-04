"use client";

import { Mountain, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mountain className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-[#1e3a4c] mb-2">Something went wrong</h1>
        <p className="text-slate-500 mb-8">
          We hit a snag loading this page. Try again or head back to the homepage.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#f97316] hover:bg-orange-600 text-white font-bold rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-100 transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
