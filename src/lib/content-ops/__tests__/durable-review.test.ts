// @vitest-environment node
// Proves the dashboard's durable data helper degrades visibly and safely when
// the fact-check tables are missing/unreachable, that the quality scorecard
// never infers green from missing data, and that evidence is read by the
// canonical (entity_type, entity_id) target rather than the queue id.
import { describe, it, expect, beforeEach, vi } from "vitest";
import { contentReviewState, listingEvidence, operators, opsDecisions } from "@/db/schema";

const mocks = vi.hoisted(() => ({
  rowsByTable: new Map<unknown, unknown[]>(),
  whereByTable: new Map<unknown, unknown[]>(),
  queryError: null as Error | null,
  selectCalls: [] as unknown[],
  mutations: [] as string[],
}));

vi.mock("@/db", () => {
  const builder = (table?: unknown) => {
    const chain: Record<string, unknown> = {};
    const self = () => chain;
    const settle = () =>
      mocks.queryError
        ? Promise.reject(mocks.queryError)
        : Promise.resolve(mocks.rowsByTable.get(table) ?? []);
    chain.from = (from: unknown) => {
      table = from;
      mocks.selectCalls.push(from);
      return chain;
    };
    chain.where = (condition: unknown) => {
      const recorded = mocks.whereByTable.get(table) ?? [];
      recorded.push(condition);
      mocks.whereByTable.set(table, recorded);
      return chain;
    };
    chain.orderBy = self;
    chain.limit = self;
    chain.then = (onFulfilled: (value: unknown) => unknown, onRejected?: (reason: unknown) => unknown) =>
      settle().then(onFulfilled, onRejected);
    return chain;
  };

  return {
    db: {
      select: () => builder(),
      insert: () => {
        mocks.mutations.push("insert");
        throw new Error("the dashboard read path must not write");
      },
      update: () => {
        mocks.mutations.push("update");
        throw new Error("the dashboard read path must not write");
      },
      delete: () => {
        mocks.mutations.push("delete");
        throw new Error("the dashboard read path must not write");
      },
    },
  };
});

async function loadHelper() {
  return import("../durable-review");
}

/** Dashboard queue item shape: the durable loader needs type + route, not just the id. */
function operatorItem(slug: string) {
  return {
    contentItemId: `operator-${slug}`,
    contentType: "operator",
    routeOrSlug: `/directory/${slug}`,
  };
}

/**
 * Flattens a drizzle condition to the column names and bound values it
 * references, so a test can assert the query really constrained entity_type.
 */
function sqlAtoms(node: unknown, out: string[] = []): string[] {
  if (!node || typeof node !== "object") return out;
  if (Array.isArray(node)) {
    for (const child of node) sqlAtoms(child, out);
    return out;
  }
  const candidate = node as { name?: unknown; table?: unknown; queryChunks?: unknown; value?: unknown };
  if (typeof candidate.name === "string" && candidate.table) out.push(candidate.name);
  if (candidate.queryChunks) sqlAtoms(candidate.queryChunks, out);
  if (typeof candidate.value === "string") out.push(candidate.value);
  if (Array.isArray(candidate.value)) for (const v of candidate.value) out.push(String(v));
  return out;
}

beforeEach(() => {
  mocks.rowsByTable.clear();
  mocks.whereByTable.clear();
  mocks.queryError = null;
  mocks.selectCalls.length = 0;
  mocks.mutations.length = 0;
});

