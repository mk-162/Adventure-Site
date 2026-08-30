// @vitest-environment node
// Build-safety test: this route must be importable (e.g. during `next build`'s
// page-data collection) even when DATABASE_URL is absent. Unlike route.test.ts,
// this file does NOT mock "@/db" or "@/lib/admin-auth" — it exercises the real
// module graph to prove the DB module is only ever evaluated lazily, inside the
// request handler, and not as a side effect of a static top-level import chain.
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

const ORIGINAL_DATABASE_URL = process.env.DATABASE_URL;

describe("admin/content-ops/review route module (no DATABASE_URL)", () => {
  beforeEach(() => {
    vi.resetModules();
    delete process.env.DATABASE_URL;
  });

  afterEach(() => {
    if (ORIGINAL_DATABASE_URL === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = ORIGINAL_DATABASE_URL;
  });

  it("imports without throwing or evaluating @/db", async () => {
    await expect(import("../route")).resolves.toHaveProperty("POST");
  });
});
