// @vitest-environment node
// Route-handler test: proves the reviewer action upserts content_review_state
// for the allowed non-published states only, stamps the authenticated reviewer,
// and never reaches domain content or a publish.
import { describe, it, expect, beforeEach, vi } from "vitest";
import { contentReviewState, operators } from "@/db/schema";

interface InsertRecord {
  table: unknown;
  values: Record<string, unknown>;
  conflict: { target?: unknown; set?: Record<string, unknown> } | null;
}

const mocks = vi.hoisted(() => ({
  session: { id: 7, email: "reviewer@adventure.wales", name: "Reviewer", role: "editor" as string },
  authFailure: null as 401 | 403 | null,
  inserts: [] as InsertRecord[],
  mutations: [] as string[],
  insertError: null as Error | null,
}));

vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    const error = new Error(`NEXT_REDIRECT ${url}`) as Error & { redirectUrl?: string };
    error.redirectUrl = url;
    throw error;
  },
}));

vi.mock("@/lib/admin-auth", () => {
  class AdminAuthError extends Error {
    status: 401 | 403;
    constructor(message: string, status: 401 | 403) {
      super(message);
      this.name = "AdminAuthError";
      this.status = status;
    }
  }
  return {
    AdminAuthError,
    requireAdminRole: async (allowedRoles: string[]) => {
      if (mocks.authFailure) throw new AdminAuthError("denied", mocks.authFailure);
      if (!allowedRoles.includes(mocks.session.role)) throw new AdminAuthError("denied", 403);
      return mocks.session;
    },
  };
});

vi.mock("@/db", () => ({
  db: {
    insert: (table: unknown) => ({
      values: (values: Record<string, unknown>) => {
        const record: InsertRecord = { table, values, conflict: null };
        mocks.inserts.push(record);
        const settle = () => (mocks.insertError ? Promise.reject(mocks.insertError) : Promise.resolve([]));
        return {
          onConflictDoUpdate: (config: { target?: unknown; set?: Record<string, unknown> }) => {
            record.conflict = config;
            return settle();
          },
          then: (onFulfilled: (value: unknown) => unknown, onRejected?: (reason: unknown) => unknown) =>
            settle().then(onFulfilled, onRejected),
        };
      },
    }),
    update: () => {
      mocks.mutations.push("update");
      throw new Error("db.update() must not be called by the review route");
    },
    delete: () => {
      mocks.mutations.push("delete");
      throw new Error("db.delete() must not be called by the review route");
    },
  },
}));

async function postReview(fields: Record<string, string>): Promise<string> {
  const { POST } = await import("../route");
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.append(key, value);
  const request = new Request("http://localhost/admin/content-ops/review", { method: "POST", body: form });

  try {
    await POST(request as never);
  } catch (error) {
    const url = (error as { redirectUrl?: string }).redirectUrl;
    if (url) return url;
    throw error;
  }
  throw new Error("review route returned without redirecting");
}

beforeEach(() => {
  mocks.session = { id: 7, email: "reviewer@adventure.wales", name: "Reviewer", role: "editor" };
  mocks.authFailure = null;
  mocks.inserts.length = 0;
  mocks.mutations.length = 0;
  mocks.insertError = null;
});

describe("POST /admin/content-ops/review durable review state", () => {
  it.each(["researched", "qa_needed", "reviewed", "signed_off", "blocked"])(
    "upserts the allowed review state %s",
    async (status) => {
      const location = await postReview({ content_item_id: "operator-bear-grylls", review_status: status });

      expect(mocks.inserts).toHaveLength(1);
      expect(mocks.inserts[0].table).toBe(contentReviewState);
      expect(mocks.inserts[0].values.status).toBe(status);
      expect(location).toContain("review=recorded");
    },
  );

  it("upserts on content_item_id rather than appending a duplicate row", async () => {
    await postReview({ content_item_id: "operator-bear-grylls", review_status: "reviewed" });

    const conflict = mocks.inserts[0].conflict;
    expect(conflict).not.toBeNull();
    expect(conflict?.target).toBe(contentReviewState.contentItemId);
    expect(conflict?.set).toMatchObject({ status: "reviewed" });
  });

  it("rejects published — publishing is not a review action", async () => {
    const location = await postReview({ content_item_id: "operator-bear-grylls", review_status: "published" });

    expect(mocks.inserts).toEqual([]);
    expect(location).toContain("review=invalid-status");
  });

  it.each(["archived", "discovered", "generated", "refresh_due", "PUBLISHED", "signed_off; published"])(
    "rejects the non-review-action status %s",
    async (status) => {
      const location = await postReview({ content_item_id: "operator-bear-grylls", review_status: status });

      expect(mocks.inserts).toEqual([]);
      expect(location).toContain("review=invalid-status");
    },
  );

  it("stamps the authenticated reviewer and ignores a client-supplied reviewer", async () => {
    await postReview({
      content_item_id: "operator-bear-grylls",
      review_status: "qa_needed",
      notes: "Two sources disagree on opening hours.",
      reviewed_by_email: "attacker@example.com",
      reviewed_by: "attacker@example.com",
    });

    const values = mocks.inserts[0].values;
    expect(values.contentItemId).toBe("operator-bear-grylls");
    expect(values.reviewedByEmail).toBe("reviewer@adventure.wales");
    expect(values.notes).toBe("Two sources disagree on opening hours.");
    expect(values.reviewedAt).toBeInstanceOf(Date);
    expect(JSON.stringify(values)).not.toContain("attacker@example.com");
    expect(mocks.inserts[0].conflict?.set).toMatchObject({ reviewedByEmail: "reviewer@adventure.wales" });
  });

  it("rejects a missing content item id without inserting", async () => {
    const location = await postReview({ content_item_id: "   ", review_status: "reviewed" });

    expect(mocks.inserts).toEqual([]);
    expect(location).toContain("review=missing-item");
  });

  it("requires an authenticated admin/editor role before upserting", async () => {
    mocks.authFailure = 401;
    expect(await postReview({ content_item_id: "x", review_status: "reviewed" })).toContain("review=unauthorized");

    mocks.authFailure = 403;
    expect(await postReview({ content_item_id: "x", review_status: "reviewed" })).toContain("review=forbidden");

    expect(mocks.inserts).toEqual([]);
  });

  it("never writes to operators, domain content, or a published status", async () => {
    await postReview({ content_item_id: "operator-bear-grylls", review_status: "signed_off" });

    expect(mocks.mutations).toEqual([]);
    expect(mocks.inserts.every((row) => row.table !== operators)).toBe(true);
    for (const row of mocks.inserts) {
      expect(JSON.stringify(row.values)).not.toContain("published");
      expect(JSON.stringify(row.conflict?.set ?? {})).not.toContain("published");
    }
  });

  it("reports an honest failure instead of 'recorded' when the durable write fails", async () => {
    mocks.insertError = new Error('relation "content_review_state" does not exist');

    const location = await postReview({ content_item_id: "operator-bear-grylls", review_status: "reviewed" });

    expect(location).not.toContain("review=recorded");
    expect(location).toContain("review=store-unavailable");
  });
});
