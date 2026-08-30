// @vitest-environment node
// Pins the one rule that the durable dashboard got wrong: a content-ops queue
// id is NOT a listing_evidence entity id. Evidence is addressed by
// (entity_type, entity_id), and an operator's entity id is its canonical
// operators.id — reached from the item's /directory/<slug> route.
import { describe, it, expect } from "vitest";

import {
  OPERATOR_ENTITY_TYPE,
  countVerifiedEvidenceByItem,
  evidenceTargetKey,
  operatorSlugFromDirectoryRoute,
  resolveEvidenceTargetRequest,
} from "../evidence-target";

describe("operatorSlugFromDirectoryRoute", () => {
  it("reads the slug from the canonical directory route", () => {
    expect(operatorSlugFromDirectoryRoute("/directory/gower-surf-academy")).toBe("gower-surf-academy");
  });

  it("tolerates a trailing slash and surrounding whitespace", () => {
    expect(operatorSlugFromDirectoryRoute("  /directory/bala-watersports/  ")).toBe("bala-watersports");
  });

  it("returns null for anything that is not a single-segment directory route", () => {
    expect(operatorSlugFromDirectoryRoute("")).toBeNull();
    expect(operatorSlugFromDirectoryRoute("/anglesey/things-to-do/coasteering")).toBeNull();
    expect(operatorSlugFromDirectoryRoute("/directory")).toBeNull();
    expect(operatorSlugFromDirectoryRoute("/directory/")).toBeNull();
    expect(operatorSlugFromDirectoryRoute("/directory/a/b")).toBeNull();
    expect(operatorSlugFromDirectoryRoute("operator-gower-surf-academy")).toBeNull();
  });
});

describe("resolveEvidenceTargetRequest", () => {
  it("asks for an operator target keyed by the route slug, not the queue id", () => {
    expect(
      resolveEvidenceTargetRequest({
        contentType: "operator",
        routeOrSlug: "/directory/gower-surf-academy",
      }),
    ).toEqual({ entityType: OPERATOR_ENTITY_TYPE, operatorSlug: "gower-surf-academy" });
  });

  it("derives the slug from the route even when the queue id would strip to something else", () => {
    // Guards against the old bug's sibling: inferring identity by chopping the
    // "operator-" prefix off the control-plane id.
    expect(
      resolveEvidenceTargetRequest({
        contentType: "operator",
        routeOrSlug: "/directory/gower-surf-school",
      }),
    ).toEqual({ entityType: OPERATOR_ENTITY_TYPE, operatorSlug: "gower-surf-school" });
  });

  it("refuses to guess an identity for an operator with no directory route", () => {
    expect(resolveEvidenceTargetRequest({ contentType: "operator", routeOrSlug: "" })).toBeNull();
    expect(resolveEvidenceTargetRequest({ contentType: "operator", routeOrSlug: "/gower/surf" })).toBeNull();
  });

  it("refuses to guess an identity for content types with no explicit mapper", () => {
    for (const contentType of ["activity_location", "location_landing", "guide", "itinerary", "event", "journal"]) {
      expect(resolveEvidenceTargetRequest({ contentType, routeOrSlug: "/anglesey/things-to-do/coasteering" })).toBeNull();
    }
  });
});

describe("countVerifiedEvidenceByItem", () => {
  const targets = new Map([
    ["operator-gower-surf-academy", { entityType: "operator", entityId: "42" }],
    ["operator-bala-watersports", { entityType: "operator", entityId: "7" }],
  ]);

  it("keys verified operator evidence back to the matching content item id", () => {
    const counts = countVerifiedEvidenceByItem(targets, [
      { entityType: "operator", entityId: "42", sourceType: "operator_website", verdict: "verified" },
      { entityType: "operator", entityId: "42", sourceType: "operator_confirmed", verdict: "verified" },
      { entityType: "operator", entityId: "7", sourceType: "google_places", verdict: "verified" },
    ]);

    expect(counts.get("operator-gower-surf-academy")).toBe(2);
    expect(counts.get("operator-bala-watersports")).toBe(1);
  });

  it("does not count the same numeric entity id under a different entity type", () => {
    const counts = countVerifiedEvidenceByItem(targets, [
      { entityType: "activity", entityId: "42", sourceType: "operator_website", verdict: "verified" },
      { entityType: "accommodation", entityId: "7", sourceType: "operator_confirmed", verdict: "verified" },
    ]);

    expect(counts.get("operator-gower-surf-academy") ?? 0).toBe(0);
    expect(counts.get("operator-bala-watersports") ?? 0).toBe(0);
  });

  it("does not count a row addressed by the content-ops queue id", () => {
    const counts = countVerifiedEvidenceByItem(targets, [
      {
        entityType: "operator",
        entityId: "operator-gower-surf-academy",
        sourceType: "operator_website",
        verdict: "verified",
      },
    ]);

    expect(counts.get("operator-gower-surf-academy") ?? 0).toBe(0);
  });

  it("ignores rows that cannot support a published verification", () => {
    const counts = countVerifiedEvidenceByItem(targets, [
      { entityType: "operator", entityId: "42", sourceType: "csv_seed", verdict: "verified" },
      { entityType: "operator", entityId: "42", sourceType: "operator_website", verdict: "unverified" },
      { entityType: "operator", entityId: "42", sourceType: "operator_website", verdict: "disputed" },
    ]);

    expect(counts.get("operator-gower-surf-academy") ?? 0).toBe(0);
  });
});

describe("evidenceTargetKey", () => {
  it("never collides across entity types that share a numeric id", () => {
    expect(evidenceTargetKey({ entityType: "operator", entityId: "42" })).not.toBe(
      evidenceTargetKey({ entityType: "activity", entityId: "42" }),
    );
  });
});
