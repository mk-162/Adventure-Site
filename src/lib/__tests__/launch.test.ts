import { describe, it, expect } from "vitest";
import { isLaunchRegion, isLaunchCombo } from "../launch";

describe("launch visibility", () => {
  describe("isLaunchRegion", () => {
    it("returns true for verified regions", () => {
      expect(isLaunchRegion("snowdonia")).toBe(true);
      expect(isLaunchRegion("pembrokeshire")).toBe(true);
      expect(isLaunchRegion("brecon-beacons")).toBe(true);
      expect(isLaunchRegion("anglesey")).toBe(true);
    });

    it("returns false for unverified regions", () => {
      expect(isLaunchRegion("cardiff")).toBe(false);
      expect(isLaunchRegion("swansea")).toBe(false);
      expect(isLaunchRegion("unknown-region")).toBe(false);
    });
  });

  describe("isLaunchCombo", () => {
    it("returns true for verified region/activity combos", () => {
      expect(isLaunchCombo("snowdonia", "hiking")).toBe(true);
      expect(isLaunchCombo("snowdonia", "kayaking")).toBe(true);
      expect(isLaunchCombo("pembrokeshire", "hiking")).toBe(true);
      expect(isLaunchCombo("pembrokeshire", "surfing")).toBe(true);
    });

    it("returns false for unverified combos", () => {
      expect(isLaunchCombo("snowdonia", "unknown-activity")).toBe(false);
      expect(isLaunchCombo("unknown-region", "hiking")).toBe(false);
      expect(isLaunchCombo("cardiff", "hiking")).toBe(false);
    });

    it("returns false for verified region with unverified activity", () => {
      expect(isLaunchCombo("snowdonia", "paragliding")).toBe(false);
    });

    it("returns false for unverified region with verified activity", () => {
      expect(isLaunchCombo("swansea", "surfing")).toBe(false);
    });
  });
});
