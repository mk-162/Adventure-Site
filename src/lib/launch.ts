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
export const LAUNCH_REGIONS: ReadonlySet<string> = new Set(["snowdonia"]);

/** Verified combo (things-to-do) pages per region: `${region}/${activityType}`. */
export const LAUNCH_COMBOS: ReadonlySet<string> = new Set([
  "snowdonia/hiking",
  "snowdonia/kayaking",
  "snowdonia/gorge-walking",
  "snowdonia/caving",
  "snowdonia/mountain-biking",
]);

/** Verified best-of list pages: `${region}/${bestSlug}`. None verified yet. */
export const LAUNCH_BEST_LISTS: ReadonlySet<string> = new Set([]);

export function isLaunchRegion(regionSlug: string): boolean {
  return LAUNCH_REGIONS.has(regionSlug);
}

export function isLaunchBestList(regionSlug: string, bestSlug: string): boolean {
  return LAUNCH_BEST_LISTS.has(`${regionSlug}/${bestSlug}`);
}

export function isLaunchCombo(regionSlug: string, activityTypeSlug: string): boolean {
  return LAUNCH_COMBOS.has(`${regionSlug}/${activityTypeSlug}`);
}
