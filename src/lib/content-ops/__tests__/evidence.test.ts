import { describe, it, expect } from "vitest";
import { isPublishableEvidenceSource, canPublishVerification } from "../evidence";

describe("isPublishableEvidenceSource", () => {
  it("rejects the CSV seed as a publishable verification source", () => {
    expect(isPublishableEvidenceSource("csv_seed")).toBe(false);
  });

  it("accepts sources that involve an actual human check", () => {
    expect(isPublishableEvidenceSource("operator_confirmed")).toBe(true);
    expect(isPublishableEvidenceSource("operator_website")).toBe(true);
    expect(isPublishableEvidenceSource("google_places")).toBe(true);
    expect(isPublishableEvidenceSource("official_tourism_board")).toBe(true);
    expect(isPublishableEvidenceSource("manual_research")).toBe(true);
  });
});

describe("canPublishVerification", () => {
  it("refuses to publish a verified verdict sourced only from the CSV seed", () => {
    expect(
      canPublishVerification({ sourceType: "csv_seed", verdict: "verified" })
    ).toBe(false);
  });

  it("refuses to publish anything short of an explicit verified verdict", () => {
    expect(
      canPublishVerification({ sourceType: "operator_confirmed", verdict: "unverified" })
    ).toBe(false);
    expect(
      canPublishVerification({ sourceType: "operator_confirmed", verdict: "needs_recheck" })
    ).toBe(false);
    expect(
      canPublishVerification({ sourceType: "operator_confirmed", verdict: "disputed" })
    ).toBe(false);
  });

  it("publishes when the verdict is verified and the source is not the CSV seed", () => {
    expect(
      canPublishVerification({ sourceType: "operator_confirmed", verdict: "verified" })
    ).toBe(true);
  });
});
