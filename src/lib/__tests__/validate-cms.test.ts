import { describe, it, expect } from "vitest";
import { validateCmsBody } from "../api/validate";

function expectSuccess(result: ReturnType<typeof validateCmsBody>) {
  expect(result.success, JSON.stringify(result)).toBe(true);
  if (!result.success) throw new Error("unreachable");
  return result.data;
}

function expectFailure(result: ReturnType<typeof validateCmsBody>) {
  expect(result.success, JSON.stringify(result)).toBe(false);
  if (result.success) throw new Error("unreachable");
  return result.issues;
}

describe("validateCmsBody", () => {
  it("accepts a valid body for a known content type", () => {
    const data = expectSuccess(
      validateCmsBody("regions", {
        name: "Snowdonia",
        slug: "snowdonia",
        description: "Mountains and lakes",
        lat: 53.068,
        lng: -4.076,
        status: "published",
      })
    );
    expect(data.name).toBe("Snowdonia");
    expect(data.lat).toBe(53.068);
  });

  it("rejects an unknown content type", () => {
    const issues = expectFailure(validateCmsBody("hacks", { name: "x" }));
    expect(issues.join(" ")).toContain("Unknown content type");
  });

  it("rejects non-object bodies", () => {
    expectFailure(validateCmsBody("regions", "not an object"));
    expectFailure(validateCmsBody("regions", null));
    expectFailure(validateCmsBody("regions", [1, 2, 3]));
  });

  it("rejects unknown keys (strict schema)", () => {
    const issues = expectFailure(
      validateCmsBody("regions", { name: "X", evilField: "drop tables" })
    );
    expect(issues.join(" ")).toMatch(/evilField|Unrecognized/i);
  });

  describe("decimal fields (lat)", () => {
    it("rejects a non-numeric string", () => {
      expectFailure(validateCmsBody("regions", { lat: "abc" }));
    });

    it('coerces "" to null', () => {
      const data = expectSuccess(validateCmsBody("regions", { lat: "" }));
      expect(data.lat).toBeNull();
    });

    it("accepts a numeric string", () => {
      const data = expectSuccess(validateCmsBody("regions", { lat: "51.5" }));
      expect(data.lat).toBe("51.5");
    });

    it("accepts a number", () => {
      const data = expectSuccess(validateCmsBody("regions", { lat: 51.5 }));
      expect(data.lat).toBe(51.5);
    });
  });

  describe("integer fields (minAge)", () => {
    it("rejects a non-integer string", () => {
      expectFailure(validateCmsBody("activities", { minAge: "twelve" }));
    });

    it("accepts an integer and an integer string", () => {
      expectSuccess(validateCmsBody("activities", { minAge: 12 }));
      expectSuccess(validateCmsBody("activities", { minAge: "12" }));
    });

    it("rejects a decimal for an integer column", () => {
      expectFailure(validateCmsBody("activities", { minAge: 12.5 }));
    });
  });

  describe("boolean fields (isFeatured)", () => {
    it('rejects "yes"', () => {
      expectFailure(validateCmsBody("events", { isFeatured: "yes" }));
    });

    it("accepts true", () => {
      const data = expectSuccess(validateCmsBody("events", { isFeatured: true }));
      expect(data.isFeatured).toBe(true);
    });

    it('accepts "true" and coerces it to boolean', () => {
      const data = expectSuccess(
        validateCmsBody("events", { isFeatured: "true" })
      );
      expect(data.isFeatured).toBe(true);
    });
  });

  describe("date fields (dateStart on events)", () => {
    it("rejects an unparseable date", () => {
      expectFailure(validateCmsBody("events", { dateStart: "not-a-date" }));
    });

    it("accepts a parseable date string", () => {
      expectSuccess(validateCmsBody("events", { dateStart: "2026-07-01" }));
    });
  });

  describe("string array fields (tags on events)", () => {
    it("accepts an array of strings", () => {
      const data = expectSuccess(
        validateCmsBody("events", { tags: ["a", "b"] })
      );
      expect(data.tags).toEqual(["a", "b"]);
    });

    it("rejects a bare string", () => {
      expectFailure(validateCmsBody("events", { tags: "a" }));
    });

    it("rejects an array of non-strings", () => {
      expectFailure(validateCmsBody("events", { tags: [1, 2] }));
    });
  });

  describe("jsonb fields (imageGallery on events)", () => {
    it("accepts an object or an array", () => {
      expectSuccess(validateCmsBody("events", { imageGallery: ["img1.jpg"] }));
      expectSuccess(validateCmsBody("events", { imageGallery: { hero: "x" } }));
    });

    it("rejects a scalar", () => {
      expectFailure(validateCmsBody("events", { imageGallery: 42 }));
    });
  });
});
