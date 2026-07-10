import fs from "fs";
import path from "path";
import { validateComboData } from "./combo-schema";

export interface ComboSpot {
  name: string;
  slug: string;
  description: string;
  difficulty: string;
  duration: string;
  distance?: string | null;
  elevationGain?: string | null;
  bestFor: string;
  notSuitableFor?: string;
  bestSeason: string;
  parking?: string;
  startPoint?: { name: string; lat: number; lng: number };
  estimatedCost?: string;
  operatorSlug?: string | null;
  insiderTip?: string;

  // --- Forward-compat "how to do it" fields (all optional) ---
  // None of the current JSON files populate these yet; authors will add them
  // over time and renderers can display them unconditionally once present.

  /** Step-by-step or narrative guidance on how to actually do the activity at this spot. */
  howToDoIt?: string;
  /** Access details: rights of way, permits, tides, landowner permission, etc. */
  access?: string;
  /** A more detailed route description (line, waypoints, terrain) than `description`. */
  routeDescription?: string;
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
  website?: string | null;
  relevantActivities?: string[];
  registrationCost?: number | null;
}

/**
 * A local business/place listing. Real data across `localDirectory.*` and
 * `practicalInfo.gearHire` uses several overlapping-but-distinct shapes; this
 * interface is a superset with everything optional beyond name/description.
 */
export interface ComboGearShop {
  name: string;
  slug?: string;
  address?: string;
  lat?: number;
  lng?: number;
  description?: string;
  website?: string | null;
  phone?: string;
  services?: string[];
  type?: string;
  priceRange?: string;
  googleRating?: number | null;
  reviewCount?: number | null;
  knownFor?: string;
  vibe?: string;
  nearestSpot?: string;
}

/** A single hire shop entry as found in `practicalInfo.gearHire` (real shape). */
export interface ComboGearHireEntry {
  name: string;
  location: string;
  url?: string | null;
}

/** A single drive-time entry as found in `practicalInfo.gettingThere.driveTimes`. */
export interface ComboDriveTime {
  from: string;
  duration: string;
  route: string;
}

/**
 * Raw shape of `gettingThere` as it actually appears in every launch JSON file
 * (an object, not the flat `transportNotes`/`parkingNotes` strings the old
 * interface assumed).
 */
export interface ComboGettingThereRaw {
  driveTimes?: ComboDriveTime[];
  publicTransport?: string;
  parkingTips?: string;
}

/**
 * Canonical, renderer-friendly shape for "getting there" info. Produced by
 * `normalizeComboData` / `normalizePracticalInfo` regardless of which raw
 * shape the source JSON used.
 */
export interface ComboGettingThere {
  /** Structured drive-time rows, e.g. for a table. Empty array if none. */
  driveTimes: ComboDriveTime[];
  /** Public transport guidance, if any. */
  publicTransport?: string;
  /** Parking tips/guidance, if any. */
  parkingTips?: string;
  /** @deprecated Back-compat alias for `publicTransport`. */
  transportNotes?: string;
  /** @deprecated Back-compat alias for `parkingTips`. */
  parkingNotes?: string;
}

/**
 * Keyword data as it actually appears in every launch JSON file: a
 * categorised object, not a flat string array.
 */
export interface ComboKeywords {
  primary?: string;
  secondary?: string[];
  longTail?: string[];
  localIntent?: string[];
  commercialIntent?: string[];
}

/**
 * Raw `practicalInfo` shape as found on disk. Field names/types vary between
 * files (confirmed via a full survey of data/combo-pages/*.json):
 *  - `safety` (string, all 36 legacy files) vs `safetyNotes` (string[], 4 newer files)
 *  - `gearHire` (array of {name,location,url}) is DISTINCT from `gearChecklist` (string[])
 *  - `gettingThere` is an object `{driveTimes, publicTransport, parkingTips}`,
 *    not the flat `transportNotes`/`parkingNotes` strings
 * `normalizePracticalInfo` reconciles all of this into one canonical shape.
 */
export interface ComboPracticalInfoRaw {
  weather?: string;
  weatherLinks?: { name: string; url: string }[];
  gearChecklist?: string[];
  gearHire?: ComboGearHireEntry[];
  /** Legacy free-text safety blurb (older files). */
  safety?: string;
  /** Newer files already split into bullets. */
  safetyNotes?: string[];
  /** Legacy flat fields (not observed in current data, kept for back-compat). */
  transportNotes?: string;
  parkingNotes?: string;
  /** Real shape used by every current file. */
  gettingThere?: ComboGettingThereRaw | string;
}

/**
 * Canonical `practicalInfo` shape. This is what `normalizeComboData` returns
 * and what renderers should consume unconditionally — no need to check for
 * missing variants.
 */
