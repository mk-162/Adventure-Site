/**
 * Launch scope gate.
 *
 * The database has all of Wales published (12 regions, 174 activities, 40 combo
 * pages), but only the Snowdonia slice has been QA-verified. To launch honestly
 * we hard-gate what is reachable + indexable to the verified set. Everything
 * outside the allowlist returns notFound() and is dropped from the sitemap.
 *
 * This is deliberately a code-level allowlist (not a data migration) so widening
 * the launch is a one-line change here once more content is verified — flip a
 * region on, or add its verified combos, and redeploy.
 */

/** Regions whose landing pages are live + indexable. */
export const LAUNCH_REGIONS: ReadonlySet<string> = new Set([
  "snowdonia",
  "pembrokeshire",
  "brecon-beacons",
  "gower",
  "anglesey",
  "llyn-peninsula",
  "south-wales",
  "mid-wales",
]);

/** Verified combo (things-to-do) pages per region: `${region}/${activityType}`. */
export const LAUNCH_COMBOS: ReadonlySet<string> = new Set([
  // Snowdonia
  "snowdonia/hiking",
  "snowdonia/kayaking",
  "snowdonia/gorge-walking",
  "snowdonia/caving",
  "snowdonia/mountain-biking",
  // Pembrokeshire
  "pembrokeshire/hiking",
  "pembrokeshire/surfing",
  "pembrokeshire/wild-swimming",
  // Brecon Beacons
  "brecon-beacons/caving",
  "brecon-beacons/gorge-walking",
  "brecon-beacons/hiking",
  "brecon-beacons/mountain-biking",
  "brecon-beacons/wild-swimming",
  // Gower
  "gower/hiking",
  "gower/surfing",
  "gower/wild-swimming",
  // Anglesey
  "anglesey/coasteering",
  "anglesey/kayaking",
  "anglesey/wild-swimming",
  // Llŷn Peninsula
  "llyn-peninsula/surfing",
  // South Wales
  "south-wales/mountain-biking",
  "south-wales/surfing",
  // Mid Wales
  "mid-wales/hiking",
  "mid-wales/mountain-biking",
]);

/** Verified best-of list pages: `${region}/${bestSlug}`. None verified yet. */
export const LAUNCH_BEST_LISTS: ReadonlySet<string> = new Set([]);

export function isLaunchRegion(regionSlug: string): boolean {
  return LAUNCH_REGIONS.has(regionSlug);
}

/**
 * Returns the region slug if it has a live, launched landing page — otherwise null.
 * Content frontmatter uses values like "general", "north-wales", "wye-valley",
 * "carmarthenshire" that either aren't regions at all or aren't in the launch
 * scope; callers should render plain text (or nothing) instead of a link.
 */
export function linkableRegionSlug(regionSlug: string | null | undefined): string | null {
  if (!regionSlug || regionSlug === "general" || !LAUNCH_REGIONS.has(regionSlug)) {
    return null;
  }
  return regionSlug;
}

export function isLaunchBestList(regionSlug: string, bestSlug: string): boolean {
  return LAUNCH_BEST_LISTS.has(`${regionSlug}/${bestSlug}`);
}

export function isLaunchCombo(regionSlug: string, activityTypeSlug: string): boolean {
  return LAUNCH_COMBOS.has(`${regionSlug}/${activityTypeSlug}`);
}
