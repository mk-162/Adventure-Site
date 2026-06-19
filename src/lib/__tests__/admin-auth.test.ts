// @vitest-environment node
// jose's webapi build rejects cross-realm Uint8Array under jsdom, so this
// pure-Node test must run in the node environment.
import { describe, it, expect, beforeAll, vi } from "vitest";

// Mock DB so admin-auth can import without opening a real connection.
vi.mock("@/db", () => ({ db: {} }));
vi.mock("@/db/schema", () => ({ adminUsers: {} }));

// Set env before any dynamic import (module-level code reads process.env.JWT_SECRET).
// NOTE: We use vi.resetModules() + a dedicated secret so the module reads it on first import.
process.env.JWT_SECRET = "01234567890123456789012345678901"; // exactly 32 chars
process.env.NODE_ENV = "development";

describe("admin-auth token round-trip", () => {
  let createAdminToken: typeof import("../admin-auth").createAdminToken;
  let verifyAdminToken: typeof import("../admin-auth").verifyAdminToken;

  beforeAll(async () => {
    vi.resetModules();
    // Re-set after resetModules so the new module instance sees it
    process.env.JWT_SECRET = "01234567890123456789012345678901";
    process.env.NODE_ENV = "development";

    const auth = await import("../admin-auth");
    createAdminToken = auth.createAdminToken;
    verifyAdminToken = auth.verifyAdminToken;
  });

  it("creates a token that verifyAdminToken can decode", async () => {
    const session = {
      id: 42,
      email: "admin@example.com",
      name: "Test Admin",
      role: "admin" as const,
    };

    const token = await createAdminToken(session);
    expect(typeof token).toBe("string");
    expect(token.split(".").length).toBe(3);

    const verified = await verifyAdminToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.id).toBe(session.id);
    expect(verified?.email).toBe(session.email);
  });

  it("returns null for an invalid token", async () => {
    const result = await verifyAdminToken("not-a-real-jwt");
    expect(result).toBeNull();
  });

  it("returns null for a bogus JWT", async () => {
    const result = await verifyAdminToken("aaaa.bbbb.cccc");
    expect(result).toBeNull();
  });
});
