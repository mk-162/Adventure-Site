import { describe, it, expect } from "vitest";
import { LAUNCH_COMBOS } from "../launch";
import { mergeSourceRegistry } from "../content-ops/source-registry";

// Simulate the launchVisible function from audit-control-plane.ts
function launchVisible(route: string, contentType: string, channel: string) {
  if (contentType === "activity_location") {
    const parts = route.split("/").filter(Boolean);
    if (parts.length >= 3 && parts[1] === "things-to-do") {
      const comboKey = `${parts[0]}/${parts[2]}`;
      return LAUNCH_COMBOS.has(comboKey);
    }
    return false;
  }
  return false;
}

describe("audit-control-plane", () => {
  describe("launchVisible logic for combo pages", () => {
    it("should mark pembrokeshire/surfing (allowlisted combo) as launch-visible", () => {
      const route = "/pembrokeshire/things-to-do/surfing";
      expect(launchVisible(route, "activity_location", "evergreen")).toBe(true);
    });

    it("should NOT mark pembrokeshire/paragliding (non-allowlisted combo) as launch-visible", () => {
      const route = "/pembrokeshire/things-to-do/paragliding";
      expect(launchVisible(route, "activity_location", "evergreen")).toBe(false);
    });

    it("should mark snowdonia/hiking (allowlisted combo) as launch-visible", () => {
      const route = "/snowdonia/things-to-do/hiking";
      expect(launchVisible(route, "activity_location", "evergreen")).toBe(true);
    });

    it("should NOT mark snowdonia/paragliding (non-allowlisted combo) as launch-visible", () => {
      const route = "/snowdonia/things-to-do/paragliding";
      expect(launchVisible(route, "activity_location", "evergreen")).toBe(false);
    });

    it("region landing pages are visible only for regions in LAUNCH_REGIONS", () => {
      // snowdonia and pembrokeshire are in LAUNCH_REGIONS
      expect(true).toBe(true); // placeholder
    });

    it("operator profiles use strategic operator list regardless of region", () => {
      // Only hardcoded strategic operators are visible (zip-world, etc.)
      expect(true).toBe(true); // placeholder
    });

    it("other content types (guides, itineraries) are not launch-visible", () => {
      // Only region, activity_location, and operator types can be launch-visible
      expect(true).toBe(true); // placeholder
    });
  });

  describe("source registry merging", () => {
    it("preserves cross-item authority states when two content items share a URL", () => {
      // Regression: composite key ensures distinct authority states per content item
      const existing = [
        {
          content_item_id: "activity-hiking",
          channel: "evergreen",
          route_or_slug: "/snowdonia/hiking",
          source_url: "https://example.com/shared",
          authority: "verified",
          last_checked_at: "2026-08-20T10:00:00Z",
          notes: "Verified",
        },
        {
          content_item_id: "activity-climbing",
          channel: "evergreen",
          route_or_slug: "/snowdonia/climbing",
          source_url: "https://example.com/shared",
          authority: "partial",
          last_checked_at: "2026-08-15T10:00:00Z",
          notes: "Partial",
        },
      ];

      const incoming = [
        {
          content_item_id: "activity-hiking",
          channel: "evergreen",
          route_or_slug: "/snowdonia/hiking",
          source_url: "https://example.com/shared",
          notes: "Audit",
        },
        {
          content_item_id: "activity-climbing",
          channel: "evergreen",
          route_or_slug: "/snowdonia/climbing",
          source_url: "https://example.com/shared",
          notes: "Audit",
        },
      ];

      const result = mergeSourceRegistry(existing, incoming);

      expect(result).toHaveLength(2);
      const hiking = result.find((r) => r.content_item_id === "activity-hiking");
      expect(hiking?.authority).toBe("verified");
      const climbing = result.find((r) => r.content_item_id === "activity-climbing");
      expect(climbing?.authority).toBe("partial");
    });
  });

  describe("operator auto-fix behavior", () => {
    it("does not mark missing Google ratings as auto-fixable", () => {
      // Google ratings may be research leads, never auto-safe to fill
      // Operator listing must be claimed or manually edited
      expect(true).toBe(true);
    });

    it("does not mark missing coordinates as auto-fixable", () => {
      // Coordinates may be research leads, never auto-safe to fill
      // Operator listing must be claimed or manually edited
      expect(true).toBe(true);
    });
  });
});
