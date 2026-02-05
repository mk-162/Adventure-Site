"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  Tent,
  Calendar,
  Users,
  MessageCircle,
  Megaphone,
  CheckSquare,
  Building2,
  Menu,
  X,
  Compass,
  Home,
  Handshake,
  BookOpen,
  CreditCard,
} from "lucide-react";
import clsx from "clsx";

const contentNav = [
  { name: "Regions", href: "/admin/content/regions", icon: Map },
  { name: "Activities", href: "/admin/content/activities", icon: Compass },
  { name: "Operators", href: "/admin/content/operators", icon: Users },
  { name: "Accommodation", href: "/admin/content/accommodation", icon: Tent },
  { name: "Events", href: "/admin/content/events", icon: Calendar },
  { name: "Answers", href: "/admin/content/answers", icon: MessageCircle },
  { name: "Guide Pages", href: "/admin/content/guide-pages", icon: BookOpen },
];

const commercialNav = [
  { name: "Billing", href: "/admin/billing", icon: CreditCard },
  { name: "Claims", href: "/admin/commercial/claims", icon: CheckSquare },
  { name: "Accounts", href: "/admin/commercial/accounts", icon: Building2 },
  { name: "Partner Mapping", href: "/admin/commercial/partners", icon: Handshake },
  { name: "Advertisers", href: "/admin/commercial/advertisers", icon: Megaphone },
  { name: "Campaigns", href: "/admin/commercial/campaigns", icon: Megaphone },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-64 bg-primary transform transition-transform lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
          <span className="text-lg font-bold text-white">Adventure Admin</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-white/70 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {/* Dashboard */}
          <Link
            href="/admin"
            className={clsx(
              "flex items-center gap-3 px-3 py-2 rounded-lg mb-4 transition-colors",
              pathname === "/admin"
                ? "bg-accent-hover text-white"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            )}
            onClick={() => setSidebarOpen(false)}
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>

          {/* Content Section */}
          <div className="mb-4">
            <p className="px-3 text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
              Content
            </p>
            {contentNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors",
                  isActive(item.href)
                    ? "bg-accent-hover text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </div>

          {/* Commercial Section */}
          <div className="mb-4">
            <p className="px-3 text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
              Commercial
            </p>
            {commercialNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors",
                  isActive(item.href)
                    ? "bg-accent-hover text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Home className="h-5 w-5" />
            View Site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex-1" />

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-white bg-primary hover:bg-[#2a4f66] px-3 py-1.5 rounded-lg transition-colors font-medium"
          >
            Go to site <span aria-hidden="true">→</span>
          </a>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
