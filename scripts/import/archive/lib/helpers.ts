// Simple slugify — no external deps
function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Wales site ID — all imports use this to stay multi-tenant-safe */
export const SITE_ID = 1;

/** Wales lat/lng bounds for coordinate validation */
export const WALES_BOUNDS = {
  latMin: 51.3,
  latMax: 53.4,
  lngMin: -5.3,
  lngMax: -2.6,
};

export function inWales(lat: number, lng: number): boolean {
  return (
    lat >= WALES_BOUNDS.latMin &&
    lat <= WALES_BOUNDS.latMax &&
    lng >= WALES_BOUNDS.lngMin &&
    lng <= WALES_BOUNDS.lngMax
  );
}

export function makeSlug(name: string, existing?: string[]): string {
  const seen = existing ?? [];
  let s = slugify(name);
  if (!seen.includes(s)) return s;
  let i = 2;
  while (seen.includes(`${s}-${i}`)) i++;
  return `${s}-${i}`;
}

export function parseBool(val: string | undefined | null): boolean | null {
  if (!val) return null;
  const lower = val.toLowerCase().trim();
  if (['true', 'yes', '1', '✔', '✓'].includes(lower)) return true;
  if (['false', 'no', '0', '✗', ''].includes(lower)) return false;
  return null;
}

export function parseNum(val: string | undefined | null): number | null {
  if (!val || val.trim() === '' || val.trim() === 'N/A' || val.trim() === '—') return null;
  const num = parseFloat(val.replace(/[^0-9.\-]/g, ''));
  return isNaN(num) ? null : num;
}

export function parseRating(val: string | undefined | null): number | null {
  if (!val) return null;
  const m = val.match(/(\d+\.?\d*)/);
  if (!m) return null;
  const n = parseFloat(m[1]);
  if (n < 0 || n > 5) return null;
  return n;
}
