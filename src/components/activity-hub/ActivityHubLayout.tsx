import { ReactNode } from "react";

interface ActivityHubLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  hero?: ReactNode;
  breadcrumbs?: ReactNode;
}

export function ActivityHubLayout({
  children,
  sidebar,
  hero,
  breadcrumbs,
}: ActivityHubLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero - Full Width */}
      {hero && <div className="w-full">{hero}</div>}

      {/* Main Content Area - 2 Column */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        {breadcrumbs && <div className="mb-6">{breadcrumbs}</div>}

        {/* 2-Column Layout */}
        <div className="flex gap-8 lg:gap-12">
          {/* Main Content - Left */}
          <main className="flex-1 min-w-0 space-y-12">
            {children}
          </main>

          {/* Sidebar - Right */}
          {sidebar}
        </div>
      </div>
    </div>
  );
}
