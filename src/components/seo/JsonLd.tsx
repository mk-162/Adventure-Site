interface JsonLdProps {
  data: Record<string, any>;
}

/**
 * JsonLd component for adding structured data to pages
 * Renders schema.org JSON-LD markup in a script tag
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 2),
      }}
    />
  );
}

/**
 * Helper function to create WebSite schema
 */
export function createWebSiteSchema(siteUrl: string = "https://adventurewales.co.uk") {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Adventure Wales",
    "url": siteUrl,
    "description": "Discover the wildest corners of Wales, from Snowdonia's misty peaks to Pembrokeshire's rugged coast. Plan unforgettable outdoor experiences across Wales.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
}

/**
 * Helper function to create Organization schema
 */
export function createOrganizationSchema(siteUrl: string = "https://adventurewales.co.uk") {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Adventure Wales",
    "url": siteUrl,
    "logo": `${siteUrl}/images/logo.png`,
    "description": "Wales' leading adventure and outdoor activity platform, connecting travelers with authentic Welsh experiences.",
    "sameAs": [
      "https://www.facebook.com/adventurewales",
      "https://www.instagram.com/adventurewales",
      "https://twitter.com/adventurewales"
    ]
  };
}

/**
 * Helper function to create TouristAttraction schema for activities
 */
export function createTouristAttractionSchema(activity: {
  name: string;
  description: string | null;
  slug: string;
  priceFrom?: string | null;
  priceTo?: string | null;
  duration?: string | null;
  difficulty?: string | null;
  lat?: string | null;
  lng?: string | null;
}, options: {
  region?: { name: string } | null;
  operator?: { name: string; website?: string | null } | null;
  imageUrl?: string;
  siteUrl?: string;
} = {}) {
  const { region, operator, imageUrl, siteUrl = "https://adventurewales.co.uk" } = options;
  
  const schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": activity.name,
    "description": activity.description || `Experience ${activity.name} in ${region?.name || 'Wales'}`,
    "url": `${siteUrl}/activities/${activity.slug}`,
  };

  if (imageUrl) {
    schema.image = imageUrl;
  }

  if (activity.lat && activity.lng) {
    schema.geo = {
      "@type": "GeoCoordinates",
      "latitude": parseFloat(activity.lat),
      "longitude": parseFloat(activity.lng)
    };
  }

  if (region) {
    schema.address = {
      "@type": "PostalAddress",
      "addressRegion": region.name,
      "addressCountry": "GB"
    };
  }

  if (activity.priceFrom || activity.priceTo) {
    schema.offers = {
      "@type": "Offer",
      "priceCurrency": "GBP",
      "price": activity.priceFrom || activity.priceTo,
      "availability": "https://schema.org/InStock"
    };

    if (activity.priceFrom && activity.priceTo) {
      schema.offers.priceSpecification = {
        "@type": "PriceSpecification",
        "minPrice": parseFloat(activity.priceFrom),
        "maxPrice": parseFloat(activity.priceTo),
        "priceCurrency": "GBP"
      };
    }
  }

  if (operator) {
    schema.provider = {
      "@type": "Organization",
      "name": operator.name,
    };
    if (operator.website) {
      schema.provider.url = operator.website;
    }
  }

  return schema;
}

/**
 * Helper function to create LodgingBusiness schema for accommodation
 */
export function createLodgingBusinessSchema(accommodation: {
  name: string;
  description: string | null;
  slug: string;
  type?: string | null;
  priceFrom?: string | null;
  priceTo?: string | null;
  address?: string | null;
  lat?: string | null;
  lng?: string | null;
  googleRating?: string | null;
}, options: {
  region?: { name: string } | null;
  imageUrl?: string;
  siteUrl?: string;
} = {}) {
  const { region, imageUrl, siteUrl = "https://adventurewales.co.uk" } = options;
  
  const schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "name": accommodation.name,
    "description": accommodation.description || `${accommodation.name} offers comfortable accommodation in ${region?.name || 'Wales'}`,
    "url": `${siteUrl}/accommodation/${accommodation.slug}`,
  };

  if (imageUrl) {
    schema.image = imageUrl;
  }

  if (accommodation.address || region) {
    schema.address = {
      "@type": "PostalAddress",
      "streetAddress": accommodation.address || "",
      "addressRegion": region?.name || "Wales",
      "addressCountry": "GB"
    };
  }

  if (accommodation.lat && accommodation.lng) {
    schema.geo = {
      "@type": "GeoCoordinates",
      "latitude": parseFloat(accommodation.lat),
      "longitude": parseFloat(accommodation.lng)
    };
  }

  if (accommodation.priceFrom) {
    schema.priceRange = `£${accommodation.priceFrom}${accommodation.priceTo ? `-£${accommodation.priceTo}` : '+'}`;
  }

  if (accommodation.googleRating) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": parseFloat(accommodation.googleRating),
      "bestRating": "5"
    };
  }

  return schema;
}

/**
 * Helper function to create TouristDestination schema for regions
 */
export function createTouristDestinationSchema(region: {
  name: string;
  description: string | null;
  slug: string;
  lat?: string | null;
  lng?: string | null;
}, options: {
  stats?: {
    activities: number;
    accommodation: number;
    events: number;
  };
  imageUrl?: string;
  siteUrl?: string;
} = {}) {
  const { stats, imageUrl, siteUrl = "https://adventurewales.co.uk" } = options;
  
  const schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "name": region.name,
    "description": region.description || `Discover the adventures waiting for you in ${region.name}`,
    "url": `${siteUrl}/${region.slug}`,
  };

  if (imageUrl) {
    schema.image = imageUrl;
  }

  if (region.lat && region.lng) {
    schema.geo = {
      "@type": "GeoCoordinates",
      "latitude": parseFloat(region.lat),
      "longitude": parseFloat(region.lng)
    };
  }

  schema.address = {
    "@type": "PostalAddress",
    "addressRegion": region.name,
    "addressCountry": "GB"
  };

  if (stats && stats.activities > 0) {
    schema.touristType = "Adventure seekers, outdoor enthusiasts, nature lovers";
  }

  return schema;
}

/**
 * Helper function to create FAQPage schema
 */
export function createFAQPageSchema(question: string, answer: string, options: {
  siteUrl?: string;
  slug?: string;
} = {}) {
  const { siteUrl = "https://adventurewales.co.uk", slug } = options;
  
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": answer
      }
    }],
    ...(slug && { "url": `${siteUrl}/answers/${slug}` })
  };
}

/**
 * Helper function to create BreadcrumbList schema
 */
export function createBreadcrumbSchema(items: Array<{ name: string; url: string }>, siteUrl: string = "https://adventurewales.co.uk") {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`
    }))
  };
}
