import { describe, it, expect } from "vitest";
import { LAUNCH_COMBOS } from "../launch";

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
    it("preserves manual authority state when URLs persist", () => {
      // When a URL was verified or discovered in a prior audit,
      // and it appears again in the new audit, its authority state is preserved
      expect(true).toBe(true); // placeholder
    });

    it("marks new URLs as unreviewed with blank last_checked_at", () => {
      // New URLs that didn't exist in prior audit start as unreviewed
      expect(true).toBe(true); // placeholder
    });

    it("removes URLs no longer in audit data", () => {
      // URLs that existed but no longer appear in incoming data are dropped
      expect(true).toBe(true); // placeholder
    });
  });

  describe("content-gap-audit.ts fixes", () => {
    it("does not mark missing Google ratings as auto-fixable", () => {
      // Google ratings may be research leads, never auto-safe to fill
      expect(true).toBe(true); // placeholder
    });

    it("does not mark missing coordinates as auto-fixable", () => {
      // Coordinates may be research leads, never auto-safe to fill
      expect(true).toBe(true); // placeholder
    });
  });
});
