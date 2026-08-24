import { describe, it, expect } from "vitest";
import { mergeSourceRegistry } from "../source-registry";

describe("mergeSourceRegistry", () => {
  it("preserves existing authority when URL is still in use", () => {
    const existing = [
      {
        content_item_id: "activity-hiking",
        channel: "evergreen",
        route_or_slug: "/snowdonia/hiking",
        source_url: "https://example.com/trail",
        authority: "verified",
        last_checked_at: "2026-08-20T10:00:00Z",
        notes: "Manually verified by operator",
      },
    ];

    const incoming = [
      {
        content_item_id: "activity-hiking",
        channel: "evergreen",
        route_or_slug: "/snowdonia/hiking",
        source_url: "https://example.com/trail",
        notes: "From audit",
      },
    ];

    const result = mergeSourceRegistry(existing, incoming);

    const merged = result.find((r) => r.source_url === "https://example.com/trail");
    expect(merged).toBeDefined();
    expect(merged?.authority).toBe("verified");
    expect(merged?.last_checked_at).toBe("2026-08-20T10:00:00Z");
    expect(merged?.notes).toBe("Manually verified by operator");
  });

  it("marks new URLs as unreviewed with blank last_checked_at", () => {
    const existing: typeof mergeSourceRegistry extends (a: infer T, b: any) => any ? T : never = [];

    const incoming = [
      {
        content_item_id: "activity-kayaking",
        channel: "evergreen",
        route_or_slug: "/snowdonia/kayaking",
        source_url: "https://example.com/new-source",
        notes: "From audit",
      },
    ];

    const result = mergeSourceRegistry(existing, incoming);

    const merged = result.find((r) => r.source_url === "https://example.com/new-source");
    expect(merged).toBeDefined();
    expect(merged?.authority).toBe("unreviewed");
    expect(merged?.last_checked_at).toBe("");
  });

  it("removes URLs that are no longer referenced in incoming data", () => {
    const existing = [
      {
        content_item_id: "activity-hiking",
        channel: "evergreen",
        route_or_slug: "/snowdonia/hiking",
        source_url: "https://example.com/old-source",
        authority: "partial",
        last_checked_at: "2026-08-15T10:00:00Z",
        notes: "Old URL",
      },
      {
        content_item_id: "activity-hiking",
        channel: "evergreen",
        route_or_slug: "/snowdonia/hiking",
        source_url: "https://example.com/kept-source",
        authority: "verified",
        last_checked_at: "2026-08-20T10:00:00Z",
        notes: "Kept",
      },
    ];

    const incoming = [
      {
        content_item_id: "activity-hiking",
        channel: "evergreen",
        route_or_slug: "/snowdonia/hiking",
        source_url: "https://example.com/kept-source",
        notes: "From audit",
      },
    ];

    const result = mergeSourceRegistry(existing, incoming);

    expect(result).toHaveLength(1);
    expect(result[0].source_url).toBe("https://example.com/kept-source");
  });

  it("handles multiple items with different authority states", () => {
    const existing = [
      {
        content_item_id: "item-1",
        channel: "evergreen",
        route_or_slug: "/region/activity1",
        source_url: "https://example.com/verified",
        authority: "verified",
        last_checked_at: "2026-08-20T10:00:00Z",
        notes: "Verified",
      },
      {
        content_item_id: "item-2",
        channel: "commercial",
        route_or_slug: "/directory/operator",
        source_url: "https://example.com/partial",
        authority: "partial",
        last_checked_at: "2026-08-18T10:00:00Z",
        notes: "Partial",
      },
    ];

    const incoming = [
      {
        content_item_id: "item-1",
        channel: "evergreen",
        route_or_slug: "/region/activity1",
        source_url: "https://example.com/verified",
        notes: "Audit",
      },
      {
        content_item_id: "item-1",
        channel: "evergreen",
        route_or_slug: "/region/activity1",
        source_url: "https://example.com/new",
        notes: "Audit",
      },
      {
        content_item_id: "item-2",
        channel: "commercial",
        route_or_slug: "/directory/operator",
        source_url: "https://example.com/partial",
        notes: "Audit",
      },
    ];

    const result = mergeSourceRegistry(existing, incoming);

    const verified = result.find((r) => r.source_url === "https://example.com/verified");
    expect(verified?.authority).toBe("verified");

    const newUrl = result.find((r) => r.source_url === "https://example.com/new");
    expect(newUrl?.authority).toBe("unreviewed");
    expect(newUrl?.last_checked_at).toBe("");

    const partial = result.find((r) => r.source_url === "https://example.com/partial");
    expect(partial?.authority).toBe("partial");
  });

  it("preserves all existing fields when merging", () => {
    const existing = [
      {
        content_item_id: "item-1",
        channel: "evergreen",
        route_or_slug: "/region/page",
        source_url: "https://example.com/source",
        authority: "discovered" as const,
        last_checked_at: "2026-08-10T10:00:00Z",
        notes: "Original notes with context",
      },
    ];

    const incoming = [
      {
        content_item_id: "item-1",
        channel: "evergreen",
        route_or_slug: "/region/page",
        source_url: "https://example.com/source",
        notes: "Audit import",
      },
    ];

    const result = mergeSourceRegistry(existing, incoming);

    expect(result[0]).toEqual({
      content_item_id: "item-1",
      channel: "evergreen",
      route_or_slug: "/region/page",
      source_url: "https://example.com/source",
      authority: "discovered",
      last_checked_at: "2026-08-10T10:00:00Z",
      notes: "Original notes with context",
    });
  });

  it("handles empty existing registry", () => {
    const incoming = [
      {
        content_item_id: "item-1",
        channel: "evergreen",
        route_or_slug: "/region/page",
        source_url: "https://example.com/source",
        notes: "Audit",
      },
    ];

    const result = mergeSourceRegistry([], incoming);

    expect(result).toHaveLength(1);
    expect(result[0].authority).toBe("unreviewed");
    expect(result[0].last_checked_at).toBe("");
  });

  it("handles empty incoming registry", () => {
    const existing = [
      {
        content_item_id: "item-1",
        channel: "evergreen",
        route_or_slug: "/region/page",
        source_url: "https://example.com/source",
        authority: "verified" as const,
        last_checked_at: "2026-08-20T10:00:00Z",
        notes: "Verified",
      },
    ];

    const result = mergeSourceRegistry(existing, []);

    expect(result).toHaveLength(0);
  });

  it("preserves distinct authority states when two content items share the same URL", () => {
    // Regression: merge lookup keyed only by URL causes collapsing when
    // multiple content items reference the same source URL
    const existing = [
      {
        content_item_id: "activity-hiking",
        channel: "evergreen",
        route_or_slug: "/snowdonia/hiking",
        source_url: "https://example.com/shared-source",
        authority: "verified",
        last_checked_at: "2026-08-20T10:00:00Z",
        notes: "Hiking authority",
      },
      {
        content_item_id: "activity-climbing",
        channel: "evergreen",
        route_or_slug: "/snowdonia/climbing",
        source_url: "https://example.com/shared-source",
        authority: "partial",
        last_checked_at: "2026-08-15T14:30:00Z",
        notes: "Climbing authority",
      },
    ];

    const incoming = [
      {
        content_item_id: "activity-hiking",
        channel: "evergreen",
        route_or_slug: "/snowdonia/hiking",
        source_url: "https://example.com/shared-source",
        notes: "From audit",
      },
      {
        content_item_id: "activity-climbing",
        channel: "evergreen",
        route_or_slug: "/snowdonia/climbing",
        source_url: "https://example.com/shared-source",
        notes: "From audit",
      },
    ];

    const result = mergeSourceRegistry(existing, incoming);

    // Should preserve both entries with their distinct states
    expect(result).toHaveLength(2);

    const hiking = result.find((r) => r.content_item_id === "activity-hiking");
    expect(hiking).toBeDefined();
    expect(hiking?.authority).toBe("verified");
    expect(hiking?.last_checked_at).toBe("2026-08-20T10:00:00Z");
    expect(hiking?.notes).toBe("Hiking authority");

    const climbing = result.find((r) => r.content_item_id === "activity-climbing");
    expect(climbing).toBeDefined();
    expect(climbing?.authority).toBe("partial");
    expect(climbing?.last_checked_at).toBe("2026-08-15T14:30:00Z");
    expect(climbing?.notes).toBe("Climbing authority");
  });
});