describe("loadDurableContentOpsState", () => {
  it("reports the durable store as available and returns the latest decision per item", async () => {
    mocks.rowsByTable.set(opsDecisions, [
      {
        contentItemId: "operator-a",
        decision: "stub_only",
        decidedByEmail: "old@adventure.wales",
        decidedAt: new Date("2026-08-01T09:00:00Z"),
      },
      {
        contentItemId: "operator-a",
        decision: "strategic_anchor",
        decidedByEmail: "mk@adventure.wales",
        decidedAt: new Date("2026-08-20T09:00:00Z"),
      },
      {
        contentItemId: "operator-b",
        decision: "remove_or_block",
        decidedByEmail: "mk@adventure.wales",
        decidedAt: new Date("2026-08-10T09:00:00Z"),
      },
    ]);

    const { loadDurableContentOpsState } = await loadHelper();
    const state = await loadDurableContentOpsState([operatorItem("a"), operatorItem("b")]);

    expect(state.available).toBe(true);
    expect(state.unavailableReason).toBeNull();
    expect(state.latestDecisionByItem.get("operator-a")?.decision).toBe("strategic_anchor");
    expect(state.latestDecisionByItem.get("operator-a")?.decidedByEmail).toBe("mk@adventure.wales");
    expect(state.latestDecisionByItem.get("operator-b")?.decision).toBe("remove_or_block");
    expect(mocks.mutations).toEqual([]);
  });

  it("maps durable review state by content item id", async () => {
    mocks.rowsByTable.set(contentReviewState, [
      {
        contentItemId: "operator-a",
        status: "qa_needed",
        reviewedByEmail: "reviewer@adventure.wales",
        reviewedAt: new Date("2026-08-21T09:00:00Z"),
        notes: "Check the price claim.",
      },
    ]);

    const { loadDurableContentOpsState } = await loadHelper();
    const state = await loadDurableContentOpsState([operatorItem("a")]);

    expect(state.reviewByItem.get("operator-a")?.status).toBe("qa_needed");
    expect(state.reviewByItem.get("operator-a")?.notes).toBe("Check the price claim.");
  });

  it("counts only human-verifiable evidence — a verified csv_seed row does not count", async () => {
    mocks.rowsByTable.set(operators, [
      { id: 42, slug: "a" },
      { id: 7, slug: "b" },
    ]);
    mocks.rowsByTable.set(listingEvidence, [
      { entityType: "operator", entityId: "42", verdict: "verified", sourceType: "operator_website" },
      { entityType: "operator", entityId: "42", verdict: "verified", sourceType: "csv_seed" },
      { entityType: "operator", entityId: "42", verdict: "unverified", sourceType: "operator_website" },
      { entityType: "operator", entityId: "7", verdict: "verified", sourceType: "csv_seed" },
    ]);

    const { loadDurableContentOpsState } = await loadHelper();
    const state = await loadDurableContentOpsState([operatorItem("a"), operatorItem("b")]);

    expect(state.verifiedEvidenceCountByItem.get("operator-a")).toBe(1);
    expect(state.verifiedEvidenceCountByItem.get("operator-b") ?? 0).toBe(0);
  });

  it("resolves an operator's evidence entity id from operators.slug via its /directory/<slug> route", async () => {
    mocks.rowsByTable.set(operators, [{ id: 42, slug: "gower-surf-academy" }]);
    mocks.rowsByTable.set(listingEvidence, [
      { entityType: "operator", entityId: "42", verdict: "verified", sourceType: "operator_website" },
    ]);

    const { loadDurableContentOpsState } = await loadHelper();
    const state = await loadDurableContentOpsState([operatorItem("gower-surf-academy")]);

    expect(state.evidenceTargetByItem.get("operator-gower-surf-academy")).toEqual({
      entityType: "operator",
      entityId: "42",
    });
    expect(state.verifiedEvidenceCountByItem.get("operator-gower-surf-academy")).toBe(1);
  });

  it("constrains the evidence query by entity_type as well as entity_id", async () => {
    mocks.rowsByTable.set(operators, [{ id: 42, slug: "gower-surf-academy" }]);

    const { loadDurableContentOpsState } = await loadHelper();
    await loadDurableContentOpsState([operatorItem("gower-surf-academy")]);

    const atoms = sqlAtoms(mocks.whereByTable.get(listingEvidence) ?? []);
    expect(atoms).toContain("entity_type");
    expect(atoms).toContain("operator");
    expect(atoms).toContain("entity_id");
    expect(atoms).toContain("42");
    // The queue id must never be used as an evidence entity id.
    expect(atoms).not.toContain("operator-gower-surf-academy");
  });

  it("does not count the same numeric entity id recorded under a different entity type", async () => {
    mocks.rowsByTable.set(operators, [{ id: 42, slug: "gower-surf-academy" }]);
    mocks.rowsByTable.set(listingEvidence, [
      { entityType: "activity", entityId: "42", verdict: "verified", sourceType: "operator_website" },
    ]);

    const { loadDurableContentOpsState } = await loadHelper();
    const state = await loadDurableContentOpsState([operatorItem("gower-surf-academy")]);

    expect(state.verifiedEvidenceCountByItem.get("operator-gower-surf-academy") ?? 0).toBe(0);
  });

  it("does not treat the content_item_id as an evidence entity id", async () => {
    mocks.rowsByTable.set(operators, [{ id: 42, slug: "gower-surf-academy" }]);
    mocks.rowsByTable.set(listingEvidence, [
      {
        entityType: "operator",
        entityId: "operator-gower-surf-academy",
        verdict: "verified",
        sourceType: "operator_website",
      },
    ]);

    const { loadDurableContentOpsState } = await loadHelper();
    const state = await loadDurableContentOpsState([operatorItem("gower-surf-academy")]);

    expect(state.verifiedEvidenceCountByItem.get("operator-gower-surf-academy") ?? 0).toBe(0);
  });

  it("leaves an operator with no matching operators row unmapped rather than guessing", async () => {
    mocks.rowsByTable.set(operators, []);
    mocks.rowsByTable.set(listingEvidence, [
      { entityType: "operator", entityId: "42", verdict: "verified", sourceType: "operator_website" },
    ]);

    const { loadDurableContentOpsState } = await loadHelper();
    const state = await loadDurableContentOpsState([operatorItem("gower-surf-academy")]);

    expect(state.evidenceTargetByItem.has("operator-gower-surf-academy")).toBe(false);
    expect(state.verifiedEvidenceCountByItem.get("operator-gower-surf-academy") ?? 0).toBe(0);
  });

  it("maps no evidence target for content types without an explicit mapper", async () => {
    const { loadDurableContentOpsState } = await loadHelper();
    const state = await loadDurableContentOpsState([
      {
        contentItemId: "activity-location-anglesey-coasteering",
        contentType: "activity_location",
        routeOrSlug: "/anglesey/things-to-do/coasteering",
      },
    ]);

    expect(state.available).toBe(true);
    expect(state.evidenceTargetByItem.size).toBe(0);
    expect(state.verifiedEvidenceCountByItem.size).toBe(0);
    // No operator slugs to resolve, so the operators table is never queried.
    expect(mocks.selectCalls).not.toContain(operators);
  });

  it("degrades visibly when the durable tables are missing, instead of throwing", async () => {
    mocks.queryError = new Error('relation "ops_decisions" does not exist');

    const { loadDurableContentOpsState } = await loadHelper();
    const state = await loadDurableContentOpsState([operatorItem("a")]);

    expect(state.available).toBe(false);
    expect(state.unavailableReason).toMatch(/migration/i);
    expect(state.latestDecisionByItem.size).toBe(0);
    expect(state.reviewByItem.size).toBe(0);
    expect(state.verifiedEvidenceCountByItem.size).toBe(0);
  });

  it("degrades when the database cannot be reached at all", async () => {
    mocks.queryError = new Error("getaddrinfo ENOTFOUND db.example.neon.tech");

    const { loadDurableContentOpsState } = await loadHelper();
    const state = await loadDurableContentOpsState([operatorItem("a")]);

    expect(state.available).toBe(false);
    expect(state.unavailableReason).toBeTruthy();
  });

  it("does not query with an empty item list but still reports availability", async () => {
    const { loadDurableContentOpsState } = await loadHelper();
    const state = await loadDurableContentOpsState([]);

    expect(state.available).toBe(true);
    expect(state.latestDecisionByItem.size).toBe(0);
  });
});