export interface ComboPracticalInfo {
  weather?: string;
  weatherLinks?: { name: string; url: string }[];
  /** General gear checklist (packing list style). */
  gearChecklist: string[];
  /** Gear hire shops relevant to this combo (distinct from gearChecklist). */
  gearHire: ComboGearHireEntry[];
  /** Always a bullet-point array, regardless of whether source was a string or array. */
  safetyNotes: string[];
  /** Structured + back-compat-flattened "getting there" info. */
  gettingThere: ComboGettingThere;
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
  /**
   * Raw practicalInfo as read from disk (may use any of the drifted shapes
   * documented on `ComboPracticalInfoRaw`). Prefer the normalized
   * `practicalInfoNormalized` field below for rendering.
   */
  practicalInfo?: ComboPracticalInfoRaw;
  /**
   * Canonical practicalInfo produced by `normalizePracticalInfo`. Always
   * present with well-typed arrays/objects — safe to render without
   * conditionals for missing variants. Populated by `getComboPageData`.
   */
  practicalInfoNormalized?: ComboPracticalInfo;
  faqs?: ComboFAQ[];
  localDirectory?: {
    gearShops?: ComboGearShop[];
    /** @deprecated Real data uses `postActivitySpots`; kept for back-compat. */
    cafes?: ComboGearShop[];
    /** Real field name used by current JSON for food/drink-after listings. */
    postActivitySpots?: ComboGearShop[];
    accommodation?: ComboGearShop[];
  };
  events?: ComboEvent[];
  /**
   * Raw keywords as read from disk — an object (`{primary, secondary,
   * longTail, localIntent, commercialIntent}`), NOT a flat string array.
   */
  keywords?: ComboKeywords;
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
  tieredTips?: {
    firstTimer: string[];
    regular: string[];
  };
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
  /** Businesses discovered during research but not yet verified/onboarded. */
  discoveredBusinesses?: Array<{
    name: string;
    type: string;
    category?: string | null;
    description: string;
    address?: string | null;
    postcode?: string | null;
    lat: number;
    lng: number;
    phone?: string | null;
    website?: string | null;
    googleRating?: number | null;
    reviewCount?: number | null;
    priceRange?: string | null;
    services?: string[];
    relevantActivities?: string[];
    priority?: string;
    notes?: string;
    inDatabase?: boolean;
  }>;
  /** Verified operators relevant to this combo (newer field name). */
  operators?: Array<{
    slug: string;
    name: string;
    description: string;
    activities: string[];
    priceRange: string;
    rating?: number | null;
  }>;
  /** @deprecated Older field name for the same data as `operators`. */
  existingOperators?: ComboPageData["operators"];
}

/**
 * Split a free-text safety blurb into bullet-style sentences.
 * Splits on newlines first; if that yields a single block, falls back to
 * splitting on sentence boundaries (". ").
 */
function splitIntoNotes(text: string): string[] {
  const byLine = text
    .split(/\r?\n+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (byLine.length > 1) return byLine;

  return text
    .split(/(?<=[.!?])\s+(?=[A-Z])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Normalize `practicalInfo` (in any of its drifted raw shapes) into the
 * canonical `ComboPracticalInfo` shape a renderer can consume unconditionally.
 */
export function normalizePracticalInfo(
  raw: ComboPracticalInfoRaw | undefined
): ComboPracticalInfo {
  const gearChecklist = raw?.gearChecklist ?? [];
  const gearHire = raw?.gearHire ?? [];

  let safetyNotes: string[];
  if (raw?.safetyNotes && raw.safetyNotes.length > 0) {
    safetyNotes = raw.safetyNotes;
  } else if (typeof raw?.safety === "string" && raw.safety.trim()) {
    safetyNotes = splitIntoNotes(raw.safety);
  } else {
    safetyNotes = [];
  }

  const rawGettingThere = raw?.gettingThere;
  let gettingThere: ComboGettingThere;
  if (rawGettingThere && typeof rawGettingThere === "object") {
    gettingThere = {
      driveTimes: rawGettingThere.driveTimes ?? [],
      publicTransport: rawGettingThere.publicTransport,
      parkingTips: rawGettingThere.parkingTips,
      transportNotes: rawGettingThere.publicTransport ?? raw?.transportNotes,
      parkingNotes: rawGettingThere.parkingTips ?? raw?.parkingNotes,
    };
  } else if (typeof rawGettingThere === "string") {
    // Legacy/unexpected: a flat string. Preserve it via the back-compat aliases.
    gettingThere = {
      driveTimes: [],
      publicTransport: rawGettingThere,
      parkingTips: raw?.parkingNotes,
      transportNotes: rawGettingThere ?? raw?.transportNotes,
      parkingNotes: raw?.parkingNotes,
    };
  } else {
    gettingThere = {
      driveTimes: [],
      publicTransport: raw?.transportNotes,
      parkingTips: raw?.parkingNotes,
      transportNotes: raw?.transportNotes,
      parkingNotes: raw?.parkingNotes,
    };
  }

  return {
    weather: raw?.weather,
    weatherLinks: raw?.weatherLinks,
    gearChecklist,
    gearHire,
    safetyNotes,
    gettingThere,
  };
}

/**
 * Normalize a raw `ComboPageData` (as parsed straight from JSON, with all its
 * schema drift) into a canonical shape. Currently this only fills in
 * `practicalInfoNormalized` and reconciles a couple of renamed fields
 * (`localDirectory.postActivitySpots` -> also exposed as `cafes`,
 * `existingOperators` -> also exposed as `operators`); all original raw
 * fields are preserved untouched.
 */
export function normalizeComboData(raw: ComboPageData): ComboPageData {
  const localDirectory = raw.localDirectory
    ? {
        ...raw.localDirectory,
        cafes: raw.localDirectory.cafes ?? raw.localDirectory.postActivitySpots,
      }
    : raw.localDirectory;

  return {
    ...raw,
    practicalInfoNormalized: normalizePracticalInfo(raw.practicalInfo),
    localDirectory,
    operators: raw.operators ?? raw.existingOperators,
  };
}

/**
 * Load combo page data from JSON files.
 * Returns null if no combo data exists for this region+activity combo.
 * The returned data is normalized (see `normalizeComboData`) — use
 * `practicalInfoNormalized` for rendering practical info.
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
    const parsed = JSON.parse(raw) as ComboPageData;

    if (process.env.NODE_ENV !== "production") {
      validateComboData(parsed, `${regionSlug}--${activityTypeSlug}.json`);
    }

    return normalizeComboData(parsed);
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
