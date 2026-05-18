"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ShieldCheck } from "lucide-react";

type ClaimableOperator = {
  slug: string;
  name: string;
  type: string | null;
  claimStatus: string;
};

export function ClaimSearch({ operators }: { operators: ClaimableOperator[] }) {
  const [query, setQuery] = useState("");

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [] as ClaimableOperator[];
    return operators
      .filter((op) => op.name.toLowerCase().includes(q))
      .slice(0, 12);
  }, [query, operators]);

  const showResults = query.trim().length > 0;

  return (
    <div>
      <label htmlFor="claim-search" className="sr-only">
        Search for your business
      </label>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          id="claim-search"
          type="search"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type your business name (e.g. Plas y Brenin)…"
          className="w-full pl-12 pr-4 py-3 text-base border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-hover focus:border-transparent"
        />
      </div>

      {showResults && (
        <div className="mt-4 border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-96 overflow-y-auto">
          {matches.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500">
              No matches. If your business isn&apos;t in our directory yet,
              use the{" "}
              <Link
                href="/advertise"
                className="text-accent-hover font-semibold underline"
              >
                Get Listed
              </Link>{" "}
              form below.
            </div>
          ) : (
            matches.map((op) => (
              <Link
                key={op.slug}
                href={`/claim/${op.slug}`}
                className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900 truncate">
                    {op.name}
                  </div>
                  {op.type && (
                    <div className="text-xs text-slate-500 capitalize">
                      {op.type}
                    </div>
                  )}
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent-hover whitespace-nowrap">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Claim
                </span>
              </Link>
            ))
          )}
        </div>
      )}

      <p className="text-xs text-slate-500 mt-3">
        {operators.length} unclaimed businesses currently in our Wales
        directory.
      </p>
    </div>
  );
}