describe("describeDurableStore", () => {
  it("states plainly that durable review data is unavailable and the file queue still renders", async () => {
    const { describeDurableStore } = await loadHelper();
    const description = describeDurableStore({
      available: false,
      unavailableReason: 'relation "ops_decisions" does not exist',
      latestDecisionByItem: new Map(),
      reviewByItem: new Map(),
      verifiedEvidenceCountByItem: new Map(),
      evidenceTargetByItem: new Map(),
    });

    expect(description.tone).toBe("red");
    expect(description.headline).toMatch(/durable review data (is )?unavailable/i);
    expect(description.detail).toMatch(/file-backed|queue/i);
  });

  it("confirms the durable store is live when reachable", async () => {
    const { describeDurableStore } = await loadHelper();
    const description = describeDurableStore({
      available: true,
      unavailableReason: null,
      latestDecisionByItem: new Map(),
      reviewByItem: new Map(),
      verifiedEvidenceCountByItem: new Map(),
      evidenceTargetByItem: new Map(),
    });

    expect(description.tone).toBe("green");
    expect(description.headline).toMatch(/durable/i);
  });
});

const emptyItem = {
  status: "discovered",
  evidenceStatus: "",
  imageStatus: "",
  copyStatus: "",
  seoStatus: "",
  routeOrSlug: "",
  sourceCount: 0,
};

