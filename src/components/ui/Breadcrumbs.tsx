'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbsProps {
  /**
   * Explicit crumbs, in order. The last item is always rendered as plain text
   * (current page), regardless of whether it has an href. When omitted, crumbs
   * are derived from the current pathname.
   */
  items?: BreadcrumbItem[];
  className?: string;
}

/** Format a URL segment into a human label: "brecon-beacons" -> "Brecon Beacons". */
function labelFromSegment(segment: string): string {
  return segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const pathname = usePathname();
  const domain = process.env.NEXT_PUBLIC_SITE_DOMAIN || 'adventurewales.com';
  const baseUrl = `https://${domain}`;

  // Derive crumbs from the pathname when explicit items are not provided.
  const derived: BreadcrumbItem[] =
    items ??
    pathname
      .split('/')
      .filter(Boolean)
      .map((segment, index, all) => ({
        name: labelFromSegment(segment),
        href: `/${all.slice(0, index + 1).join('/')}`,
      }));

  // Nothing to show on the homepage / with no crumbs.
  if (derived.length === 0) return null;

  const crumbs = derived.map((item, index) => ({
    ...item,
    isLast: index === derived.length - 1,
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      ...crumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: crumb.name,
        ...(crumb.href ? { item: `${baseUrl}${crumb.href}` } : {}),
      })),
    ],
  };

  return (
    <nav aria-label="Breadcrumb" className={className ?? 'mb-4'}>
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ol className="flex items-center space-x-1 text-sm text-slate-500 sm:space-x-2">
        <li>
          <Link
            href="/"
            className="flex items-center transition-colors hover:text-primary"
            title="Home"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {crumbs.map((crumb, index) => (
          <li key={crumb.href ?? `${crumb.name}-${index}`} className="flex min-w-0 items-center">
            <ChevronRight className="mx-1 h-4 w-4 flex-shrink-0 text-slate-400" />
            {crumb.isLast || !crumb.href ? (
              <span
                className="max-w-[150px] truncate font-medium text-primary sm:max-w-none"
                aria-current={crumb.isLast ? 'page' : undefined}
                title={crumb.name}
              >
                {crumb.name}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="max-w-[100px] truncate transition-colors hover:text-accent-strong sm:max-w-none"
                title={crumb.name}
              >
                {crumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
