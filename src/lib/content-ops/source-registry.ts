/**
 * Source registry merge helper.
 *
 * Preserves manual review state (authority, last_checked_at, notes) when
 * URLs persist across audits. New URLs start unreviewed.
 */

export interface SourceRegistryEntry {
  content_item_id: string;
  channel: string;
  route_or_slug: string;
  source_url: string;
  authority: "unreviewed" | "discovered" | "partial" | "verified";
  last_checked_at: string;
  notes: string;
}

export interface IncomingSourceEntry {
  content_item_id: string;
  channel: string;
  route_or_slug: string;
  source_url: string;
  notes: string;
}

/**
 * Merges existing source registry with incoming audit data.
 *
 * Preserves authority/last_checked_at when URLs remain in use.
 * Marks new URLs as unreviewed with blank last_checked_at.
 * Removes URLs no longer in the incoming data.
 *
 * @param existing - Current source registry entries (may be empty)
 * @param incoming - New entries from audit (URLs to keep)
 * @returns Merged registry with prior review state preserved where applicable
 */
export function mergeSourceRegistry(
  existing: SourceRegistryEntry[],
  incoming: IncomingSourceEntry[]
): SourceRegistryEntry[] {
  // Build a map of existing entries by composite key (content_item_id + URL)
  // to handle cases where multiple content items reference the same URL
  const existingByKey = new Map<string, SourceRegistryEntry>();
  for (const entry of existing) {
    const key = `${entry.content_item_id}::${entry.source_url}`;
    existingByKey.set(key, entry);
  }

  // Build result by processing incoming data
  const result: SourceRegistryEntry[] = [];
  for (const incomingEntry of incoming) {
    const key = `${incomingEntry.content_item_id}::${incomingEntry.source_url}`;
    const existingEntry = existingByKey.get(key);

    if (existingEntry) {
      // Preserve the existing entry's authority state
      result.push(existingEntry);
    } else {
      // New URL for this content item: start unreviewed
      result.push({
        content_item_id: incomingEntry.content_item_id,
        channel: incomingEntry.channel,
        route_or_slug: incomingEntry.route_or_slug,
        source_url: incomingEntry.source_url,
        authority: "unreviewed",
        last_checked_at: "",
        notes: incomingEntry.notes,
      });
    }
  }

  return result;
}
