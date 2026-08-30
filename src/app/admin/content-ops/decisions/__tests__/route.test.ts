// @vitest-environment node
// Route-handler test: proves the commercial decision POST persists durably to
// ops_decisions (append-only) instead of the ephemeral repo JSON file, and that
// it never touches operators/domain content or publishes anything.
import { describe, it, expect, beforeEach, vi } from "vitest";
import { opsDecisions, operators } from "@/db/schema";

const mocks = vi.hoisted(() => ({
  session: { id: 1, email: "admin@adventure.wales", name: "Admin", role: "admin" as string },
  authFailure: null as 401 | 403 | null,
  inserts: [] as Array<{ table: unknown; values: Record<string, unknown> }>,
  mutations: [] as string[],
  fileWrites: [] as string[],
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
        mocks.inserts.push({ table, values });
        return mocks.insertError ? Promise.reject(mocks.insertError) : Promise.resolve([]);
      },
    }),
    update: () => {
      mocks.mutations.push("update");
      throw new Error("db.update() must not be called by the decisions route");
    },
    delete: () => {
      mocks.mutations.push("delete");
      throw new Error("db.delete() must not be called by the decisions route");
    },
  },
}));

// The old implementation wrote content/ops/commercial-decisions.json. Mocked so
// a regression is asserted on rather than silently mutating the repo.
vi.mock("fs", () => ({
  existsSync: () => false,
  readFileSync: () => "{}",
  readdirSync: () => [],
  writeFileSync: (path: unknown) => {
    mocks.fileWrites.push(String(path));
  },
}));

const validForm = {
  content_item_id: "operator-adventure-parc-snowdonia",
  title: "Adventure Parc Snowdonia",
  route_or_slug: "/operators/adventure-parc-snowdonia",
  decision: "strategic_anchor",
  source_count: "3",
  research_source_count: "5",
  image_status: "needs_review",
  research_image_status: "not_recorded",
  research_file: "data/research/content-ops/operator-adventure-parc-snowdonia.json",
};

async function postDecision(fields: Record<string, string>): Promise<string> {
  const { POST } = await import("../route");
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.append(key, value);
  const request = new Request("http://localhost/admin/content-ops/decisions", {
    method: "POST",
    body: form,
  });

  try {
    await POST(request as never);
  } catch (error) {
    const url = (error as { redirectUrl?: string }).redirectUrl;
    if (url) return url;
    throw error;
  }
  throw new Error("decisions route returned without redirecting");
}

beforeEach(() => {
  mocks.session = { id: 1, email: "admin@adventure.wales", name: "Admin", role: "admin" };
  mocks.authFailure = null;
  mocks.inserts.length = 0;
  mocks.mutations.length = 0;
  mocks.fileWrites.length = 0;
  mocks.insertError = null;
});

describe("POST /admin/content-ops/decisions durable persistence", () => {
  it("appends an ops_decisions row instead of writing the repo JSON file", async () => {
    const location = await postDecision(validForm);

    expect(mocks.inserts).toHaveLength(1);
    expect(mocks.inserts[0].table).toBe(opsDecisions);
    expect(mocks.fileWrites).toEqual([]);
    expect(location).toContain("decision=recorded");
  });

  it("stamps the authenticated admin email and ignores a client-supplied decider", async () => {
    await postDecision({
      ...validForm,
      decided_by: "attacker@example.com",
      decided_by_email: "attacker@example.com",
    });

    const values = mocks.inserts[0].values;
    expect(values.decidedByEmail).toBe("admin@adventure.wales");
    expect(JSON.stringify(values)).not.toContain("attacker@example.com");
  });

  it("preserves the submitted decision context and guardrails on the durable row", async () => {
    await postDecision(validForm);

    const values = mocks.inserts[0].values;
    expect(values.contentItemId).toBe("operator-adventure-parc-snowdonia");
    expect(values.decision).toBe("strategic_anchor");
    expect(values.title).toBe("Adventure Parc Snowdonia");
    expect(values.routeOrSlug).toBe("/operators/adventure-parc-snowdonia");
    expect(values.evidenceSnapshot).toMatchObject({
      source_count: 3,
      research_source_count: 5,
      image_status: "needs_review",
      research_file: "data/research/content-ops/operator-adventure-parc-snowdonia.json",
    });
    expect(values.guardrails).toEqual(
      expect.arrayContaining(["does_not_publish_content", "does_not_change_operator_tier_automatically"]),
    );
  });

  it("is append-only: never updates or deletes existing decision rows", async () => {
    await postDecision(validForm);
    await postDecision({ ...validForm, decision: "stub_only" });

    expect(mocks.mutations).toEqual([]);
    expect(mocks.inserts).toHaveLength(2);
    expect(mocks.inserts.map((row) => row.values.decision)).toEqual(["strategic_anchor", "stub_only"]);
  });

  it("never writes to operators, domain content, or a published status", async () => {
    await postDecision(validForm);

    expect(mocks.inserts.every((row) => row.table !== operators)).toBe(true);
    for (const row of mocks.inserts) {
      expect(row.values).not.toHaveProperty("status");
      expect(row.values).not.toHaveProperty("commercialTier");
      expect(JSON.stringify(row.values)).not.toContain("published");
    }
  });

  it("rejects a decision outside the allowed enum without inserting", async () => {
    const location = await postDecision({ ...validForm, decision: "publish_now" });

    expect(mocks.inserts).toEqual([]);
    expect(location).toContain("decision=invalid");
  });

  it("rejects a missing content item id without inserting", async () => {
    const location = await postDecision({ ...validForm, content_item_id: "  " });

    expect(mocks.inserts).toEqual([]);
    expect(location).toContain("decision=missing-item");
  });

  it("requires an authenticated admin/editor role before inserting", async () => {
    mocks.authFailure = 401;
    expect(await postDecision(validForm)).toContain("decision=unauthorized");

    mocks.authFailure = 403;
    expect(await postDecision(validForm)).toContain("decision=forbidden");

    expect(mocks.inserts).toEqual([]);
  });

  it("reports an honest failure instead of 'recorded' when the durable write fails", async () => {
    mocks.insertError = new Error('relation "ops_decisions" does not exist');

    const location = await postDecision(validForm);

    expect(location).not.toContain("decision=recorded");
    expect(location).toContain("decision=store-unavailable");
  });
});
