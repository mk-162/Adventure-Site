'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumbs() {
  const pathname = usePathname();
  const domain = process.env.NEXT_PUBLIC_SITE_DOMAIN || 'adventurewales.com';
  const baseUrl = `https://${domain}`;

  // Don't render breadcrumbs on the homepage
  if (pathname === '/') return null;

  const paths = pathname.split('/').filter(Boolean);

  const breadcrumbs = paths.map((path, index) => {
    const href = `/${paths.slice(0, index + 1).join('/')}`;
    // Format label: replace hyphens with spaces and capitalize words
    const label = path.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      label,
      href,
      isLast: index === paths.length - 1,
    };
  });

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
      ...breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: crumb.label,
        item: `${baseUrl}${crumb.href}`,
      })),
    ],
  };

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <ol className="flex items-center space-x-1 sm:space-x-2 text-sm text-slate-600">
        <li>
          <Link 
            href="/" 
            className="flex items-center hover:text-[#1e3a4c] transition-colors"
            title="Home"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        
        {breadcrumbs.map((crumb) => (
          <li key={crumb.href} className="flex items-center min-w-0">
            <ChevronRight className="h-4 w-4 text-slate-400 mx-1 flex-shrink-0" />
            {crumb.isLast ? (
              <span 
                className="font-medium text-[#1e3a4c] truncate max-w-[150px] sm:max-w-none" 
                aria-current="page"
                title={crumb.label}
              >
                {crumb.label}
              </span>
            ) : (
              <Link 
                href={crumb.href}
                className="hover:text-[#f97316] transition-colors truncate max-w-[100px] sm:max-w-none"
                title={crumb.label}
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
