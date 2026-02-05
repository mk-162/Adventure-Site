import fs from "fs";
import path from "path";

export interface BestListEntry {
  rank: number;
  name: string;
  slug: string;
  verdict: string;
  image: string;
  imageAlt: string;
  whyItMadeTheList: string;
  difficulty: string;
  duration: string;
  distance: string;
  elevationGain: string;
  cost: string;
  bestFor: string;
  skipIf: string;
  insiderTip: string;
  season: string;
  parking?: {
    location: string;
    cost: string;
    notes: string;
    lat: number;
    lng: number;
  };
  startPoint?: {
    name: string;
    lat: number;
    lng: number;
  };
  operatorSlug?: string | null;
  guidedOption?: string | null;
  youtubeVideoId?: string | null;
  relatedActivitySlug?: string | null;
  comboPageAnchor?: string | null;
}

export interface BestListData {
  regionSlug: string;
  slug: string;
  urlPath: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  strapline: string;
  heroImage: string;
  heroAlt: string;
  updatedDate: string;
  introduction: string;
  rankingCriteria: string;
  comboPageLink: string;
  keywords: {
    primary: string;
    secondary: string[];
    longTail: string[];
  };
  entries: BestListEntry[];
  comparisonTable: boolean;
  seasonalPicks?: {
    spring?: { entries: number[]; note: string };
    summer?: { entries: number[]; note: string };
    autumn?: { entries: number[]; note: string };
    winter?: { entries: number[]; note: string };
  };
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  relatedLists?: Array<{
    slug: string;
    label: string;
  }>;
}

/**
 * Get best-of list data for a specific region + slug
 */
export function getBestListData(regionSlug: string, bestSlug: string): BestListData | null {
  const filePath = path.join(
    process.cwd(),
    "data",
    "best-lists",
    `${regionSlug}--${bestSlug}.json`
  );

  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content) as BestListData;
  } catch (error) {
    console.error(`Error reading best-list file ${filePath}:`, error);
    return null;
  }
}

/**
 * Get all best-of list slugs for static generation
 */
export function getAllBestListSlugs(): Array<{ region: string; bestSlug: string }> {
  const dir = path.join(process.cwd(), "data", "best-lists");

  if (!fs.existsSync(dir)) {
    return [];
  }

  try {
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => {
        const [region, ...slugParts] = f.replace(".json", "").split("--");
        return { region, bestSlug: slugParts.join("--") };
      });
  } catch (error) {
    console.error("Error reading best-lists directory:", error);
    return [];
  }
}

/**
 * Get all best-of lists for a specific region
 */
export function getBestListsForRegion(regionSlug: string): BestListData[] {
  const allSlugs = getAllBestListSlugs();
  const regionSlugs = allSlugs.filter((item) => item.region === regionSlug);

  return regionSlugs
    .map((item) => getBestListData(item.region, item.bestSlug))
    .filter((data): data is BestListData => data !== null);
}
