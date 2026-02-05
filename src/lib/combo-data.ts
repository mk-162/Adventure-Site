import fs from "fs";
import path from "path";

export interface ComboSpot {
  name: string;
  slug: string;
  description: string;
  difficulty: string;
  duration: string;
  distance?: string;
  elevationGain?: string;
  bestFor: string;
  notSuitableFor?: string;
  bestSeason: string;
  parking?: string;
  startPoint?: { name: string; lat: number; lng: number };
  estimatedCost?: string;
  operatorSlug?: string;
  insiderTip?: string;
}

export interface ComboFAQ {
  question: string;
  answer: string;
}

export interface ComboEvent {
  name: string;
  type: string;
  monthTypical: string;
  description: string;
  website?: string;
  relevantActivities?: string[];
  registrationCost?: number;
}

export interface ComboGearShop {
  name: string;
  slug: string;
  address: string;
  lat?: number;
  lng?: number;
  description: string;
  website?: string;
  phone?: string;
  services?: string[];
}

export interface ComboPageData {
  regionSlug: string;
  activityTypeSlug: string;
  title: string;
  strapline: string;
  metaTitle: string;
  metaDescription: string;
  heroAlt: string;
  introduction: string;
  bestSeason: string;
  difficultyRange: string;
  priceRange: string;
  spots: ComboSpot[];
  practicalInfo?: {
    weather?: string;
    weatherLinks?: { name: string; url: string }[];
    gearChecklist?: string[];
    safetyNotes?: string[];
    transportNotes?: string;
    parkingNotes?: string;
  };
  faqs?: ComboFAQ[];
  localDirectory?: {
    gearShops?: ComboGearShop[];
    cafes?: ComboGearShop[];
    accommodation?: ComboGearShop[];
  };
  events?: ComboEvent[];
  keywords?: string[];
  nearbyAlternatives?: {
    sameActivity?: { regionSlug: string; label: string }[];
    sameRegion?: { activityTypeSlug: string; label: string }[];
  };
  // New enriched content fields (all optional for backward compatibility)
  localTakes?: Array<{
    name: string;
    role: string;
    business: string;
    photo: string;
    quote: string;
    operatorSlug?: string;
    isPlaceholder?: boolean;
  }>;
  featuredExpert?: {
    name: string;
    credentials: string;
    photo: string;
    perspective: string; // markdown
    operatorSlug?: string;
    isPlaceholder?: boolean;
  };
  topTips?: string[];
  honestTruth?: {
    great: string[];
    notGreat: string[];
  };
  editorial?: string; // long-form markdown (can replace/supplement introduction)
  whereToEat?: Array<{
    name: string;
    description: string;
    location: string;
    bestFor: string;
  }>;
  whereToStay?: Array<{
    name: string;
    description: string;
    location: string;
    priceRange: string;
    bestFor: string;
  }>;
  imageCredits?: Array<{
    image: string;
    photographer: string;
    source: string;
    sourceUrl?: string;
    licence: string;
  }>;
}

/**
 * Load combo page data from JSON files.
 * Returns null if no combo data exists for this region+activity combo.
 */
export function getComboPageData(
  regionSlug: string,
  activityTypeSlug: string
): ComboPageData | null {
  const filePath = path.join(
    process.cwd(),
    "data",
    "combo-pages",
    `${regionSlug}--${activityTypeSlug}.json`
  );

  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as ComboPageData;
  } catch {
    return null;
  }
}

/**
 * List all available combo page slugs for static generation.
 */
export function getAllComboSlugs(): { region: string; activityType: string }[] {
  const dir = path.join(process.cwd(), "data", "combo-pages");
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const [region, activityType] = f.replace(".json", "").split("--");
      return { region, activityType };
    });
}
