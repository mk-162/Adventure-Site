import { describe, it, expect, beforeAll } from "vitest";
import { hashPassword, verifyPassword } from "../password";

// NOTE: hashPassword uses scrypt N=131072 (~100ms per hash/verify), so the
// number of full-cost scrypt operations here is kept deliberately small.
// Malformed-input cases either short-circuit before scrypt or embed a small N.

const PASSWORD = "correct horse battery staple";

describe("hashPassword / verifyPassword round-trip", () => {
  let stored: string;

  beforeAll(async () => {
    stored = await hashPassword(PASSWORD);
  });

  it("produces the scrypt$N$r$p$salt$hash format", () => {
    const parts = stored.split("$");
    expect(parts).toHaveLength(6);
    expect(parts[0]).toBe("scrypt");
    expect(Number(parts[1])).toBe(131072);
    expect(Number(parts[2])).toBe(8);
    expect(Number(parts[3])).toBe(1);
    // salt (16 bytes) and hash (64 bytes) are valid base64
    expect(Buffer.from(parts[4], "base64")).toHaveLength(16);
    expect(Buffer.from(parts[5], "base64")).toHaveLength(64);
  });

  it("verifies the correct password", async () => {
    await expect(verifyPassword(PASSWORD, stored)).resolves.toBe(true);
  });

  it("rejects a wrong password", async () => {
    await expect(verifyPassword("wrong password", stored)).resolves.toBe(false);
  });

  it("produces a different hash for the same password (random salt)", async () => {
    const second = await hashPassword(PASSWORD);
    expect(second).not.toBe(stored);
    // Salts must differ
    expect(second.split("$")[4]).not.toBe(stored.split("$")[4]);
  });
});

describe("verifyPassword with malformed stored hashes", () => {
  it("returns false for empty / null / undefined stored values", async () => {
    await expect(verifyPassword(PASSWORD, "")).resolves.toBe(false);
    await expect(verifyPassword(PASSWORD, null)).resolves.toBe(false);
    await expect(verifyPassword(PASSWORD, undefined)).resolves.toBe(false);
  });

  it("returns false for garbage that is not a hash at all", async () => {
    await expect(verifyPassword(PASSWORD, "total-garbage")).resolves.toBe(false);
  });

  it("returns false for the wrong number of parts", async () => {
    await expect(
      verifyPassword(PASSWORD, "scrypt$131072$8$1$onlyfiveparts")
    ).resolves.toBe(false);
    await expect(
      verifyPassword(PASSWORD, "scrypt$131072$8$1$salt$hash$extra")
    ).resolves.toBe(false);
  });

  it("returns false for a non-scrypt prefix", async () => {
    await expect(
      verifyPassword(PASSWORD, "bcrypt$131072$8$1$c2FsdA==$aGFzaA==")
    ).resolves.toBe(false);
  });

  it("returns false for non-numeric scrypt parameters", async () => {
    await expect(
      verifyPassword(PASSWORD, "scrypt$abc$8$1$c2FsdA==$aGFzaA==")
    ).resolves.toBe(false);
  });

  it("returns false (does not throw) for bad base64 salt/hash", async () => {
    // Invalid chars are stripped by the base64 decoder, leaving bytes that
    // cannot match the derived key. Small N keeps this test fast.
    await expect(
      verifyPassword(PASSWORD, "scrypt$16384$8$1$!!bad??salt$??also!!bad")
    ).resolves.toBe(false);
  });

  it("returns false when base64 decodes to empty buffers", async () => {
    // "%%%%" decodes to a zero-length buffer; must not match any password.
    await expect(
      verifyPassword(PASSWORD, "scrypt$16384$8$1$%%%%$%%%%")
    ).resolves.toBe(false);
  });
});