const OPERATOR_TARGET = { entityType: "operator", entityId: "42" };

const unknownDurable = {
  available: false,
  decision: null,
  review: null,
  verifiedEvidenceCount: 0,
  evidenceTarget: null,
};

describe("buildQualityScorecard", () => {
  it("always reports the six founder-visible categories", async () => {
    const { buildQualityScorecard } = await loadHelper();
    const card = buildQualityScorecard({ item: emptyItem, research: null, durable: unknownDurable });

    expect(card.map((entry) => entry.key)).toEqual([
      "evidence",
      "accuracy",
      "image_rights",
      "editorial",
      "technical",
      "approval",
    ]);
    expect(card.every((entry) => entry.label.length > 0 && entry.detail.length > 0)).toBe(true);
  });

  it("never scores green when nothing is known", async () => {
    const { buildQualityScorecard } = await loadHelper();
    const card = buildQualityScorecard({ item: emptyItem, research: null, durable: unknownDurable });

    expect(card.every((entry) => entry.tone === "amber" || entry.tone === "red")).toBe(true);
  });

  it("keeps review and approval amber (unknown) when the durable store is unavailable", async () => {
    const { buildQualityScorecard } = await loadHelper();
    const card = buildQualityScorecard({
      item: { ...emptyItem, status: "reviewed", copyStatus: "approved", seoStatus: "ready", routeOrSlug: "/x" },
      research: { sourceCount: 9, imageStatus: "usable_recorded", humanReviewFlags: 0 },
      durable: unknownDurable,
    });

    const byKey = Object.fromEntries(card.map((entry) => [entry.key, entry]));
    expect(byKey.accuracy.tone).toBe("amber");
    expect(byKey.approval.tone).toBe("amber");
    expect(byKey.accuracy.detail).toMatch(/unavailable|unknown/i);
  });

  it("scores evidence red with no sources, amber with unverified sources, green only with durable verified evidence", async () => {
    const { buildQualityScorecard } = await loadHelper();
    const evidenceFor = (item: typeof emptyItem, verifiedEvidenceCount: number, available = true) =>
      buildQualityScorecard({
        item,
        research: null,
        durable: {
          available,
          decision: null,
          review: null,
          verifiedEvidenceCount,
          evidenceTarget: OPERATOR_TARGET,
        },
      }).find((entry) => entry.key === "evidence");

    expect(evidenceFor(emptyItem, 0)?.tone).toBe("red");
    expect(evidenceFor({ ...emptyItem, sourceCount: 4 }, 0)?.tone).toBe("amber");
    expect(evidenceFor({ ...emptyItem, sourceCount: 4 }, 2)?.tone).toBe("green");
    // Durable store down means we cannot claim verification, whatever the file says.
    expect(evidenceFor({ ...emptyItem, sourceCount: 4 }, 2, false)?.tone).toBe("amber");
  });

  it("keeps evidence amber for an item with no mapped evidence entity, and says so", async () => {
    const { buildQualityScorecard } = await loadHelper();
    const evidence = buildQualityScorecard({
      item: { ...emptyItem, sourceCount: 4 },
      research: null,
      durable: {
        available: true,
        decision: null,
        review: null,
        verifiedEvidenceCount: 0,
        evidenceTarget: null,
      },
    }).find((entry) => entry.key === "evidence");

    expect(evidence?.tone).toBe("amber");
    expect(evidence?.detail).toMatch(/no .*evidence entity|not mapped/i);
    // The wording must not imply the queue id is itself an evidence entity id.
    expect(evidence?.detail).not.toMatch(/content[_ ]item[_ ]id/i);
  });

  it("never scores evidence green without a mapped evidence entity", async () => {
    const { buildQualityScorecard } = await loadHelper();
    const evidence = buildQualityScorecard({
      item: { ...emptyItem, sourceCount: 4 },
      research: null,
      durable: {
        available: true,
        decision: null,
        review: null,
        verifiedEvidenceCount: 3,
        evidenceTarget: null,
      },
    }).find((entry) => entry.key === "evidence");

    expect(evidence?.tone).toBe("amber");
  });

  it("names the resolved evidence target when it reports verified evidence", async () => {
    const { buildQualityScorecard } = await loadHelper();
    const evidence = buildQualityScorecard({
      item: { ...emptyItem, sourceCount: 4 },
      research: null,
      durable: {
        available: true,
        decision: null,
        review: null,
        verifiedEvidenceCount: 2,
        evidenceTarget: OPERATOR_TARGET,
      },
    }).find((entry) => entry.key === "evidence");

    expect(evidence?.tone).toBe("green");
    expect(evidence?.detail).toMatch(/operator/);
    expect(evidence?.detail).toMatch(/42/);
  });

  it("reflects the durable review state in the accuracy category", async () => {
    const { buildQualityScorecard } = await loadHelper();
    const accuracyFor = (review: { status: string } | null) =>
      buildQualityScorecard({
        item: emptyItem,
        research: null,
        durable: {
          available: true,
          decision: null,
          review: review ? { ...review, reviewedByEmail: "r@a.wales", reviewedAt: new Date() } : null,
          verifiedEvidenceCount: 0,
          evidenceTarget: null,
        },
      }).find((entry) => entry.key === "accuracy");

    expect(accuracyFor(null)?.tone).toBe("red");
    expect(accuracyFor({ status: "blocked" })?.tone).toBe("red");
    expect(accuracyFor({ status: "qa_needed" })?.tone).toBe("amber");
    expect(accuracyFor({ status: "researched" })?.tone).toBe("amber");
    expect(accuracyFor({ status: "reviewed" })?.tone).toBe("green");
    expect(accuracyFor({ status: "signed_off" })?.tone).toBe("green");
  });

  it("reflects the durable decision in the approval category", async () => {
    const { buildQualityScorecard } = await loadHelper();
    const approvalFor = (decision: string | null) =>
      buildQualityScorecard({
        item: emptyItem,
        research: null,
        durable: {
          available: true,
          decision: decision
            ? { decision: decision as never, decidedByEmail: "mk@adventure.wales", decidedAt: new Date() }
            : null,
          review: null,
          verifiedEvidenceCount: 0,
          evidenceTarget: null,
        },
      }).find((entry) => entry.key === "approval");

    expect(approvalFor(null)?.tone).toBe("red");
    expect(approvalFor("remove_or_block")?.tone).toBe("red");
    expect(approvalFor("needs_human_permission")?.tone).toBe("red");
    expect(approvalFor("strategic_anchor")?.tone).toBe("green");
    expect(approvalFor("strategic_anchor")?.detail).toMatch(/mk@adventure\.wales/);
  });

  it("treats unrecorded image provenance as amber and blocked/missing rights as red", async () => {
    const { buildQualityScorecard } = await loadHelper();
    const imageFor = (imageStatus: string, researchImageStatus?: string) =>
      buildQualityScorecard({
        item: { ...emptyItem, imageStatus },
        research: researchImageStatus
          ? { sourceCount: 1, imageStatus: researchImageStatus, humanReviewFlags: 0 }
          : null,
        durable: unknownDurable,
      }).find((entry) => entry.key === "image_rights");

    expect(imageFor("")?.tone).toBe("amber");
    expect(imageFor("not_recorded")?.tone).toBe("amber");
    expect(imageFor("needs_review")?.tone).toBe("amber");
    expect(imageFor("missing")?.tone).toBe("red");
    expect(imageFor("approved", "blocked_or_missing")?.tone).toBe("red");
    expect(imageFor("approved", "usable_recorded")?.tone).toBe("green");
  });

  it("scores editorial and technical readiness from recorded statuses only", async () => {
    const { buildQualityScorecard } = await loadHelper();
    const card = (item: Partial<typeof emptyItem>) =>
      Object.fromEntries(
        buildQualityScorecard({
          item: { ...emptyItem, ...item },
          research: null,
          durable: unknownDurable,
        }).map((entry) => [entry.key, entry.tone]),
      );

    expect(card({ copyStatus: "approved" }).editorial).toBe("green");
    expect(card({ copyStatus: "missing" }).editorial).toBe("red");
    expect(card({ status: "research_needed" }).editorial).toBe("red");
    expect(card({}).editorial).toBe("amber");

    expect(card({ seoStatus: "ready", routeOrSlug: "/operators/x" }).technical).toBe("green");
    expect(card({ seoStatus: "ready" }).technical).toBe("red");
    expect(card({ routeOrSlug: "/operators/x" }).technical).toBe("amber");
  });
});
