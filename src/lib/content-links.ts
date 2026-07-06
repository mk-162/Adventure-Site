import { isLaunchCombo, isLaunchRegion } from "./launch";

/**
 * Normalize internal hrefs found inside authored content (answers/guides
 * markdown, DB-imported journal posts). Content was written against older URL
 * schemes and an unlaunched all-Wales scope, so raw hrefs can point at retired
 * routes (/{region}/things-to-do/{x}, /activity/{x}), unlaunched regions, or
 * unlaunched combos. Returns the corrected href, or null when there is no
 * valid target — render plain text in that case, never a dead link.
 */

// All region slugs that ever appear in content — used to tell region links
// apart from other top-level routes. Launch state is checked separately.
const KNOWN_REGION_SLUGS = new Set([
  "snowdonia", "pembrokeshire", "brecon-beacons", "gower", "anglesey",
  "llyn-peninsula", "south-wales", "mid-wales",
  // retired / never-launched region slugs still referenced in old content
  "north-wales", "wye-valley", "carmarthenshire", "ceredigion", "cardiff",
  "cardiff-vale", "general", "all-wales", "eryri-snowdonia", "gower-peninsula",
  "anglesey-coast",
]);

/** Activity types with a dedicated top-level hub page (src/app/<slug>/page.tsx). */
const HUB_ROUTES = new Set([
  "bouldering", "canoeing", "caving", "climbing", "coasteering", "fishing",
  "gorge-walking", "hiking", "horse-riding", "kayaking", "kitesurfing",
  "mountain-biking", "paddleboarding", "paragliding", "rock-climbing",
  "sailing", "skydiving", "surfing", "wild-swimming", "windsurfing",
]);

export function normalizeContentHref(href: string): string | null {
  // Leave external links, anchors, mailto etc. untouched
  if (!href.startsWith("/")) return href;

  const [path, suffix = ""] = href.split(/(?=[?#])/, 2);
  const segments = path.split("/").filter(Boolean);
  const [seg1, seg2, seg3] = segments;
  if (!seg1) return href;

  // Legacy singular /activity/{slug} → hub page or activities index
  if (seg1 === "activity" && seg2) {
    return HUB_ROUTES.has(seg2) ? `/${seg2}${suffix}` : "/activities";
  }

  // Legacy /operators → public directory
  if (seg1 === "operators" && !seg2) {
    return "/directory";
  }

  if (KNOWN_REGION_SLUGS.has(seg1)) {
    if (!isLaunchRegion(seg1)) return null;

    // /{region}
    if (!seg2) return `/${seg1}${suffix}`;

    // Legacy /{region}/things-to-do[/{activity}]
    if (seg2 === "things-to-do") {
      if (seg3 && isLaunchCombo(seg1, seg3)) return `/${seg1}/${seg3}${suffix}`;
      return `/${seg1}`;
    }

    // /{region}/stay and /{region}/tips exist for launch regions
    if (seg2 === "stay" || seg2 === "tips") return `/${seg1}/${seg2}${suffix}`;

    // /{region}/{activity} combo
    if (isLaunchCombo(seg1, seg2)) return `/${seg1}/${seg2}${suffix}`;
    return `/${seg1}`;
  }

  return href;
}

/**
 * Drop-in replacement for the `[text](url)` replacement step of the
 * markdownToHtml helpers: rewrites the href and falls back to plain text
 * when the target doesn't exist in the launch scope.
 */
export function renderContentLink(text: string, url: string, className: string): string {
  const normalized = normalizeContentHref(url);
  if (normalized === null) return text;
  return `<a href="${normalized}" class="${className}">${text}</a>`;
}
