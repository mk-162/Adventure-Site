// @vitest-environment node
// jose's webapi build rejects cross-realm Uint8Array under jsdom, so this
// pure-Node test must run in the node environment.
import { describe, it, expect, beforeAll, beforeEach, vi } from "vitest";
import { hashPassword } from "../password";

// ---------------------------------------------------------------------------
// Mock @/db so authenticateAdmin's drizzle chains resolve against in-memory
// state. The real @/db/schema is used (it is just table definitions), so
// drizzle's eq() receives genuine columns.
//
//   db.select().from(adminUsers).where(eq(...)).limit(1)  -> state.rows
//   db.update(adminUsers).set({...}).where(eq(...))       -> recorded
// ---------------------------------------------------------------------------

const state = vi.hoisted(() => ({
  rows: [] as Array<Record<string, unknown>>,
  updateSetCalls: [] as Array<Record<string, unknown>>,
}));

vi.mock("@/db", () => ({
  db: {
    select: () => ({
      from: () => ({
        where: () => ({
          limit: async () => state.rows,
        }),
      }),
    }),
    update: () => ({
      set: (values: Record<string, unknown>) => {
        state.updateSetCalls.push(values);
        return { where: async () => undefined };
      },
    }),
  },
}));

// admin-auth reads JWT_SECRET at module load; set it before the dynamic import.
process.env.JWT_SECRET = "01234567890123456789012345678901"; // 32 chars

const PASSWORD = "hunter2-but-much-longer";
const KNOWN_EMAIL = "admin@example.com";

describe("authenticateAdmin (scrypt password verification)", () => {
  let authenticateAdmin: typeof import("../admin-auth").authenticateAdmin;
  let verifyAdminToken: typeof import("../admin-auth").verifyAdminToken;
  let passwordHash: string;

  beforeAll(async () => {
    vi.resetModules();
    process.env.JWT_SECRET = "01234567890123456789012345678901";

    const auth = await import("../admin-auth");
    authenticateAdmin = auth.authenticateAdmin;
    verifyAdminToken = auth.verifyAdminToken;

    // Real scrypt hash (N=131072, ~100ms) generated once and reused.
    passwordHash = await hashPassword(PASSWORD);
  });

  beforeEach(() => {
    state.rows = [
      {
        id: 7,
        email: KNOWN_EMAIL,
        name: "Test Admin",
        passwordHash,
        role: "admin",
        sitePermissions: null,
        createdAt: new Date(),
        lastLogin: null,
      },
    ];
    state.updateSetCalls = [];
  });

  it("succeeds with the correct password and issues a verifiable token", async () => {
    const result = await authenticateAdmin(KNOWN_EMAIL, PASSWORD);
    expect(result).not.toBeNull();
    expect(result!.session).toMatchObject({
      id: 7,
      email: KNOWN_EMAIL,
      name: "Test Admin",
      role: "admin",
    });

    const decoded = await verifyAdminToken(result!.token);
    expect(decoded).not.toBeNull();
    expect(decoded!.email).toBe(KNOWN_EMAIL);

    // lastLogin was updated on successful login
    expect(state.updateSetCalls).toHaveLength(1);
    expect(state.updateSetCalls[0].lastLogin).toBeInstanceOf(Date);
  });

  it("fails with a wrong password and does not touch lastLogin", async () => {
    const result = await authenticateAdmin(KNOWN_EMAIL, "wrong-password");
    expect(result).toBeNull();
    expect(state.updateSetCalls).toHaveLength(0);
  });

  it("fails for an unknown email", async () => {
    state.rows = [];
    const result = await authenticateAdmin("nobody@example.com", PASSWORD);
    expect(result).toBeNull();
    expect(state.updateSetCalls).toHaveLength(0);
  });

  it("fails closed for an admin without a password hash", async () => {
    state.rows[0].passwordHash = null;
    const result = await authenticateAdmin(KNOWN_EMAIL, PASSWORD);
    expect(result).toBeNull();
    expect(state.updateSetCalls).toHaveLength(0);
  });
});
