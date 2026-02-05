import { redirect } from "next/navigation";
import { getOperatorSession } from "@/lib/auth";
import { db } from "@/db";
import { operators } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { headers } from "next/headers";
import { NavLink } from "./nav-link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getOperatorSession();
  if (!session) {
    redirect("/auth/login");
  }

  const operator = await db.query.operators.findFirst({
    where: eq(operators.id, session.operatorId),
  });

  if (!operator) {
    redirect("/auth/login"); // Or error page
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white flex-shrink-0 hidden md:block">
        <div className="p-6">
          <Link href="/dashboard" className="text-xl font-bold text-white no-underline">
            Adventure Wales
          </Link>
          <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Operator Portal</div>
        </div>
        <nav className="px-4 py-4 space-y-1">
          <NavLink href="/dashboard">Overview</NavLink>
          <NavLink href="/dashboard/listing">My Listing</NavLink>
          <NavLink href="/dashboard/activities">Activities</NavLink>
          <NavLink href="/dashboard/enquiries">Enquiries</NavLink>
          <NavLink href="/dashboard/billing">Billing</NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-4">
             {/* Mobile menu button could go here */}
             <h1 className="font-semibold text-slate-800 truncate max-w-xs">{operator.name}</h1>
             <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase border ${
                 operator.billingTier === 'premium' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                 operator.billingTier === 'verified' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                 'bg-slate-100 text-slate-600 border-slate-200'
             }`}>
                 {operator.billingTier}
             </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 hidden sm:inline">{session.email}</span>
            <form action="/api/auth/logout" method="POST">
                <button type="submit" className="text-sm text-slate-600 hover:text-orange-600 font-medium">
                    Sign Out
                </button>
            </form>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
            {children}
        </main>
      </div>
    </div>
  );
}

// Helper for active link styles (simple version, checking path start)
// Need client component for usePathname or just simple server check?
// NavLink usually needs 'use client' to check active state.
// I'll make a small client component for NavLink.
