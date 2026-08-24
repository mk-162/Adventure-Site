import { describe, it, expect } from "vitest";
import { getTableConfig } from "drizzle-orm/pg-core";
import {
  listingEvidence,
  contentReviewState,
  opsDecisions,
  emailSuppression,
  operators,
  operatorInterest,
} from "../schema";

function column(table: Parameters<typeof getTableConfig>[0], name: string) {
  const config = getTableConfig(table);
  const col = config.columns.find((c) => c.name === name);
  if (!col) throw new Error(`column ${name} not found on ${config.name}`);
  return col;
}

describe("listing_evidence", () => {
  it("requires a stable entity type, entity id, field and source type", () => {
    expect(column(listingEvidence, "entity_type").notNull).toBe(true);
    expect(column(listingEvidence, "entity_id").notNull).toBe(true);
    expect(column(listingEvidence, "field").notNull).toBe(true);
    expect(column(listingEvidence, "source_type").notNull).toBe(true);
  });

  it("uses a varchar entity_id to support stable string keys (operators, combo facts)", () => {
    const col = column(listingEvidence, "entity_id");
    expect(col.columnType).toBe("PgVarchar");
  });

  it("constrains source_type to a closed enum that includes csv_seed", () => {
    const col = column(listingEvidence, "source_type");
    expect(col.enumValues).toContain("csv_seed");
  });

  it("defaults verdict to unverified, not verified", () => {
    const col = column(listingEvidence, "verdict");
    expect(col.default).toBe("unverified");
  });
});

describe("content_review_state", () => {
  it("has a globally unique, required content_item_id", () => {
    const col = column(contentReviewState, "content_item_id");
    expect(col.notNull).toBe(true);
    expect(col.isUnique).toBe(true);
  });
});

describe("ops_decisions", () => {
  it("mirrors the commercial-decisions.json decision option set", () => {
    const col = column(opsDecisions, "decision");
    expect(col.enumValues).toEqual([
      "strategic_anchor",
      "premium_sales_lure",
      "claimed_basic",
      "stub_only",
      "remove_or_block",
      "needs_human_permission",
    ]);
  });

  it("requires a decider and a content item id", () => {
    expect(column(opsDecisions, "decided_by_email").notNull).toBe(true);
    expect(column(opsDecisions, "content_item_id").notNull).toBe(true);
  });
});

describe("email_suppression", () => {
  it("has a globally unique email identity", () => {
    const col = column(emailSuppression, "email");
    expect(col.notNull).toBe(true);
    expect(col.isUnique).toBe(true);
  });

  it("requires a reason", () => {
    expect(column(emailSuppression, "reason").notNull).toBe(true);
  });
});

describe("operators.verification_level", () => {
  it("exists, defaults to unverified, and is compatible with existing data_source values", () => {
    const col = column(operators, "verification_level");
    expect(col.notNull).toBe(true);
    expect(col.default).toBe("unverified");
    expect(col.enumValues).toContain("csv_seed");
    expect(col.enumValues).toContain("human_verified");
  });
});

describe("operator_interest triage fields", () => {
  it("adds status, handled-by/date and next action", () => {
    expect(column(operatorInterest, "status").notNull).toBe(true);
    expect(column(operatorInterest, "status").default).toBe("new");
    // handled_by/handled_at/next_action are nullable until triage happens
    expect(() => column(operatorInterest, "handled_by_email")).not.toThrow();
    expect(() => column(operatorInterest, "handled_at")).not.toThrow();
    expect(() => column(operatorInterest, "next_action")).not.toThrow();
  });
});
